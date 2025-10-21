export class Wall{
    constructor(x,y,w,angle) {//x,y,z позиция 
        this.entity = document.createElement('a-box');
        this.setupWall(x,y,w,angle);
    }
    setupWall(x,y,w,angle) {
        this.entity.setAttribute('position', `${x} 0 ${y}`);
        this.entity.setAttribute('class',"collision")
        this.entity.setAttribute('width',`${w}`)
        this.entity.setAttribute('height',"50")
        this.entity.setAttribute('depth',"3")
        this.entity.setAttribute('color',"red")
        this.entity.setAttribute('rotation',`0 ${angle} 0`)
        
    }
    getEntity() {
        return this.entity;
    }
}