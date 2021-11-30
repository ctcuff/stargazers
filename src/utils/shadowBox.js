import * as twgl from 'twgl.js';
import { gl } from '../constants';
import { deg2rad } from './math';
import { Matrix4, Quaternion, Vector3 } from 'three';

// NOTE (Joseph): this only exists so that i dont have to type 75 then remember what it means
function fov() {
  return 75;
}

// TODO change the near plane to 0.1
// NOTE (Joseph): this only exists so that i dont have to type 1 then remember what it means
function nearPlane() {
  return 1;
}

function aspectRatio() {
  return gl.canvas.width / gl.canvas.height;
}

// vector representing the up direction
const UP = new Vector3(0, 1, 0);

// vector representing the forward direction
const FORWARD = new Vector3(0, 0, -1);

// value representing the maximum shadow distance
const SHADOW_DISTANCE = 100;

// helps prevent weird times where shadows dont show up properly
const OFFSET = 35;

class ShadowBox {
  /**
   * 
   * @typedef {import('../camera').default} Camera
   * @param {import('three').Matrix4} lightViewMat
   * @param {Camera} camera 
   */
  constructor(lightViewMat, camera) {
    this.lightViewMat = lightViewMat;
    this.camera = camera;
    this.calculateWidthsAndHeights();
    
    // for the purposes of types and autocomplete
    this.maxX = 0;
    this.minX = 0;
    this.maxY = 0;
    this.minY = 0;
    this.maxZ = 0;
    this.minZ = 0;
  }

  update() {
    const camRot = this.calculateCameraRotationMatrix();
    const forwardVec = FORWARD.clone().applyMatrix4(camRot);

    const toFar = forwardVec.clone().multiplyScalar(SHADOW_DISTANCE);
    const toNear = forwardVec.clone().multiplyScalar(nearPlane());
    const centerFar = toFar.add(this.camera.position);
    const centerNear = toNear.add(this.camera.position);

    let points = this.calculateFrustrumVerticies(camRot, forwardVec, centerNear, centerFar);

    let first = true;
    for (const point of points) {
      if (first) {
        this.minX = point.x;
        this.maxX = point.x;
        this.minY = point.y;
        this.maxY = point.y;
        this.minZ = point.z;
        this.maxZ = point.z;
        first = false;
        continue;
      }

      if (point.x > this.maxX) {
        this.maxX = point.x;
      }
      if (point.x < this.minX) {
        this.minX = point.x;
      }
      
      if (point.y > this.maxY) {
        this.maxY = point.y;
      }
      if (point.y < this.minY) {
        this.minY = point.y;
      }
      
      if (point.z > this.maxZ) {
        this.maxZ = point.z;
      }
      if (point.z < this.minZ) {
        this.minZ = point.z;
      }

      this.maxZ += OFFSET;
    }
  }

  /**
   * 
   * @param {Matrix4} rotation - the rotation of the camera
   * @param {Vector3} forward - the vector representing the forward direction after rotation
   * @param {Vector3} centerNear - the center point of the near plane
   * @param {Vector3} centerFar - the center point of the far plane
   * @returns {Vector3[]} the verticies that make up the shadow box view frustrum
   */
  calculateFrustrumVerticies(rotation, forward, centerNear, centerFar) {
    // up down left right but based on the current rotation
    const upVector = UP.clone().applyMatrix4(rotation);
    const rightVector = forward.cross(upVector);
    const downVector = upVector.clone().negate();
    const leftVector = rightVector.clone().negate();

    // plane top and bot
    const farTop = upVector.clone().multiplyScalar(this.farHeight).add(centerFar);
    const farBot = downVector.clone().multiplyScalar(this.farHeight).add(centerFar);
    const nearTop = upVector.clone().multiplyScalar(this.farHeight).add(centerNear);
    const nearBot = downVector.clone().multiplyScalar(this.farHeight).add(centerNear);

    // calculate the points
    const points = [];

    points.push(this.calculateLightSpaceFrustrumCorner(farTop, rightVector, this.farWidth));
    points.push(this.calculateLightSpaceFrustrumCorner(farTop, leftVector, this.farWidth));
    points.push(this.calculateLightSpaceFrustrumCorner(farBot, rightVector, this.farWidth));
    points.push(this.calculateLightSpaceFrustrumCorner(farBot, leftVector, this.farWidth));
    points.push(this.calculateLightSpaceFrustrumCorner(nearTop, rightVector, this.nearWidth));
    points.push(this.calculateLightSpaceFrustrumCorner(nearTop, leftVector, this.nearWidth));
    points.push(this.calculateLightSpaceFrustrumCorner(nearBot, rightVector, this.nearWidth));
    points.push(this.calculateLightSpaceFrustrumCorner(nearBot, leftVector, this.nearWidth));
    return points;
  }

  /**
   * 
   * @param {Vector3} startPoint - the start point of this corner
   * @param {Vector3} dir - the direction of calc the corner from
   * @param {Number} width - distance along dir to travel
   * @returns {Vector3} the point calculated
   */
  calculateLightSpaceFrustrumCorner(startPoint, dir, width) {
    let point = dir.clone().multiplyScalar(width).add(startPoint);
    point.applyMatrix4(this.lightViewMat);
    return point;
  }

  /**
   * 
   * @returns {Matrix4} a matrix representing only the rotation of the camera
   */
  calculateCameraRotationMatrix() {
    const camMat = new Matrix4().set(...this.camera.cameraMatrix);
    const camRot = new Quaternion().setFromRotationMatrix(camMat);
    return new Matrix4().makeRotationFromQuaternion(camRot);
  }

  calculateWidthsAndHeights() {
    this.farWidth = SHADOW_DISTANCE * Math.tan(deg2rad(fov()));
    this.nearWidth = nearPlane() * Math.tan(deg2rad(fov()));
    this.farHeight = this.farWidth / aspectRatio();
    this.nearHeight = this.nearWidth / aspectRatio();
  }

  /**
   * 
   * @returns {Vector3} the center of the shadow box
   */
  getCenter() {
    let x = (this.minX + this.maxX) / 2.0;
    let y = (this.minY + this.maxY) / 2.0;
    let z = (this.minZ + this.maxZ) / 2.0;

    let center = new Vector3(x, y, z);

    const invertedLight = this.lightViewMat.clone().invert();
    center.applyMatrix4(invertedLight);
    return center;
  }

  getWidth() {
    return this.maxX - this.minX;
  }

  getHeight() {
    return this.maxY - this.minY;
  }

  getLength() {
    return this.maxZ - this.minZ;
  }
}

export default ShadowBox;