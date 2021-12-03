import * as twgl from 'twgl.js';
import vs from './shaders/skybox/sky.vert';
import fs from './shaders/skybox/sky.frag';
import { gl } from './constants';
import manager from './gamemanager';

// create the shader to render this from
const skyboxShader = twgl.createProgramInfo(gl, [vs, fs], error => console.log(error));

// the texture of the sky box
const skyboxTexture = loadSkyboxTexture();

// the size of the cube
const SIZE = 2000;

// the model of the cube to render
const cube = createCube();

// helper function to load the thing
function loadSkyboxTexture() {
  return twgl.createTextures(gl, {
    skybox: {
      // ORDER: F, B, L, R, U, D
      target: gl.TEXTURE_CUBE_MAP,
      src: [
        require('./assets/skybox/planet/front.png'),
        require('./assets/skybox/planet/back.png'),
        require('./assets/skybox/planet/left.png'),
        require('./assets/skybox/planet/right.png'),
        require('./assets/skybox/planet/top.png'),
        require('./assets/skybox/planet/bot.png')
      ],
      cubeFaceOrder: [
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Z,
        gl.TEXTURE_CUBE_MAP_POSITIVE_Z,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_X,
        gl.TEXTURE_CUBE_MAP_POSITIVE_X,
        gl.TEXTURE_CUBE_MAP_POSITIVE_Y,
        gl.TEXTURE_CUBE_MAP_NEGATIVE_Y
      ],
      wrapS: gl.CLAMP_TO_EDGE,
      wrapT: gl.CLAMP_TO_EDGE,
      mag: gl.LINEAR,
      min: gl.LINEAR
    }
  });
}

// helper function to create the cube
function createCube() {
  const verticies = [
    -SIZE,  SIZE, -SIZE,
    -SIZE, -SIZE, -SIZE,
     SIZE, -SIZE, -SIZE,
     SIZE, -SIZE, -SIZE,
     SIZE,  SIZE, -SIZE,
    -SIZE,  SIZE, -SIZE,

    -SIZE, -SIZE,  SIZE,
    -SIZE, -SIZE, -SIZE,
    -SIZE,  SIZE, -SIZE,
    -SIZE,  SIZE, -SIZE,
    -SIZE,  SIZE,  SIZE,
    -SIZE, -SIZE,  SIZE,

     SIZE, -SIZE, -SIZE,
     SIZE, -SIZE,  SIZE,
     SIZE,  SIZE,  SIZE,
     SIZE,  SIZE,  SIZE,
     SIZE,  SIZE, -SIZE,
     SIZE, -SIZE, -SIZE,

    -SIZE, -SIZE,  SIZE,
    -SIZE,  SIZE,  SIZE,
     SIZE,  SIZE,  SIZE,
     SIZE,  SIZE,  SIZE,
     SIZE, -SIZE,  SIZE,
    -SIZE, -SIZE,  SIZE,

    -SIZE,  SIZE, -SIZE,
     SIZE,  SIZE, -SIZE,
     SIZE,  SIZE,  SIZE,
     SIZE,  SIZE,  SIZE,
    -SIZE,  SIZE,  SIZE,
    -SIZE,  SIZE, -SIZE,

    -SIZE, -SIZE, -SIZE,
    -SIZE, -SIZE,  SIZE,
     SIZE, -SIZE, -SIZE,
     SIZE, -SIZE, -SIZE,
    -SIZE, -SIZE,  SIZE,
     SIZE, -SIZE,  SIZE
  ];

  const va = {
    position: { numComponents: 3, data: verticies }
  };

  return twgl.createBufferInfoFromArrays(gl, va);
}

// the function responsible for actually rendering the darn thing
function renderSkybox() {
  // use the shader
  gl.useProgram(skyboxShader.program);

  // get the view matrix but remove the translation from it
  const viewMatCopy = [...manager.camera.viewMatrix];
  twgl.m4.setTranslation(viewMatCopy, [0, 0, 0], viewMatCopy);

  // set the uniforms
  twgl.setUniforms(skyboxShader, {
    projectionMatrix: manager.camera.projectionMatrix,
    viewMatrix: viewMatCopy,
    skybox: skyboxTexture.skybox
  });

  // render
  twgl.setBuffersAndAttributes(gl, skyboxShader, cube);
  twgl.drawBufferInfo(gl, cube);
}

export { renderSkybox };
