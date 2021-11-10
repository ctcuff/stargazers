import './style/index.css';
import * as twgl from 'twgl.js';
import vs from './shaders/shader.vert';
import fs from './shaders/shader.frag';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');
const programInfo = twgl.createProgramInfo(gl, [vs, fs], error =>
  console.log(error)
);

// object containing what keys are down for a animation frame
const keyDown = {};

document.querySelector('body').addEventListener('keydown', e => {
  keyDown[e.code] = true;
});

document.querySelector('body').addEventListener('keyup', e => {
  keyDown[e.code] = false;
});

// init gl stuff here, like back face culling and the depth test
gl.enable(gl.DEPTH_TEST);
gl.clearColor(0.5, 0.2, 0.7, 1.0);

// start the render loop by requesting an animation frame for the frame function
let rafHandle = requestAnimationFrame(frame);

// track when the last frame rendered
let lastFrameMilis = 0;

// create looper function
function frame(curentMilis) {
  // calculate the change in time in seconds since the last frame
  let deltaTime = (curentMilis - lastFrameMilis) / 1000;

  // update things here
  update(deltaTime);

  // clear the previous frame
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // do the render
  render(deltaTime);

  // request the next frame
  rafHandle = requestAnimationFrame(frame);

  // update the last frame milis
  lastFrameMilis = curentMilis;
}

function update(deltaTime) {
  console.log(keyDown);
}

function render(deltaTime) {
  gl.useProgram(programInfo.program);
  // twgl.drawBufferInfo or what ever the call is i dont remember
}
