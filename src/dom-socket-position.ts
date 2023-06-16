import { BaseSchemes, Scope } from 'rete'
import { BaseAreaPlugin } from 'rete-area-plugin'

import { ExpectArea2DExtra, Position, Side, SocketPositionWatcher } from './types'
import { EventEmitter, getElementCenter } from './utils'

type SocketPayload = {
  element: HTMLElement
  side: Side
  key: string
  nodeId: string
  position: Position // relative to node
}

export class SocketsPositionsStorage {
  elements = new Map<HTMLElement, SocketPayload>()

  getPosition(data: { nodeId: string, key: string, side: Side }) {
    const list = Array.from(this.elements.values())
    const found = list.filter(item => {
      return item.side === data.side && item.nodeId === data.nodeId && item.key === data.key
    })

    // eslint-disable-next-line no-console
    if (found.length > 1) console.warn([
      'Found more than one element for socket with same key and side.',
      'Probably it was not unmounted correctly'
    ].join(' '), data)

    return found.pop()?.position || null
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

async function calculateSocketPosition(params: { nodeId: string, side: Side, key: string, element: HTMLElement }, relative: HTMLElement, props: { offset?: OffsetSocket }) {
  const position = await getElementCenter(params.element, relative)

  // eslint-disable-next-line @typescript-eslint/naming-convention
  const offset = props?.offset ? props.offset : <OffsetSocket>(({ x, y }, _nodeId, socketSide) => {
    return {
      x: x + 12 * (socketSide === 'input' ? -1 : 1),
      y
    }
  })

  return offset(position, params.nodeId, params.side, params.key)
}

export function getDOMSocketPosition<Schemes extends BaseSchemes, K>(props?: Props): SocketPositionWatcher<Scope<never, [K]>> {
  const sockets = new SocketsPositionsStorage()
  const emitter = new EventEmitter<ListenerData>()
  let area: BaseAreaPlugin<Schemes, ExpectArea2DExtra<Schemes>> | null = null

  return {
    attach(scope) {
      if (area) return
      if (!scope.hasParent()) return
      area = scope.parentScope<BaseAreaPlugin<Schemes, ExpectArea2DExtra<Schemes>>>(BaseAreaPlugin)

      // eslint-disable-next-line max-statements, complexity
      area.addPipe(async context => {
        if (!context || typeof context !== 'object' || !('type' in context)) return context

        if (context.type === 'rendered' && context.data.type === 'socket') {
          const { nodeId, key, side, element } = context.data
          const view = area?.nodeViews.get(nodeId)

          if (view?.element) {
            const position = await calculateSocketPosition(context.data, view.element, { offset: props?.offset })

            sockets.add({ nodeId, key, side, element, position })
            emitter.emit({ nodeId, key, side })
          }
        } else if (context.type === 'unmount') {
          sockets.remove(context.data.element)
        } else if (context.type === 'nodetranslated') {
          emitter.emit({ nodeId: context.data.id })
        } else if (context.type === 'noderesized') {
          const { id: nodeId } = context.data

          await Promise.all(Array.from(sockets.elements.values())
            .filter(item => item.nodeId === nodeId && item.side === 'output')
            .map(async item => {
              const view = area?.nodeViews.get(nodeId)

              if (!view?.element) return
              item.position = await calculateSocketPosition(item, view.element, { offset: props?.offset })
            }))
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

          if (!position) return

          const { x, y } = position
          const nodeView = area?.nodeViews.get(nodeId)

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
