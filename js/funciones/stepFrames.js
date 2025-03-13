function stepFrames(numFrames){
  let dt = numFrames / FPS;
  let newTime = currentPreviewTime + dt;
  newTime = Math.max(0, Math.min(newTime, getTimelineMaxTime()));
  setPreviewTime(newTime);
}
