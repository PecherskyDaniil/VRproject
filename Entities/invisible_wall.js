export class Wall {
    constructor(x, z, y, w, h, angle, collide=true,d=5) {//x,y,z позиция 
        this.entity = document.createElement('a-box');
        this.setupWall(x, z, y, w, h,d, angle, collide);
    }
    setupWall(x, z, y, w, h,d, angle, collide) {
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        if (collide){
            this.entity.setAttribute('class', "collision wall")
        }else{
            this.entity.setAttribute('class', "collision")
        }
        this.entity.setAttribute('width', `${w}`)
        this.entity.setAttribute('height', `${h}`)
        this.entity.setAttribute('depth', `${d}`)
        this.entity.setAttribute('color', "red")
        this.entity.setAttribute('rotation', `0 ${angle} 0`)
        this.entity.setAttribute('visible', false)
    }
    getEntity() {
        return this.entity;
    }
}