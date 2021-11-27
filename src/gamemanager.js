import Model from './model';
import GameBox from './utils/game-box';

class GameManager {
  constructor() {
    /**
     * @type {{ [key: string]: Model }}
     */
    this.modelList = {};
    this.sceneObjects = [];
    this.box = new GameBox();
    this.time = 0;
    this.difficulty = 1; // Set difficulty range [1, 10]
  }

  async addModels(models) {
    for (const model of models) {
      const url = model.model;
      const m = new Model();
      await m.load(url);
      this.modelList[model.name] = m;
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

const manager = new GameManager();

export { manager as default, GameManager };
