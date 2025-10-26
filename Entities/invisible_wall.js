export class Wall {
    constructor(x, z, y, w, h, angle) {//x,y,z позиция 
        this.entity = document.createElement('a-box');
        this.setupWall(x, z, y, w, h, angle);
    }
    setupWall(x, z, y, w, h, angle) {
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        this.entity.setAttribute('class', "collision wall")
        this.entity.setAttribute('width', `${w}`)
        this.entity.setAttribute('height', `${h}`)
        this.entity.setAttribute('depth', "5")
        this.entity.setAttribute('color', "red")
        this.entity.setAttribute('rotation', `0 ${angle} 0`)
        this.entity.setAttribute('visible', false)
    }
    getEntity() {
        return this.entity;
    }
}