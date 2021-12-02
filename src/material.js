import { m4 } from 'twgl.js';
import { Vector3 } from 'three';
import { deg2rad } from './utils/math';

class Material {
  /**
   * @param {Vector3} materialColor
   * @param {Number} diffuse
   */
  constructor(materialColor, diffuse) {
    this.materialColor = materialColor;
    this.diffuse = diffuse;
  }

  getUniforms() {
    return {
      materialColor: this.materialColor,
      diffuse: this.diffuse
    };
  }
}

export default Material;
