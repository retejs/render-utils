import { BaseSchemes, NodeId, Scope } from 'rete'
import { BaseAreaPlugin } from 'rete-area-plugin'

import { ExpectArea2DExtra, Position, Side } from '../types'
import { EventEmitter } from '../utils'
import { SocketsPositionsStorage } from './storage'
import { OnChange, SocketPositionWatcher } from './types'

type ListenerData = {
  nodeId: string
  side?: Side
  key?: string
}

export abstract class BaseSocketPosition<Schemes extends BaseSchemes, K> implements SocketPositionWatcher<Scope<never, [K]>> {
  sockets = new SocketsPositionsStorage()
  emitter = new EventEmitter<ListenerData>()
  area: BaseAreaPlugin<Schemes, ExpectArea2DExtra<Schemes>> | null = null

  abstract calculatePosition(nodeId: string, side: Side, key: string, element: HTMLElement): Promise<Position | null>

  attach(scope: Scope<never, [K]>) {
    if (this.area) return
    if (!scope.hasParent()) return
    this.area = scope.parentScope<BaseAreaPlugin<Schemes, ExpectArea2DExtra<Schemes>>>(BaseAreaPlugin)

    // eslint-disable-next-line max-statements, complexity
    this.area.addPipe(async context => {
      if (context.type === 'rendered' && context.data.type === 'socket') {
        const { nodeId, key, side, element } = context.data

        const position = await this.calculatePosition(nodeId, side, key, element)

        if (position) {
          this.sockets.add({ nodeId, key, side, element, position })
          this.emitter.emit({ nodeId, key, side })
        }
      } else if (context.type === 'unmount') {
        this.sockets.remove(context.data.element)
      } else if (context.type === 'nodetranslated') {
        this.emitter.emit({ nodeId: context.data.id })
      } else if (context.type === 'noderesized') {
        const { id: nodeId } = context.data

        await Promise.all(this.sockets.snapshot()
          .filter(item => item.nodeId === context.data.id && item.side === 'output')
          .map(async item => {
            const { side, key, element } = item
            const position = await this.calculatePosition(nodeId, side, key, element)

            if (position) {
              item.position = position
            }
          }))
        this.emitter.emit({ nodeId })
      } else if (context.type === 'render' && context.data.type === 'connection') {
        const { source, target } = context.data.payload
        const nodeId = source || target

        this.emitter.emit({ nodeId })
      }
      return context
    })
  }

  listen(nodeId: NodeId, side: Side, key: string, change: OnChange) {
    const unlisten = this.emitter.listen((data: ListenerData) => {
      if (data.nodeId !== nodeId) return
      if ((!data.key || data.side === side) && (!data.side || data.key === key)) {
        const position = this.sockets.getPosition({ side, nodeId, key })

        if (!position) return

        const { x, y } = position
        const nodeView = this.area?.nodeViews.get(nodeId)

        if (nodeView) change({
          x: x + nodeView.position.x,
          y: y + nodeView.position.y
        })
      }
    })

    this.sockets.snapshot().forEach(data => {
      if (data.nodeId === nodeId) this.emitter.emit(data)
    })
    return unlisten
  }
}
