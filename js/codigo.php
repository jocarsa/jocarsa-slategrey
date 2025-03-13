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
let isPlaying = false;
let previewLastTimestamp = 0; // for requestAnimationFrame

// DOM references
const previewCanvas   = document.getElementById('previewCanvas');
const ctx             = previewCanvas.getContext('2d');
const trackVideo1El   = document.getElementById('trackVideo1');
const trackVideo2El   = document.getElementById('trackVideo2');
const trackAudioEl    = document.getElementById('trackAudio');

trackVideo1El.style.width = TIMELINE_WIDTH + 'px';
trackVideo2El.style.width = TIMELINE_WIDTH + 'px';
trackAudioEl.style.width  = TIMELINE_WIDTH + 'px';

const timeCursorEl    = document.getElementById('timeCursor');
timeCursorEl.style.left = '0px';
timeCursorEl.style.height = '100%';

const ghostCursorEl   = document.getElementById('ghostCursor');
const renderButton    = document.getElementById('renderButton');
const renderModal     = document.getElementById('renderModal');
const renderProgress  = document.getElementById('renderProgress');
const timeScaleEl     = document.getElementById('timeScale');
const tracksContainerEl = document.getElementById('tracksContainer');

// Playback controls
document.getElementById('btnRewind').addEventListener('click', () => setPreviewTime(0));
document.getElementById('btnBack25').addEventListener('click', () => stepFrames(-25));
document.getElementById('btnBack1').addEventListener('click', () => stepFrames(-1));
document.getElementById('btnPlay').addEventListener('click', () => {
  isPlaying = true; 
  previewLastTimestamp = null; 
  requestAnimationFrame(playbackLoop);
});
document.getElementById('btnPause').addEventListener('click', () => {
  isPlaying = false;
});
document.getElementById('btnFwd1').addEventListener('click', () => stepFrames(1));
document.getElementById('btnFwd25').addEventListener('click', () => stepFrames(25));
document.getElementById('btnLastFrame').addEventListener('click', () => {
  let end = getTimelineMaxTime();
  setPreviewTime(end);
});

//-----------------------------------------------------------
// TIME SCALE (ruler) + CLICK => Move time cursor
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
// CLIP MOVING (click + drag the clip body)
//-----------------------------------------------------------
let movingClip = null;
let moveStartMouseX = 0;
let moveStartLeftPx = 0;
<?php include "funciones/startClipMove.js";?>
<?php include "funciones/onClipMoveMouseMove.js";?>
<?php include "funciones/onClipMoveMouseUp.js";?>

//-----------------------------------------------------------
// CLIP RESIZING (grab left/right handle)
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

/** Step frames (+/-) from current time. 1 frame ~ 1/FPS seconds. */
<?php include "funciones/stepFrames.js";?>
<?php include "funciones/setPreviewTime.js";?>

/** Return the last "end time" among all clips in all tracks. */
<?php include "funciones/getTimelineMaxTime.js";?>

// Actually draw the preview at a given time (compositing video track #1 under #2)
<?php include "funciones/updatePreviewAtTime.js";?>
<?php include "funciones/drawClipsAtTime.js";?>

//-----------------------------------------------------------
// RENDER (VIDEO + AUDIO) with a progress bar & ghost cursor
//-----------------------------------------------------------
renderButton.addEventListener('click', () => {
  let endTime = getTimelineMaxTime();
  if (endTime < 0.01) {
    alert("No clips to render!");
    return;
  }
  doRender(endTime);
});
<?php include "funciones/doRender.js";?>
<?php include "funciones/scheduleAllAudio.js";?>

//-----------------------------------------------------------
// AUDIO DECODING + WAVEFORM
//-----------------------------------------------------------
<?php include "funciones/decodeAudioFile.js";?>
<?php include "funciones/fileToArrayBuffer.js";?>
<?php include "funciones/drawAudioWaveform.js";?>

//-----------------------------------------------------------
// ===== NEW SELECTION & PROPERTIES LOGIC =====
//-----------------------------------------------------------

/** A global that holds our currently selected clip, if any */
let selectedClip = null;

/** Called when user clicks a clip in the timeline */
function selectClip(clip) {
  // Un-highlight the previous selection
  if (selectedClip && selectedClip.element) {
    selectedClip.element.classList.remove('clip-selected');
  }
  // Mark new clip as selected
  selectedClip = clip;
  if (clip.element) {
    clip.element.classList.add('clip-selected');
  }
  // Update the properties panel
  updatePropertiesPanel();
}

/** Show/hide input fields depending on clip type (video/image vs audio) */
function updatePropertiesPanel(){
  const noSelEl     = document.getElementById('noSelection');
  const videoPropsEl= document.getElementById('videoProps');
  const audioPropsEl= document.getElementById('audioProps');

  if (!selectedClip) {
    // No selection => show "No clip selected"
    noSelEl.style.display       = 'block';
    videoPropsEl.style.display  = 'none';
    audioPropsEl.style.display  = 'none';
    return;
  }

  // Hide "No clip selected"
  noSelEl.style.display = 'none';

  // Is it a video/image clip? (We check for clip.img or clip.video)
  let isVideoOrImage = (selectedClip.img || selectedClip.video);
  // Is it audio? (Check for clip.audioBuffer)
  let isAudio = !!selectedClip.audioBuffer;

  if (isVideoOrImage) {
    // Show the videoProps fields, hide audioProps
    videoPropsEl.style.display = 'block';
    audioPropsEl.style.display = 'none';

    // Populate inputs from the clip
    document.getElementById('propPosX').value     = selectedClip.posX;
    document.getElementById('propPosY').value     = selectedClip.posY;
    document.getElementById('propRotation').value = selectedClip.rotation;
    document.getElementById('propScale').value    = selectedClip.scale;
  }
  else if (isAudio) {
    // Show audioProps, hide videoProps
    videoPropsEl.style.display = 'none';
    audioPropsEl.style.display = 'block';

    document.getElementById('propVolume').value   = selectedClip.volume;
    document.getElementById('propPanning').value  = selectedClip.panning;
  }
}

/** Listen for user changes in the video/image property fields */
document.getElementById('propPosX').addEventListener('input', e => {
  if (selectedClip) {
    selectedClip.posX = parseFloat(e.target.value) || 0;
    updatePreviewUI();
  }
});
document.getElementById('propPosY').addEventListener('input', e => {
  if (selectedClip) {
    selectedClip.posY = parseFloat(e.target.value) || 0;
    updatePreviewUI();
  }
});
document.getElementById('propRotation').addEventListener('input', e => {
  if (selectedClip) {
    selectedClip.rotation = parseFloat(e.target.value) || 0;
    updatePreviewUI();
  }
});
document.getElementById('propScale').addEventListener('input', e => {
  if (selectedClip) {
    selectedClip.scale = parseFloat(e.target.value) || 1;
    updatePreviewUI();
  }
});

/** Listen for user changes in the audio property fields */
document.getElementById('propVolume').addEventListener('input', e => {
  if (selectedClip) {
    selectedClip.volume = parseFloat(e.target.value);
    // If you want real-time volume changes, you'd do that in scheduleAllAudio or via separate nodes
  }
});
document.getElementById('propPanning').addEventListener('input', e => {
  if (selectedClip) {
    selectedClip.panning = parseFloat(e.target.value);
    // If you want real-time panning changes, you'd use a StereoPannerNode, etc.
  }
});

