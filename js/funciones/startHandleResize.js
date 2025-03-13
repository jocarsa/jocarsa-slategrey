function startHandleResize(e, clip, mode){
  e.preventDefault();
  resizingClip = clip;
  resizeMode = mode;
  resizeStartMouseX = e.clientX;
  resizeStartLeftPx = parseFloat(clip.element.style.left);
  resizeStartWidthPx = parseFloat(clip.element.style.width);

  window.addEventListener('mousemove', onHandleResizeMove);
  window.addEventListener('mouseup', onHandleResizeUp);
}
