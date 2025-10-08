const ball = document.getElementById('kidball');
if (!ball) {
  console.error("ball-interaction.js: элемент #kidball не найден.");
}
ball.setAttribute("picked", "false"); // по умолчанию не в руках

const camera = document.querySelector('[camera]');
const progressBar = document.getElementById('progress-bar');
const progressFill = document.getElementById('progress-bar-fill');

let hovering = false;
let hoverProgress = 0;
const pickupDuration = 1000; // ms - время наведения для подъёма
let hoverAnimId = null;
let hoverLastTs = 0;

let charging = false;
let chargeStart = 0;
const chargeMaxMs = 1500; // время для максимального заряда
const minThrowStrength = 3.0;
const maxThrowStrength = 16.0;

const physics = {
  gravity: -9.8, // m/s^2
};

const state = {
  flying: false,    // мяч в полёте
  onGround: false,  // мяч остановился на земле и доступен для подъёма
  velocity: new THREE.Vector3(0,0,0),
  lastPhysicsTime: null,
  spin: new THREE.Vector3(0,0,0), // угловая скорость (рад/с) по осям
};

// радиус мяча
const ballRadius = parseFloat(ball.getAttribute('radius')) || 0.2;

// РАБОТА С ПРОГРЕСС-БАРОМ

function showProgressBar() {
  if (progressBar) progressBar.style.display = 'block';
}
function hideProgressBar() {
  if (progressBar) progressBar.style.display = 'none';
}
function setProgressPct(pct) {
  if (progressFill) progressFill.style.width = Math.min(Math.max(pct,0),1) * 100 + '%';
}


ball.addEventListener('mouseenter', () => {
  // Если мяч в руках или в полёте — не запускаем подбор
  if (isPicked() || state.flying) return;
  hovering = true;
  hoverProgress = 0;
  hoverLastTs = 0;
  showProgressBar();
  if (!hoverAnimId) hoverAnimId = requestAnimationFrame(hoverLoop);
});
ball.addEventListener('mouseleave', () => {
  hovering = false;
  hoverProgress = 0;
  hideProgressBar();
  setProgressPct(0);
  if (hoverAnimId) {
    cancelAnimationFrame(hoverAnimId);
    hoverAnimId = null;
    hoverLastTs = 0;
  }
});

function hoverLoop(ts) {
  if (!hoverLastTs) hoverLastTs = ts;
  const dt = ts - hoverLastTs;
  hoverLastTs = ts;
  if (hovering) {
    hoverProgress += dt;
    const pct = Math.min(hoverProgress / pickupDuration, 1);
    setProgressPct(pct);
    if (pct >= 1) {
      // поднимаем мяч
      pickUpBall();
      hovering = false;
      hideProgressBar();
      setProgressPct(0);
      hoverAnimId = null;
      hoverLastTs = 0;
      return;
    }
    hoverAnimId = requestAnimationFrame(hoverLoop);
  } else {
    hoverAnimId = null;
    hoverLastTs = 0;
  }
}

function isPicked() {
  const p = ball.getAttribute("picked");
  return (p === true || p === 'true');
}

function pickUpBall() {
  if (isPicked()) return;
  // Сбросим физику и состояния
  state.flying = false;
  state.onGround = false;
  state.velocity.set(0,0,0);
  state.spin.set(0,0,0);
  ball.setAttribute("picked", "true");

  // Прикрепляем мяч к камере через объект3D
  camera.object3D.attach(ball.object3D);
  // Относительная позиция — чуть ниже и перед камерой
  ball.object3D.position.set(0, -0.5, -1);
  ball.object3D.rotation.set(0,0,0);
}

function fixballToCamera() {
  // анимированный переход мяча к позиции перед камерой (используется при подборе через hover)
  const camWorldPos = new THREE.Vector3();
  camera.object3D.getWorldPosition(camWorldPos);
  const camDir = new THREE.Vector3();
  camera.object3D.getWorldDirection(camDir);

  const targetPos = camWorldPos.clone().add(camDir.multiplyScalar(1)).add(new THREE.Vector3(0, -0.5, 0));
  const startWorldPos = new THREE.Vector3();
  ball.object3D.getWorldPosition(startWorldPos);

  const durationAnim = 300; // ms
  let startTime = null;

  function animateMove(time) {
    if (!startTime) startTime = time;
    const elapsed = time - startTime;
    const t = Math.min(elapsed / durationAnim, 1);
    const currentWorldPos = startWorldPos.clone().lerp(targetPos, t);

    const sceneObj = document.querySelector('a-scene').object3D;
    const localPos = currentWorldPos.clone();
    sceneObj.worldToLocal(localPos);
    ball.object3D.position.copy(localPos);

    if (t < 1) {
      requestAnimationFrame(animateMove);
    } else {
      // закрепляем под камерой
      camera.object3D.attach(ball.object3D);
      ball.object3D.position.set(0, -0.5, -1);
      ball.object3D.rotation.set(0,0,0);
      ball.setAttribute("picked","true");
    }
  }
  requestAnimationFrame(animateMove);
}

function detachToSceneKeepWorldPos() {
  const worldPos = new THREE.Vector3();
  ball.object3D.getWorldPosition(worldPos);

  const sceneObj = document.querySelector('a-scene').object3D;
  sceneObj.attach(ball.object3D); // теперь дочерний сцены
  const localPos = worldPos.clone();
  sceneObj.worldToLocal(localPos);
  ball.object3D.position.copy(localPos);
}

function startCharging() {
  if (!isPicked()) return;
  charging = true;
  chargeStart = performance.now();
  showProgressBar();
  setProgressPct(0);
}

function stopChargingAndThrow() {
  if (!charging) return;
  charging = false;
  hideProgressBar();

  const now = performance.now();
  const elapsed = Math.min(now - chargeStart, chargeMaxMs);
  const t = elapsed / chargeMaxMs;
  const strength = minThrowStrength + (maxThrowStrength - minThrowStrength) * t;

  // Выполняем бросок
  throwBall(strength);

  // Сброс прогресса визуально
  setProgressPct(0);
}

// Слушатели мыши: если мяч в руках — mousedown запускает заряд, mouseup бросок
window.addEventListener('pointerdown', (ev) => {
  // Только левый клик (button 0) используем для заряда/броска
  if (ev.button !== 0) return;
  if (isPicked()) {
    startCharging();
  }
});

window.addEventListener('pointerup', (ev) => {
  if (ev.button !== 0) return;
  if (isPicked() && charging) {
    stopChargingAndThrow();
  }
});

window.addEventListener('click', (ev) => {
  // Если мяч на земле — попробовать подобрать (если близко)
  if (state.onGround && !isPicked()) {
    const camPos = new THREE.Vector3();
    camera.object3D.getWorldPosition(camPos);
    const ballPos = new THREE.Vector3();
    ball.object3D.getWorldPosition(ballPos);
    const dist = camPos.distanceTo(ballPos);
    if (dist < 2.0) {
      // Поднять
      state.onGround = false;
      state.flying = false;
      state.velocity.set(0,0,0);
      state.spin.set(0,0,0);
      fixballToCamera();
    }
  }
});

function throwBall(strength = 6) {
  if (!isPicked()) return;

  // перевести в мировые координаты и отсоединить
  const startWorldPos = new THREE.Vector3();
  ball.object3D.getWorldPosition(startWorldPos);

  // Отсоединяем от камеры (прикрепляем к сцене) и ставим позицию
  detachToSceneKeepWorldPos();

  // Направление вперед по камере
  const dir = new THREE.Vector3(0,0,-1);
  const quat = new THREE.Quaternion();
  camera.object3D.getWorldQuaternion(quat);
  dir.applyQuaternion(quat).normalize();

  // Начальная скорость
  state.velocity.copy(dir.multiplyScalar(strength));
  if (state.velocity.y < 1.2) state.velocity.y = 1.6; // подъёмный импульс

  // чем сильнее бросок — тем более интенсивный спин
  const spinIntensity = Math.min(Math.max((strength - minThrowStrength) / (maxThrowStrength - minThrowStrength), 0), 1);

  state.spin.set(
    (Math.random() - 0.5) * 6.0 * spinIntensity, // rad/s
    (Math.random() - 0.5) * 6.0 * spinIntensity,
    (Math.random() - 0.5) * 6.0 * spinIntensity
  );

  // Установить состояния
  state.flying = true;
  state.onGround = false;
  state.lastPhysicsTime = performance.now();

  // Снять отметку picked
  ball.setAttribute("picked", "false");
}

function physicsStep(now) {
  requestAnimationFrame(physicsStep);

  // Если мы заряжаем — обновляем прогресс-бар как индикатор заряда
  if (charging) {
    const elapsed = Math.min(performance.now() - chargeStart, chargeMaxMs);
    const pct = elapsed / chargeMaxMs;
    setProgressPct(pct);
  }

  if (!state.flying) return;

  if (!state.lastPhysicsTime) state.lastPhysicsTime = now;
  const dt = Math.min((now - state.lastPhysicsTime) / 1000, 0.05); // s, ограничение dt
  state.lastPhysicsTime = now;

  // интеграция скорости под действием гравитации
  state.velocity.y += physics.gravity * dt;

  // позиция в мировых координатах
  const worldPos = new THREE.Vector3();
  ball.object3D.getWorldPosition(worldPos);

  worldPos.x += state.velocity.x * dt;
  worldPos.y += state.velocity.y * dt;
  worldPos.z += state.velocity.z * dt;

  const rot = ball.object3D.rotation;
  rot.x += state.spin.x * dt;
  rot.y += state.spin.y * dt;
  rot.z += state.spin.z * dt;
  ball.object3D.rotation.set(rot.x, rot.y, rot.z);

  // проверка на контакт с землёй
  if (worldPos.y <= ballRadius) {
    // есть контакт
    // если высокая скорость по вертикали — сделать небольшой отскок (bounce)
    const impactSpeed = Math.abs(state.velocity.y);
    const bounceThreshold = 1.0;
    if (impactSpeed > bounceThreshold) {
      // отскок: инвертируем вертикаль и ослабляем
      worldPos.y = ballRadius;
      state.velocity.y = -state.velocity.y * 0.35; // потеря энергии при ударе
      // трение по горизонтали
      state.velocity.x *= 0.6;
      state.velocity.z *= 0.6;
      // уменьшаем спин
      state.spin.multiplyScalar(0.7);
      // если после отскока скорости малы — остановим
      if (Math.abs(state.velocity.y) < 0.8) {
        state.velocity.y = 0;
      }
    } else {
      // стоп: слишком медленно — фиксируем на земле
      worldPos.y = ballRadius;
      state.flying = false;
      state.onGround = true;
      state.velocity.set(0,0,0);
      state.spin.set(0,0,0);
      // убедимся, что мяч не вращается дальше
      ball.object3D.rotation.set(0,0,0);
    }
  }

  // записываем позицию в локальные координаты сцены
  const sceneObj = document.querySelector('a-scene').object3D;
  const localPos = worldPos.clone();
  sceneObj.worldToLocal(localPos);
  ball.object3D.position.copy(localPos);
}

// запуск цикла физики
requestAnimationFrame(physicsStep);

const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();

window.addEventListener('mousemove', (e) => {
  // position progress-bar near cursor
  if (progressBar) {
    progressBar.style.left = (e.clientX - 30) + 'px';
    progressBar.style.top = (e.clientY + 20) + 'px';
  }

  // нормализованные координаты
  mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
  mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

  // получаем камеру THREE
  let threeCam = null;
  try {
    threeCam = document.querySelector('[camera]').getObject3D('camera');
  } catch(e) {
    threeCam = null;
  }
  if (!threeCam) {
    threeCam = camera && camera.object3D ? camera.object3D : null;
  }
  if (!threeCam) return;

  raycaster.setFromCamera(mouse, threeCam);
  const intersects = raycaster.intersectObject(ball.object3D, true);
  if (intersects.length > 0 && !isPicked() && !state.flying) {
    // hovering handled by mouseenter/mouseleave too, но на случай, если событие не сработало
    if (!hovering) {
      hovering = true;
      hoverProgress = 0;
      showProgressBar();
      if (!hoverAnimId) hoverAnimId = requestAnimationFrame(hoverLoop);
    }
  } else {
    if (hovering) {
      hovering = false;
      hideProgressBar();
      setProgressPct(0);
      if (hoverAnimId) {
        cancelAnimationFrame(hoverAnimId);
        hoverAnimId = null;
        hoverLastTs = 0;ы
      }
    }
  }
});