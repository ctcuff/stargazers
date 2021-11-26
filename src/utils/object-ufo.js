import GameObject from '../game-object';
import manager from '../gamemanager';
import Physics from '../physics';
import { Vector3 } from 'three';

class UFO extends GameObject {
    constructor() {
        super(manager.modelList.ufo, new Physics());
        this.startSpeed = -200;
        this.startRot = -200;
        this.physics = new Physics(new Vector3(0, 0, this.startSpeed ), new Vector3(0, this.startRot, 0), 0);
        this.scale = 0.5;
        this.initalDia = 99.7135610685365;

        this.turningSpeedX = 5;
        this.turningSpeedY = 3;
        this.speedIncrement = 20;
    }

    update(deltaTime) {
        super.update(deltaTime);
    }
}

export default UFO;