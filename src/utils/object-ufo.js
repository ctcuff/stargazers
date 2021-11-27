import GameObject from '../game-object';
import manager from '../gamemanager';
import Physics from '../physics';
import { Vector3 } from 'three';
import Input from '../input';
import Projectile from './projectile';

class UFO extends GameObject {
  constructor() {
    super(manager.modelList.ufo, new Physics());
    this.startSpeed = -300;
    this.startRot = -300;
    this.physics = new Physics(new Vector3(0, 0, this.startSpeed), new Vector3(0, this.startRot, 0), 0);
    this.scale = 0.5;
    this.initalDia = 99.7135610685365;

    this.strafeSpeedX = 5;
    this.strafeSpeedY = 3;
    this.velcIncr = 10;
    this.angularVelIncr = 30;
    this.lastProjectileTimestamp = 0;

    /**
     * The time (in milliseconds) before the UFO can shoot another projectile
     */
    this.projectileTimeLimit = 500;

    Input.addKeyPressListener('space', this.addProjectile.bind(this));
    Input.addClickListener(this.addProjectile.bind(this));
  }

  update(deltaTime) {
    super.update(deltaTime);
  }

  addProjectile() {
    const now = Date.now();

    if (now - this.lastProjectileTimestamp >= this.projectileTimeLimit) {
      manager.addObject(new Projectile(this.position));
      this.lastProjectileTimestamp = now;
    }
  }
}

export default UFO;
