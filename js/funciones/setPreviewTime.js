function setPreviewTime(t){
  currentPreviewTime = t;
  isPlaying = false; // stop if it was playing
  updatePreviewUI();
}
