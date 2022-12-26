
export function classicConnectionPath(points: number[], curvature: number) {
    const [x1, y1, x2, y2] = points
    const vertical = Math.abs(y1 - y2)
    const hx1 = x1 + Math.max(vertical / 2, Math.abs(x2 - x1)) * curvature
    const hx2 = x2 - Math.max(vertical / 2, Math.abs(x2 - x1)) * curvature

    return `M ${x1} ${y1} C ${hx1} ${y1} ${hx2} ${y2} ${x2} ${y2}`
}

export function loopConnectionPath(points: number[], curvature: number, size: number) {
    const [x1, y1, x2, y2] = points
    const k = y2 > y1 ? 1 : -1
    const middleX = (x1 + x2) / 2
    const middleY = y1 - k * size
    const vertical = (y2 - y1) * curvature

    return `
        M ${x1} ${y1}
        C ${x1 + size} ${y1}
        ${x1 + size} ${middleY - vertical}
        ${middleX} ${middleY}
        C ${x2 - size} ${middleY + vertical}
        ${x2 - size} ${y2}
        ${x2} ${y2}
    `
}
