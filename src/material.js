import { m4 } from 'twgl.js';
import { Vector3 } from 'three';
import { deg2rad } from './utils/math';

class Material {
    /**
     * @param {any} materialColor
     * @param {any} diffuse
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