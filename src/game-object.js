import { m4 } from 'twgl.js';
import { Vector3 } from 'three';
import { deg2rad } from './utils/math';

/**
 * Base for all object
 */
class GameObject {
  /**
   * @typedef {import('./model').default} Model
   * @param {Model} model
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
  }

  update(deltaTime) {
    // Physics update
    this.position.add(this.physics.velocity.clone().multiplyScalar(deltaTime));
    this.rotation.add(this.physics.angularVelocity.clone().multiplyScalar(deltaTime));
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
   * Add a already created gameobject to the manager
   */
  doesCollide(gameobject) {
    return this.position.distanceTo(gameobject.position) <= this.physics.colliderRadius + gameobject.colliderRadius;
  }
}

export default GameObject;
