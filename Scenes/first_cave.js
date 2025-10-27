import { Player } from '../Entities/player.js';
import { Ball } from '../Entities/ball.js';
import { Cave } from '../Entities/cave.js';
import { Wall } from '../Entities/invisible_wall.js';
import { Light } from '../Entities/light.js';
import { Floor } from '../Entities/floor.js';
import { Exit } from '../Entities/exit.js';
import { DefaultEntity } from '../Entities/default_entity.js';//Вот базовый объект для модельки
document.addEventListener('DOMContentLoaded', function () {
    var scene = document.querySelector("a-scene")

    const player = new Player(0, 1.6, 5);
    const cave = new Cave(0, 1, 0, 0.8, "cave1/our_cave.gltf")
    scene.appendChild(cave.getEntity());
    scene.appendChild(player.getEntity());
    const leftwall = new Wall(15, 0, 0, 100, 1000, 90);
    const rightwall = new Wall(-15, 0, 0, 100, 1000, 90);
    const backwall1 = new Wall(0, 15, 0, 100, 1000, 0);
    const backwall2 = new Wall(0, -15, 0, 100, 1000, 0);
    const column = new Wall(6, 6, 0, 6, 100, 0);
    const floor = new Floor(0, -4, 0, 0, 1000, 100)
    const exit = new Exit(0, 0, -14, 20, 20, 20, "./second_scene.html");
    scene.appendChild(leftwall.getEntity());
    scene.appendChild(rightwall.getEntity());
    scene.appendChild(backwall1.getEntity());
    scene.appendChild(backwall2.getEntity());
    scene.appendChild(floor.getEntity())
    scene.appendChild(column.getEntity())
    scene.appendChild(exit.getEntity())
    const ball = new Ball(9, -1.5, 9, 0.7);
    scene.appendChild(ball.getEntity());
    var ambient = new Audio('./music/ambient.mp3');

    // Доп. декор — мягкие куртины у колонны, у выходов и в дальних углах
    var fc_f1 = new DefaultEntity(6,  -1,  6,  4, "lady_fern/wdvlditia_tier_2.gltf", 0,  45, 0); scene.appendChild(fc_f1.getEntity());

    var fc_m2 = new DefaultEntity(-8, -2, -6, 6, "bolete_mushrooms2/qdzrT_tier_2.gltf", 0, 15, 0); scene.appendChild(fc_m2.getEntity());
    var fc_f2 = new DefaultEntity(-10,-2,  4, 4, "lady_fern/wdvlditia_tier_2.gltf", 0, -10, 0); scene.appendChild(fc_f2.getEntity());

    var fc_m3 = new DefaultEntity(0,  -2.2, -12, 8, "bolete_mushrooms/Bolete_Mushrooms_pdvcB_Mid.gltf", 0, 0, 0); scene.appendChild(fc_m3.getEntity());
    var fc_f3 = new DefaultEntity(3,  -2, -13, 4, "lady_fern/wdvlditia_tier_2.gltf", 0, 10, 0); scene.appendChild(fc_f3.getEntity());

    // Камни по углам
    var fc_r1 = new DefaultEntity(-13, -1, -13, 2, "rock1/xfpjeie_tier_2.gltf", 0, 25, 0); scene.appendChild(fc_r1.getEntity());
    var fc_r2 = new DefaultEntity( 13, -1, -13, 2, "rock1/xfpjeie_tier_2.gltf", 0,-10, 0); scene.appendChild(fc_r2.getEntity());
    var fc_r3 = new DefaultEntity(-13, -1,  13, 3, "rock1/xfpjeie_tier_2.gltf", 0, 40, 0); scene.appendChild(fc_r3.getEntity());
    var fc_r4 = new DefaultEntity( 13, -1,  13, 3, "rock1/xfpjeie_tier_2.gltf", 0,  5, 0); scene.appendChild(fc_r4.getEntity());



    function gameLoop() {// это для того чтобы мяч двигался с игроком
        ambient.play();
        ball.update();
        if (ball.isPicked) {
            exit.isOpen = true;
        }
        exit.checkExit()
        requestAnimationFrame(gameLoop);
    }
    gameLoop();
});