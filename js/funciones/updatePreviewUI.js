function updatePreviewUI(){
  // Move time cursor
  let px = currentPreviewTime * PIXELS_PER_SECOND;
  moveTimeCursorTo(px);

  // Draw
  updatePreviewAtTime(currentPreviewTime);
}
