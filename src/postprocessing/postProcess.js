import * as twgl from 'twgl.js';
import { gl } from '../constants';
import CombineTwo from './combine';
import HorizontalBlur from './horizontalBlur';
import VerticalBlur from './verticalBlur';

class PostProcess {
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
    this.combine = new CombineTwo();
  }

  /**
   * Runs post processing on the given textures
   * @param {WebGLTexture} colorTex - the texture that represnets the main scene
   * @param {WebGLTexture} brightTex - the texture that represents the bright spots of the scene
   */
  run(colorTex, brightTex) {
    this.hblur.render(this.quad, brightTex);
    this.vblur.render(this.quad, this.hblur.getOutputTexture());
    this.combine.render(this.quad, colorTex, this.vblur.getOutputTexture());
  }
}

export default PostProcess;
