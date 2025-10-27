export class Stalagmite {
    constructor(x, y, z, scale) { //x,y,z позиция scale размер и ground level - высота "пола"
        this.entity = document.createElement('a-entity');
        this.setupStalagmite(x, y, z, scale);
        this.fell=true;
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
        this.entity.setAttribute('class', "collision");
        this.entity.setAttribute('gltf-model', '#stalagmite-model');
        this.entity.setAttribute('scale', `${scale*0.8} ${scale} ${scale*0.8}`);
        
    }
    
    fall(){
        var pos =this.entity.getAttribute('position')
        this.fell=false
        this.entity.setAttribute('animation',`property: position; to:${pos.x} 2 ${pos.z}; loop: false; dur: 2000`)
    }

    getEntity() {
        return this.entity;
    }
}