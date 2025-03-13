function scheduleAllAudio(audioCtx, audioDest, totalTime){
  // We sum up all audio from the single track. If you want multiple
  // audio tracks, do the same approach for each track (or each clip).
  for(let c of clipsAudio){
    if(!c.audioBuffer) continue;
    let source = audioCtx.createBufferSource();
    source.buffer = c.audioBuffer;
    // only play up to c.duration
    source.start(audioCtx.currentTime + c.startTime, 0, c.duration);
    // connect to main mix
    source.connect(audioCtx.destination);
    source.connect(audioDest);
  }
}
