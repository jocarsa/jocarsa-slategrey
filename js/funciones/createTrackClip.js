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
    img: null,    // we'll store a preloaded Image for image files
    video: null   // we'll store an HTMLVideoElement for video files
  };

  // Base CSS classes
  clipObj.element.classList.add('clip');
  if (trackType === 'audio'){
    clipObj.element.classList.add('audio-clip');
  }

  // Position and width in the timeline
  let leftPx = startTime * PIXELS_PER_SECOND;
  let widthPx = defDur * PIXELS_PER_SECOND;
  clipObj.element.style.left = leftPx + 'px';
  clipObj.element.style.width = widthPx + 'px';

  // Inner HTML: resize handles + label
  clipObj.element.innerHTML = `
    <div class="handle left"></div>
    <div class="handle right"></div>
    <div class="clip-label">${file.name}</div>
  `;

  // ---- IMAGE case ----
  if (file.type.startsWith('image/')) {
    let fr = new FileReader();
    fr.onload = evt => {
      let i = new Image();
      i.onload = () => {
        clipObj.img = i;
      };
      i.src = evt.target.result;

      // Also set a background image in the timeline clip for visibility
      clipObj.element.style.backgroundImage = `url('${evt.target.result}')`;
      clipObj.element.style.backgroundSize  = 'cover';
      clipObj.element.style.backgroundPosition = 'center';
    };
    fr.readAsDataURL(file);

  // ---- VIDEO case (e.g. MP4) ----
  } else if (file.type.startsWith('video/')) {
    // Create a hidden <video> element for frame‐by‐frame drawing
    let vid = document.createElement('video');
    vid.preload = 'auto';
    vid.src = URL.createObjectURL(file);
    vid.muted = true;
    vid.playsInline = true;

    vid.onloadedmetadata = () => {
      // Once metadata is available, you can do something with vid.videoWidth/Height if needed
      console.log('Video loaded:', vid.videoWidth, vid.videoHeight);
    };

    clipObj.video = vid;

    // Give the clip a dark background or poster so user sees something in the timeline
    clipObj.element.style.background = '#444';
  }

  // ---- AUDIO case ----
  if (trackType === 'audio'){
    decodeAudioFile(file).then(buffer => {
      clipObj.audioBuffer = buffer;
      drawAudioWaveform(clipObj);
    });
  }

  // Insert into the correct track array + append to DOM
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

  // Add mouse listeners for moving/resizing (the same as before)
  clipObj.element.addEventListener('mousedown', e => {
    // If user clicked on a handle, skip to the resize flow
    if(e.target.classList.contains('handle')) return;
    startClipMove(e, clipObj);
  });

  let leftHandle = clipObj.element.querySelector('.handle.left');
  let rightHandle = clipObj.element.querySelector('.handle.right');
  leftHandle.addEventListener('mousedown', e => startHandleResize(e, clipObj, 'left'));
  rightHandle.addEventListener('mousedown', e => startHandleResize(e, clipObj, 'right'));
}

