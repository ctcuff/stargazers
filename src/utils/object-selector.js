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
        console.error("Object number passed into the ObjectSelector is invalid.")
        break;
    }

    // Member variables
    this.initWithRandom();
    this.ufoDia = manager.ufo.initalDia;
  }

  update(deltaTime) {
    // check here for out of bounds, update position
    if (manager.ufo.position.z < this.position.z - this.ufoDia
      || manager.ufo.position.x > this.position.x + manager.box.xMax
      || manager.ufo.position.x < this.position.x - manager.box.xMax
      || manager.ufo.position.y > this.position.y + manager.box.yMax
      || manager.ufo.position.y < this.position.y - manager.box.yMax) {
      this.initWithRandom();
    }
    
    // you want to call this btw
    super.update(deltaTime);
  }
  initWithRandom() { 
      let x = getRandomInt(manager.ufo.position.x + manager.box.xMin, manager.ufo.position.x + manager.box.xMax);
      let y = getRandomInt(manager.ufo.position.y + manager.box.yMin, manager.ufo.position.y + manager.box.yMax);
      let z = getRandomInt(manager.ufo.position.z + manager.box.zMin - 200, manager.ufo.position.z + manager.box.zMax);

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

      this.scale = (Math.random() + 1) * this.scaleAmount;
    }
}

export default ObjectSelector;
