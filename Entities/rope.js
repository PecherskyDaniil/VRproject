export class Rope {
    constructor(x, y, z, scale) {//x,y,z позиция scale размер и model - моделька пещеры
        this.entity = document.createElement('a-entity');
        this.setupRope(x, y, z, scale);
    }

    setupRope(x, y, z, scale) {
        var assets = document.querySelector("a-assets")
        if (assets == null) {
            assets = document.createElement('a-assets')
            document.querySelector("a-scene").appendChild(assets)
        }
        assets.innerHTML += `
            <a-asset-item id="rope" src="Models/rope/rope.gltf"></a-asset-item>
        `
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        this.entity.setAttribute('gltf-model', '#rope');
        this.entity.setAttribute('scale', `${scale} ${scale} ${scale}`);
        this.entity.setAttribute("rotation", "0 -90 0")
    }

    getEntity() {
        return this.entity;
    }
}