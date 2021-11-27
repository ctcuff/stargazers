import GameObject from '../game-object';
import manager from '../gamemanager';
import Physics from '../physics';
import { getRandomDir, getRandomInt } from '../utils/math';
import { Vector3 } from 'three';

class Asteroid extends GameObject {
  // types of asteroids
  static ROD = 0;
  static CHUNKY = 1;

  constructor(variant = Asteroid.ROD) {
    switch (variant) {
      case Asteroid.ROD:
        super(manager.modelList.asteroid0, new Physics());
        this.scaleAmount = 20.0;
        break;
      case Asteroid.CHUNKY:
        super(manager.modelList.asteroid1, new Physics());
        this.scaleAmount = 0.5;
        break;
      default:
        console.error('Invalid variant selected');
        break;
    }

    this.shouldRotate = true;
    this.shouldMove = true;
    this.velocityScalar = 20;

    this.initWithRandom();
  }

  update(deltaTime) {
    // check here for out of bounds, update position
    if (
      manager.ufo.position.z < this.position.z - manager.ufo.initalDia ||
      manager.ufo.position.x > this.position.x + manager.box.xMax ||
      manager.ufo.position.x < this.position.x - manager.box.xMax ||
      manager.ufo.position.y > this.position.y + manager.box.yMax ||
      manager.ufo.position.y < this.position.y - manager.box.yMax
    ) {
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

    let randVelocity;
    if (this.shouldMove) {
      randVelocity = new Vector3(getRandomDir() * this.velocityScalar, getRandomDir() * this.velocityScalar, getRandomDir() * this.velocityScalar);
    } else {
      randVelocity = new Vector3(0, 0, 0);
    }
    this.physics.velocity = randVelocity;

    if (this.shouldRotate) {
      const rot = new Vector3(getRandomDir(), getRandomDir(), getRandomDir());
      rot.multiplyScalar(Math.random() * 80);
      this.physics.angularVelocity = rot;
    }

    this.scale = (Math.random() + 1) * this.scaleAmount;
  }

  onCollisionEnter(gameobject) {
    // let asteroids pass through eachother
    if (!(gameobject instanceof Asteroid)) this.alive = false;
  }

  static spawnAsteroids = (asteroidCount = 100) => {
    let asteroids = [];
    for (let i = 0; i < asteroidCount; i++) {
      asteroids.push(new Asteroid(getRandomInt(0, 2)));
    }
    return asteroids;
  };
}

export default Asteroid;
