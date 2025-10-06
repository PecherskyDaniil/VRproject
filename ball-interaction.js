
const ball = document.getElementById('kidball');
//Изначально мяч не подобран
ball.setAttribute("picked", false);
const camera = document.querySelector('[camera]');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-bar-fill');
      
let progress = 0;
const duration = 2000; // 2 секунды
let hovering = false;
let animationId = null;

window.addEventListener('mousemove', (e) => {
    progressBar.style.left = e.clientX + 'px';
    progressBar.style.top = e.clientY + 'px';
});

ball.addEventListener('mouseenter', () => {
    if (ball.setAttribute("picked")) return; 
    hovering = true;
        progress = 0;
        progressFill.style.width = '0%';
        progressBar.style.display = 'block';
    if (!animationId) animationId = requestAnimationFrame(progressLoop);
});

ball.addEventListener('mouseleave', () => {
    if (ball.getAttribute("picked")) return;
    hovering = false;
    progress = 0;
    progressFill.style.width = '0%';
    progressBar.style.display = 'none';
    if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = null;
    }
});

let lastTimestamp = null;
function progressLoop(timestamp) {
    if (!lastTimestamp) lastTimestamp = timestamp;
    const delta = timestamp - lastTimestamp;
    lastTimestamp = timestamp;

    if (hovering) {
        progress += delta;
        const pct = Math.min(progress / duration, 1);
        progressFill.style.width = (pct * 100) + '%';

        if (pct >= 1) {
            fixballToCamera();
            hovering = false;
            progressBar.style.display = 'none';
            animationId = null;
            ball.setAttribute("picked", true);
            return;
          }
        animationId = requestAnimationFrame(progressLoop);
    }
}

function fixballToCamera() {
    // Получаем позицию и направление камеры
    const camWorldPos = new THREE.Vector3();
    camera.object3D.getWorldPosition(camWorldPos);
    const camDir = new THREE.Vector3();
    camera.object3D.getWorldDirection(camDir);

    // Вычисляем позицию мяча: 1 метр вперед и 0.5 м ниже камеры
    const targetPos = camWorldPos.clone().add(camDir.multiplyScalar(1)).add(new THREE.Vector3(0, -0.5, 0));

    // Перемещаем мяч к targetPos с анимацией
    const startPos = ball.object3D.position.clone();
    const durationAnim = 1000;
    let startTime = null;

    function animateMove(time) {
        if (!startTime) startTime = time;
        let elapsed = time - startTime;
        let t = Math.min(elapsed / durationAnim, 1);

        ball.object3D.position.lerpVectors(startPos, targetPos, t);

        if (t < 1) {
        requestAnimationFrame(animateMove);
        } else {
        // После анимации делаем мяч дочерним объектом камеры и фиксируем позицию
            camera.object3D.attach(ball.object3D);
            ball.object3D.position.set(0, -0.5, -1); // относительная позиция к камере
        }
    }
    requestAnimationFrame(animateMove);
    //Отметить что мяч подобран
}