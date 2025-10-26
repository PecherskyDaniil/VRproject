export class Stalagmite {
    constructor(x, y, z, scale) { //x,y,z позиция scale размер и ground level - высота "пола"
        this.entity = document.createElement('a-entity');
        this.setupStalagmite(x, y, z, scale);
    }

    setupStalagmite(x, y, z, scale) {
        let assets = document.querySelector("a-assets");
        if (assets == null) {
            assets = document.createElement('a-assets');
            document.querySelector("a-scene").appendChild(assets);
        }

        // Add model to assets if not already present
        if (!document.querySelector('#stalagmite-model')) {
            assets.innerHTML += `
                <a-asset-item id="stalagmite-model" src="Models/big_stalagmite/big_stalagmite.gltf"></a-asset-item>
            `;
        }
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        this.entity.setAttribute('gltf-model', '#stalagmite-model');
        this.entity.setAttribute('scale', `${scale} ${scale} ${scale}`);
    }

    getEntity() {
        return this.entity;
    }
}