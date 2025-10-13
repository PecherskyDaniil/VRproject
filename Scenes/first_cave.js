import { Player } from '../Entities/player.js';
import { Ball } from '../Entities/ball.js';
import {Cave} from '../Entities/cave.js';
document.addEventListener('DOMContentLoaded', function () {
    var scene=document.querySelector("a-scene")
    
    const player = new Player(0,1.6,5);
    const ball=new Ball(0,-1.5,0,0.7);
    const cave=new Cave(0,1,0,0.8,"cave1/our_cave.gltf")
    scene.appendChild(cave.getEntity());
    scene.appendChild(player.getEntity());
    scene.appendChild(ball.getEntity());

    function gameLoop() {// это для того чтобы мяч двигался с игроком
        ball.update();
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
});