import { CanAssignSignal, NodeId } from 'rete'

export type Side = 'input' | 'output'
export type Position = { x: number, y: number }
type OnChange = (data: Position) => void

export type SocketPositionWatcher = (nodeId: NodeId, side: Side, key: string, onChange: OnChange) => (() => void)

type SocketData = {
  type: 'socket',
  nodeId: string,
  key: string,
  side: Side,
  element: HTMLElement
}

export type ExpectArea2DExtra = {
  type: 'rendered' | 'render',
  data: SocketData
}

type IsCompatible<K> = K extends { data: infer P } ? CanAssignSignal<P, SocketData> : false

export type Substitute<K> = IsCompatible<K> extends true ? K : ExpectArea2DExtra
