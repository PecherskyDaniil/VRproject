export class Lift {
    constructor(x, y, z, width, height, depth, lift_step) {
        this.entity = document.createElement('a-box');
        this.lift_step = lift_step;
        this.playerTouching = false; // Флаг касания игрока
        this.setupLift(x, y, z, width, height, depth);
    }

    setupLift(x, y, z, width, height, depth) {
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        //this.entity.setAttribute('class', "exit");
        this.entity.setAttribute('width', `${width}`);
        this.entity.setAttribute('depth', `${depth}`);
        this.entity.setAttribute('height', `${height}`);
        this.entity.setAttribute('color', "white");
        this.entity.setAttribute("visible", false)
    }

    getEntity() {
        return this.entity;
    }

    // Функция проверки и телепортации
    lift() {
        // Находим камеру
        const camera = document.querySelector('a-camera');
        if (!camera) return false;

        // Получаем позицию камеры
        const cameraPos = camera.getAttribute('position');

        // Получаем позицию и размеры выхода
        const liftPos = this.entity.getAttribute('position');
        const liftWidth = parseFloat(this.entity.getAttribute('width'));
        const liftDepth = parseFloat(this.entity.getAttribute('depth'));
        const liftHeight = parseFloat(this.entity.getAttribute('height'));

        // Проверяем, находится ли камера внутри выхода
        const isInsideLift =
            cameraPos.x >= liftPos.x - liftWidth / 2 &&
            cameraPos.x <= liftPos.x + liftWidth / 2 &&
            cameraPos.z >= liftPos.z - liftDepth / 2 &&
            cameraPos.z <= liftPos.z + liftDepth / 2 &&
            cameraPos.y >= liftPos.y - liftHeight / 2 &&
            cameraPos.y <= liftPos.y + liftHeight / 2;

        // Если камера внутри и выход открыт - телепортируем
        if (isInsideLift) {
            camera.setAttribute('position', {
                x: cameraPos.x,
                y: cameraPos.y + this.lift_step, // сохраняем высоту камеры
                z: cameraPos.z
            });
            return true;
        }

        return false;
    }

    // Дополнительный метод для непрерывной проверки (можно вызывать в игровом цикле)
    checkLift() {
        return this.lift();
    }
}