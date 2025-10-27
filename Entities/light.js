export class Light {
    constructor(x, y, z, color, intensity) { //x,y,z позиция scale размер и ground level - высота "пола"
        this.entity = document.createElement('a-entity');
        this.setupLight(x, y, z, color, intensity);
    }

    setupLight(x, y, z, color, intensity) {
        this.entity.setAttribute("light", `color: ${color}; intensity: ${intensity}`)
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
    }

    getEntity() {
        return this.entity;
    }
}