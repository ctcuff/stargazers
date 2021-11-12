import Model from './model';

class GameManager {
  constructor() {
    this.modelList = [];
    this.sceneObjects = [];
  }

  async addModels(models) {
    for (const url of models) {
      const m = new Model();
      await m.load(url);
      this.modelList.push(m);
    }
  }

  /**
   * @typedef {import('./game-object').default} GameObject
   * @param {GameObject} gameobject
   * Add a already created gameobject to the manager
   */
  addObject(gameobject) {
    this.sceneObjects.push(gameobject);
  }

  /**
   * @typedef {import('./game-object').default} GameObject
   * @param {GameObject[]} gameobjects
   * Add a list of already created gameobjects to the manager
   */
  addObjects(gameobjects) {
    gameobjects.forEach(gameobject => this.addObject(gameobject));
  }
}

export default GameManager;
