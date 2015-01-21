# This is a javascript snow crash.

Our devices just don't crash the way they used to.  

Generate a snow crash anywhere `<canvas>` is supported.  

Can also generate random audio noise, anywhere `AudioContext` is supported.

```
    <canvas id="Snow" class="snow"></canvas>

    <script src="snow.js"></script>
    <script>
      var snow = SnowCrash({
        el: document.getElementById("Snow"),
        width: 1080,
        height: 720,
        muted: true
      });
    </script>
```

## Options

**el** 
Required. The canvas element in which to generate the snow crash.

**width / height**  
Required. The dimensions of the element.  This will not resize the element.

**muted** 
Defaults to true.  Determines whether audio is audible.

**freeze** 
Defaults to false.  Determines whether snow is generated.


## Methods

**toggleSnow()**
Turns the snow on and off.  Does not clear the canvas.

**toggleAudio()**
Turns the audio on and off.

**toggleColor()**
Toggles the snow from greyscale to full color.  Suffers performance issues.







