export class Bridge {
    constructor(x, z, y, w, h) {//x,y,z позиция 
        this.entity = document.createElement('a-entity');
        this.setupBridge(x, z, y, w, h);
    }
    setupBridge(x, z, y, w, h) {
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        this.entity.setAttribute('class', "bridge")
        //this.entity.setAttribute('width', `${w}`)
        //this.entity.setAttribute('height', `${h}`)
        //this.entity.setAttribute('depth', "1")
        //this.entity.setAttribute('color', "red")
        this.entity.setAttribute('geometry', "primitive: box; width: 120; height: 2; depth: 10;")
        let assets = document.querySelector("a-assets");
        if (assets == null) {
            assets = document.createElement('a-assets');
            document.querySelector("a-scene").appendChild(assets);
        }

        // Add model to assets if not already present
        if (!document.querySelector('#pallet-model')) {
            assets.innerHTML += `
                <a-asset-item id="pallet-model" src="Models/pallet/pallet.gltf"></a-asset-item>
            `;
        }

        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        this.entity.setAttribute('rotation', "0 90 90");
        this.entity.setAttribute('scale', '2 2 2');
        this.entity.setAttribute('gltf-model', '#pallet-model');
    }
    raise(){
        this.entity.setAttribute('animation',"property: rotation; to: 0 90 0; loop: false; dur: 2000")
        this.entity.setAttribute('animation__pos',`property: position; to:25 -8 40; loop: false; dur: 2000`)
    }
    getEntity() {
        return this.entity;
    }
}