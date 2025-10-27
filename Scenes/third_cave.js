import { Player } from '../Entities/player.js';
import { Ball } from '../Entities/ball.js';
import { Cave } from '../Entities/cave.js';
import { Wall } from '../Entities/invisible_wall.js';
import { Stalagmite } from '../Entities/stalagmite.js';
import { Light } from '../Entities/light.js';
import { Floor } from '../Entities/floor.js';
import { Exit } from '../Entities/exit.js';
document.addEventListener('DOMContentLoaded', function () {
    var scene = document.querySelector("a-scene")
    const player = new Player(0, 1.6, 9);
    const cave = new Cave(0, 10, -30, 0.3, "cave3/cave3.gltf")
    const leftwall = new Wall(-15, -25, 0, 80, 1000, 90);
    const rightwall = new Wall(0, -50, 0, 80, 1000, 0);
    const backwall1 = new Wall(35, -25, 0, 80, 1000, 90);
    const backwall2 = new Wall(0, 15, 0, 80, 1000, 0);
    const dop_wall1 = new Wall(-9, 11, 0, 10, 1000, 0)
    const dop_wall2 = new Wall(27, 1, 0, 10, 1000, 0)
    const dop_wall3 = new Wall(21, 9, 0, 10, 1000, 90)
    var stalagmites=[
        new Stalagmite(0, 50, -30, 0.1),
        new Stalagmite(20, 50, -10, 0.1),
        new Stalagmite(-5, 50, -5, 0.1),
    ]
    const floor = new Floor(0, -6, 0, 0, 100, 100)
    var light1 = new Light(0, 70, 20, "rgba(255, 255, 255, 1)", 5)
    var light2 = new Light(0, 70, -20, "rgba(247, 249, 134, 1)", 2)
    const exit = new Exit(5, 0, -40, 30, 20, 20, "http://127.0.0.1:5500/final.html");
    scene.appendChild(exit.getEntity())
    scene.appendChild(cave.getEntity());
    scene.appendChild(player.getEntity());
    scene.append(floor.getEntity())
    for (var i = 0; i<stalagmites.length;i++){
        scene.appendChild(stalagmites[i].getEntity());
    }
    scene.append(light1.getEntity())
    scene.append(light2.getEntity())
    scene.appendChild(leftwall.getEntity());
    scene.appendChild(rightwall.getEntity());
    scene.appendChild(backwall1.getEntity());
    scene.appendChild(backwall2.getEntity());
    scene.append(dop_wall1.getEntity())
    scene.append(dop_wall2.getEntity())
    scene.append(dop_wall3.getEntity())
    const ball = new Ball(0, -1.5, 0, 0.7, -6);
    scene.appendChild(ball.getEntity());
    var x_limit = [-20, 55]
    var z_limit = [-7, 11]
    function gameLoop() {// это для того чтобы мяч двигался с игроком
        if (ball.isPicked) {
            exit.isOpen = true;
        }
        
        for (var i = 0; i<stalagmites.length;i++){
            if (stalagmites[i].fell){
                var st_pos=stalagmites[i].getEntity().getAttribute('position')
                var pl_pos = player.getEntity().getAttribute('position')
                if (Math.sqrt(Math.pow(st_pos.x-pl_pos.x,2)+Math.pow(st_pos.z-pl_pos.z,2))<10 && st_pos.y!=0){
                    stalagmites[i].fall()
                }
            }
        }
        ball.update();
        requestAnimationFrame(gameLoop);
        exit.checkExit()
    }
    gameLoop()
});