import GameObject from "../game-object";
import manager from "../gamemanager";
import Physics from "../physics";
import { getRandomDir, getRandomInt } from './math';
import { Vector3 } from "three";
import { UFO_DIA, X_LOW, X_HIGH, Y_LOW, Y_HIGH, Z_LOW, Z_HIGH } from './constants';


class Ast0 extends GameObject {
  constructor() {
    super(manager.modelList.asteroid0, new Physics());
    this.initWithRandom();
    this.ufoDia = UFO_DIA;
  }

  update(deltaTime) {
    // check here for out of bounds, update position
    if (manager.ufo.position.z < this.position.z - this.ufoDia) {
      this.initWithRandom();
    }

    // you want to call this btw
    super.update(deltaTime);
  }

  initWithRandom() {
    let x = getRandomInt(X_LOW, X_HIGH);
    let y = getRandomInt(Y_LOW, Y_HIGH);
    let z = getRandomInt(manager.ufo.position.z + Z_LOW, manager.ufo.position.z + Z_HIGH);

    this.position = new Vector3(x, y, z);

    // normalize a random vel vector
    const vel = new Vector3(getRandomDir(), getRandomDir(), getRandomDir());
    vel.normalize();

    this.physics.velocity = vel;

    const rot = new Vector3(getRandomDir(), getRandomDir(), getRandomDir());
    rot.multiplyScalar(Math.random() * 80);
    this.physics.angularVelocity = rot;

    this.scale = Math.random() * 20;
  }
}

export default Ast0;