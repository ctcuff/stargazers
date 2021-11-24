import * as twgl from 'twgl.js';
import { gl } from '../constants';
import ImageRenderer from "./imageRenderer";
import vs from '../shaders/postprocessing/simple.vert';
import fs from '../shaders/postprocessing/combine.frag';

class CombineTwo {
  constructor() {
    this.renderer = new ImageRenderer();
    this.shader = twgl.createProgramInfo(gl, [vs, fs], error => console.log(error));
  }

  /**
   * render this post processing step
   * @param {twgl.BufferInfo} quad - an xy quad that covers the whole screen
   * @param {WebGLTexture} texture1 - the first texture to to read from
   * @param {WebGLTexture} texture2 - the second texture to to read from
   */
  render(quad, texture1, texture2) {
    gl.useProgram(this.shader.program);

    twgl.setUniforms(this.shader, {
      colorTex: texture1,
      highlightTex: texture2
    });

    this.renderer.render(quad, this.shader);
  }
}

export default CombineTwo;
