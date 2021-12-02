import { m4 } from 'twgl.js';
import { Vector3 } from 'three';
import { deg2rad } from './utils/math';

class Material {
  /**
   * @param {WebGLTexture} texture
   * @param {Number} specularity
   * @param {Number} ambience
   * @param {Number} diffuse
   */
  constructor(texture, specularity, ambience, diffuse) {
    this.texture = texture;
    this.specularity = specularity;
    this.ambience = ambience;
    this.diffuse = diffuse;
  }

  getUniforms() {
    // Is named tex as texture is a keyword
    return {
      tex: this.texture,
      specularity: this.specularity,
      ambience: this.ambience,
      diffuse: this.diffuse
    };
  }
}

export default Material;
