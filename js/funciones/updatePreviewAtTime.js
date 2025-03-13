function updatePreviewAtTime(timeSec){
  ctx.clearRect(0,0,previewCanvas.width, previewCanvas.height);
  drawClipsAtTime(clipsVideo1, timeSec);
  drawClipsAtTime(clipsVideo2, timeSec);
}
