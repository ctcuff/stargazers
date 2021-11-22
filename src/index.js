import './style/index.css';
import * as twgl from 'twgl.js';
import vs from './shaders/shader.vert';
import fs from './shaders/shader.frag';
import GameObject from './game-object';
import Physics from './physics';
import { gl } from './constants';
import manager from './gamemanager';
import Camera from './camera';
import { Vector3 } from 'three';

const main = async () => {
  const programInfo = twgl.createProgramInfo(gl, [vs, fs], error => console.log(error));

  // // init gl stuff here, like back face culling and the depth test
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

  const camera = new Camera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  // Add models to canvas
  manager.addObject(myAsteroid1);
  manager.addObject(ufo);

  /** mainModel should be the main model of the scene */
  const mainModel = manager.modelList.ufo.getModelExtent();

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
    manager.sceneObjects.forEach(sceneObject => sceneObject.render(programInfo, camera.getUniforms()));
  }

  gl.viewport(0, 0, window.innerWidth, window.innerHeight);
  twgl.resizeCanvasToDisplaySize(gl.canvas);

  // start the render loop by requesting an animation frame for the frame function
  rafHandle = requestAnimationFrame(frame);
};

main();
