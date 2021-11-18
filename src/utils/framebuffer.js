import * as twgl from 'twgl.js';
import { gl } from '../constants';

/**
 * A class representing a webgl frame buffer
 * For now, this is only able to be used for shadows, as it only contains a depth texture
 * @author TheIceCreamBear - Joseph T
 */
class FrameBuffer {
  /**
   * Constructs a new Framebuffer with the given width and height
   * @param {Number} width width of the frame buffer
   * @param {Number} height height of the frame buffer
   * @param {Object} opts options for this frame buffer TODO
   */
  constructor(width, height, opts) {
    this.width = width;
    this.height = height;

    // create webgl framebuffer the manual way because twgl doesnt have what i need
    const frameBuf = gl.createFramebuffer();
    this.frameBuf = frameBuf;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuf);

    // create depth buffer attachment
    const depthTex = gl.createTexture();
    this.depthTex = depthTex;
    gl.bindTexture(gl.TEXTURE_2D, depthTex);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT32F, width, height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, depthTex, 0);

    // unbind the buffer and texture
    gl.bindTexture(gl.TEXTURE_2D, 0);
    gl.bindFramebuffer(gl.FRAMEBUFFER, 0);
  }

  /**
   * Binds the frame buffer represented by this object
   */
  bind() {
    // not sure why this line is here, ignore it for now
    gl.bindTexture(gl.TEXTURE_2D, 0);

    // bind this frame buffer and set the view port
    gl.bindFramebuffer(gl.FRAMEBUFFER, this.frameBuf);
    gl.viewport(0, 0, this.width, this.height);
  }

  /**
   * Unbinds the frame buffer represented by this object
   */
  unbind() {
    // unbind this frame buffer and reset the view port to the canvas size
    gl.bindFramebuffer(gl.FRAMEBUFFER, 0);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }
}

export default FrameBuffer;
