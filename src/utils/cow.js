import GameObject from "../game-object";
import manager from "../gamemanager";
import Physics from "../physics";
import { getRandomDir, getRandomInt } from './math';
import { Vector3 } from "three";

class Cow extends GameObject {
  constructor() {
    super(manager.modelList.cow, new Physics());
    this.initWithRandom(true);
  }

  update(deltaTime) {
    // check here for out of bounds, update position
    if (manager.ufo.position.z < this.position.z - 99.7135610685365) {
      this.initWithRandom(false);
    }

    // you want to call this btw
    super.update(deltaTime);
  }

  initWithRandom(updateFlag) {
    // pick a random x y z inside (-200, -200, 0) to (200, 200, -800)
    let x = getRandomInt(-200, 200);
    let y = getRandomInt(-200, 200);
    let z = getRandomInt(0, -1000);

    if (!updateFlag) {
      z = -getRandomInt(manager.ufo.position.z + 1000, manager.ufo.position.z + 1200);
    }

    this.position = new Vector3(x, y, z);

    // normalize a random vel vector
    const vel = new Vector3(getRandomDir(), getRandomDir(), getRandomDir());
    vel.normalize();

    this.physics.velocity = vel;

    // 1/4 of the time, add a random rotation
    if (Math.random() >= 0.25) {
      const rot = new Vector3(getRandomDir(), getRandomDir(), getRandomDir());
      rot.multiplyScalar(Math.random() * 8);
      this.physics.angularVelocity = rot;
    }

    this.scale = Math.random() + 0.5;
  }
}

export default Cow;