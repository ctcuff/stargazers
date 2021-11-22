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

  // helper for ints in range
  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  // helper for -1 - 1
  function getRandomDir() {
    return Math.random() * 2 - 1;
  }

  let cows = [];

  // loop to generate 3200 cows
  for (let i = 0; i < 3200; i++) {
    // pick a random x y z inside (-200, -200, 0) to (200, 200, -800)
    let x = getRandomInt(-200, 200);
    let y = getRandomInt(-200, 200);
    let z = getRandomInt(0, -800);
    
    // normalize a random vel vector
    const vel = new Vector3(getRandomDir(), getRandomDir(), getRandomDir());
    vel.normalize();

    // cow
    const cow = new GameObject(manager.modelList[1], new Physics(vel));
    
    // 1/4 of the time, add a random rotation
    if (Math.random() >= 0.25) {
      const rot = new Vector3(getRandomDir(), getRandomDir(), getRandomDir());
      rot.multiplyScalar(Math.random() * 8);
      cow.physics.angularVelocity = rot;
    }

    cow.position = new Vector3(x, y, z);
    cow.scale = Math.random() + 0.5;
    cows.push(cow);
  }

  manager.addObjects([...cows]);

  // manager.addObjects([myRayman, myCow]);
  // Add models to canvas
  manager.addObject(myAsteroid1);
  manager.addObject(ufo);

  /** mainModel should be the main model of the scene */
  const mainModel = manager.modelList.ufo.getModelExtent();

  // Offset camera
  let cameraStartingPos = new Vector3();

  // camera begin
  const eye = m4.transformPoint(m4.multiply(m4.translation(mainModel.center), m4.multiply(m4.rotationY(0), m4.rotationX(0))), [
    cameraStartingPos.x,
    cameraStartingPos.y,
    cameraStartingPos.z + mainModel.dia
  ]);

  const cameraMatrix = m4.lookAt(eye, mainModel.center, [0, 1, 0]);
  const viewMatrix = m4.inverse(cameraMatrix);
  const projectionMatrix = m4.perspective(deg2rad(75), window.innerWidth / window.innerHeight, 0.1, 5000);

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
    // update z pos of camera
    eye[2] -= 20 * deltaTime;

    manager.sceneObjects.forEach(sceneObject => sceneObject.update(deltaTime));
  }

  function render(deltaTime) {
    // update the camera for this frame
    cameraMatrix = m4.lookAt(eye, raymanModelExtents.center, [0, 1, 0]);
    viewMatrix = m4.identity();
    m4.rotateX(viewMatrix, 0, viewMatrix);
    m4.rotateY(viewMatrix, 0, viewMatrix);
    m4.translate(viewMatrix, twgl.v3.negate(eye), viewMatrix);
    
    // hack
    const uniforms = {
      viewMatrix,
      projectionMatrix
    };

    
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
