const elem = document.getElementById('zoom-container')
const panzoom = Panzoom(elem, { canvas: true })
const parent = elem.parentElement

console.log(elem)
console.log(panzoom)
console.log(parent)

parent.addEventListener('wheel', panzoom.zoomWithWheel)

parent.addEventListener('wheel', function(event) {
  if (!event.shiftKey) return
  panzoom.zoomWithWheel(event)
})