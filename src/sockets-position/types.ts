import { NodeId } from 'rete'

import { Position, Side } from '../types'

export type OnChange = (data: Position) => void

export type SocketPositionWatcher<Area> = {
  attach(area: Area): void,
  listen(nodeId: NodeId, side: Side, key: string, onChange: OnChange): (() => void)
}
