import GameObject from '../game-object';
import manager from '../gamemanager';
import Physics from '../physics';
import { getRandomDir, getRandomInt } from './math';
import { Vector3 } from 'three';

class ObjectSelector extends GameObject {
  constructor(objectNumber = 0) {
    // Object selector
    switch (objectNumber) {
      case 0:
        super(manager.modelList.asteroid0, new Physics());
        this.scaleAmount = 20.0;
        this.shouldRotate = true;
        this.shouldMove = true;
        this.velScalar = 20;
        break;
      case 1:
        super(manager.modelList.asteroid1, new Physics());
        this.scaleAmount = 0.5;
        this.shouldRotate = true;
        this.shouldMove = true;
        this.velScalar = 20;
        break;
      // case 2:
      // Add a power up object that increases speed?
      default:
        console.error('Object number passed into the ObjectSelector is invalid.');
        break;
    }

    // Member variables
    this.initWithRandom(true);
    this.ufoDia = manager.ufo.initalDia;
  }

  update(deltaTime) {
    // check here for out of bounds, update position
    if (manager.ufo.position.z < this.position.z - this.ufoDia) {
      this.initWithRandom(false);
    }

    // you want to call this btw
    super.update(deltaTime);
  }
  initWithRandom(flag) {
    let x = getRandomInt(manager.box.xMin, manager.box.xMax);
    let y = getRandomInt(manager.box.yMin, manager.box.yMax);
    let z;
    if (flag) z = getRandomInt(manager.ufo.position.z + manager.box.zMin, manager.ufo.position.z + manager.box.zMax);
    else z = getRandomInt(manager.ufo.position.z + manager.box.zMin - 1000, manager.ufo.position.z + manager.box.zMax);

    this.position = new Vector3(x, y, z);

    let vel;
    if (this.shouldMove) {
      vel = new Vector3(getRandomDir() * this.velScalar, getRandomDir() * this.velScalar, getRandomDir() * this.velScalar);
    } else {
      vel = new Vector3(0, 0, 0);
    }
    this.physics.velocity = vel;

    if (this.shouldRotate) {
      const rot = new Vector3(getRandomDir(), getRandomDir(), getRandomDir());
      rot.multiplyScalar(Math.random() * 80);
      this.physics.angularVelocity = rot;
    }

    this.scale = (Math.random() + 0.5) * this.scaleAmount;
  }
}

export default ObjectSelector;
