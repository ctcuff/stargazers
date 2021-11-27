import GameObject from '../game-object';
import manager from '../gamemanager';
import Physics from '../physics';
import { Vector3 } from 'three';

class Projectile extends GameObject {
  /**
   * @param {Vector3} position
   */
  constructor(position) {
    super(manager.modelList.cow, new Physics());
    this.speed = -1000;
    this.scale = 5;
    this.physics = new Physics(new Vector3(0, 0, this.speed));
    this.position = position.clone().setZ(position.z - 40);
    this.physics.angularVelocity.add(new Vector3(-200, -0, 0));
    this.rotation.y = 90;
  }

  update(deltaTime) {
    super.update(deltaTime);
  }
}

export default Projectile;
