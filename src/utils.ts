/* eslint-disable max-statements */

/**
 * Calculates the center coordinates of a child element relative to a parent element.
 * @async
 * @param child The child element whose center coordinates need to be calculated.
 * @param parent The parent element relative to which the child element's center is calculated.
 * @returns Position of the child element's center
 * @throws Error if the child element has a null offsetParent.
 */
export async function getElementCenter(child: HTMLElement, parent: HTMLElement) {
  while (!child.offsetParent) {
    await new Promise(res => setTimeout(res, 0))
  }

  let x = child.offsetLeft
  let y = child.offsetTop
  let currentElement = child.offsetParent as HTMLElement | null

  if (!currentElement) throw new Error('child has null offsetParent')

  while (currentElement !== null && currentElement !== parent) {
    x += currentElement.offsetLeft + currentElement.clientLeft
    y += currentElement.offsetTop + currentElement.clientTop
    currentElement = currentElement.offsetParent as HTMLElement | null
  }
  const width = child.offsetWidth
  const height = child.offsetHeight

  return {
    x: x + width / 2,
    y: y + height / 2
  }
}
export class EventEmitter<T> {
  listeners = new Set<(data: T) => void>()

  emit(data: T) {
    this.listeners.forEach(listener => {
      listener(data)
    })
  }

  listen(handler: (data: T) => void) {
    this.listeners.add(handler)

    return () => {
      this.listeners.delete(handler)
    }
  }
}
