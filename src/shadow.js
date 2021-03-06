import * as twgl from 'twgl.js';
import { gl } from './constants';
import { rad2deg } from './utils/math';
import vs from './shaders/shadow/mapping.vert';
import fs from './shaders/shadow/mapping.frag';
import FrameBuffer from './utils/framebuffer';
import ShadowBox, { SHADOW_DISTANCE } from './utils/shadowBox';
import { Matrix4, Vector2, Vector3 } from 'three';
import manager from './gamemanager';
import DEBUGvs from './shaders/postprocessing/simple.vert';
import DEBUGfs from './shaders/postprocessing/simple.frag';
import ImageRenderer from './postprocessing/imageRenderer';
import ShadowBlurPostProcess from './postprocessing/shadowBlur';

const m4 = twgl.m4;

// use a constant but adjustable (at dev time) size for the framebuffers
const SHADOW_MAP_SIZE = 4096;

/**
 * @returns {twgl.m4} - matrix is used to convert from screen space to uv space
 */
function createOffset() {
  const mat = m4.identity();
  m4.translate(mat, [0.5, 0.5, 0.5], mat);
  m4.scale(mat, [0.5, 0.5, 0.5], mat);
  return mat;
}

// create quad from -1 to 1 on the xy plane
const screenQuad = twgl.primitives.createXYQuadBufferInfo(gl);

// create a shader to debug with
const DEBUGshader = twgl.createProgramInfo(gl, [DEBUGvs, DEBUGfs], error => console.log(error));

// an image render that will render to the screen the shadow map;
const DEBUGrenderer = new ImageRenderer();

class ShadowRenderer {
  /**
   *
   * @typedef {import('./camera').default} Camera
   * @param {Camera} camera
   */
  constructor(camera) {
    this.camera = camera;

    // create the shader program
    this.shader = twgl.createProgramInfo(gl, [vs, fs], error => {
      console.error(error);
    });

    // create the frame buffer to render to
    this.framebuf = new FrameBuffer(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE, { noColor: true, depthAsTex: true });

    // this matrix represents the conversion from world space to the shadow map texture space
    this.shadowMapSpaceMatrix = m4.identity();

    // the view matrix from the perspective of the light matrix
    this.lightViewMatrix = m4.identity();

    // the ortho projection matrix
    this.projMatrix = new Matrix4();

    // the shadow box
    this.shadowBox = new ShadowBox(this.lightViewMatrix, this.camera);

    // projection and view matricies combined
    this.pvMatrix = m4.identity();

    // offset matrix for use in the conversion process
    this.offset = createOffset();

    // creates a new post process for bluring the shadow map
    this.blurProces = new ShadowBlurPostProcess(SHADOW_MAP_SIZE, SHADOW_MAP_SIZE);
  }

  /**
   * @returns {twgl.m4} a matrix used to convert the world pos to the uv of the shadow map
   */
  getToShadowmapSpaceMatrix() {
    return m4.multiply(this.offset, this.pvMatrix);
  }

  /**
   * @returns {WebGLTexture} - the depth texture that contains the shadow information
   */
  getShadowMap() {
    return this.blurProces.getOutputTexture();
  }

  getMainPassUniforms() {
    return {
      shadowMapSpace: this.getToShadowmapSpaceMatrix(),
      shadowDistance: SHADOW_DISTANCE,
      shadowMap: this.getShadowMap(),
      shadowMapSize: SHADOW_MAP_SIZE
    };
  }

  /**
   *
   * @param {import('three').Vector3} lightDir - the direction of the light casting the shadows
   */
  renderShadowMap(lightDir) {
    // update the shadow box
    this.shadowBox.update();

    // update ortho proj mat
    this.updateOrthoProjMat(this.shadowBox.getWidth(), this.shadowBox.getHeight(), this.shadowBox.getLength());

    // update light view mat
    this.updateLightViewMatrix(lightDir, this.shadowBox.getCenter());

    // calculate the combined projection view matrix
    this.pvMatrix = m4.multiply(this.projMatrix.toArray(), this.lightViewMatrix);

    // bind the frame buffer because we are about to render to it
    this.framebuf.bind();

    // clear the frame buffer
    gl.clear(gl.DEPTH_BUFFER_BIT);

    // loop over all objects
    for (const gobj of manager.sceneObjects) {
      // pre compute the pvm matrix for the object
      const pvmMatrix = m4.multiply(this.pvMatrix, gobj.uniforms.modelMatrix);
      const uniforms = {
        pvmMatrix
      };

      // render the object's model directly
      gobj.model.render(this.shader, uniforms);
    }

    // unbind the frame buffer casue we are done rendering to it
    this.framebuf.unbind();

    // blur the shadow map
    this.blurProces.run(this.framebuf.depthTex);
  }

  /**
   *
   * @param {Vector3} direction - the direction of the light
   * @param {Vector3} center - the center of the view box in world space
   */
  updateLightViewMatrix(direction, center) {
    const dir = direction.clone().normalize();
    center.negate();

    // calc pitch and and yaw of light dir
    let pitch = Math.acos(new Vector2(dir.x, dir.z).length());
    let yaw = rad2deg(Math.atan(dir.x, dir.z));
    yaw = dir.z > 0 ? yaw - 180 : 0;

    // update the matrix
    m4.identity(this.lightViewMatrix);
    m4.rotateX(this.lightViewMatrix, pitch, this.lightViewMatrix);
    m4.rotateY(this.lightViewMatrix, rad2deg(yaw), this.lightViewMatrix);
    m4.translate(this.lightViewMatrix, [center.x, center.y, center.z], this.lightViewMatrix);
  }

  /**
   *
   * @param {Number} width - the width of the ortho box
   * @param {Number} height - the height of the ortho box
   * @param {Number} length - the length of the ortho box
   */
  updateOrthoProjMat(width, height, length) {
    this.projMatrix.identity();
    // complex method to set the diagonal of the matrix to the necessary stuff for an ortho proj mat
    this.projMatrix.set(2 / width, 0, 0, 0, 0, 2 / height, 0, 0, 0, 0, -2 / length, 0, 0, 0, 0, 1);
  }

  onWindowResize() {
    this.shadowBox = new ShadowBox(this.lightViewMatrix, this.camera);
  }

  DEBUGrenderDepthTex(x = 0, y = 0, scale = 1) {
    gl.useProgram(DEBUGshader.program);

    const transform = m4.identity();
    m4.translate(transform, [x, y, 0], transform);
    m4.scale(transform, [scale, scale, 1], transform);

    twgl.setUniforms(DEBUGshader, {
      colorTex: this.blurProces.getOutputTexture(),
      transform
    });

    DEBUGrenderer.render(screenQuad, DEBUGshader);
  }
}

export default ShadowRenderer;
