import GameObject from "../game-object";
import manager from "../gamemanager";
import Physics from "../physics";
import { getRandomDir, getRandomInt } from './math';
import { Vector3 } from "three";

class Ast1 extends GameObject {
  constructor() {
    super(manager.modelList.asteroid1, new Physics());
    this.initWithRandom(false);
    this.ufoDia = 99.7135610685365;
  }

  update(deltaTime) {
    // check here for out of bounds, update position
    if (manager.ufo.position.z < this.position.z - this.ufoDia) {
      this.initWithRandom(true);
    }

    // you want to call this btw
    super.update(deltaTime);
  }

  initWithRandom(updateFlag) {
    // pick a random x y z inside (-200, -200, 0) to (200, 200, -800)
    let x = getRandomInt(-400, 400);
    let y = getRandomInt(-400, 400);
    let z = getRandomInt(-100, -2000);

    if (updateFlag) {
      z = getRandomInt(manager.ufo.position.z - 1000, manager.ufo.position.z - 2000);
    }
    this.position = new Vector3(x, y, z);

    // normalize a random vel vector
    const vel = new Vector3(getRandomDir(), getRandomDir(), getRandomDir());
    vel.normalize();

    this.physics.velocity = vel;

    // 1/4 of the time, add a random rotation
    const rot = new Vector3(getRandomDir(), getRandomDir(), getRandomDir());
    rot.multiplyScalar(Math.random() * 80);
    this.physics.angularVelocity = rot;

    this.scale = Math.random() * 0.5;
  }
}

export default Ast1;