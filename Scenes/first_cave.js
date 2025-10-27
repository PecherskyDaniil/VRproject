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

    //ВОт тут добавляем модель
    var che_to = new DefaultEntity(2, -1, 2, 1, "lever/leverbase.gltf", 0, 0, 0)// Задаем координаты, размер, путь к модельке и углы поворота
    scene.appendChild(che_to.getEntity())//Добавляем модель на сцену


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