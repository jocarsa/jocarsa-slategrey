/** Create a new clip object at the current time cursor. */
function createTrackClip(file, trackType){
  let startPx = parseFloat(timeCursorEl.style.left) || 0;
  let startTime = startPx / PIXELS_PER_SECOND;

  let defDur = (trackType === 'audio') ? DEFAULT_DURATION_AUDIO : DEFAULT_DURATION_VIDEO;
  let clipObj = {
    id: clipIdCounter++,
    file,
    track: trackType,
    startTime,
    duration: defDur,
    element: document.createElement('div'),
    audioBuffer: null,
    img: null  // we'll store a preloaded image for image files
  };

  // .clip setup
  clipObj.element.classList.add('clip');
  if(trackType === 'audio'){
    clipObj.element.classList.add('audio-clip');
  }

  let leftPx = startTime * PIXELS_PER_SECOND;
  let widthPx = defDur * PIXELS_PER_SECOND;
  clipObj.element.style.left = leftPx + 'px';
  clipObj.element.style.width = widthPx + 'px';

  // Inner HTML: handles, label
  clipObj.element.innerHTML = `
    <div class="handle left"></div>
    <div class="handle right"></div>
    <div class="clip-label">${file.name}</div>
  `;

  // If it's an image, preload once
  if(file.type.startsWith('image/')){
    let fr = new FileReader();
    fr.onload = evt => {
      let i = new Image();
      i.onload = () => { clipObj.img = i; };
      i.src = evt.target.result;
      // Also set background for visual ID
      clipObj.element.style.backgroundImage = `url('${evt.target.result}')`;
    };
    fr.readAsDataURL(file);
  }

  // If audio => decode + draw waveform
  if(trackType === 'audio'){
    decodeAudioFile(file).then(buffer => {
      clipObj.audioBuffer = buffer;
      drawAudioWaveform(clipObj);
    });
  }

  // For video files, no decoding here; just a placeholder.

  // Insert into correct array
  if(trackType === 'video1'){
    trackVideo1El.appendChild(clipObj.element);
    clipsVideo1.push(clipObj);
  } else if(trackType === 'video2'){
    trackVideo2El.appendChild(clipObj.element);
    clipsVideo2.push(clipObj);
  } else if(trackType === 'audio'){
    trackAudioEl.appendChild(clipObj.element);
    clipsAudio.push(clipObj);
  }

  // Add listeners for MOUSE-based dragging/resizing (not HTML5 drag)
  clipObj.element.addEventListener('mousedown', e => {
    // If user clicked a handle, we skip, because we do a separate flow
    if(e.target.classList.contains('handle')) return;
    startClipMove(e, clipObj);
  });
  let leftHandle = clipObj.element.querySelector('.handle.left');
  let rightHandle = clipObj.element.querySelector('.handle.right');
  leftHandle.addEventListener('mousedown', e => startHandleResize(e, clipObj, 'left'));
  rightHandle.addEventListener('mousedown', e => startHandleResize(e, clipObj, 'right'));
}
