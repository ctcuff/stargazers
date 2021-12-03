class Material {
  /**
   * @param {WebGLTexture} texture
   * @param {Number} specularity
   * @param {Number} ambience
   * @param {Number} diffuse
   */
  constructor(texture, specularity = 0.5, ambience = 0.1, diffuse = 0.5) {
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
