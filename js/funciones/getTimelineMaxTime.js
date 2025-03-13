function getTimelineMaxTime(){
  let maxT = 0;
  function check(arr){
    for(let c of arr){
      let end = c.startTime + c.duration;
      if(end > maxT) maxT = end;
    }
  }
  check(clipsVideo1);
  check(clipsVideo2);
  check(clipsAudio);
  return maxT;
}
