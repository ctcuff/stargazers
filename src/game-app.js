import * as twgl from 'twgl.js';
import vs from './shaders/shader.vert';
import fs from './shaders/shader.frag';
import { gl } from './constants';
import manager from './gamemanager';
import FrameBuffer from './utils/framebuffer';
import PostProcess from './postprocessing/postProcess';
import UFO from './gameobjects/ufo';
import Asteroid from './gameobjects/asteroid';
import ShadowRenderer from './shadow';
import { Vector3 } from 'three';
import Material from './material';
import uiManager from './textmanager2d';
import { renderSkybox } from './skybox';

/**
 * A class that handles setting up WebGL, initializing the scene, and
 * rendering the game. When this is instantiated, you'll only need to call
 * a few methods, every thing else is handled by the class itself.
 *
 * ```
 * await app.loadModels();
 * app.start();
 * ```
 */
class GameApp {
  constructor() {
    // Track if the window was resized and adjust the canvas and viewport to match
    this.wasResized = false;
    // The handle to the current requested animation frame, set later
    this.rafHandle = 0;
    // Tracks when the last frame rendered
    this.lastFrameMilis = 0;

    this.programInfo = twgl.createProgramInfo(gl, [vs, fs], error => console.log(error));
    gl.enable(gl.DEPTH_TEST);
    gl.clearColor(0, 0, 0, 1.0);

    // This will init the canvas width and height and the viewport
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // make an instance of the shadow renderer
    this.shadowRenderer = new ShadowRenderer(manager.camera);

    // Create multisample (and TODO multitarget) frame buffer
    this.multiSampleFrame = new FrameBuffer(gl.canvas.width, gl.canvas.height, { multiSample: true, targets: [true] });
    this.colorFrame = new FrameBuffer(gl.canvas.width, gl.canvas.height, { targets: [true] });
    this.brightFrame = new FrameBuffer(gl.canvas.width, gl.canvas.height, { targets: [true] });
    this.postProcessor = new PostProcess(gl.canvas.width, gl.canvas.height);

    window.addEventListener('resize', this.onResize.bind(this));

    // This function is bound here to prevent binding it every time
    // requestAnimationFrame is called
    this.frame = this.frame.bind(this);
  }

  onResize() {
    // Even though this is an event listener, due to the nature of the javascript
    // event loop, this will not cause weird timing issues with our rendering
    // because we cant be rendering and processing this at the same time
    // it just inst possible
    twgl.resizeCanvasToDisplaySize(gl.canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    this.wasResized = true;
  }

  async loadModels() {
    const textures = twgl.createTextures(gl, {
      asteroid0: { src: require('./assets/asteroid0/asteroid0.png'), flipY: true, wrap: gl.REPEAT, mag: gl.LINEAR, min: gl.MIPMAP },
      asteroid1: { src: require('./assets/asteroid1/asteroid1.png'), flipY: true, wrap: gl.REPEAT, mag: gl.LINEAR, min: gl.MIPMAP },
      ufo: { src: require('./assets/ufo/ufo_diffuse.png'), flipY: true, wrap: gl.REPEAT, mag: gl.LINEAR, min: gl.MIPMAP },
      shield: { src: require('./assets/shield/shieldTexture.png'), flipY: true, wrap: gl.REPEAT, mag: gl.LINEAR, min: gl.MIPMAP }
    });

    const modelRefs = [
      { model: require('./assets/ufo/ufo.obj'), name: 'ufo', material: new Material(textures.ufo) },
      { model: require('./assets//asteroid0/asteroid0.obj'), name: 'asteroid0', material: new Material(textures.asteroid1) },
      { model: require('./assets/asteroid1/asteroid1.obj'), name: 'asteroid1', material: new Material(textures.asteroid1) },
      { model: require('./assets/shield/shield.obj'), name: 'shield', material: new Material(textures.shield) }
    ];

    await manager.addModels(modelRefs);
  }

  initScene() {
    cancelAnimationFrame(this.rafHandle);

    manager.sceneObjects = [];

    const ufo = new UFO();

    // This is a hack, this allows all the asteroids to access the UFO
    manager.ufo = ufo;
    manager.addObject(ufo);

    // Spawn the first set of asteroids
    const asteroids = Asteroid.spawnAsteroids(100 * manager.difficulty);
    manager.addObjects(asteroids);

    manager.camera.lookAt({
      x: 0,
      y: 0,
      z: 0
    });

    manager.camera.setPosition({
      x: ufo.extents.dia * 0,
      y: ufo.extents.dia * 0.7,
      z: ufo.extents.dia
    });

    // Initialize the UI
    uiManager.undimScreen();
    uiManager.updateScore("0");
    uiManager.restoreLives();
  }

  /**
   * @param {number} currentMilis
   */
  frame(currentMilis) {
    // calculate the change in time in seconds since the last frame
    let deltaTime = (currentMilis - this.lastFrameMilis) / 1000;

    // check if the canvas needs to be resized, if so, things need to be recreated here
    if (this.wasResized) {
      // re create frame buffers here so that they have the proper settings
      this.wasResized = false;
      this.multiSampleFrame = new FrameBuffer(gl.canvas.width, gl.canvas.height, { multiSample: true, targets: [true] });
      this.colorFrame = new FrameBuffer(gl.canvas.width, gl.canvas.height, { targets: [true] });
      this.brightFrame = new FrameBuffer(gl.canvas.width, gl.canvas.height, { targets: [true] });
      this.postProcessor = new PostProcess(gl.canvas.width, gl.canvas.height);
    }

    this.update(deltaTime);
    this.render(deltaTime);

    this.rafHandle = requestAnimationFrame(this.frame);
    this.lastFrameMilis = currentMilis;
  }

  /**
   * Responsible for updating all objects and
   * things that need to be updated since last frame
   *
   * @param {number} deltaTime
   */
  update(deltaTime) {
    // Update the position of each object
    manager.sceneObjects.forEach(sceneObject => sceneObject.update(deltaTime));

    // collision pass
    for (let i = 0; i < manager.sceneObjects.length; i++) {
      const firstObj = manager.sceneObjects[i];
      for (let j = i + 1; j < manager.sceneObjects.length; j++) {
        const secondObj = manager.sceneObjects[j];
        if (firstObj.doesCollide(secondObj)) {
          firstObj.onCollisionEnter(secondObj);
          secondObj.onCollisionEnter(firstObj);
        }
      }
    }

    // remove all gameobjects that are now not "alive"
    manager.sceneObjects = manager.sceneObjects.filter(gameobject => gameobject.alive);

    // Add new objects with time
    manager.time = manager.time + Math.ceil(deltaTime * 60);

    uiManager.score = (manager.ufo.position.length() / 50).toFixed(0);
    uiManager.updateScore("" + uiManager.score);

    if (manager.time % 500 == 0) {
      manager.addObjects(Asteroid.spawnAsteroids(5 * manager.difficulty));
    }
  }

  /**
   * Responsible for true rendering,
   * including shadows, model rendering, and post processing
   *
   * @param {number} deltaTime
   */
  render(deltaTime) {
    // = = = = = = = = = = PRE-RENDER = = = = = = = = = =

    // render the scene from the light dir
    this.shadowRenderer.renderShadowMap(manager.lighting.light);

    // bind the multi sample frame buffer
    this.multiSampleFrame.bind();

    // clear the previous frame
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // = = = = = = = = = = MAIN-RENDER = = = = = = = = = =
    const uniforms = {
      ...manager.camera.getUniforms(),
      ...manager.lighting.getUniforms()
    };

    // render all objects in the scene
    manager.sceneObjects.forEach(sceneObject => sceneObject.render(this.programInfo, uniforms));

    // TODO remove this debug when shadows are fully applied:
    // this.shadowRenderer.DEBUGrenderDepthTex(-0.75, 0.75, .25);

    // = = = = = = = = = = POST-RENDER = = = = = = = = = =

    // render the skybox
    renderSkybox();

    // unbind the multi sample frame buffer
    this.multiSampleFrame.unbind();

    // resolve the 0th color attachment (the main one) to the color fbo
    this.multiSampleFrame.resolveToFrameBuffer(gl.COLOR_ATTACHMENT0, this.colorFrame);

    // resolve the 1st color attachment (the bright one) to the bright fbo
    // TODO change the below to gl.COLOR_ATTACHMENT1 when proper bloom is implemented
    this.multiSampleFrame.resolveToFrameBuffer(gl.COLOR_ATTACHMENT0, this.brightFrame);

    // resolve the main output frame to the screen
    this.postProcessor.run(this.colorFrame.colorAttachments[0], this.brightFrame.colorAttachments[0]);
  }

  gameOver() {  uiManager.gameOver(); }

  /**
   * Note that calling this method handles re-creating the scene,
   * so calling `start()` after the game has already started will
   * restart the game.
   */
  start() {
    this.initScene();
    this.rafHandle = requestAnimationFrame(this.frame);
  }
}

export default GameApp;
