function drawAudioWaveform(clip){
  let waveCanvas = document.createElement('canvas');
  waveCanvas.className = 'waveform';
  clip.element.appendChild(waveCanvas);

  // We'll draw a small representation
  let w = clip.element.clientWidth;
  let h = clip.element.clientHeight;
  waveCanvas.width = w;
  waveCanvas.height = h;

  // gather ~1000 samples from the buffer
  let ctx2d = waveCanvas.getContext('2d');
  ctx2d.clearRect(0,0,w,h);

  let data = clip.audioBuffer.getChannelData(0); // just channel 0 for simplicity
  let step = Math.floor(data.length / w);
  let amp = h/2;
  ctx2d.beginPath();
  ctx2d.moveTo(0, amp);
  for(let x=0; x<w; x++){
    let minVal = 1, maxVal = -1;
    let start = x*step;
    let end = start+step;
    for(let i=start; i<end; i++){
      let v = data[i];
      if(v<minVal) minVal = v;
      if(v>maxVal) maxVal = v;
    }
    ctx2d.lineTo(x, amp + minVal*amp);
    ctx2d.lineTo(x, amp + maxVal*amp);
  }
  ctx2d.strokeStyle = '#000';
  ctx2d.stroke();

  // If user resizes clip, the canvas won't auto-resize. In a robust app,
  // we'd re-draw on a 'resize' observer. Here we keep it simple.
}
