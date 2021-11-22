import { m4 } from 'twgl.js';
import { deg2rad } from './utils/math';

class Camera {
  /**
   * @param {number} fov
   * @param {number} aspect
   * @param {number} near
   * @param {number} far
   */
  constructor(fov, aspect, near, far) {
    this.fov = fov;
    this.aspect = aspect;
    this.near = near;
    this.far = far;
    this.position = [0, 0, 0];
    this.lookAtTarget = [0, 0, 0];

    this.cameraMatrix = m4.lookAt(this.position, this.lookAtTarget, [0, 1, 0]);
    this.viewMatrix = m4.inverse(this.cameraMatrix);
    this.projectionMatrix = m4.perspective(deg2rad(fov), aspect, near, far);

    window.addEventListener('resize', () => {
      this.setAspect(window.innerWidth / window.innerHeight);
    });
  }

  /**
   * @param {{ x: number, y: number, z: number }} target
   */
  lookAt({ x, y, z }) {
    this.lookAtTarget = [
      x ?? this.lookAtTarget[0], 
      y ?? this.lookAtTarget[1], 
      z ?? this.lookAtTarget[2]
    ];
    this.updateViewMatrix();
  }

  /**
   * @param {number} aspect
   */
  setAspect(aspect) {
    this.aspect = aspect;
    this.updateProjectionMatrix();
  }

  /**
   * @param {{ x: number, y: number, z: number }} position
   */
  setPosition({ x, y, z }) {
    this.position = [
      x ?? this.position[0], 
      y ?? this.position[1],
      z ?? this.position[2]
    ];

    this.updateViewMatrix();
  }

  updateViewMatrix() {
    this.cameraMatrix = m4.lookAt(this.position, this.lookAtTarget, [0, 1, 0]);
    this.viewMatrix = m4.inverse(this.cameraMatrix);
  }

  updateProjectionMatrix() {
    this.projectionMatrix = m4.perspective(deg2rad(this.fov), this.aspect, this.near, this.far);
  }

  getUniforms() {
    return {
      viewMatrix: this.viewMatrix,
      projectionMatrix: this.projectionMatrix
    };
  }
}

export default Camera;
