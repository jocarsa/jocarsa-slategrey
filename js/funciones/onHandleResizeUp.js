function onHandleResizeUp(e){
  window.removeEventListener('mousemove', onHandleResizeMove);
  window.removeEventListener('mouseup', onHandleResizeUp);
  resizingClip = null;
}
