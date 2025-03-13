async function doRender(totalTime){
  // Show modal
  renderModal.style.display = 'flex';
  renderProgress.value = 0;
  ghostCursorEl.style.display = 'block';
  ghostCursorEl.style.left = '0px';

  // Prepare audio
  let audioCtx = new AudioContext();
  let audioDest = audioCtx.createMediaStreamDestination();
  scheduleAllAudio(audioCtx, audioDest, totalTime);

  // Combine streams
  let canvasStream = previewCanvas.captureStream(FPS);
  let combinedStream = new MediaStream([
    ...canvasStream.getVideoTracks(),
    ...audioDest.stream.getAudioTracks()
  ]);

  let recorder = new MediaRecorder(combinedStream, { mimeType: 'video/webm; codecs=vp9' });
  let chunks = [];
  recorder.ondataavailable = e => { if(e.data.size>0) chunks.push(e.data); };
  recorder.onstop = e => {
    let blob = new Blob(chunks, { type: 'video/webm' });
    let url = URL.createObjectURL(blob);
    let a = document.createElement('a');
    a.href = url;
    a.download = 'rendered_with_audio.webm';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Hide modal
    renderModal.style.display = 'none';
    ghostCursorEl.style.display = 'none';
  };

  recorder.start();
  audioCtx.resume();

  let startTime = audioCtx.currentTime;
  function renderLoop(){
    let now = audioCtx.currentTime;
    let elapsed = now - startTime;
    if(elapsed >= totalTime){
      // done
      recorder.stop();
      audioCtx.close();
      return;
    }
    // Draw current frame
    // We just reuse updatePreviewAtTime with a separate time variable
    updatePreviewAtTime(elapsed);

    // Move ghost cursor + update progress
    let px = elapsed * PIXELS_PER_SECOND;
    ghostCursorEl.style.left = px + 'px';
    renderProgress.value = Math.round((elapsed/totalTime)*100);

    requestAnimationFrame(renderLoop);
  }
  renderLoop();
}
