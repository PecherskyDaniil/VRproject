export class Player {

    constructor(x, y, z) {//x,y,z позиция 
        this.entity = document.createElement('a-camera');
        this.setupPlayer(x, y, z);
    }

    setupPlayer(x, y, z) {
        let assets = document.querySelector("a-assets");
        if (assets == null) {
            assets = document.createElement('a-assets');
            document.querySelector("a-scene").appendChild(assets);
        }

        // Add model to assets if not already present
        if (!document.querySelector('#ball-model')) {
            assets.innerHTML += `
                <audio id="footstepSound" src="./music/footsteps.mp3" preload="auto"></audio>
            `;
        }
        this.entity.setAttribute('footstep-sound', 'sound: #footstepSound; stepDistance: 10')
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        //this.entity.setAttribute('camera', '');
        //this.entity.setAttribute('look-controls', '');
        this.entity.setAttribute('wasd-controls', '');
        this.entity.setAttribute('reset-on-collision', "with: .collision")
        // Курсор
        this.entity.innerHTML = `
            <a-cursor></a-cursor>
        `;
    }

    limitMovement(x_limit, z_limit) {
        var pos = this.entity.getAttribute('position');
        if (pos.x < x_limit[0]) {
            this.entity.setAttribute('position', `${x_limit[0] + 0.1} ${pos.y} ${pos.z}`)
        }
        if (pos.x > x_limit[1]) {
            this.entity.setAttribute('position', `${x_limit[1] - 0.1} ${pos.y} ${pos.z}`)
        }
        if (pos.z < z_limit[0]) {
            this.entity.setAttribute('position', `${pos.x} ${pos.y} ${z_limit[0] + 0.1}`)
        }
        if (pos.z > z_limit[1]) {
            this.entity.setAttribute('position', `${pos.x} ${pos.y} ${z_limit[1] - 0.1}`)
        }
    }

    getEntity() {
        return this.entity;
    }
}

