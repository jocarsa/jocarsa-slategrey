//-----------------------------------------------------------
// BASIC TIMELINE CONSTANTS
//-----------------------------------------------------------
const TIMELINE_WIDTH = 4000;
const PIXELS_PER_SECOND = 50;
const DEFAULT_DURATION_VIDEO = 2;
const DEFAULT_DURATION_AUDIO = 3;

// Our track data (real arrays hold file refs, DOM elements, etc.)
let clipsVideo1 = [];
let clipsVideo2 = [];
let clipsAudio  = [];
let clipIdCounter = 0;

// >>> Se asignan al objeto global para que puedan ser accedidos desde ventanas hijas <<<
window.clipsVideo1 = clipsVideo1;
window.clipsVideo2 = clipsVideo2;
window.clipsAudio  = clipsAudio;

// DOM references for the timeline
const trackVideo1El = document.getElementById('trackVideo1');
const trackVideo2El = document.getElementById('trackVideo2');
const trackAudioEl  = document.getElementById('trackAudio');

trackVideo1El.style.width = TIMELINE_WIDTH + 'px';
trackVideo2El.style.width = TIMELINE_WIDTH + 'px';
trackAudioEl.style.width  = TIMELINE_WIDTH + 'px';

const timeCursorEl = document.getElementById('timeCursor');
timeCursorEl.style.left   = '0px';
timeCursorEl.style.height = '100%';

const ghostCursorEl = document.getElementById('ghostCursor');

const timeScaleEl = document.getElementById('timeScale');
const tracksContainerEl = document.getElementById('tracksContainer');

//-----------------------------------------------------------
// TIME SCALE + CLICK => Move time cursor
//-----------------------------------------------------------
timeScaleEl.addEventListener('click', (e) => {
  let rect = timeScaleEl.getBoundingClientRect();
  let x = e.clientX - rect.left;
  moveTimeCursorTo(x);
  let timeSec = x / PIXELS_PER_SECOND;
  setPreviewTime(timeSec);
});

<?php include "funciones/moveTimeCursorTo.js";?>
<?php include "funciones/drawTimeScale.js";?>
window.addEventListener('resize', drawTimeScale);
drawTimeScale();

//-----------------------------------------------------------
// DRAG & DROP => Creates a clip object
//-----------------------------------------------------------
<?php include "funciones/handleFileDrop.js";?>
<?php include "funciones/createTrackClip.js";?>

//-----------------------------------------------------------
// CLIP MOVING (click+drag on the clip itself)
//-----------------------------------------------------------
let movingClip = null;
let moveStartMouseX = 0;
let moveStartLeftPx = 0;

<?php include "funciones/startClipMove.js";?>
<?php include "funciones/onClipMoveMouseMove.js";?>
<?php include "funciones/onClipMoveMouseUp.js";?>

//-----------------------------------------------------------
// CLIP RESIZING (handles on left/right edges)
//-----------------------------------------------------------
let resizingClip = null;
let resizeMode = null;
let resizeStartMouseX = 0;
let resizeStartLeftPx = 0;
let resizeStartWidthPx = 0;

<?php include "funciones/startHandleResize.js";?>
<?php include "funciones/onHandleResizeMove.js";?>
<?php include "funciones/onHandleResizeUp.js";?>

//-----------------------------------------------------------
// HELPER: Return the last "end time" among all clips
//-----------------------------------------------------------
<?php include "funciones/getTimelineMaxTime.js";?>

//-----------------------------------------------------------
// AUDIO DECODING + WAVEFORM
//-----------------------------------------------------------
<?php include "funciones/decodeAudioFile.js";?>
<?php include "funciones/fileToArrayBuffer.js";?>
<?php include "funciones/drawAudioWaveform.js";?>

//-----------------------------------------------------------
// SELECT CLIP + PROPERTIES (just highlighting in timeline)
//-----------------------------------------------------------
let selectedClip = null;

function selectClip(clip) {
  if (selectedClip && selectedClip.element) {
    selectedClip.element.classList.remove('clip-selected');
  }
  selectedClip = clip;
  if (clip.element) {
    clip.element.classList.add('clip-selected');
  }
  broadcastSelection();
}

function broadcastSelection() {
  if (!selectedClip) {
    channel.postMessage({ type: 'selectionChanged', selectedClip: null });
  } else {
    channel.postMessage({ type: 'selectionChanged', selectedClip: selectedClip.id });
  }
}

//-----------------------------------------------------------
// TIMELINE "CURRENT TIME" LOGIC => move red cursor
//-----------------------------------------------------------
function setPreviewTime(t) {
  currentPreviewTime = t;
  updateTimeCursor();
  channel.postMessage({ type:'timeChanged', currentTime: currentPreviewTime });
  if (typeof updateTimeDisplay === 'function') {
    updateTimeDisplay();
  }
}

function updateTimeCursor() {
  let px = currentPreviewTime * PIXELS_PER_SECOND;
  moveTimeCursorTo(px);
}

let channel;

function initializeChannel() {
  channel = new BroadcastChannel('myVideoEditorChannel');

  channel.onmessage = function(e) {
    const msg = e.data;
    switch(msg.type) {
      case 'requestInitialState':
        broadcastFullState();
        break;
      case 'updateClipProperty':
        updateClipProperty(msg.clipId, msg.property, msg.value);
        break;
      case 'timeChanged':
        currentPreviewTime = msg.currentTime;
        updateTimeCursor();
        if (typeof updateTimeDisplay === 'function') {
          updateTimeDisplay();
        }
        break;
      default:
        // Handle other messages if needed
    }
  };
}

initializeChannel();

function serializeClip(clip) {
  return {
    id: clip.id,
    track: clip.track,
    startTime: clip.startTime,
    duration: clip.duration,
    fileName: clip.file ? clip.file.name : "",
    fileType: clip.file ? clip.file.type : "",
    posX: clip.posX,
    posY: clip.posY,
    rotation: clip.rotation,
    scale: clip.scale,
    volume: clip.volume,
    panning: clip.panning
  };
}

function broadcastFullState(){
  channel.postMessage({
    type: 'fullState',
    clipsVideo1: clipsVideo1.map(serializeClip),
    clipsVideo2: clipsVideo2.map(serializeClip),
    clipsAudio:  clipsAudio.map(serializeClip),
    currentTime: currentPreviewTime,
    selectedClipId: (selectedClip ? selectedClip.id : null)
  });
}

function updateClipProperty(clipId, property, value) {
  let all = clipsVideo1.concat(clipsVideo2, clipsAudio);
  let c = all.find(x => x.id === clipId);
  if (!c) return;
  c[property] = value;
  broadcastFullState();
}

