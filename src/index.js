import './style/index.css';
import * as twgl from 'twgl.js';
import vs from './shaders/shader.vert';
import fs from './shaders/shader.frag';
import GameObject from './game-object';
import Physics from './physics';
import { gl } from './constants';
import manager from './gamemanager';
import Input from './input';
import Camera from './camera';
import { Vector3 } from 'three';
import { spawnArr } from './utils/object-spawner';
import UFO from './utils/object-ufo';

const m4 = twgl.m4;

const main = async () => {
  const programInfo = twgl.createProgramInfo(gl, [vs, fs], error => console.log(error));

  // init gl stuff here, like back face culling and the depth test
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0, 0, 0, 1.0);

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

  // Setup the ufo model
  const ufo = new UFO(); // Declare ufo model
  manager.ufo = ufo; // This is a hack, this allows me to have access to the ufo in all the cows
  manager.addObject(ufo); // Add the ufo model to canvas

  // Spawn the first set of asteroids
  let arrOfObjects = spawnArr(50 * manager.difficulty);
  manager.addObjects(arrOfObjects);

  // mainModel should be the 'main' model of the scene
  const mainModel = manager.modelList.ufo.getModelExtent();

  // create and init camera
  const camera = new Camera(75, window.innerWidth / window.innerHeight, 1, 3000);

  camera.lookAt({
    x: 0,
    y: 0,
    z: 0
  });

  camera.setPosition({
    x: mainModel.dia * 0,
    y: mainModel.dia * 0.7,
    z: mainModel.dia
  });

  // create looper function
  function frame(curentMilis) {
    // calculate the change in time in seconds since the last frame
    let deltaTime = (curentMilis - lastFrameMilis) / 1000;

    // check if the canvas needs to be resized, if so, things need to be recreated here
    if (wasResized) {
      // re create frame buffers (TODO) here so that they have the proper settings
    }

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

  // update function, responsible for updating all objects and things that need to be updated since last frame
  function update(deltaTime) {

    // Add a shift key mapping to act like a "crouch" that cuts the ships speed in half while you are pressing it down
    // Or make it toggle so every time you press shift you crouch or uncrouch depending on the state (holding is prefered over toggle but toggle might be easier)
    
    // Key mapping:
    // Right movement
    if ((Input.keysDown.ArrowRight || Input.keysDown.d || Input.keysDown.D || Input.keysDown.e)) {
      ufo.position.add(new Vector3(ufo.strafeSpeedX, 0, 0));
    }
    // Left movement
    if ((Input.keysDown.ArrowLeft || Input.keysDown.a || Input.keysDown.q)) {
      ufo.position.add(new Vector3(-ufo.strafeSpeedX, 0, 0));
    }
    // Up movement
    if ((Input.keysDown.ArrowUp || Input.keysDown.w || Input.keysDown.e || Input.keysDown.q)) {
      ufo.position.add(new Vector3(0, ufo.strafeSpeedY, 0));
    }
    // Down movement
    if ((Input.keysDown.ArrowDown || Input.keysDown.s)) {
      ufo.position.add(new Vector3(0, -ufo.strafeSpeedY, 0));
    }
    // Added o, p and r for debugging purposes, not needed for actual gameplay
    // Speed up the ship and it's rotation
    if (Input.keysDown.o) {
      ufo.physics.velocity.add(new Vector3(0, 0, -10));
      ufo.physics.angularVelocity.add(new Vector3(0, -10, 0));
    }
    // Slow down the ship and it's rotation
    if (Input.keysDown.p) {
      ufo.physics.velocity.add(new Vector3(0, 0, 10));
      ufo.physics.angularVelocity.add(new Vector3(0, 10, 0));
    }
    // Reset the ship to it's starting speed
    if (Input.keysDown.r) {
      ufo.physics.velocity = new Vector3(0, 0, ufo.startSpeed);
      ufo.physics.angularVelocity = new Vector3(0, ufo.startRot, 0);
    }

    // Update the position of each object
    manager.sceneObjects.forEach(sceneObject => sceneObject.update(deltaTime));

    // Fix the camera so it's positioned behind the ship each frame
    let offset = new Vector3(0, mainModel.dia * 0.35, mainModel.dia * 0.9);
    camera.setPosition(ufo.position.clone().add(offset));
    camera.lookAt(ufo.position);

    // Add new objects with time
    manager.time = manager.time + Math.ceil(deltaTime * 60);
    if (manager.time % 100 == 0) {
      manager.addObjects(spawnArr(5 * manager.difficulty));
      ufo.physics.velocity.add(new Vector3(0, 0, -ufo.velcIncr * manager.difficulty));
      ufo.physics.angularVelocity.add(new Vector3(0, -ufo.angularVelIncr * manager.difficulty, 0));
      ufo.strafeSpeedX += 0.5;
      ufo.strafeSpeedY += 0.25;
    }
  }

  // render function, responsible for alloh true rendering, including shadows (TODO), model rendering, and post processing (TODO)
  function render(deltaTime) {
    manager.sceneObjects.forEach(sceneObject => sceneObject.render(programInfo, camera.getUniforms()));
  }

  // track if the window was resized and adjust the canvas and viewport to match
  let wasResized = false;
  window.addEventListener('resize', () => {
    // even though this is an event listener, due to the nature of the javascript event loop,
    // this will not cause weird timing issues with our rendering because we cant be rendering and processing this at the same time
    // it just inst possible
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    wasResized = true;
  });

  // this will make init the canvas width and height and the viewport
  twgl.resizeCanvasToDisplaySize(gl.canvas);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // start the render loop by requesting an animation frame for the frame function
  rafHandle = requestAnimationFrame(frame);
};

main();
