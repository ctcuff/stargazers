import './style/index.css';
import * as twgl from 'twgl.js';
import vs from './shaders/shader.vert';
import fs from './shaders/shader.frag';
import Model from './model';
import GameObject from './game-object';
import Physics from './physics';
import { gl } from './constants';
import { Vector3 } from 'three';
import manager from './gamemanager';
import { deg2rad } from './utils/math';

const m4 = twgl.m4;

const main = async () => {
  const programInfo = twgl.createProgramInfo(gl, [vs, fs], error => console.log(error));

  // object containing what keys are down for a animation frame
  const keyDown = {};

  document.body.addEventListener('keydown', e => {
    keyDown[e.code] = true;
  });

  document.body.addEventListener('keyup', e => {
    keyDown[e.code] = false;
  });

  // init gl stuff here, like back face culling and the depth test
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.5, 0.2, 0.7, 1.0);

  // the handle to the current requested animation frame, set later
  let rafHandle = undefined;

  // track when the last frame rendered
  let lastFrameMilis = 0;

  const modelRefs = [
    { model: require('./models/ufo.obj'), name: 'ufo' },
    { model: require('./models/starwars.obj'), name: 'starwars' },
    { model: require('./models/asteroid0.obj'), name: 'asteroid0' },
    { model: require('./models/asteroid1.obj'), name: 'asteroid1' },
    { model: require('./models/raymanModel.obj'), name: 'rayman' },
    { model: require('./models/cow.obj'), name: 'cow' }
  ];

  await manager.addModels(modelRefs);

  // Create physics objects
  // Physics(Velocity, angularVelocity, colliderRadius)
  let asteroidPhysics = new Physics(new Vector3(0, 0, -30), new Vector3(0, 0, 0), 0);
  let ufoPhysics = new Physics(new Vector3(0, 0, 0), new Vector3(0, -200, 0), 0);

  // Declare models to be used
  const ufo = new GameObject(manager.modelList.ufo, ufoPhysics);
  const myAsteroid1 = new GameObject(manager.modelList.asteroid0, asteroidPhysics);

  // Add models to canvas
  manager.addObject(myAsteroid1);
  manager.addObject(ufo);

  /** mainModel should be the main model of the scene */
  const mainModel = manager.modelList.ufo.getModelExtent();

  // Offset camera
  let cameraStartingPos = new Vector3(mainModel.dia * 0, mainModel.dia * 0.7, mainModel.dia * 0.1);

  // camera begin
  const eye = m4.transformPoint(m4.multiply(m4.translation(mainModel.center), m4.multiply(m4.rotationY(0), m4.rotationX(0))), [
    cameraStartingPos.x,
    cameraStartingPos.y,
    cameraStartingPos.z + mainModel.dia
  ]);

  const cameraMatrix = m4.lookAt(eye, mainModel.center, [0, 1, 0]);
  const viewMatrix = m4.inverse(cameraMatrix);
  const projectionMatrix = m4.perspective(deg2rad(75), window.innerWidth / window.innerHeight, 0.1, 5000);

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
    uniforms.projectionMatrix = m4.perspective(deg2rad(75), window.innerWidth / window.innerHeight, 0.1, 5000);
  });

  gl.viewport(0, 0, window.innerWidth, window.innerHeight);
  twgl.resizeCanvasToDisplaySize(gl.canvas);

  // start the render loop by requesting an animation frame for the frame function
  rafHandle = requestAnimationFrame(frame);
};

main();
