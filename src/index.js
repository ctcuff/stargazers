import * as twgl from 'twgl.js';
import vs from './shaders/shader.vert';
import fs from './shaders/shader.frag';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');
const programInfo = twgl.createProgramInfo(gl, [vs, fs], error =>
  console.log(error)
);

gl.clearColor(0.5, 0.2, 0.7, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);
gl.useProgram(programInfo.program);
