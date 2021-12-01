import GameObject from '../game-object';
import manager from '../gamemanager';
import Physics from '../physics';
import { Vector3 } from 'three';

class ShieldProjectile extends GameObject {
  /**
   * @param {Vector3} position
   * @param {Vector3} speed
   */
  constructor(position, speed) {
    super(manager.modelList.shield, new Physics(speed));
    this.scale = 1;
    this.position = position.setZ(position.z - 10);
    this.rotation.y = 180;

    setTimeout(() => {
      this.alive = false;
    }, 5000);
  }
}

export default ShieldProjectile;
