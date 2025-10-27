import { Player } from '../Entities/player.js';
import { Ball } from '../Entities/ball.js';
import { Cave } from '../Entities/cave.js';
import { Wall } from '../Entities/invisible_wall.js';
import { Light } from '../Entities/light.js';
import { Bridge } from '../Entities/bridge.js';
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
    const barier1 = new Wall(50, 36, 0, 25, 120, 0, false, 48);
    const barier2 = new Wall(-5, 36, 0, 35, 120, 0, false, 48);
    const barier3 = new Wall(25, 36, 0, 25, 120, 0, false, 48);
    const bridge = new Bridge(25, 60, 20, 10, 60)
    const ball_destroyer = new BallDestroyer(0, -40, 30, 150, 60, 60)
    const exit = new Exit(20, 0, 90, 50, 20, 20, "./third_scene.html");
    scene.appendChild(exit.getEntity())
    scene.appendChild(ball_destroyer.getEntity())
    scene.appendChild(leftwall.getEntity());
    scene.appendChild(rightwall.getEntity());
    scene.appendChild(backwall1.getEntity());
    scene.appendChild(backwall2.getEntity());
    scene.appendChild(downwall1.getEntity());
    scene.appendChild(downwall2.getEntity());
    scene.appendChild(barier1.getEntity());
    scene.appendChild(barier2.getEntity());
    scene.appendChild(barier3.getEntity());
    const floor1 = new Floor(0, -6, -2, 0, 120, 30)
    const floor2 = new Floor(0, 0, 90, -15, 120, 60)
    const floor3 = new Floor(25, -8, 40, 0, 20, 60)
    scene.appendChild(floor1.getEntity());
    scene.appendChild(floor2.getEntity());
    var x_limit = [-20, 55]
    var z_limit = [-7, 11]
    const ball = new Ball(0, -1.5, 0, 0.7, -6);
    scene.appendChild(ball.getEntity());
    scene.appendChild(bridge.getEntity())
    console.log(exit.getEntity().getAttribute('position'))
    console.log(player.getEntity().getAttribute('position'))
    var start = false;
    var floor_added = false
    var ambient = new Audio('./music/ambient.mp3');
    function gameLoop() {// это для того чтобы мяч двигался с игроком
        ambient.play();
        if (ball.isPicked) {
            exit.isOpen = true;
            start = true;
        }
        if (ball.checkSphereBoxCollision(ball.entity, bridge.entity) && start && !floor_added) {
            ball.pickUp()
            floor_added = true
            scene.appendChild(floor3.getEntity());
            scene.appendChild(barier3.getEntity());
            ball.allFloor = ball.findAllFloor()
            bridge.raise()
        }
        ball.update();
        requestAnimationFrame(gameLoop);
        exit.checkExit()
        //player.limitMovement(x_limit, z_limit);
    }
    gameLoop()
});