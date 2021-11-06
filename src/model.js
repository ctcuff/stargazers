import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import * as twgl from 'twgl.js';
import { gl } from './constants';

const loader = new OBJLoader();
const vec3 = twgl.v3;
const mat4 = {
  ...twgl.m4,
  create: () =>
    new Float32Array([1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1]),
  fromQuat: q => {
    let x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let yx = y * x2;
    let yy = y * y2;
    let zx = z * x2;
    let zy = z * y2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    let out = [];
    out[0] = 1 - yy - zz;
    out[1] = yx + wz;
    out[2] = zx - wy;
    out[3] = 0;

    out[4] = yx - wz;
    out[5] = 1 - xx - zz;
    out[6] = zy + wx;
    out[7] = 0;

    out[8] = zx + wy;
    out[9] = zy - wx;
    out[10] = 1 - xx - yy;
    out[11] = 0;

    out[12] = out[13] = out[14] = 0;
    out[15] = 1;
    return out;
  },
  fromRotationTranslationScale: (q, v, s) => {
    // Quaternion math
    let x = q[0],
      y = q[1],
      z = q[2],
      w = q[3];
    let x2 = x + x;
    let y2 = y + y;
    let z2 = z + z;
    let xx = x * x2;
    let xy = x * y2;
    let xz = x * z2;
    let yy = y * y2;
    let yz = y * z2;
    let zz = z * z2;
    let wx = w * x2;
    let wy = w * y2;
    let wz = w * z2;
    let sx = s[0];
    let sy = s[1];
    let sz = s[2];
    let out = [];
    out[0] = (1 - (yy + zz)) * sx;
    out[1] = (xy + wz) * sx;
    out[2] = (xz - wy) * sx;
    out[3] = 0;
    out[4] = (xy - wz) * sy;
    out[5] = (1 - (xx + zz)) * sy;
    out[6] = (yz + wx) * sy;
    out[7] = 0;
    out[8] = (xz + wy) * sz;
    out[9] = (yz - wx) * sz;
    out[10] = (1 - (xx + yy)) * sz;
    out[11] = 0;
    out[12] = v[0];
    out[13] = v[1];
    out[14] = v[2];
    out[15] = 1;
    return out;
  }
};

class Model {
  constructor() {
    this.onModelLoaded = this.onModelLoaded.bind(this);
    this.createSC = this.createSC.bind(this);
    this.createSCs = this.createSCs.bind(this);

    this.model = null;
    this.vertexAttributes = [];
  }

  load(modelURL) {
    return new Promise((resolve, reject) => {
      loader.load(
        modelURL,
        obj => {
          this.onModelLoaded(obj);
          resolve();
        },
        () => {},
        err => console.log(err)
      );
    });
  }

  onModelLoaded(loadedObject) {
    this.model = loadedObject;

    const modelObj = this.createSCs(loadedObject);

    const va = modelObj.map(d => ({
      position: { numComponents: 3, data: d.sc.positions },
      normal: { numComponents: 3, data: d.sc.normals },
      uv: { numComponents: 2, data: d.sc.uvs }
    }));

    this.vertexAttributes = va.map(attribute =>
      twgl.createBufferInfoFromArrays(gl, attribute)
    );
  }

  createSCs(obj) {
    const sceneGraph = {};
    let scs = [];

    const getNode = (node, M) => {
      const sc = {};
      sc.name = node.name;

      const translation = node.position
        ? [node.position.x, node.position.y, node.position.z]
        : [0, 0, 0];
      const quaternion = node.quaternion
        ? [
            node.quaternion.x,
            node.quaternion.y,
            node.quaternion.z,
            node.quaternion.w
          ]
        : [0, 0, 0, 1];
      //const rotation = node.rotation?[node.rotation.x,node.rotation.y,node.rotation.z]:[0,0,0];// XYZ order
      const scale =
        node.scale && node.scale.x
          ? [node.scale.x, node.scale.y, node.scale.z]
          : [1, 1, 1];

      sc.modelMatrix = mat4.multiply(
        M,
        mat4.fromRotationTranslationScale(quaternion, translation, scale)
      );

      if (node.geometry || node.attributes) {
        const attributes = node.geometry
          ? node.geometry.attributes
          : node.attributes;
        if (
          node.geometry &&
          node.geometry.groups &&
          node.geometry.groups.length > 0
        ) {
          const groups = node.geometry.groups;
          const localScs = d3.range(0, groups.length, 1).map(i => {

            return this.createSC(attributes, {
              start: groups[i].start,
              count: groups[i].count
            });
          });
          
          localScs.forEach((d, i) => {
            scs.push({ name: sc.name, sc: d, modelMatrix: sc.modelMatrix });
          });
        } else {
          sc.sc = this.createSC(attributes);
          scs.push(sc);
        }
      }
      if (node.children) node.children.forEach(d => getNode(d, sc.modelMatrix));
    };

    if (obj.scene) getNode(obj.scene, mat4.create());
    else getNode(obj, mat4.create());
    return scs;
  }

  createSC(attributes, offset) {
    let positions = offset
      ? attributes.position.array.slice(
          offset.start * 3,
          (offset.start + offset.count) * 3
        )
      : attributes.position.array.slice();
    let normals = undefined,
      uvs = undefined;
    if (attributes.normal)
      normals = offset
        ? attributes.normal.array.slice(
            offset.start * 3,
            (offset.start + offset.count) * 3
          )
        : attributes.normal.array.slice();
    else {
      let count = positions.length / 3;
      let Ns = [];
      for (let i = 0; i < offset.count; i += 3) {
        const k = offset.start + i;
        const v0 = positions.slice(k * 9, k * 9 + 3),
          v1 = positions.slice(k * 9 + 3, k * 9 + 6),
          v2 = positions.slice(k * 9 + 6, k * 9 + 9);
        const N = Array.from(
          vec3.normalize(
            vec3.cross(vec3.subtract(v1, v0), vec3.subtract(v2, v0))
          )
        );
        Ns.push(N, N, N);
      }
      normals = Ns.flat();
    }
    if (attributes.uv)
      uvs = offset
        ? attributes.uv.array.slice(
            offset.start * 2,
            (offset.start + offset.count) * 2
          )
        : attributes.uv.array.slice();
    return {
      positions,
      normals,
      uvs
    };
  }
}

export default Model;
