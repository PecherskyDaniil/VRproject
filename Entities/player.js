export class Player {
    
    constructor(x,y,z) {//x,y,z позиция 
        this.entity = document.createElement('a-camera');
        this.setupPlayer(x,y,z);
    }
    
    setupPlayer(x,y,z) {
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        //this.entity.setAttribute('camera', '');
        //this.entity.setAttribute('look-controls', '');
        this.entity.setAttribute('wasd-controls', '');
        this.entity.setAttribute('reset-on-collision',"with: .collision")
        // Курсор
        this.entity.innerHTML = `
            <a-cursor></a-cursor>
        `;
    }
    
    limitMovement(x_limit, z_limit){
        var pos = this.entity.getAttribute('position');
        if (pos.x<x_limit[0]){
            this.entity.setAttribute('position', `${x_limit[0]+0.1} ${pos.y} ${pos.z}`)
        }
        if (pos.x>x_limit[1]){
            this.entity.setAttribute('position', `${x_limit[1]-0.1} ${pos.y} ${pos.z}`)
        }
        if (pos.z<z_limit[0]){
            this.entity.setAttribute('position', `${pos.x} ${pos.y} ${z_limit[0]+0.1}`)
        }
        if (pos.z>z_limit[1]){
            this.entity.setAttribute('position', `${pos.x} ${pos.y} ${z_limit[1]-0.1}`)
        }
    }

    getEntity() {
        return this.entity;
    }
}

