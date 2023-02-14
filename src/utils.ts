
export function getElementCenter(zoom: number, element: HTMLElement, relative: HTMLElement) {
  const elementBB = element.getBoundingClientRect()
  const relativeBB = relative.getBoundingClientRect()
  const x = (elementBB.left - relativeBB.left) / zoom
  const y = (elementBB.top - relativeBB.top) / zoom

  return {
    x: (x + element.offsetWidth / 2),
    y: (y + element.offsetHeight / 2)
  }
}
export class EventEmitter<T> {
  listeners = new Set<(data: T) => void>()

  emit(data: T) {
    this.listeners.forEach(listener => listener(data))
  }

  listen(handler: (data: T) => void) {
    this.listeners.add(handler)

    return () => {
      this.listeners.delete(handler)
    }
  }
}
