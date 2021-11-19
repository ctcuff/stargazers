import { Vector3 } from 'three';

class Physics {
  constructor(velocity = new Vector3(), angularVelocity = new Vector3(), colliderRadius = 1) {
    this.velocity = velocity;
    this.angularVelocity = angularVelocity;
    this.colliderRadius = colliderRadius;
  }
}

export default Physics;
