import { Vector3 } from 'three';
import Material from '../material';

class BasicMat extends Material {
  constructor() {
    this.materialColor = new Vector3(0, 0, 0);
    this.diffuse = 1;
  }
}

export default BasicMat;
