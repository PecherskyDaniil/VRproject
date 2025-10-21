import { Player } from '../Entities/player.js';
import { Ball } from '../Entities/ball.js';
import {Cave} from '../Entities/cave.js';
import {Wall} from '../Entities/invisible_wall.js';
document.addEventListener('DOMContentLoaded', function () {
    var scene=document.querySelector("a-scene")
    const player = new Player(0,1.6,5);
    const ball=new Ball(0,-1.5,0,0.7,-6);
    const cave=new Cave(10,18,30,0.6,"cave2/cave2.gltf")
    const leftwall = new Wall(55,40,150,90);
    const rightwall = new Wall(-20,40,150,90);
    const backwall1 = new Wall(10,-18,100,0);
    const backwall2 = new Wall(52,-18,10,-45);
    scene.appendChild(cave.getEntity());
    scene.appendChild(player.getEntity());
    scene.appendChild(ball.getEntity());
    scene.appendChild(leftwall.getEntity());
    scene.appendChild(rightwall.getEntity());
    scene.appendChild(backwall1.getEntity());
    scene.appendChild(backwall2.getEntity());
    var x_limit = [-20,55]
    var z_limit = [-7,11]
    function gameLoop() {// это для того чтобы мяч двигался с игроком
        ball.update();
        requestAnimationFrame(gameLoop);
        //player.limitMovement(x_limit, z_limit);
    }
    gameLoop()
});