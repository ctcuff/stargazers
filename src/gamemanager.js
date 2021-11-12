import Model from "./model";

class GameManager{
    constructor()
    {
        this.modelList = []
        this.sceneObjects = []
        this.addModels = this.addModels.bind(this);

    }

    async addModels(models){
        models.forEach(async url => {
            const m = new Model();
            await m.load(url);
            console.log(m);
            this.modelList.push(m);
        });
    }
    /**
     * @typedef {import('./game-object').default} GameObject
     * @param {GameObject} gameobject
     * Add a already created gameobject to the manager
     */
    addObject(gameobject)
    {
        this.sceneObjects.push(gameobject);
    }
}

export default GameManager;