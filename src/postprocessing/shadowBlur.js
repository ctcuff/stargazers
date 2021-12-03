import * as twgl from 'twgl.js';
import { gl } from '../constants';
import HorizontalBlur from './horizontalBlur';
import VerticalBlur from './verticalBlur';

class ShadowBlurPostProcess {
  constructor(width, height) {
    this.width = width;
    this.height = height;

    // create quad from -1 to 1 on the xy plane
    this.quad = twgl.primitives.createXYQuadBufferInfo(gl);

    // represents how much to down sample the output by, makes it more blury but will introduce flikering
    // solution to flickering would be to down sample by less and have more blur passes
    let downSample = 5;

    this.hblur = new HorizontalBlur(width / downSample, height / downSample);
    this.vblur = new VerticalBlur(width / downSample, height / downSample);
  }

  /**
   * Runs post processing on the given texture
   * @param {WebGLTexture} colorTex - the texture that represnets the shadow map
   */
  run(colorTex) {
    this.hblur.render(this.quad, colorTex);
    this.vblur.render(this.quad, this.hblur.getOutputTexture());
  }

  /**
   * 
   * @returns {WebGLTexture} gets the texture this process generates
   */
  getOutputTexture() {
    return this.vblur.getOutputTexture();
  }
}

export default ShadowBlurPostProcess;
