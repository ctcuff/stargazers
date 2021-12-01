import { m4 } from 'twgl.js';
import { Vector3 } from 'three';
import { deg2rad } from './utils/math';

class Lighting {
  /**
   * @param {Vector3} light;
   * @param {number} ambient;
   */
  constructor(light, ambient) {
    this.light = light;
    this.ambient = ambient;
  }

  getUniforms() {
    return {
      light: this.light,
      ambient: this.ambient
    };
  }

  setDirection(x, y, z) {
    this.light = (x, y, z);
  }

  setAmbience(ambience) {
    this.ambient = ambience;
  }
}

export default Lighting;