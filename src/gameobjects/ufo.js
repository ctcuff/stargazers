import GameObject from '../game-object';
import manager from '../gamemanager';
import Physics from '../physics';
import Input from '../input';
import { Vector3 } from 'three';
import Asteroid from './asteroid';
import BasicMat from '../materials/basic-mat';
import Material from '../material';

class UFO extends GameObject {
  constructor() {
    super(manager.modelList.ufo, new Physics(), new Material(new Vector3(0, 0, 0), 1));
    this.startSpeed = -300;
    this.startRot = -300;
    this.physics = new Physics(new Vector3(0, 0, this.startSpeed), new Vector3(0, this.startRot, 0), 0);
    this.scale = 0.5;
    this.initalDia = 99.7135610685365;

    this.strafeSpeedX = 5;
    this.strafeSpeedY = 3;
    this.velcIncr = 10;
    this.angularVelIncr = 30;

    this.maxLives = 3;
    this.currLives = this.maxLives;

    /**
     * The time (in milliseconds) before the UFO can shoot another projectile
     */
    this.projectileTimeLimit = 15_000;
    this.lastProjectileTimestamp = 0;

    Input.addKeyPressListener('space', this.fireProjectile.bind(this));
    Input.addClickListener(this.fireProjectile.bind(this));
  }

  update(deltaTime) {
    super.update(deltaTime);
  }

  onCollisionEnter(gameobject) {
    if (gameobject instanceof Asteroid) this.takeDamage();
  }

  takeDamage() {
    this.currLives--;
    console.log('UFO took damage! Now has ' + this.currLives + ' lives');

    if (this.currLives <= 0) {
      this.alive = false;
    }
  }

  fireProjectile() {
    if (!this.alive) {
      return;
    }

    const now = Date.now();
    // Changing the z to make sure the projectile is always faster than the UFO when it's shot
    const projectileSpeed = this.physics.velocity.clone().setZ(this.physics.velocity.z - 500);

    if (now - this.lastProjectileTimestamp >= this.projectileTimeLimit) {
      manager.addObject(new ShieldProjectile(this.position.clone(), projectileSpeed));
      this.lastProjectileTimestamp = now;
    }
  }
}

export default UFO;
