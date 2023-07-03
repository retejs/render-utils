import { BaseSchemes } from 'rete'

import { Position, Side } from '../types'
import { getElementCenter } from '../utils'
import { BaseSocketPosition } from './base-socket-position'

type Props = {
  offset?: (position: Position, nodeId: string, side: Side, key: string) => Position
}

export class DOMSocketPosition<Schemes extends BaseSchemes, K> extends BaseSocketPosition<Schemes, K> {
  constructor(private props?: Props) {
    super()
  }

  async calculatePosition(nodeId: string, side: Side, key: string, element: HTMLElement) {
    const view = this.area?.nodeViews.get(nodeId)

    if (!view?.element) return null
    const position = await getElementCenter(element, view.element)

    if (this.props?.offset) return this.props?.offset(position, nodeId, side, key)

    return {
      x: position.x + 12 * (side === 'input' ? -1 : 1),
      y: position.y
    }
  }
}

export function getDOMSocketPosition<Schemes extends BaseSchemes, K>(props?: Props) {
  return new DOMSocketPosition<Schemes, K>(props)
}
