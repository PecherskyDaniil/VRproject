import { Player } from '../Entities/player.js';
import { Ball } from '../Entities/ball.js';
import { Cave } from '../Entities/cave.js';
import { Wall } from '../Entities/invisible_wall.js';
import { Stalagmite } from '../Entities/stalagmite.js';
import { Light } from '../Entities/light.js';
import { Floor } from '../Entities/floor.js';
import { Exit } from '../Entities/exit.js';
import { Lift } from '../Entities/lift.js';
import { Rope } from '../Entities/rope.js';
import { DefaultEntity } from '../Entities/default_entity.js';


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
    var stalagmites = [
        new Stalagmite(0, 50, -30, 0.1),
        new Stalagmite(20, 50, -10, 0.1),
        new Stalagmite(-5, 50, -5, 0.1),
    ]
    const floor = new Floor(0, -6, 0, 0, 100, 100)
    var light1 = new Light(0, 70, 20, "rgba(255, 255, 255, 1)", 5)
    var light2 = new Light(0, 70, -20, "rgba(247, 249, 134, 1)", 2)
    const exit = new Exit(5, 30, -40, 40, 20, 40, "./final.html");
    const lift = new Lift(5, 0, -40, 4, 60, 4, 0.2);
    const rope = new Rope(5, 10, -46, 0.4);
    scene.appendChild(rope.getEntity());
    scene.appendChild(lift.getEntity());
    scene.appendChild(exit.getEntity())
    scene.appendChild(cave.getEntity());
    scene.appendChild(player.getEntity());
    scene.append(floor.getEntity())
    for (var i = 0; i < stalagmites.length; i++) {
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
    var ambient = new Audio('./music/ambient.mp3');

    // Декор: у входа, возле сталактитов и вокруг лифта
    // Входная полянка
    var tc_m1 = new DefaultEntity(-6, -5, -3, 5, "bolete_mushrooms/Bolete_Mushrooms_pdvcB_Mid.gltf", 0, 10, 0); scene.appendChild(tc_m1.getEntity());
    var tc_f1 = new DefaultEntity(-4, -5, -5, 4, "lady_fern/wdvlditia_tier_2.gltf", 0, -5, 0);   scene.appendChild(tc_f1.getEntity());

    // Центральный зал вдоль пути
    var tc_m2 = new DefaultEntity(18, -5, -2, 7, "bolete_mushrooms2/qdzrT_tier_2.gltf", 0, 20, 0); scene.appendChild(tc_m2.getEntity());
    var tc_f2 = new DefaultEntity(24, -5, -8, 4, "lady_fern/wdvlditia_tier_2.gltf", 0, 30, 0);    scene.appendChild(tc_f2.getEntity());

    // Район лифта и верёвки
    var tc_f3 = new DefaultEntity(5,  -6, -36, 4, "lady_fern/wdvlditia_tier_2.gltf", 0, 0, 0);    scene.appendChild(tc_f3.getEntity());
    var tc_m3 = new DefaultEntity(7,  -6, -38, 6, "bolete_mushrooms/Bolete_Mushrooms_pdvcB_Mid.gltf", 0, -15, 0); scene.appendChild(tc_m3.getEntity());
    var tc_m4 = new DefaultEntity(3,  -7, -42, 8, "bolete_mushrooms2/qdzrT_tier_2.gltf", 0, 10, 0); scene.appendChild(tc_m4.getEntity());

    // Между сталагмитами — аккуратные пятна, не мешают триггерам падения
    var tc_m5 = new DefaultEntity(0,  -6, -15, 6, "bolete_mushrooms/Bolete_Mushrooms_pdvcB_Mid.gltf", 0, 0, 0);  scene.appendChild(tc_m5.getEntity());
    var tc_m6 = new DefaultEntity(20, -6, -12, 5, "bolete_mushrooms2/qdzrT_tier_2.gltf", 0, 25, 0); scene.appendChild(tc_m6.getEntity());


    function gameLoop() {// это для того чтобы мяч двигался с игроком
        ambient.play();
        if (ball.isPicked) {
            exit.isOpen = true;
            lift.checkLift();
        }

        for (var i = 0; i < stalagmites.length; i++) {
            if (stalagmites[i].fell) {
                var st_pos = stalagmites[i].getEntity().getAttribute('position')
                var pl_pos = player.getEntity().getAttribute('position')
                if (Math.sqrt(Math.pow(st_pos.x - pl_pos.x, 2) + Math.pow(st_pos.z - pl_pos.z, 2)) < 10 && st_pos.y != 0) {
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