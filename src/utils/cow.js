import GameObject from "../game-object";
import manager from "../gamemanager";
import Physics from "../physics";
import { getRandomDir, getRandomInt } from './math'

class Cow extends GameObject {
  constructor() {
    super(manager.modelList.cow, new Physics());
    // pick a random x y z inside (-200, -200, 0) to (200, 200, -800)
    let x = getRandomInt(-200, 200);
    let y = getRandomInt(-200, 200);
    let z = getRandomInt(0, -800);

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

  update(deltaTime) {
    // check here for out of bounds, update position

    // you want to call this btw
    super.update(deltaTime);
  }
}

export default Cow;