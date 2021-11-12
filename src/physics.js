import { Vector3 } from 'three'

class Physics{
    constructor(velocity, colliderRadius)
    {
        this.velocity = velocity ?? new Vector3();
        this.colliderRadius = colliderRadius ?? 1;
    }
}


export default Physics;