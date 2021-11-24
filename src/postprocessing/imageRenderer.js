import * as twgl from 'twgl.js';
import { gl } from '../constants';
import FrameBuffer from '../utils/framebuffer';

class ImageRenderer {
  /**
   * @param {Number} width - width of the fbo to create. if a value is not present, an fbo will not be created
   * @param {Number} height - height of the fbo to create.
   */
  constructor(width, height) {
    if (width) {
      this.fbo = new FrameBuffer(width, height, {
        noDepth: true,
        targets: [true]
      });
    }
  }

  /**
   * renders the given quad with the given shader, with a possible fbo
   * @param {twgl.BufferInfo} quad - an xy quad that covers the whole screen
   * @param {twgl.ProgramInfo} program - the shader to render the quad with
   */
  render(quad, program) {
    // if fbo exists, bind
    this.fbo?.bind();
    // disable depth test if it is enabled
    const depth = gl.isEnabled(gl.DEPTH_TEST);
    if (depth) gl.disable(gl.DEPTH_TEST);
    // render
    twgl.setBuffersAndAttributes(gl, program, quad);
    twgl.drawBufferInfo(gl, quad);
    // re enable depth test if it is enabled
    if (depth) gl.enable(gl.DEPTH_TEST);
    // if fbo exists, undbind
    this.fbo?.unbind();
  }

  /**
   * @returns the 0th color attachment of the fbo for this object if it exists, otherwise a falsy value
   */
  getOutputTexture() {
    return this.fbo?.colorAttachments[0];
  }
}

export default ImageRenderer;
