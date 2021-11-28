import { m4 } from 'twgl.js';
import { Vector3 } from 'three';
import { deg2rad } from './utils/math';

class Lighting {
  /**
   * @param {any} lightDirection
   * @param {any} ambient;
   */
  constructor(lightDirection, ambient) {
    this.lightDirection = lightDirection;
    this.ambient = ambient;
  }

  getUniforms() {
    return {
      light: this.lightDirection,
      ambient: this.ambient
    };
  }

  setDirection(x, y, z) {
    this.lightDirection = (x, y, z);
  }

  setAmbience(ambience) {
    this.ambient = ambience;
  }
}

export default Lighting;

/*
const uniforms = {
  light,
  ambientIntensity = 1,
  shininess = 1,
  diffuse = 1
};

// create a new buffer, bind it to the buffer, and send along the array of vertex normals
const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

const vertexNormals = [];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);

const numComponents = 3;
const type = gl.FLOAT;
const norm = false;
const stride = 0;
const offset = 0;

gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
gl.vertexAttribPointer(programInfo.atttribLocations.vertexNormal, numComponents, type, stride, offset);

gl.enableVertexAttribArray(programInfo.attribLocations.vertexNormal);

const normalMatrix = mat4.create();
mat4.invert(normalMatrix, modelViewMatrix);
mat4.transpose(normalMatrix, normalMatrix);

gl.uniformMatrix(programInfo.uniformLocations.normalMatrix, false, normalMatrix);
*/
