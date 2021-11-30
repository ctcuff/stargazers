import { m4 } from 'twgl.js';
import { Vector3 } from 'three';
import { deg2rad } from './utils/math';
import Material from './material';

/**
 * Base for all object
 */
class GameObject {
  /**
   * @typedef {import('./model').default} Model
   * @param {Model} model
   * @param {Material} material
   * @typedef {import('./physics').default} Physics
   * @param {Physics} physics
   */
  constructor(model, physics) {
    this.model = model;
    this.physics = physics;

    this.uniforms = {
      modelMatrix: m4.identity()
    };

    // Transform properties
    this.scale = 1;
    this.rotation = new Vector3();
    this.position = new Vector3();

    // set to false when you want the object to "die", aka eventually be removed from the sceneobject list
    this.alive = true;

    this.physics.colliderRadius = (this.model.extents.dia / 2) * this.scale;
    this.collidedWithLastFrame = new Set();
  }

  update(deltaTime) {
    // Physics update
    this.position.add(this.physics.velocity.clone().multiplyScalar(deltaTime));
    this.rotation.add(this.physics.angularVelocity.clone().multiplyScalar(deltaTime));
    this.physics.colliderRadius = (this.model.extents.dia / 2) * this.scale;

    this.computeModelMatrix();
  }

  render(programInfo, uniforms) {
    this.model.render(programInfo, {
      ...uniforms,
      ...this.uniforms
    });
  }

  computeModelMatrix() {
    let modelMatrix = m4.identity();
    m4.translate(modelMatrix, this.position.toArray(), modelMatrix);
    m4.rotateX(modelMatrix, deg2rad(this.rotation.x), modelMatrix);
    m4.rotateY(modelMatrix, deg2rad(this.rotation.y), modelMatrix);
    m4.rotateZ(modelMatrix, deg2rad(this.rotation.z), modelMatrix);
    m4.scale(modelMatrix, [this.scale, this.scale, this.scale], modelMatrix);

    this.uniforms.modelMatrix = modelMatrix;
  }

  /**
   *
   * @param {{ x: number, y: number, z: number }} rotation
   */
  setRotation(rotation) {
    this.rotation = {
      ...this.rotation,
      ...rotation
    };
  }

  /**
   *
   * @param {{ x: number, y: number, z: number }} rotation
   */
  addRotation({ x, y, z }) {
    this.rotation = {
      x: this.rotation.x + (x ?? 0),
      y: this.rotation.y + (y ?? 0),
      z: this.rotation.z + (z ?? 0)
    };
  }

  /**
   * @param {{ x: number, y: number, z: number }} position
   */
  // uses rest operator to allow optional arguments
  setPosition(position) {
    this.position = {
      ...this.position,
      ...position
    };
  }

  /**
   *
   * @param {{ x: number, y: number, z: number }} position
   */
  addPosition({ x, y, z }) {
    this.position = {
      x: this.position.x + (x ?? 0),
      y: this.position.y + (y ?? 0),
      z: this.position.z + (z ?? 0)
    };
  }

  /**
   * @typedef {import('./game-object').default} GameObject
   * @param {GameObject} gameobject
   * gameobject to check collision with
   */
  doesCollide(gameobject) {
    if (!gameobject.alive) return false;
    if (!this.colliderOverlap(gameobject)) {
      this.collidedWithLastFrame.delete(gameobject);
      return false;
    }
    if (this.collidedWithLastFrame.has(gameobject)) return false;
    this.collidedWithLastFrame.add(gameobject);
    return true;
  }

  colliderOverlap(gameobject) {
    const dist = this.position.distanceTo(gameobject.position);
    const sumRadi = this.physics.colliderRadius + gameobject.physics.colliderRadius;
    return dist <= sumRadi;
  }

  // "abstract" method
  onCollisionEnter(gameobject) {}
}

export default GameObject;
