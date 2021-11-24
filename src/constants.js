const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2', {
  antialias: false
});

// the number of samples for a multisample frame buffer
const multiSampleSamples = 4;

export { gl, multiSampleSamples };
