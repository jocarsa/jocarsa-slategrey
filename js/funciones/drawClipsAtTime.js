function drawClipsAtTime(clipArray, timeSec){
  // Draw each clip in order. (V1 is underneath V2 if they overlap)
  for(let clip of clipArray){
    let start = clip.startTime;
    let end   = clip.startTime + clip.duration;
    if(timeSec >= start && timeSec < end){
      // ---- If it's an IMAGE clip ----
      if (clip.img) {
        // Draw at its native resolution, centered in the previewCanvas
        let iw = clip.img.width;
        let ih = clip.img.height;
        let cw = previewCanvas.width;
        let ch = previewCanvas.height;

        let x = (cw - iw) / 2;
        let y = (ch - ih) / 2;

        ctx.drawImage(clip.img, x, y);

      // ---- If it's a VIDEO clip ----
      } else if (clip.video) {
        // Local time inside this clip
        let localTime = timeSec - clip.startTime;
        // Prevent out‐of‐range if the timeline time extends beyond the actual video length
        localTime = Math.max(0, Math.min(localTime, clip.video.duration || 999999));

        // Attempt to seek the video to that time
        try {
          clip.video.currentTime = localTime;
        } catch(err) {
          // Some browsers may block or delay setting .currentTime too often.
        }

        // If the video metadata is loaded, draw at its native size, centered
        if (clip.video.videoWidth > 0 && clip.video.videoHeight > 0) {
          let vw = clip.video.videoWidth;
          let vh = clip.video.videoHeight;
          let cw = previewCanvas.width;
          let ch = previewCanvas.height;

          let x = (cw - vw) / 2;
          let y = (ch - vh) / 2;

          ctx.drawImage(clip.video, x, y);
        }
      }
      // If it’s audio only (clipObj.audioBuffer, no .img or .video),
      // we don’t draw anything visually on the preview.
    }
  }
}

