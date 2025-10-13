export class Cave {
    constructor(x,y,z,scale,model) {//x,y,z позиция scale размер и model - моделька пещеры
        this.entity = document.createElement('a-entity');
        this.setupCave(x,y,z,scale,model);
    }
    
    setupCave(x,y,z,scale,model) {
        var assets=document.querySelector("a-assets")
        if (assets==null) {
            assets=document.createElement('a-assets')
            document.querySelector("a-scene").appendChild(assets)
        }
        assets.innerHTML+=`
            <a-asset-item id="cave" src="Models/${model}"></a-asset-item>
        `
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        this.entity.setAttribute('gltf-model', '#cave');
        this.entity.setAttribute('scale', `${scale} ${scale} ${scale}`);
    }
    
    getEntity() {
        return this.entity;
    }
}