var SnowCrash = function(opts){

  // Setting default options.
  opts.el = opts.el || document.getElementById("Snow");
  opts.width = opts.width || 800;
  opts.height = opts.height || 500;
  opts.muted = (opts.muted === undefined) ? true : opts.muted;
  opts.freeze = (opts.freeze === undefined) ? false : opts.freeze;

  // instance globals.
  var gainNode,
      gainInterval,
      snowInterval,
      cfx = 0;

  function modulateGain(){
    var gain = 1;
    gainInterval = setInterval(function(){
      gain = (Math.random() + 0.4) * gain;
      gain = (gain > 1) ? 1 : gain;
      gain = (gain < 0.3) ? 0.3 : gain;

      gainNode.gain.value = gain;
    }, 60);
  }

  function clearGain(){
    clearInterval(gainInterval);
    gainNode.gain.value = 0;
    gainInterval = undefined;
  }

  function makeNoise(){

    // cribbed mostly from MDN.

    var audioCtx,
      frameCount,
      myArrayBuffer,
      nowBuffering,
      channel,
      i,
      source,
      channels = 1;


    if (window.AudioContext) {
      audioCtx = new window.AudioContext();
    } else if (window.webkitAudioContext) {
      audioCtx = new window.webkitAudioContext();
    }

    if (!audioCtx) {
      return;
    }

    // Create an empty two second stereo buffer at the
    // sample rate of the AudioContext
    frameCount = audioCtx.sampleRate * 3.1;
    myArrayBuffer = audioCtx.createBuffer(channels, frameCount, audioCtx.sampleRate);
    for (channel = 0; channel < channels; channel++) {
      nowBuffering = myArrayBuffer.getChannelData(channel);
      for (i = 0; i < frameCount; i++) {
        nowBuffering[i] = Math.random() + 2 - 1;
      }
    }

    // Get an AudioBufferSourceNode.
    // This is the AudioNode to use when we want to play an AudioBuffer
    gainNode = audioCtx.createGain();
    source = audioCtx.createBufferSource();
    source.buffer = myArrayBuffer;
    source.connect(gainNode);
    gainNode.gain.value = 0;
    gainNode.connect(audioCtx.destination);
    source.loop = true;
    source.start();

    if (!opts.muted) {
      gainInterval = modulateGain();
    }
  }

  var gridIron = [];
  for (i = 0; i < 18; i ++) {
    gridIron.push(Math.random() + 0.9);
  }

  function drawSnow(ctx, px, imageData, colorFactor){
    /*
     ctx - a 2d context object
     px - integer value denoting the number of pixels in the canvas.
     imageData - ctx.imageData object into which pixels are modified.
     colorfactor - an integer 0 <= colorFactor < 1 that denotes the degree to which RGB values can vary.  0.9 recommended for color snow crash simulation.
     */
    var n,
      mx,
      multiplier = colorFactor || 0,
      maxSaturation = Math.floor(255 / (1 + multiplier)),
      snow = Math.floor(Math.random() * maxSaturation);


    // The multiplier variable indicates that RGB values will diverge, creating the illusion of color.
    if (multiplier) {
      for (i = 0; i < px; i ++ ) {
        n = i * 4; // starting location.  each pixel has 4 slots in the imageData array.  RGBa
        mx = Math.floor(Math.random() * 15);

        imageData.data[n] = snow * gridIron[mx];
        imageData.data[n+1] = snow * gridIron[mx+1];
        imageData.data[n+2] = snow * gridIron[mx+2];

        imageData.data[n+3] = 255;

        snow = Math.floor(Math.random() * maxSaturation);
      }


      // Handling the case of a plain black and white snow crash
    } else {
      for (i = 0; i < px; i ++ ) {
        n = i * 4; // starting location.  each pixel has 4 slots in the imageData array.  RGBa
        imageData.data[n] = snow;       // R
        imageData.data[n+1] = snow;     // G
        imageData.data[n+2] = snow;     // B
        imageData.data[n+3] = 255;      // a

        snow = Math.floor(Math.random() * 255);
      }
    }

    ctx.putImageData(imageData, 0, 0);
  }


  var i,
    x = opts.width,
    y = opts.height,
    underrun = 0.5,
    px = x * y,
    canvas = opts.el,
    ctx = canvas.getContext("2d"),
    imageData = ctx.createImageData(x, y);

  // Using individual pixels is totally unnecessary.
  canvas.width = underrun * x;
  canvas.height = underrun * y;


  function makeSnow(){
    snowInterval = setInterval(function(){
      drawSnow(ctx, px, imageData, cfx);
    }, 60);
  }
  function clearSnow() {
    clearInterval(snowInterval);
    snowInterval = undefined;
  }

  makeNoise();

  if (!opts.freeze) {
    makeSnow();
  }

  return {
    toggleSnow: function(){
      console.log("Stop the snow!");
      if (snowInterval) {
        clearSnow();
      } else {
        makeSnow();
      }
    },
    toggleColor: function(value){
      if (value !== undefined) {
        cfx = value;
      } else if (cfx === 0) {
        cfx = 0.95;
      } else {
        cfx = 0;
      }
    },
    toggleAudio: function(){
      console.log("Toggle the audio!");
      if (gainInterval) {
        clearGain();
      } else {
        modulateGain();
      }
    }
  }

};
