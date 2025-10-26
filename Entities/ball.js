export class Ball {
    constructor(x, y, z, scale, groundLevel = -2) { //x,y,z позиция scale размер и ground level - высота "пола"
        this.entity = document.createElement('a-entity');
        this.setupBall(x, y, z, scale);

        // Initialize ball state
        this.isPicked = false;
        this.chargeStrength = 0;
        this.maxChargeStrength = 15;
        this.chargeRate = 0.1;

        // Physics properties
        this.velocity = new THREE.Vector3(0, 0, 0);
        this.gravity = -9.8;
        this.isFlying = false;

        // Ground level for collision detection
        this.groundLevel = groundLevel;

        // References
        this.player = null;
        this.camera = null;
        this.throwDirection = new THREE.Vector3(0, 0, -1);
        this.originalPosition = new THREE.Vector3(x, y, z);
        this.allFloor = this.findAllFloor()
        this.allWall = this.findAllWall()
        this.allBD = this.findAllBallDestroyers()

        // Hold position relative to camera
        this.holdDistance = 2;
        this.holdHeight = -0.5;

        // Set up event listeners
        this.initEventListeners();

        // Start physics loop
        this.startPhysics();
    }

    setupBall(x, y, z, scale) {
        let assets = document.querySelector("a-assets");
        if (assets == null) {
            assets = document.createElement('a-assets');
            document.querySelector("a-scene").appendChild(assets);
        }

        // Add model to assets if not already present
        if (!document.querySelector('#ball-model')) {
            assets.innerHTML += `
                <a-asset-item id="ball-model" src="Models/ball/ball.gltf"></a-asset-item>
            `;
        }

        this.entity.setAttribute('position', `${x} ${y} ${z}`);
        this.entity.setAttribute('gltf-model', '#ball-model');
        this.entity.setAttribute('scale', `${scale} ${scale} ${scale}`);
        // Add collision component for interaction
        this.entity.setAttribute('class', 'interactive');
    }

    getEntity() {
        return this.entity;
    }
    //Дальше идет ЖОСКИЙ ВАЙБ КОД, можно поменять или забить
    initEventListeners() {
        // Event for picking up the ball
        this.entity.addEventListener('mousedown', (e) => {
            if (!this.isPicked && !this.isFlying) {
                this.pickUp();
            }
        });

        // Event for charging throw
        document.addEventListener('keydown', (e) => {
            if (this.isPicked && e.code === 'Space') {
                this.startCharging();
            }
        });

        // Event for releasing throw
        document.addEventListener('keyup', (e) => {
            if (this.isPicked && e.code === 'Space') {
                this.throw();
            }
        });


    }

    startPhysics() {
        const updatePhysics = () => {
            if (this.isFlying) {
                this.updateFlight();
            }
            requestAnimationFrame(updatePhysics);
        };
        updatePhysics();
    }

    pickUp() {
        // Find player camera
        this.camera = document.querySelector('a-camera');
        this.player = document.querySelector('a-camera');

        if (this.camera) {
            this.isPicked = true;
            this.isFlying = false;
            this.velocity.set(0, 0, 0);

            console.log('Ball picked up');
        }
    }

    startCharging() {
        if (!this.isPicked) return;

        const chargeInterval = setInterval(() => {
            if (this.isPicked && this.chargeStrength < this.maxChargeStrength) {
                this.chargeStrength += this.chargeRate;

                // Visual feedback for charging (scale effect)
                const scale = 1 + (this.chargeStrength / this.maxChargeStrength) * 0.3;
                this.entity.setAttribute('scale', `${scale} ${scale} ${scale}`);

                console.log(`Charging: ${this.chargeStrength.toFixed(2)}`);
            } else {
                clearInterval(chargeInterval);
            }
        }, 50);

        // Store interval reference to clear if needed
        this.chargeInterval = chargeInterval;
    }

    throw() {
        if (!this.isPicked || this.chargeStrength === 0) return;

        // Clear charging interval
        if (this.chargeInterval) {
            clearInterval(this.chargeInterval);
        }

        // Get current camera position and rotation
        const cameraWorldPos = new THREE.Vector3();
        const cameraWorldQuat = new THREE.Quaternion();

        this.camera.object3D.getWorldPosition(cameraWorldPos);
        this.camera.object3D.getWorldQuaternion(cameraWorldQuat);

        // Calculate throw direction based on camera rotation
        this.throwDirection.set(0, 0, -1);
        this.throwDirection.applyQuaternion(cameraWorldQuat);

        // Set initial velocity based on charge strength
        const throwPower = this.chargeStrength * 2;
        this.velocity.copy(this.throwDirection).multiplyScalar(throwPower);

        // Reset scale
        this.entity.setAttribute('scale', '1 1 1');

        // Reset rotation when thrown (optional - can remove if you want to keep rotation)
        this.entity.object3D.rotation.set(0, 0, 0);

        // Update state
        this.isPicked = false;
        this.isFlying = true;

        console.log(`Ball thrown with power: ${throwPower}`);

        // Reset charge
        this.chargeStrength = 0;
    }

    updateFlight() {
        //console.log(this.isColliding)
        if (!this.isFlying) return;

        const currentPos = this.entity.getAttribute('position');
        const newPos = {
            x: currentPos.x + this.velocity.x * 0.016,
            y: currentPos.y + this.velocity.y * 0.016,
            z: currentPos.z + this.velocity.z * 0.016
        };

        // Apply gravity
        this.velocity.y += this.gravity * 0.016;

        // Update position
        this.entity.setAttribute('position', newPos);

        // Add rotation during flight for visual effect
        if (this.isFlying) {
            const currentRotation = this.entity.object3D.rotation;
            this.entity.object3D.rotation.x += this.velocity.x * 0.1;
            this.entity.object3D.rotation.z += this.velocity.z * 0.1;
        }

        // Check for ground collision using configurable ground level
        if (this.isOnFloor()) {
            console.log(newPos)
            this.land();
        }
        if (this.isOnWall()) {
            console.log(newPos)

            this.velocity.x = 0;
            this.velocity.z = 0;
        }
        if (this.isOnBallDestroyer()) {
            console.log(newPos)
            this.land()
            this.pickUp()
        }

        // Simple boundary checking
        const maxDistance = 1000000;
        if (Math.abs(newPos.x) > maxDistance || Math.abs(newPos.z) > maxDistance) {
            this.resetBall();
        }
    }

    land() {
        this.isFlying = false;
        this.velocity.set(0, 0, 0);
        // Set on ground using the configured ground level
        const currentPos = this.entity.getAttribute('position');
        this.entity.setAttribute('position', {
            x: currentPos.x,
            y: currentPos.y,
            z: currentPos.z
        });
        // Reset rotation when landed
        this.entity.object3D.rotation.set(0, 0, 0);

        console.log('Ball landed at ground level:', this.groundLevel);
    }

    resetBall() {
        this.isPicked = false;
        this.isFlying = false;
        this.chargeStrength = 0;
        this.velocity.set(0, 0, 0);

        // Reset to original position
        this.entity.setAttribute('position', this.originalPosition);

        // Reset scale and rotation
        this.entity.setAttribute('scale', '1 1 1');
        this.entity.object3D.rotation.set(0, 0, 0);

        console.log('Ball reset to original position');
    }

    // Update ball position to follow camera when held
    updateHeldPosition() {
        if (this.isPicked && this.camera && !this.isFlying) {
            const cameraWorldPos = new THREE.Vector3();
            const cameraWorldQuat = new THREE.Quaternion();

            // Get camera world position and rotation
            this.camera.object3D.getWorldPosition(cameraWorldPos);
            this.camera.object3D.getWorldQuaternion(cameraWorldQuat);

            // Calculate position in front of camera
            const offset = new THREE.Vector3(0, this.holdHeight, -this.holdDistance);
            offset.applyQuaternion(cameraWorldQuat);

            const holdPos = new THREE.Vector3(
                cameraWorldPos.x + offset.x,
                cameraWorldPos.y + offset.y,
                cameraWorldPos.z + offset.z
            );

            // Update ball position
            this.entity.setAttribute('position', {
                x: holdPos.x,
                y: holdPos.y,
                z: holdPos.z
            });

            // Apply camera rotation to ball with proper quaternion conversion
            const ballRotation = new THREE.Euler();
            ballRotation.setFromQuaternion(cameraWorldQuat);

            // Convert to degrees for A-Frame
            const degreesRotation = {
                x: THREE.MathUtils.radToDeg(ballRotation.x),
                y: THREE.MathUtils.radToDeg(ballRotation.y),
                z: THREE.MathUtils.radToDeg(ballRotation.z)
            };

            this.entity.setAttribute('rotation', degreesRotation);
        }
    }
    findAllFloor() {
        return document.querySelectorAll(".floor");
    }
    findAllWall() {
        return document.querySelectorAll(".collision.wall");
    }
    findAllBallDestroyers() {
        return document.querySelectorAll(".balldestroyer");
    }
    // Alternative method using look-at component for simpler rotation
    updateHeldPositionSimple() {
        if (this.isPicked && this.camera && !this.isFlying) {
            const cameraWorldPos = new THREE.Vector3();
            const cameraWorldQuat = new THREE.Quaternion();

            // Get camera world position and rotation
            this.camera.object3D.getWorldPosition(cameraWorldPos);
            this.camera.object3D.getWorldQuaternion(cameraWorldQuat);

            // Calculate position in front of camera
            const offset = new THREE.Vector3(0, this.holdHeight, -this.holdDistance);
            offset.applyQuaternion(cameraWorldQuat);

            const holdPos = new THREE.Vector3(
                cameraWorldPos.x + offset.x,
                cameraWorldPos.y + offset.y,
                cameraWorldPos.z + offset.z
            );

            // Update ball position
            this.entity.setAttribute('position', {
                x: holdPos.x,
                y: holdPos.y,
                z: holdPos.z
            });

            // Simple rotation - make ball face the same general direction as camera
            const cameraRotation = this.camera.getAttribute('rotation') || { x: 0, y: 0, z: 0 };
            this.entity.setAttribute('rotation', {
                x: cameraRotation.x,
                y: cameraRotation.y,
                z: cameraRotation.z
            });
        }
    }

    // Call this in your main game loop to update held ball position
    update() {
        if (this.isPicked && !this.isFlying) {
            this.updateHeldPositionSimple(); // Используем упрощенный метод для надежности
        }
    }

    // Utility method to force drop the ball
    drop() {
        if (this.isPicked) {
            if (this.chargeInterval) {
                clearInterval(this.chargeInterval);
            }

            this.isPicked = false;
            this.chargeStrength = 0;
            this.entity.setAttribute('scale', '1 1 1');
            this.entity.object3D.rotation.set(0, 0, 0);
        }
    }
    isOnFloor() {
        for (var i = 0; i < this.allFloor.length; i++) {
            if (this.checkSphereBoxCollision(this.entity, this.allFloor[i])) {
                return true
            }
        }
        return false
    }
    isOnWall() {
        for (var i = 0; i < this.allWall.length; i++) {
            if (this.checkSphereBoxCollision(this.entity, this.allWall[i])) {
                return true
            }
        }
        return false
    }
    isOnBallDestroyer() {
        for (var i = 0; i < this.allBD.length; i++) {
            if (this.checkSphereBoxCollision(this.entity, this.allBD[i])) {
                return true
            }
        }
        return false
    }
    whichFloor() {
        for (var i = 0; i < this.allFloor.length; i++) {
            if (this.checkSphereBoxCollision(this.entity, this.allFloor[i])) {
                return this.allFloor[i]
            }
        }
    }
    checkSphereBoxCollision(sphere, box) {
        // Получаем компоненты позиции и масштаба
        const spherePos = sphere.object3D.getWorldPosition(new THREE.Vector3());
        const sphereRadius = sphere.getAttribute('radius') || 0.5;
        const sphereScale = sphere.object3D.getWorldScale(new THREE.Vector3());
        const actualSphereRadius = sphereRadius * Math.max(sphereScale.x, sphereScale.y, sphereScale.z);

        const boxPos = box.object3D.getWorldPosition(new THREE.Vector3());
        const boxScale = box.object3D.getWorldScale(new THREE.Vector3());
        const boxSize = box.getAttribute('geometry')?.width ?
            new THREE.Vector3(
                box.getAttribute('geometry').width * boxScale.x,
                box.getAttribute('geometry').height * boxScale.y,
                box.getAttribute('geometry').depth * boxScale.z
            ) : new THREE.Vector3(1 * boxScale.x, 1 * boxScale.y, 1 * boxScale.z);

        // Получаем матрицу вращения коробки
        const boxMatrix = new THREE.Matrix4();
        boxMatrix.extractRotation(box.object3D.matrixWorld);

        // Преобразуем позицию сферы в локальное пространство коробки
        const localSpherePos = spherePos.clone().sub(boxPos);
        localSpherePos.applyMatrix4(new THREE.Matrix4().copy(boxMatrix).invert());

        // Находим ближайшую точку на коробке к сфере
        const closestPoint = new THREE.Vector3();
        closestPoint.x = Math.max(-boxSize.x / 2, Math.min(localSpherePos.x, boxSize.x / 2));
        closestPoint.y = Math.max(-boxSize.y / 2, Math.min(localSpherePos.y, boxSize.y / 2));
        closestPoint.z = Math.max(-boxSize.z / 2, Math.min(localSpherePos.z, boxSize.z / 2));

        // Преобразуем обратно в мировые координаты
        closestPoint.applyMatrix4(boxMatrix);
        closestPoint.add(boxPos);

        // Вычисляем расстояние между сферой и ближайшей точкой
        const distance = spherePos.distanceTo(closestPoint);

        return distance <= actualSphereRadius;
    }
}