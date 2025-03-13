// Draw approximate ticks
function drawTimeScale() {
  let width = timeScaleEl.offsetWidth;
  timeScaleEl.innerHTML = '';
  let tickInterval = 50; 
  let totalTicks = Math.floor(width / tickInterval);
  for (let i=0; i<=totalTicks; i++){
    let tickX = i * tickInterval;
    let timeSec = (tickX / PIXELS_PER_SECOND).toFixed(1);

    let d = document.createElement('div');
    d.style.position = 'absolute';
    d.style.left = tickX + 'px';
    d.style.width = '1px';
    d.style.background = '#333';
    d.style.top = (i % 5 === 0) ? '0' : '20px';
    d.style.bottom = '0';
    d.title = timeSec+'s';
    timeScaleEl.appendChild(d);
  }
}
