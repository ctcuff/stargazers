import { Vector3 } from 'three';
import Material from '../material';

class BasicMat extends Material {
  constructor() {
    super(new Vector3(0, 0, 0), 1);
  }
}

export default BasicMat;
