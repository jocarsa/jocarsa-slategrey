function playbackLoop(timestamp){
  if(!isPlaying) return;

  if(!previewLastTimestamp) previewLastTimestamp = timestamp;
  let dt = (timestamp - previewLastTimestamp) / 1000; // in seconds
  previewLastTimestamp = timestamp;

  currentPreviewTime += dt;
  let endTime = getTimelineMaxTime();
  if(currentPreviewTime > endTime) {
    currentPreviewTime = endTime;
    isPlaying = false;
    return;
  }
  updatePreviewUI();
  requestAnimationFrame(playbackLoop);
}
