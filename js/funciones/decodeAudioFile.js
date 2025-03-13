async function decodeAudioFile(file){
  let arrayBuf = await fileToArrayBuffer(file);
  let tmpCtx = new AudioContext();
  let decoded = await tmpCtx.decodeAudioData(arrayBuf);
  tmpCtx.close();
  return decoded;
}
