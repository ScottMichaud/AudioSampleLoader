#AudioSampleLoader

AudioSampleLoader() is a utility class to help load, and decode, one or more 
audio samples using WebAudio API. It is designed to closely resemble 
XMLHttpRequest Level 2. It is asynchronous.

## Sample Usage

### Creating an Instance

`var loader = new AudioSampleLoader();`

This document will assume that your instance is a variable called `loader. Like
always, you are free to name it whatever you want (or even have multiple
instances active, each with its own variable name).

### Setting Attributes

`src` (required) is the URL to your audio files.

`loader.src = 'audio/file.mp3';`

or

`loader.src = ['audio/file1.mp3', 'audio/file2.mp3', 'sounds/filec.mp3'];`

`ctx` (required) is your WebAudio context that will perform the actual decode.
Note: In the future, this might be made optional. If so, and if it is not
provided a valid WebAudio context, it will create one.

`loader.ctx = yourAudioContext;`

`onload` (required) is your callback function which is executed after the
successful decode. When this function is called, your data will be available at
`loader.response` as an AudioBuffer (or an array of AudioBuffers, depending on
`src`).

`loader.onload = function () { window.mySample = loader.response; };`

`onerror` (optional) is your callback function which is executed on failure.
Currently, this is when: your URL is not a string or pure string array, XHR
calls its onerror callback, or the WebAudio context's decodeAudioData() method
calls its onerror callback. If not provided, it will do nothing.

`loader.onerror = function () { alert('Awwwwww snap!'); };`

### Sending the Request

When the above attributes are properly set, you can then put AudioSampleLoader
to work by calling its `send()` method.

`loader.send();`

### Reading Your Results

If everything goes well, your AudioSampleLoader will call `onload`. At this
time, your decoded audio samples will be available at `loader.response`. If
`src` was a string, `response` will be the AudioBuffer decoded from the file at
that URL. If `src` was a list of strings, `response` will be a list of
AudioBuffer objects, where `src[0]` will correspond to `response[0]`, `src[1]`
will correspond to `response[1]`, and so forth.