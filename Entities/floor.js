export class Floor {
    constructor(x, y, z, angle, width, length) {//x,y,z позиция 
        this.entity = document.createElement('a-box');
        this.setupFloor(x, y, z, angle, width, length);
    }
    setupFloor(x, y, z, angle, width, length) {
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        this.entity.setAttribute('class', "floor")
        this.entity.setAttribute('width', `${width}`)
        this.entity.setAttribute('depth', `${length}`)
        this.entity.setAttribute('height', "3")
        this.entity.setAttribute('rotation', `${angle} 0 0`)
        this.entity.setAttribute('color', "blue")
        this.entity.setAttribute('visible', false)
    }
    getEntity() {
        return this.entity;
    }
}