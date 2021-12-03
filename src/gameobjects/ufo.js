import GameObject from '../game-object';
import manager from '../gamemanager';
import Physics from '../physics';
import Input from '../input';
import { Vector3 } from 'three';
import Asteroid from './asteroid';
import ShieldProjectile from './shield-projectile';
import gameEventEmitter from '../utils/game-event-emitter';
import { GameEvents } from '../constants';

class UFO extends GameObject {
  constructor() {
    super(manager.modelList.ufo, new Physics());
    this.startSpeed = -300;
    this.startRot = -300;
    this.physics = new Physics(new Vector3(0, 0, this.startSpeed), new Vector3(0, this.startRot, 0), 0);
    this.scale = 0.5;
    this.extents = manager.modelList.ufo.extents;

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
    // Key mapping:

    // Right movement
    if (Input.keysDown.ArrowRight || Input.keysDown.d || Input.keysDown.D || Input.keysDown.e) {
      this.position.add(new Vector3(this.strafeSpeedX, 0, 0));
    }

    // Left movement
    if (Input.keysDown.ArrowLeft || Input.keysDown.a || Input.keysDown.q) {
      this.position.add(new Vector3(-this.strafeSpeedX, 0, 0));
    }

    // Up movement
    if (Input.keysDown.ArrowUp || Input.keysDown.w || Input.keysDown.e || Input.keysDown.q) {
      this.position.add(new Vector3(0, this.strafeSpeedY, 0));
    }

    // Down movement
    if (Input.keysDown.ArrowDown || Input.keysDown.s) {
      this.position.add(new Vector3(0, -this.strafeSpeedY, 0));
    }

    // Added o, p and r for debugging purposes, not needed for actual gameplay
    // Speed up the ship and it's rotation
    if (Input.keysDown.o) {
      this.physics.velocity.add(new Vector3(0, 0, -10));
      this.physics.angularVelocity.add(new Vector3(0, -10, 0));
    }

    // Slow down the ship and it's rotation
    if (Input.keysDown.p) {
      this.physics.velocity.add(new Vector3(0, 0, 10));
      this.physics.angularVelocity.add(new Vector3(0, 10, 0));
    }

    // Reset the ship to it's starting speed
    if (Input.keysDown.r) {
      this.physics.velocity = new Vector3(0, 0, this.startSpeed);
      this.physics.angularVelocity = new Vector3(0, this.startRot, 0);
    }

    if (manager.time % 1000 == 0) {
      this.physics.velocity.add(new Vector3(0, 0, -this.velcIncr * manager.difficulty));
      this.physics.angularVelocity.add(new Vector3(0, -this.angularVelIncr * manager.difficulty, 0));
      this.strafeSpeedX += 0.5;
      this.strafeSpeedY += 0.25;
    }

    // Fix the camera so it's positioned behind the ship each frame
    const offset = new Vector3(0, this.extents.dia * 0.35, this.extents.dia * 0.9);
    manager.camera.setPosition(this.position.clone().add(offset));
    manager.camera.lookAt(this.position);

    super.update(deltaTime);
  }

  onCollisionEnter(gameobject) {
    if (gameobject instanceof Asteroid) this.takeDamage();
  }

  takeDamage() {
    if (!this.alive) {
      return;
    }

    this.currLives--;
    console.log('UFO took damage! Now has ' + this.currLives + ' lives');

    if (this.currLives <= 0) {
      this.alive = false;

      // Broadcast a global death event
      gameEventEmitter.emit(GameEvents.DEATH);
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
