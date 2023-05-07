import { BaseSchemes, ScopeAsParameter } from 'rete'
import { AreaPlugin } from 'rete-area-plugin'

import { ExpectArea2DExtra, Position, Side, SocketPositionWatcher } from './types'
import { EventEmitter, getElementCenter } from './utils'

type SocketPayload = {
  element: HTMLElement
  side: Side
  key: string
  nodeId: string
  position: Position // relative to node
}

class SocketsPositionsStorage {
  elements = new Map<HTMLElement, SocketPayload>()

  getPosition(data: { nodeId: string, key: string, side: Side }) {
    const list = Array.from(this.elements.values())
    const found = list.find(item => {
      return item.side === data.side && item.nodeId === data.nodeId && item.key === data.key
    })

    return found?.position || null
  }

  add(data: SocketPayload) {
    this.elements.set(data.element, data)
  }

  remove(element: SocketPayload['element']) {
    this.elements.delete(element)
  }

  snapshot() {
    return Array.from(this.elements.values())
  }
}

type ListenerData = {
  nodeId: string
  side?: Side
  key?: string
}
type OffsetSocket = (position: Position, nodeId: string, side: Side, key: string) => Position

type Props = {
  offset?: OffsetSocket
}

function calculateSocketPosition(params: { nodeId: string, side: Side, key: string, element: HTMLElement }, relative: HTMLElement, props: { k: number, offset?: OffsetSocket }) {
  const position = getElementCenter(props.k, params.element, relative)
  // eslint-disable-next-line @typescript-eslint/naming-convention
  const offset = props?.offset ? props.offset : <OffsetSocket>(({ x, y }, _nodeId, socketSide) => {
    return {
      x: x + 12 * (socketSide === 'input' ? -1 : 1),
      y
    }
  })

  return offset(position, params.nodeId, params.side, params.key)
}

export function getDOMSocketPosition<Schemes extends BaseSchemes, K>(props?: Props): SocketPositionWatcher<ScopeAsParameter<AreaPlugin<Schemes, K>, [ExpectArea2DExtra<Schemes>]>> {
  const sockets = new SocketsPositionsStorage()
  const emitter = new EventEmitter<ListenerData>()
  let area: AreaPlugin<Schemes, ExpectArea2DExtra<Schemes>> | null = null

  return {
    attach(areaPlugin) {
      area = areaPlugin as AreaPlugin<Schemes, ExpectArea2DExtra<Schemes>>

      // eslint-disable-next-line max-statements, complexity
      area.addPipe(context => {
        if (!context || typeof context !== 'object' || !('type' in context)) return context

        if (context.type === 'rendered' && context.data.type === 'socket') {
          const { nodeId, key, side, element } = context.data
          const view = area?.nodeViews.get(nodeId)

          if (area && view) {
            const { k } = area.area.transform
            const position = calculateSocketPosition(context.data, view.element, { k, offset: props?.offset })

            sockets.add({ nodeId, key, side, element, position })
            emitter.emit({ nodeId, key, side })
          }
        } else if (context.type === 'unmount') {
          sockets.remove(context.data.element)
        } else if (context.type === 'nodetranslated') {
          emitter.emit({ nodeId: context.data.id })
        } else if (context.type === 'noderesized') {
          const { id: nodeId } = context.data

          Array.from(sockets.elements.values())
            .filter(item => item.nodeId === nodeId && item.side === 'output')
            .forEach(item => {
              const view = area?.nodeViews.get(nodeId)

              if (!view || !area) return
              item.position = calculateSocketPosition(item, view.element, { k: area.area.transform.k, offset: props?.offset })
            })
          emitter.emit({ nodeId })
        } else if (context.type === 'render' && context.data.type === 'connection') {
          const { source, target } = context.data.payload
          const nodeId = source || target

          emitter.emit({ nodeId })
        }
        return context
      })
    },
    listen(nodeId, side, key, change) {
      const unlisten = emitter.listen((data: ListenerData) => {
        if (data.nodeId !== nodeId) return
        if ((!data.key || data.side === side) && (!data.side || data.key === key)) {
          const position = sockets.getPosition({ side, nodeId, key })

          if (!position || !area) return

          const { x, y } = position
          const nodeView = area.nodeViews.get(nodeId)

          if (nodeView) change({
            x: x + nodeView.position.x,
            y: y + nodeView.position.y
          })
        }
      })

      sockets.snapshot().forEach(data => emitter.emit(data))
      return unlisten
    }
  }
}
