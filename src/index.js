import './style/index.css';
import * as twgl from 'twgl.js';
import vs from './shaders/shader.vert';
import fs from './shaders/shader.frag';
import GameObject from './game-object';
import Physics from './physics';
import { gl } from './constants';
import manager from './gamemanager';
import Camera from './camera';

const main = async () => {
  const programInfo = twgl.createProgramInfo(gl, [vs, fs], error => console.log(error));

  // // init gl stuff here, like back face culling and the depth test
  gl.enable(gl.DEPTH_TEST);
  gl.clearColor(0.5, 0.2, 0.7, 1.0);

  // the handle to the current requested animation frame, set later
  let rafHandle = undefined;

  // track when the last frame rendered
  let lastFrameMilis = 0;

  const modelRefs = [require('./models/raymanModel.obj'), require('./models/cow.obj')];

  await manager.addModels(modelRefs);

  const myRayman = new GameObject(manager.modelList[0], new Physics());
  const myCow = new GameObject(manager.modelList[1], new Physics());

  manager.addObjects([myRayman, myCow]);

  const raymanModelExtents = manager.modelList[0].getModelExtent();

  const camera = new Camera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.lookAt(...raymanModelExtents.center);
  camera.setPosition(0, 8, raymanModelExtents.dia);

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
    manager.sceneObjects.forEach(sceneObject =>
      sceneObject.render(programInfo, camera.getUniforms())
    );
  }

  gl.viewport(0, 0, window.innerWidth, window.innerHeight);
  twgl.resizeCanvasToDisplaySize(gl.canvas);

  // start the render loop by requesting an animation frame for the frame function
  rafHandle = requestAnimationFrame(frame);
};

main();
