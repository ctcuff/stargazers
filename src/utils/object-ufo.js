import GameObject from '../game-object';
import manager from '../gamemanager';
import Physics from '../physics';
import { Vector3 } from 'three';

class UFO extends GameObject {
    constructor() {
        super(manager.modelList.ufo, new Physics());
        this.startSpeed = -300;
        this.startRot = -300;
        this.physics = new Physics(new Vector3(0, 0, this.startSpeed ), new Vector3(0, this.startRot, 0), 0);
        this.scale = 0.5;
        this.initalDia = 99.7135610685365;

        this.strafeSpeedX = 5;
        this.strafeSpeedY = 3;
        this.velcIncr = 10;
        this.angularVelIncr = 30;
    }

    update(deltaTime) {
        super.update(deltaTime);
    }
}

export default UFO;