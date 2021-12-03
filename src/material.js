class Material {
  /**
   * @param {WebGLTexture} texture
   * @param {Number} specularity
   * @param {Number} ambience
   * @param {Number} diffuse
   */
  constructor(texture, specularMap = null, useSpecularMap = false, specularity = 0.1, ambience = 0.1, diffuse = 1.0) {
    this.texture = texture;
    this.specularity = specularity;
    this.ambience = ambience;
    this.diffuse = diffuse;
    this.specularMap = specularMap;
    this.useSpecularMap = useSpecularMap;
  }

  getUniforms() {
    // Is named tex as texture is a keyword
    let specularUniforms = {
      useSpecularMap: 0
    };

    if (this.useSpecularMap) {
      specularUniforms = {
        specularMap: this.specularMap,
        useSpecularMap: 1
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
