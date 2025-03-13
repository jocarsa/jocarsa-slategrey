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

    // For audio
    audioBuffer: null,
    // For images
    img: null,
    // For video
    video: null,

    // Transformation / property defaults
    posX: 0,
    posY: 0,
    rotation: 0, // degrees
    scale: 1.0,

    // Audio property defaults
    volume: 1.0,
    panning: 0
  };

  clipObj.element.classList.add('clip');
  if(trackType === 'audio'){
    clipObj.element.classList.add('audio-clip');
  }

  // Position & width on timeline
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

  // IMAGE?
  if (file.type.startsWith('image/')){
    let fr = new FileReader();
    fr.onload = evt => {
      let i = new Image();
      i.onload = () => { clipObj.img = i; };
      i.src = evt.target.result;

      // Also set background image in the timeline clip
      clipObj.element.style.backgroundImage = `url('${evt.target.result}')`;
      clipObj.element.style.backgroundSize = 'cover';
      clipObj.element.style.backgroundPosition = 'center';
    };
    fr.readAsDataURL(file);

  // VIDEO?
  } else if (file.type.startsWith('video/')){
    let vid = document.createElement('video');
    vid.preload = 'auto';
    vid.src = URL.createObjectURL(file);
    vid.muted = true;
    vid.playsInline = true;
    vid.onloadedmetadata = () => {
      console.log('Video loaded:', vid.videoWidth, vid.videoHeight);
    };
    clipObj.video = vid;

    // Give a dark background in timeline
    clipObj.element.style.background = '#444';
  }

  // AUDIO? 
  if (trackType === 'audio'){
    decodeAudioFile(file).then(buffer => {
      clipObj.audioBuffer = buffer;
      drawAudioWaveform(clipObj);
    });
  }

  // Insert into the correct track array
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

  // Mouse-based dragging/resizing
  clipObj.element.addEventListener('mousedown', e => {
    if(e.target.classList.contains('handle')) return;
    startClipMove(e, clipObj);
  });
  let leftHandle = clipObj.element.querySelector('.handle.left');
  let rightHandle = clipObj.element.querySelector('.handle.right');
  leftHandle.addEventListener('mousedown', e => startHandleResize(e, clipObj, 'left'));
  rightHandle.addEventListener('mousedown', e => startHandleResize(e, clipObj, 'right'));

  // Click => select this clip
  clipObj.element.addEventListener('click', () => {
    selectClip(clipObj);
  });

  // === NEW: broadcast so the Monitor/Params know a new clip was added
  broadcastFullState();
}

