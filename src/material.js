class Material {
  /**
   * @param {WebGLTexture} texture
   * @param {Number} specularity
   * @param {Number} ambience
   * @param {Number} diffuse
   */
  constructor(texture, specularMap = null, specularity = 0.1, ambience = 0.1, diffuse = 1.0) {
    this.texture = texture;
    this.specularity = specularity;
    this.ambience = ambience;
    this.diffuse = diffuse;
    if (specularMap != null) {
      this.specularMap = specularMap;
      this.hasSpecularMap = true;
    }
  }

  getUniforms() {
    // Is named tex as texture is a keyword
    let specularUniforms = {};

    if (this.hasSpecularMap) {
      specularUniforms = {
        specularMap: this.specularMap,
        hasSpecularMap: this.hasSpecularMap
      }
    }

    return {
      tex: this.texture,
      specularity: this.specularity,
      ambience: this.ambience,
      diffuse: this.diffuse,
      ...specularUniforms
    };
  }
}

export default Material;
