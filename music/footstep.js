AFRAME.registerComponent('footstep-sound', {
    schema: {
        sound: { type: 'selector' },
        stepDistance: { type: 'number', default: 5 },
        lastPosition: { type: 'vec3' }
    },

    init: function () {
        // Сохраняем начальную позицию
        this.lastPosition = new THREE.Vector3();
        this.lastPosition.copy(this.el.object3D.position);

        // Инициализируем пройденное расстояние
        this.distanceTraveled = 0;

        // Убедимся, что звук загружен и готов
        this.data.sound.volume = 0.5; // Настройка громкости
    },

    tick: function () {
        // Получаем текущую позицию камеры
        const currentPosition = this.el.object3D.position;

        // Вычисляем расстояние, пройденное с последнего кадра
        const distanceSinceLastFrame = this.lastPosition.distanceTo(currentPosition);
        this.distanceTraveled += distanceSinceLastFrame;

        // Если пройдено достаточно расстояния, воспроизводим звук шага
        if (this.distanceTraveled >= 5) {
            this.playFootstep();
            this.distanceTraveled = 0; // Сбрасываем счетчик
        }

        // Обновляем последнюю известную позицию
        this.lastPosition.copy(currentPosition);
    },

    playFootstep: function () {
        // Останавливаем звук, если он уже играет, и начинаем заново
        this.data.sound.pause();
        this.data.sound.currentTime = 0;
        this.data.sound.play();
    }
});