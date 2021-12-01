import { m4 } from 'twgl.js';
import { Vector3 } from 'three';
import { deg2rad } from './utils/math';

class Lighting {
  /**
   * @param {Vector3} lightDirection
   * @param {number} ambient;
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