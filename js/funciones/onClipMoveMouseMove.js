function onClipMoveMouseMove(e){
  if(!movingClip) return;
  let dx = e.clientX - moveStartMouseX;
  let newLeft = moveStartLeftPx + dx;
  newLeft = Math.max(0, Math.min(newLeft, TIMELINE_WIDTH - movingClip.element.offsetWidth));
  movingClip.element.style.left = newLeft + 'px';
  movingClip.startTime = newLeft / PIXELS_PER_SECOND;
}
