
export function classicConnectionPath(points: number[], curvature: number) {
    const [x1, y1, x2, y2] = points
    const hx1 = x1 + Math.abs(x2 - x1) * curvature
    const hx2 = x2 - Math.abs(x2 - x1) * curvature

    return `M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`
}
