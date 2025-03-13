function moveTimeCursorTo(px) {
  px = Math.max(0, Math.min(px, TIMELINE_WIDTH));
  timeCursorEl.style.left = px + 'px';
}
