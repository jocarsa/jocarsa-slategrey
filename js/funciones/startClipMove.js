function startClipMove(e, clip){
  e.preventDefault();
  movingClip = clip;
  moveStartMouseX = e.clientX;
  moveStartLeftPx = parseFloat(clip.element.style.left);

  window.addEventListener('mousemove', onClipMoveMouseMove);
  window.addEventListener('mouseup', onClipMoveMouseUp);
}
