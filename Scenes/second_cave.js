import { Player } from '../Entities/player.js';
import { Ball } from '../Entities/ball.js';
import { Cave } from '../Entities/cave.js';
import { Wall } from '../Entities/invisible_wall.js';
import { Light } from '../Entities/light.js';
import { Floor } from '../Entities/floor.js';
import { BallDestroyer } from '../Entities/ball_destroyer.js';
import { Exit } from '../Entities/exit.js';
document.addEventListener('DOMContentLoaded', function () {
    var scene = document.querySelector("a-scene")
    const player = new Player(0, 1.6, 5);

    const cave = new Cave(10, 18, 30, 0.6, "cave2/cave2.gltf")

    scene.appendChild(cave.getEntity());
    scene.appendChild(player.getEntity());
    const leftwall = new Wall(55, 40, 0, 150, 1000, 90);
    const rightwall = new Wall(-20, 40, 0, 150, 1000, 90);
    const backwall1 = new Wall(10, -18, 0, 100, 1000, 0);
    const backwall2 = new Wall(0, 100, 0, 100, 1000, 0);
    const downwall1 = new Wall(0, 62, -32, 120, 50, 0);
    const downwall2 = new Wall(0, 11, -30, 120, 50, 0);
    const ball_destroyer = new BallDestroyer(0, -40, 30, 150, 50, 50)
    const exit = new Exit(20, 0, 90, 50, 20, 20, "http://127.0.0.1:5500/third_scene.html");
    scene.appendChild(exit.getEntity())
    scene.appendChild(ball_destroyer.getEntity())
    scene.appendChild(leftwall.getEntity());
    scene.appendChild(rightwall.getEntity());
    scene.appendChild(backwall1.getEntity());
    scene.appendChild(backwall2.getEntity());
    scene.appendChild(downwall1.getEntity());
    scene.appendChild(downwall2.getEntity());
    const floor1 = new Floor(0, -6, -2, 0, 120, 30)
    const floor2 = new Floor(0, 0, 90, -15, 120, 60)
    scene.appendChild(floor1.getEntity());
    scene.appendChild(floor2.getEntity());
    var x_limit = [-20, 55]
    var z_limit = [-7, 11]
    const ball = new Ball(0, -1.5, 0, 0.7, -6);
    scene.appendChild(ball.getEntity());
    console.log(exit.getEntity().getAttribute('position'))
    console.log(player.getEntity().getAttribute('position'))
    function gameLoop() {// это для того чтобы мяч двигался с игроком

        if (ball.isPicked) {
            exit.isOpen = true;
        }
        ball.update();
        requestAnimationFrame(gameLoop);
        exit.checkExit()
        //player.limitMovement(x_limit, z_limit);
    }
    gameLoop()
});