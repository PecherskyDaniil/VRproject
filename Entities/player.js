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
        
        // Курсор
        this.entity.innerHTML = `
            <a-cursor></a-cursor>
        `;
    }
    
    getEntity() {
        return this.entity;
    }
}

