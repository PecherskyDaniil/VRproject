export class BallDestroyer {
    constructor(x, y, z, width, height, depth) {//x,y,z позиция 
        this.entity = document.createElement('a-box');
        this.setupFloor(x, y, z, width, height, depth);
    }
    setupFloor(x, y, z, width, height, depth) {
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        this.entity.setAttribute('class', "balldestroyer")
        this.entity.setAttribute('width', `${width}`)
        this.entity.setAttribute('depth', `${depth}`)
        this.entity.setAttribute('height', `${height}`)
        this.entity.setAttribute('color', "green")
        this.entity.setAttribute('visible', false)
    }
    getEntity() {
        return this.entity;
    }
}