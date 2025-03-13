//-----------------------------------------------------------
// BASIC TIMELINE CONSTANTS
//-----------------------------------------------------------
const TIMELINE_WIDTH = 4000;
const PIXELS_PER_SECOND = 50;
const DEFAULT_DURATION_VIDEO = 2;
const DEFAULT_DURATION_AUDIO = 3;
const FPS = 30; // for preview playback and final render

// Our track data
let clipsVideo1 = [];
let clipsVideo2 = [];
let clipsAudio = [];
let clipIdCounter = 0;

// We'll keep track of the "preview" current time (in seconds) for normal playback/pause
let currentPreviewTime = 0;
let isPlaying = false; // for preview
let previewLastTimestamp = 0; // for requestAnimationFrame

// DOM references
const previewCanvas = document.getElementById('previewCanvas');
const ctx = previewCanvas.getContext('2d');

const trackVideo1El = document.getElementById('trackVideo1');
const trackVideo2El = document.getElementById('trackVideo2');
const trackAudioEl  = document.getElementById('trackAudio');

trackVideo1El.style.width = TIMELINE_WIDTH + 'px';
trackVideo2El.style.width = TIMELINE_WIDTH + 'px';
trackAudioEl.style.width  = TIMELINE_WIDTH + 'px';

const timeCursorEl = document.getElementById('timeCursor');
timeCursorEl.style.left = '0px';
timeCursorEl.style.height = '100%';

const ghostCursorEl = document.getElementById('ghostCursor');

const renderButton = document.getElementById('renderButton');
const renderModal = document.getElementById('renderModal');
const renderProgress = document.getElementById('renderProgress');

const timeScaleEl = document.getElementById('timeScale');
const tracksContainerEl = document.getElementById('tracksContainer');

// Playback controls
document.getElementById('btnRewind').addEventListener('click', () => setPreviewTime(0));
document.getElementById('btnBack25').addEventListener('click', () => stepFrames(-25));
document.getElementById('btnBack1').addEventListener('click', () => stepFrames(-1));
document.getElementById('btnPlay').addEventListener('click', () => { isPlaying = true; previewLastTimestamp = null; requestAnimationFrame(playbackLoop); });
document.getElementById('btnPause').addEventListener('click', () => { isPlaying = false; });
document.getElementById('btnFwd1').addEventListener('click', () => stepFrames(1));
document.getElementById('btnFwd25').addEventListener('click', () => stepFrames(25));
document.getElementById('btnLastFrame').addEventListener('click', () => {
  let end = getTimelineMaxTime();
  setPreviewTime(end);
});

//-----------------------------------------------------------
// TIME SCALE (ruler) + CLICK = move time cursor
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
// DRAG & DROP FILES => Creates a clip object
//-----------------------------------------------------------

<?php include "funciones/handleFileDrop.js";?>
<?php include "funciones/createTrackClip.js";?>
//-----------------------------------------------------------
// CLIP MOVING: on mousedown => track mousemove => update clip pos
//-----------------------------------------------------------
let movingClip = null;
let moveStartMouseX = 0;
let moveStartLeftPx = 0;

<?php include "funciones/startClipMove.js";?>
<?php include "funciones/onClipMoveMouseMove.js";?>
<?php include "funciones/onClipMoveMouseUp.js";?>
//-----------------------------------------------------------
// RESIZING: Similar approach for the left/right handles
//-----------------------------------------------------------
let resizingClip = null;
let resizeMode = null; // 'left' or 'right'
let resizeStartMouseX = 0;
let resizeStartLeftPx = 0;
let resizeStartWidthPx = 0;

<?php include "funciones/startHandleResize.js";?>
<?php include "funciones/onHandleResizeMove.js";?>
<?php include "funciones/onHandleResizeUp.js";?>

//-----------------------------------------------------------
// PREVIEW PLAYBACK
//-----------------------------------------------------------

<?php include "funciones/playbackLoop.js";?>

/** Update preview canvas + time cursor to show currentPreviewTime */

<?php include "funciones/updatePreviewUI.js";?>

/** Step frames ( +/- ) from current time. 1 frame ~ 1/FPS seconds. */

<?php include "funciones/stepFrames.js";?>
<?php include "funciones/setPreviewTime.js";?>

/** Return the last "end time" among all clips in all tracks, to define timeline length. */

<?php include "funciones/getTimelineMaxTime.js";?>

// Actually draw the preview at a given time (compositing video track #1 under #2)

<?php include "funciones/updatePreviewAtTime.js";?>
<?php include "funciones/drawClipsAtTime.js";?>

//-----------------------------------------------------------
// RENDER (VIDEO+ AUDIO) WITH A PROGRESS BAR & GHOST CURSOR
//-----------------------------------------------------------
renderButton.addEventListener('click', () => {
  let endTime = getTimelineMaxTime();
  if(endTime < 0.01){
    alert("No clips to render!");
    return;
  }
  doRender(endTime);
});

/**
 * We do a real-time approach: 
 * 1) Create an AudioContext, schedule all audio, 
 * 2) Each frame: draw the right images, 
 * 3) Capture the canvas + combined audio in a MediaRecorder,
 * 4) Show a modal & progress bar,
 * 5) Show a ghost cursor that moves from 0..endTime 
 */
 
<?php include "funciones/doRender.js";?>
/** Schedules all audio clips in real-time from 0..clip.duration */
<?php include "funciones/scheduleAllAudio.js";?>

//-----------------------------------------------------------
// AUDIO DECODING + WAVEFORM
//-----------------------------------------------------------

<?php include "funciones/decodeAudioFile.js";?>
<?php include "funciones/fileToArrayBuffer.js";?>
/** Draw a simple waveform inside the audio clip’s div. */

<?php include "funciones/drawAudioWaveform.js";?>
