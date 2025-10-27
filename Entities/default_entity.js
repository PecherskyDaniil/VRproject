export class DefaultEntity {
    constructor(x, y, z, scale, model, anglex, angley, anglez) {//x,y,z позиция scale размер и model - моделька пещеры
        this.entity = document.createElement('a-entity');
        this.setupModel(x, y, z, scale, model, anglex, angley, anglez);
    }

    setupModel(x, y, z, scale, model, anglex, angley, anglez) {
        var assets = document.querySelector("a-assets")
        if (assets == null) {
            assets = document.createElement('a-assets')
            document.querySelector("a-scene").appendChild(assets)
        }
        assets.innerHTML += `
            <a-asset-item id="${model}" src="Models/${model}"></a-asset-item>
        `
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        this.entity.setAttribute('gltf-model', `#${model}`);
        this.entity.setAttribute('scale', `${scale} ${scale} ${scale}`);
        this.entity.setAttribute('rotation', `${anglex} ${angley} ${anglez}`);
    }

    getEntity() {
        return this.entity;
    }
}