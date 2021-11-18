import Model from './model';


class GameManager {
  constructor() {
    this.modelList = [];
    this.sceneObjects = [];
  }

  /**
   * @param {string[]} modelURLs
   */
  async addModels(modelURLs) {
    // Load all models at once and resolve after they've all finished loading
    const promises = modelURLs.map(url => {
      const model = new Model();
      return model.load(url).then(() => this.modelList.push(model));
    });

    await Promise.all(promises);
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

const manager = new GameManager();

export {manager as default, GameManager};
