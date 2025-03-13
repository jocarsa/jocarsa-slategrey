function handleFileDrop(e, trackType){
  e.preventDefault();
  let files = e.dataTransfer.files;
  if(!files.length) return;

  for(let file of files){
    if(trackType.startsWith('video')){
      if(!file.type.startsWith('image/') && !file.type.startsWith('video/')){
        alert("Please drop image/video in video track.");
        continue;
      }
      createTrackClip(file, trackType);
    } else if(trackType === 'audio'){
      if(!file.type.startsWith('audio/')){
        alert("Please drop audio in audio track.");
        continue;
      }
      createTrackClip(file, 'audio');
    }
  }
}
