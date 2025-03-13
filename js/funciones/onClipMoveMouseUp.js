function onClipMoveMouseUp(e){
  window.removeEventListener('mousemove', onClipMoveMouseMove);
  window.removeEventListener('mouseup', onClipMoveMouseUp);
  movingClip = null;
}
