import { GameEvents } from './constants';
import GameApp from './game-app';
import gameEventEmitter from './utils/game-event-emitter';

const main = async () => {
  const app = new GameApp();

  await app.loadModels();
  app.start();

  // Simulate a simple game restart (this is merely an example)
  gameEventEmitter.on(GameEvents.DEATH, () => {
    app.gameOver();
    console.log('Game Over! Restarting in 5 seconds...');
    setTimeout(() => app.start(), 5000);
  });
};

main();
