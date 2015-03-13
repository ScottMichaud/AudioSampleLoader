/**
* AudioSampleLoader loads and decodes audio samples with audioCtx. It can be 
* provided a single URL as a string or a list of URL strings. It is designed to
* function very similar to XMLHttpRequest Level 2.
* <p>
* Sample Usage:<br>
* var loader = new AudioSampleLoader();<br>
* loader.ctx = yourWebAudioContext;<br>
* loader.src = yourPathOrListOfPathsToAudioFiles;<br>
* loader.onload = yourCallbackFunction;<br>
* loader.onerror = yourOptionalErrorCallback;<br>
* loader.send();<br>
* <p>
* When your callback is called, you can view your decoded buffers at:<br>
* loader.response;<br>
* ... which will be an AudioBuffer (or a list of AudioBuffers in the order that
* you provided). Your response will NOT be an argument in the callback. The
* callback only gives you a trigger for completion time (just like XHR).
* <p>
* Basically, imagine it like XMLHttpRequest for loading WebAudio samples.
*
* @author Scott Michaud
* @version 0.2
*/

//Forward-declare AudioContext for Safari and older Google Chrome.
window.AudioContext = window.AudioContext || window.webkitAudioContext;

function AudioSampleLoader() {
  "use strict";
  this.loaded = 0;
}

AudioSampleLoader.prototype.send = function () {
  "use strict";
  var console = window.console,
    i;
  if (!this.hasOwnProperty('ctx')) {
    this.ctx = new window.AudioContext();
  } else if (!(this.ctx instanceof window.AudioContext)) {
    //TODO: Post an error, but do not overwrite the variable with a valid context.
    console.error('AudioSampleLoader: ctx not an instance of AudioContext');
    return;
  }
    
  if (!this.hasOwnProperty('onload')) {
    console.error('AudioSampleLoader: Callback onload does not exist');
    return;
  } else if (typeof this.onload !== 'function') {
    console.error('AudioSampleLoader: Callback onload not a function');
    return;
  }
    
  if (!this.hasOwnProperty('onerror') || typeof this.onerror !== 'function') {
    this.onerror = function () {};
  }
    
  if (Array.isArray(this.src)) {
    for (i = 0; i < this.src.length; i += 1) {
      if (typeof this.src[i] !== 'string') {
        console.error('AudioSampleLoader: src[' + i + '] is not a string');
        this.onerror();
        return;
      }
    }
    
    //If src is a valid list of strings.
    this.response = new Array(this.src.length);
    for (i = 0; i < this.src.length; i += 1) {
      this.loadOneOfBuffers(this.src[i], i);
    }

  } else if (typeof this.src === 'string') {
  
    //If src is just a single string.
    this.loadOneBuffer(this.src);
    
  } else {
    console.error('AudioSampleLoader: src not string or list of strings');
    this.onerror();
    return;
  }
};

AudioSampleLoader.prototype.loadOneBuffer = function (url) {
  "use strict";
  var console = window.console,
    loader = this,
    XHR = new XMLHttpRequest();
  XHR.open('GET', url, true);
  XHR.responseType = 'arraybuffer';
  
  XHR.onload = function () {
    loader.ctx.decodeAudioData(
      XHR.response,
      function (buffer) {
        loader.response = buffer;
        loader.onload();
      },
      function () {
        console.error('AudioSampleLoader: ctx.decodeAudioData() called onerror');
        loader.onerror();
      }
    );
  };
  
  XHR.onerror = function () {
    console.error('AudioSampleLoader: XMLHttpRequest called onerror');
    loader.onerror();
  };
  XHR.send();
};

AudioSampleLoader.prototype.loadOneOfBuffers = function (url, index) {
  "use strict";
  var console = window.console,
    loader = this,
    XHR = new XMLHttpRequest();
  XHR.open('GET', url, true);
  XHR.responseType = 'arraybuffer';
  
  XHR.onload = function () {
    loader.ctx.decodeAudioData(
      XHR.response,
      function (buffer) {
        loader.response[index] = buffer;
        loader.loaded += 1;
        if (loader.loaded === loader.src.length) {
          loader.loaded = 0;
          loader.onload();
        }
      },
      function () {
        console.error('AudioSampleLoader: ctx.decodeAudioData() called onerror');
        loader.onerror();
      }
    );
  };
  
  XHR.onerror = function () {
    console.error('AudioSampleLoader: XMLHttpRequest called onerror');
    loader.onerror();
  };
  XHR.send();
};