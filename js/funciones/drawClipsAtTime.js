function drawClipsAtTime(clipArray, timeSec){
  // For overlapping clips, we just draw them in order. (V1 is under V2 if they overlap.)
  for(let clip of clipArray){
    let start = clip.startTime;
    let end = clip.startTime + clip.duration;
    if(timeSec >= start && timeSec < end){
      // If it's an image, we have a preloaded .img
      if(clip.file.type.startsWith('image/')){
        if(clip.img){
          ctx.drawImage(clip.img, 0,0, previewCanvas.width, previewCanvas.height);
        }
      } else {
        // If it's a video file (not implemented for real decode)
        ctx.fillStyle = '#000';
        ctx.fillRect(0,0, previewCanvas.width, previewCanvas.height);
        ctx.fillStyle = '#fff';
        ctx.fillText("Video not implemented", 50, 50);
      }
    }
  }
}
