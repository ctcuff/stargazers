import * as twgl from 'twgl.js';
import { gl } from '../constants';
import ImageRenderer from './imageRenderer';
import vs from '../shaders/postprocessing/gaussianblur/vblur.vert';
import fs from '../shaders/postprocessing/gaussianblur/blur.frag';

class VerticalBlur {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.renderer = new ImageRenderer(width, height);
    this.shader = twgl.createProgramInfo(gl, [vs, fs], error => console.log(error));
  }

  /**
   * render this post processing step
   * @param {twgl.BufferInfo} quad - an xy quad that covers the whole screen
   * @param {WebGLTexture} texture - the texture to to read from
   */
  render(quad, texture) {
    gl.useProgram(this.shader.program);

    twgl.setUniforms(this.shader, {
      height: this.height,
      tex: texture
    });

    this.renderer.render(quad, this.shader);
  }

  /**
   * @returns {WebGLTexture} a webgl texture containing the output of this rendering step
   */
  getOutputTexture() {
    return this.renderer.getOutputTexture();
  }
}

export default VerticalBlur;
