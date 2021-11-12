import './style/index.css';
import * as twgl from 'twgl.js';
import vs from './shaders/shader.vert';
import fs from './shaders/shader.frag';
import Model from './model';
import GameObject from './game-object';
import Physics from './physics';
import { gl } from './constants';
import { Vector3 } from 'three';
import GameManager from './gamemanager';
import { deg2rad } from './utils/math';

const m4 = twgl.m4;

const main = async () => {
  const programInfo = twgl.createProgramInfo(gl, [vs, fs], error =>
    console.log(error)
  );

  // object containing what keys are down for a animation frame
  const keyDown = {};

  document.body.addEventListener('keydown', e => {
    keyDown[e.code] = true;
  });

  document.body.addEventListener('keyup', e => {
    keyDown[e.code] = false;
  });

  // // init gl stuff here, like back face culling and the depth test
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.5, 0.2, 0.7, 1.0);

  // track when the last frame rendered
  let lastFrameMilis = 0;

  const manager = new GameManager();
  
  const modelRefs = [require('./models/raymanModel.obj'), require('./models/cow.obj')]
  
  await manager.addModels(modelRefs);

  const myRayman = new GameObject(manager.modelList[0], new Physics());


  manager.addObject(myRayman);


  const modelExtents = manager.modelList[0].getModelExtent();

  // camera begin
  const eye = m4.transformPoint(
    m4.multiply(
      m4.translation(modelExtents.center),
      m4.multiply(m4.rotationY(0), m4.rotationX(0))
    ),
    [0, 0, modelExtents.dia]
  );

  const cameraMatrix = m4.lookAt(eye, modelExtents.center, [0, 1, 0]);
  const viewMatrix = m4.inverse(cameraMatrix);
  const projectionMatrix = m4.perspective(
    deg2rad(75),
    window.innerWidth / window.innerHeight,
    0.1,
    5000
  );

  const uniforms = {
    viewMatrix,
    projectionMatrix
  };
  // camera end

  // create looper function
  function frame(curentMilis) {
    // calculate the change in time in seconds since the last frame
    let deltaTime = (curentMilis - lastFrameMilis) / 1000;

    // update things here
    update(deltaTime);

    // clear the previous frame
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // do the render
    render(deltaTime);

    // request the next frame
    rafHandle = requestAnimationFrame(frame);

    // update the last frame milis
    lastFrameMilis = curentMilis;
  }

  function update(deltaTime) {
    manager.sceneObjects.forEach(sceneObject => sceneObject.update(deltaTime));
  }

  function render(deltaTime) {
    manager.sceneObjects.forEach(sceneObject => sceneObject.render(programInfo, uniforms));
  }

  window.addEventListener('resize', () => {
    uniforms.projectionMatrix = m4.perspective(
      deg2rad(75),
      window.innerWidth / window.innerHeight,
      0.1,
      5000
    );
  });

  gl.viewport(0, 0, window.innerWidth, window.innerHeight);
  twgl.resizeCanvasToDisplaySize(gl.canvas);

  // start the render loop by requesting an animation frame for the frame function
  let rafHandle = requestAnimationFrame(frame);
};

main();
