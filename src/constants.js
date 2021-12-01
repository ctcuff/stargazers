const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2', {
  antialias: false
});

/**
 * A mapping of event names sent out by the `gameEventEmitter`
 */
const GameEvents = {
  /**
   * Sent when the UFO runs out of lives
   */
  DEATH: 'DEATH'
};

// the number of samples for a multisample frame buffer
const multiSampleSamples = 4;

export { gl, multiSampleSamples, GameEvents };
