import { m4 } from 'twgl.js';
import { Vector3 } from 'three';
import { deg2rad } from './utils/math';

class Lighting {
    constructor(lightPosition, lightDirection) {
        this.lightDirection = lightDirection;
        this.lightPosition = lightPosition;
        
    }
}

const uniforms = {
    light,
    ambientIntensity,
    shininess,
    diffuse
};

// create a new buffer, bind it to the buffer, and send along the array of vertex normals
const normalBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);

const vertexNormals = [

];

gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertexNormals), gl.STATIC_DRAW);



const numComponents = 3;
const type = gl.FLOAT;
const norm = false;
const stride = 0;
const offset = 0;

gl.bindBuffer(gl.ARRAY_BUFFER, buffers.normal);
gl.vertexAttribPointer(
    programInfo.atttribLocations.vertexNormal,
    numComponents,
    type,
    stride,
    offset
);

gl.enableVertexAttribArray(
    programInfo.attribLocations.vertexNormal
);


const normalMatrix = mat4.create();
mat4.invert(normalMatrix, modelViewMatrix);
mat4.transpose(normalMatrix, normalMatrix);

gl.uniformMatrix(
    programInfo.uniformLocations.normalMatrix,
    false,
    normalMatrix
);

const programInfo = {
    program: shaderProgram,
    attribLocations: {
        vertexPosition: gl.getAttribLocation(shaderProgram, 'aVertexPosition'),
        vertexNormal: gl.getAttribLocation(shaderProgram, 'aVertexNormal'),
        textureCoord: gl.getAttribLocation(shaderProgram, 'aTextureCoord'),
    },
    uniformLocations: {
        projectionMatrix: gl.getUniformLocation(shaderProgram, 'uProjectionMatrix'),
        modelViewMatrix: gl.getUniformLocation(shaderProgram, 'uModelViewMatrix'),
        normalMatrix: gl.getUniformLocation(shaderProgram, 'uNormalMatrix'),
        uSampler: gl.getUniformLocaiton(shaderProgram, 'uSampler'),
    },
};