export class Exit {
    constructor(x, y, z, width, height, depth, exit_page) {
        this.entity = document.createElement('a-box');
        this.isOpen = false;
        this.exit_page = exit_page;
        this.teleportPosition = { x: 0, z: 0 };
        this.playerTouching = false; // Флаг касания игрока
        this.setupExit(x, y, z, width, height, depth);
    }

    setupExit(x, y, z, width, height, depth) {
        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        this.entity.setAttribute('class', "exit");
        this.entity.setAttribute('width', `${width}`);
        this.entity.setAttribute('depth', `${depth}`);
        this.entity.setAttribute('height', `${height}`);
        this.entity.setAttribute('color', "yellow");
        this.entity.setAttribute("visible", false)
    }

    getEntity() {
        return this.entity;
    }

    // Функция проверки и телепортации
    exit() {
        // Находим камеру
        const camera = document.querySelector('a-camera');
        if (!camera) return false;

        // Получаем позицию камеры
        const cameraPos = camera.getAttribute('position');

        // Получаем позицию и размеры выхода
        const exitPos = this.entity.getAttribute('position');
        const exitWidth = parseFloat(this.entity.getAttribute('width'));
        const exitDepth = parseFloat(this.entity.getAttribute('depth'));
        const exitHeight = parseFloat(this.entity.getAttribute('height'));

        // Проверяем, находится ли камера внутри выхода
        const isInsideExit =
            cameraPos.x >= exitPos.x - exitWidth / 2 &&
            cameraPos.x <= exitPos.x + exitWidth / 2 &&
            cameraPos.z >= exitPos.z - exitDepth / 2 &&
            cameraPos.z <= exitPos.z + exitDepth / 2 &&
            cameraPos.y >= exitPos.y - exitHeight / 2 &&
            cameraPos.y <= exitPos.y + exitHeight / 2;

        // Если камера внутри и выход открыт - телепортируем
        if (isInsideExit && this.isOpen) {
            document.location.href = this.exit_page;
            //camera.setAttribute('position', {
            //    x: this.teleportPosition.x,
            //    y: cameraPos.y, // сохраняем высоту камеры
            //    z: this.teleportPosition.z
            //});
            return true;
        }

        return false;
    }

    // Дополнительный метод для непрерывной проверки (можно вызывать в игровом цикле)
    checkExit() {
        return this.exit();
    }
}