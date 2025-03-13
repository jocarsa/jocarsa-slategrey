function drawClipsAtTime(clipArray, timeSec){
  for (let clip of clipArray) {
    let start = clip.startTime;
    let end   = clip.startTime + clip.duration;
    if (timeSec >= start && timeSec < end) {

      // IMAGE?
      if (clip.img) {
        let iw = clip.img.width;
        let ih = clip.img.height;
        let cw = previewCanvas.width;
        let ch = previewCanvas.height;

        // center of canvas
        let centerX = cw / 2;
        let centerY = ch / 2;

        // apply transformations
        ctx.save();
        // move origin to canvas center
        ctx.translate(centerX, centerY);
        // apply user offsets
        ctx.translate(clip.posX, clip.posY);
        // rotation in degrees -> radians
        ctx.rotate(clip.rotation * Math.PI / 180);
        // scale
        ctx.scale(clip.scale, clip.scale);

        // draw so that the image center is at the origin
        ctx.drawImage(clip.img, -iw/2, -ih/2);
        ctx.restore();

      // VIDEO?
      } else if (clip.video) {
        let localTime = timeSec - clip.startTime;
        localTime = Math.max(0, Math.min(localTime, clip.video.duration || 999999));
        try {
          clip.video.currentTime = localTime;
        } catch (err) {
          // Some browsers might complain about frequent seeking
        }

        if (clip.video.videoWidth > 0 && clip.video.videoHeight > 0) {
          let vw = clip.video.videoWidth;
          let vh = clip.video.videoHeight;
          let cw = previewCanvas.width;
          let ch = previewCanvas.height;

          let centerX = cw / 2;
          let centerY = ch / 2;

          ctx.save();
          ctx.translate(centerX, centerY);
          ctx.translate(clip.posX, clip.posY);
          ctx.rotate(clip.rotation * Math.PI / 180);
          ctx.scale(clip.scale, clip.scale);

          ctx.drawImage(clip.video, -vw/2, -vh/2);
          ctx.restore();
        }
      }
      // AUDIO-only => no visual drawing
    }
  }
}

