import { Position, Side } from '../types'

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
