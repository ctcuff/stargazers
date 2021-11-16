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
import TextManager2D from './textmanager2d';
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

  const modelRefs = [
    require('./models/raymanModel.obj'),
    require('./models/cow.obj')
  ];

  // Initialize WebGL back face culling and depth test.
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.5, 0.2, 0.7, 1.0);

  const manager = new GameManager();
  const textManager = new TextManager2D();

  // Add the models to the game manager.
  await manager.addModels(modelRefs);

  // initialModels will hold all of the objects we'd like to initially put on the screen. We will then push it to the GameManager.
  const initialModels = []

  // The following three lines can be used for debugging.
  // const myRayman = new GameObject(manager.modelList[0], new Physics());
  // const myCow = new GameObject(manager.modelList[1], new Physics());
  // initialModels = [myRayman, myCow];

  initialModels.push(new GameObject(manager.modelList[0], new Physics())); // Rayman
  initialModels.push(new GameObject(manager.modelList[1], new Physics())); // Cow
  manager.addObjects(initialModels);

  const raymanModelExtents = manager.modelList[0].getModelExtent();
  
  // camera begin
  const eye = m4.transformPoint(
    m4.multiply(
      m4.translation(raymanModelExtents.center),
      m4.multiply(m4.rotationY(0), m4.rotationX(0))
    ),
    [0, 0, raymanModelExtents.dia]
  );

  const cameraMatrix = m4.lookAt(eye, raymanModelExtents.center, [0, 1, 0]);
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

  let lastFrameMs = 0;

  // Game loop
  function frame(currentMs) {
    // Time passed between frames.
    let deltaTime = (currentMs - lastFrameMs) / 1000;

    // Update things. Calculate physics, positions, etc... 
    update(deltaTime);

    // CLear the previous frame.
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Display the things we've just updated. Simply used to render the objects to the screen.
    render(deltaTime);

    // Request the next frame
    rafHandle = requestAnimationFrame(frame);

    // Update the last frame ms
    lastFrameMs = currentMs;

    let debugVal = (lastFrameMs / 1000).toFixed(0)
    textManager.updateScore(debugVal);
    textManager.updateCenterText(debugVal);
  }

  function update(deltaTime) {
    manager.sceneObjects.forEach(sceneObject => sceneObject.update(deltaTime));
  }

  function render(deltaTime) {
    manager.sceneObjects.forEach(sceneObject =>
      sceneObject.render(programInfo, uniforms)
    );
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