import * as twgl from 'twgl.js';
import { gl, multiSampleSamples as samples } from '../constants';

/**
 * @typedef {Object} FrameBufferOpts
 * @property {boolean} multiSample - defines if this framebuffer should be a multi sample frame buffer. Cant be true if depthAsTex is true
 * @property {boolean[]} targets - defines the color output targets this should frame buffer should have. Ignored if multiSample is false
 * @property {boolean} depthAsTex - defines if the depth buffer should be a texture or a buffer. Cant be true if multiSample is true
 * @property {boolean} noColor - prevents color buffers from being creatied. Overwrites multiSample and targets
 */

/**
 * Creates a new color texture for a frame buffer
 * @param {Number} width - the width of the frame buffer
 * @param {Number} height - the height of the frame buffer
 * @returns the WebGL texture id of the color texture
 */
function createColorTexture(width, height) {
  const tex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, tex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA8UI, width, height, 0, gl.RGBA_INTEGER, gl.UNSIGNED_BYTE, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  return tex;
}

/**
 * Creates a new multisample color buffer for a frame buffer
 * @param {Number} width - the width of the frame buffer
 * @param {Number} height - the height of the frame buffer
 * @returns the WebGL buffer id of the color buffer
 */
function createMultiSampleColorBuffer(width, height) {
  const buf = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, buf);
  gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, gl.RGBA8, width, height);
  return buf;
}

/**
 * Creates a new depth texture for a frame buffer
 * @param {Number} width - the width of the frame buffer
 * @param {Number} height - the height of the frame buffer
 * @returns the WebGL texture id of the depth texture
 */
function createDepthTexture(width, height) {
  const depthTex = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, depthTex);
  gl.texImage2D(gl.TEXTURE_2D, 0, gl.DEPTH_COMPONENT24, width, height, 0, gl.DEPTH_COMPONENT, gl.FLOAT, null);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
  return depthTex;
}

/**
 * Creates a new depth buffer for a frame buffer
 * @param {Number} width - the width of the frame buffer
 * @param {Number} height - the height of the frame buffer
 * @param {boolean} multiSample - a flag representing if the frame buffer is multisample
 * @returns a WebGL buffer id of the depth buffer
 */
function createDepthBuffer(width, height, multiSample) {
  const depthBuf = gl.createRenderbuffer();
  gl.bindRenderbuffer(gl.RENDERBUFFER, depthBuf);
  if (multiSample) {
    gl.renderbufferStorageMultisample(gl.RENDERBUFFER, samples, gl.DEPTH_COMPONENT24, width, height);
  } else {
    gl.renderbufferStorage(gl.RENDERBUFFER, gl.DEPTH_COMPONENT24, width, height);
  }
  return depthBuf;
}

/**
 * A class representing a WebGL frame buffer. Configureable to have multi samples, multi targets, and depth as tex.
 * @author TheIceCreamBear - Joseph T
 */
class FrameBuffer {
  /**
   * Constructs a new Framebuffer with the given width and height
   * @param {Number} width width of the frame buffer
   * @param {Number} height height of the frame buffer
   * @param {FrameBufferOpts} opts options for this frame buffer, required
   */
  constructor(width, height, opts) {
    // enforce the requirement that opts.multiSample and opts.depthAsTex cannot both be true
    if (opts.multiSample && opts.depthAsTex) {
      throw new Error(`Frame buffer with w=${width}, h=${height}, & o=${JSON.stringify(opts)} has an invalid configuration.`);
    }

    this.width = width;
    this.height = height;

    // create webgl framebuffer the manual way because twgl doesnt have what is needed
    const frameBuf = gl.createFramebuffer();
    this.frameBuf = frameBuf;
    gl.bindFramebuffer(gl.FRAMEBUFFER, frameBuf);

    // create color attachments
    if (!opts.noColor) {
      this.colorAttachments = [];
      if (opts.multiSample) {
        // enforce at least the first color buffer to be specified
        if (opts.targets?.length == 0) {
          opts.targets = [true];
        }

        // loop over specified targets
        for (let i = 0; i < opts.targets.length; i++) {
          let buf = createMultiSampleColorBuffer(width, height);
          // attach result to frame buffer
          gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0 + i, gl.RENDERBUFFER, buf);

          // save it
          this.colorAttachments.push(buf);
        }
      } else {
        let color = createColorTexture(width, height);
        // attach result to frame buffer
        gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, color, 0);
        // save color
        this.colorAttachments.push(color);
        this.primaryColor = color;
      }

      // specify which buffers get drawn to when we draw
      let attachments = [];
      for (let i = 0; i < this.colorAttachments.length; i++) {
        attachments.push(gl.COLOR_ATTACHMENT0 + i);
      }
      gl.drawBuffers(attachments);
    } else {
      // specify that we arent drwaing to any of the buffers
      gl.drawBuffers([gl.NONE]);
    }

    // create depth attachment based on params
    if (opts.depthAsTex) {
      this.depthTex = createDepthTexture(width, height);
      // attach result to frame buffer
      gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.TEXTURE_2D, this.depthTex, 0);
    } else {
      this.depthBuf = createDepthBuffer(width, height, opts.multiSample);
      // attach result to frame buffer
      gl.framebufferRenderbuffer(gl.FRAMEBUFFER, gl.DEPTH_ATTACHMENT, gl.RENDERBUFFER, this.depthBuf);
    }

    // do a quick error check
    if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
      console.error(`Incomplete frame buffer w=${width}, h=${height}, & o=${JSON.stringify(opts)}`);
    }

    // unbind anything that may have been bound during the process of creating the frame buffer
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.bindRenderbuffer(gl.RENDERBUFFER, null);
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
  }

  /**
   * Binds the frame buffer represented by this object
   * @param {boolean} asRead - set to true if this buffer should be bound as the read buffer
   */
  bind(asRead) {
    if (asRead) {
      gl.bindFramebuffer(gl.READ_FRAMEBUFFER, this.frameBuf);
      gl.readBuffer(gl.COLOR_ATTACHMENT0);
      return;
    }
    // bind this frame buffer and set the view port
    gl.bindFramebuffer(gl.DRAW_FRAMEBUFFER, this.frameBuf);
    gl.viewport(0, 0, this.width, this.height);
  }

  /**
   * Unbinds the frame buffer represented by this object
   */
  unbind() {
    // unbind this frame buffer and reset the view port to the canvas size
    gl.bindFramebuffer(gl.FRAMEBUFFER, null);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  }
}

export default FrameBuffer;
