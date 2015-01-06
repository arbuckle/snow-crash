(function(){


  function makeNoise(){

    // cribbed mostly from MDN.

    var audioCtx,
      error,
      frameCount,
      myArrayBuffer,
      nowBuffering,
      gainNode,
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
      error = "AudioContext is not supported by this browser.";
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
    gainNode.connect(audioCtx.destination);
    source.loop = true;
    source.start();


    var gain = 1;
    setInterval(function(){
      gain = (Math.random() + 0.4) * gain;
      gain = (gain > 1) ? 1 : gain;
      gain = (gain < 0.3) ? 0.3 : gain;


      gainNode.gain.value = gain;
    }, 60);




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
      maxSaturation = Math.floor(255 / (1 + multiplier));
    snow = Math.floor(Math.random() * maxSaturation);


    // The multiplier variable indicates that RGB values will diverge, creating the illusion of color.
    if (multiplier) {
      for (i = 0; i < px; i ++ ) {
        n = i * 4; // starting location.  each pixel has 4 slots in the imageData array.  RGBa
        mx = Math.random() + multiplier;
        imageData.data[n] = snow * mx;

        mx = Math.random() + multiplier;
        imageData.data[n+1] = snow * mx;

        mx = Math.random() + multiplier;
        imageData.data[n+2] = snow * mx;

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
    x = 800,
    y = 500,
    underrun = 0.5,
    px = x * y,
    canvas = document.getElementById("Snow"),
    ctx = canvas.getContext("2d"),
    imageData = ctx.createImageData(x, y);

  // Using individual pixels is totally unnecessary.
  canvas.style.width = x;
  canvas.width = underrun * x;
  canvas.style.height = y;
  canvas.height = underrun * y;

  setInterval(function(){
    drawSnow(ctx, px, imageData, 0);
  }, 60);
  makeNoise();


})();
