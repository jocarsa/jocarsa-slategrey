function onHandleResizeMove(e){
  if(!resizingClip) return;
  let dx = e.clientX - resizeStartMouseX;
  let clipEl = resizingClip.element;
  if(resizeMode === 'right'){
    let newWidth = resizeStartWidthPx + dx;
    newWidth = Math.max(10, newWidth);
    let maxWidth = TIMELINE_WIDTH - resizeStartLeftPx;
    newWidth = Math.min(newWidth, maxWidth);
    clipEl.style.width = newWidth + 'px';
    resizingClip.duration = newWidth / PIXELS_PER_SECOND;
  } else { // left handle
    let newLeft = resizeStartLeftPx + dx;
    let newWidth = resizeStartWidthPx - dx;
    if(newLeft < 0){
      newLeft = 0;
      newWidth = resizeStartLeftPx + resizeStartWidthPx;
    }
    if(newLeft + newWidth > TIMELINE_WIDTH){
      newWidth = TIMELINE_WIDTH - newLeft;
    }
    clipEl.style.left = newLeft + 'px';
    clipEl.style.width = newWidth + 'px';
    resizingClip.startTime = newLeft / PIXELS_PER_SECOND;
    resizingClip.duration = newWidth / PIXELS_PER_SECOND;
  }
}
