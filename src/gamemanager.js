import Camera from './camera';
import Model from './model';
import Lighting from './lighting';
import GameBox from './utils/game-box';
import { Vector3 } from 'three';

class GameManager {
  constructor() {
    /**
     * @type {{ [key: string]: Model }}
     */
    this.modelList = {};
    /**
     * @type {GameObject[]}
     */
    this.sceneObjects = [];
    this.box = new GameBox();
    this.time = 0;
    /**
     * Set difficulty range [1, 10]
     */
    this.difficulty = 1;
    this.camera = new Camera(75, window.innerWidth / window.innerHeight, 1, 3000);
    this.lighting = new Lighting(new Vector3(-1, 1, 0), 0.1);
  }

  async addModels(models) {
    for (const model of models) {
      const url = model.model;
      const m = new Model(model.material);
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
