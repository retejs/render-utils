import { Position } from './types'

export function classicConnectionPath(points: [Position, Position], curvature: number) {
  const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = points
  const vertical = Math.abs(y1 - y2)
  const hx1 = x1 + Math.max(vertical / 2, Math.abs(x2 - x1)) * curvature
  const hx2 = x2 - Math.max(vertical / 2, Math.abs(x2 - x1)) * curvature

  return `M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`
}

export function loopConnectionPath(points: [Position, Position], curvature: number, size: number) {
  const [{ x: x1, y: y1 }, { x: x2, y: y2 }] = points
  const k = y2 > y1 ? 1 : -1
  const scale = size + Math.abs(x1 - x2) / (size / 2)
  const middleX = (x1 + x2) / 2
  const middleY = y1 - k * scale
  const vertical = (y2 - y1) * curvature

  return `
        M ${x1} ${y1}
        C ${x1 + scale} ${y1}
        ${x1 + scale} ${middleY - vertical}
        ${middleX} ${middleY}
        C ${x2 - scale} ${middleY + vertical}
        ${x2 - scale} ${y2}
        ${x2} ${y2}
    `
}
