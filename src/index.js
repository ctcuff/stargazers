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
    require('./models/raymanModel.obj'),
    require('./models/cow.obj')
  ];

  await manager.addModels(modelRefs);

  const myRayman = new GameObject(manager.modelList[0], new Physics());
  const myCow = new GameObject(manager.modelList[1], new Physics());

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
  }

  function getRandomDir() {
    return Math.random() * 2 - 1;
  }

  let cows = [];

  for (let i = 0; i < 3200; i++) {
    let x = getRandomInt(-160, 160);
    let y = getRandomInt(-160, 160);
    let z = getRandomInt(0, -800);
    const vel = new Vector3(getRandomDir(), getRandomDir(), getRandomDir());
    vel.normalize();
    const cow = new GameObject(manager.modelList[1], new Physics(vel));
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

  myCow.physics.angularVelocity = new Vector3(10, 10, 10);

  const raymanModelExtents = manager.modelList[0].getModelExtent();

  // camera begin
  let eye = m4.transformPoint(m4.multiply(m4.translation(raymanModelExtents.center), m4.multiply(m4.rotationY(0), m4.rotationX(0))), [
    0,
    0,
    raymanModelExtents.dia
  ]);

  let cameraMatrix = m4.lookAt(eye, raymanModelExtents.center, [0, 1, 0]);
  let viewMatrix = m4.inverse(cameraMatrix);
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
    eye[2] -= 20 * deltaTime;
    manager.sceneObjects.forEach(sceneObject => sceneObject.update(deltaTime));
  }

  function render(deltaTime) {
    cameraMatrix = m4.lookAt(eye, raymanModelExtents.center, [0, 1, 0]);
    viewMatrix = m4.identity();
    m4.rotateX(viewMatrix, 0, viewMatrix);
    m4.rotateY(viewMatrix, 0, viewMatrix);
    m4.translate(viewMatrix, twgl.v3.negate(eye), viewMatrix);
    
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
