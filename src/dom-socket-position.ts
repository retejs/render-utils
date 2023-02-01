import { BaseSchemes } from 'rete'
import { AreaPlugin } from 'rete-area-plugin'

import { ExpectArea2DExtra, Position, Side, SocketPositionWatcher, Substitute } from './types'
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

type Props = {
    padding?: number
}

export function useDOMSocketPosition<Schemes extends BaseSchemes, K>(areaPlugin: AreaPlugin<Schemes, Substitute<K>>, props?: Props): SocketPositionWatcher {
    const sockets = new SocketsPositionsStorage()
    const emitter = new EventEmitter<ListenerData>()

    function canculateSocketPosition(side: Side, element: HTMLElement, relative: HTMLElement) {
        const { k } = areaPlugin.area.transform
        const position = getElementCenter(k, element, relative)
        const padding = props && typeof props.padding !== 'undefined' ? props.padding : 12

        position.x += side === 'input' ? -padding : padding

        return position
    }

    // eslint-disable-next-line max-statements
    areaPlugin.addPipe(ctx => {
        const context = ctx as (Exclude<(typeof ctx), Substitute<K>> | ExpectArea2DExtra)

        if (context.type === 'rendered' && context.data.type === 'socket') {
            const { nodeId, key, side, element } = context.data
            const view = areaPlugin.nodeViews.get(nodeId)

            if (view) {
                const position = canculateSocketPosition(side, element, view.element)

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
                    const view = areaPlugin.nodeViews.get(nodeId)

                    if (!view) return
                    item.position = canculateSocketPosition(item.side, item.element, view.element)
                })
            emitter.emit({ nodeId })
        } else if (context.type === 'render' && context.data.type === 'connection') {
            const { source, target } = context.data.payload
            const nodeId = source || target

            emitter.emit({ nodeId })
        }
        return ctx
    })

    return (nodeId, side, key, change) => {
        const unlisten = emitter.listen((data: ListenerData) => {
            if (data.nodeId !== nodeId) return
            if ((!data.key || data.side === side) && (!data.side || data.key === key)) {
                const position = sockets.getPosition({ side, nodeId, key })

                if (!position) return

                const { x, y } = position
                const nodeView = areaPlugin.nodeViews.get(nodeId)

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
