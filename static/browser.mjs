import * as p from 'https://cdn.jsdelivr.net/npm/@mitranim/js@0.1.25/prax.mjs'
const {E} = p.Ren.native()

import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';


let points, starsGroup

const stars = [];
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(12, 10, 8);

const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.shadowMap.enabled = true
renderer.setClearColor(0x000000)
document.getElementById('container').appendChild(renderer.domElement);

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false; // Prevents panning in screen space
// Установите пределы для вертикального вращения (полярный угол)
controls.minPolarAngle = Math.PI / 4; // Минимальный угол (например, 45 градусов)
controls.maxPolarAngle = Math.PI / 2.2; // Максимальный угол (например, 90 градусов)
// Установите пределы для горизонтального вращения (азимутальный угол)
controls.minAzimuthAngle = Math.PI / 8; // Левая граница поворота (например, -45 градусов)
controls.maxAzimuthAngle = Math.PI / 2;  // Правая граница поворота (например, 45 градусов)
// Другие параметры OrbitControls, если нужно
// controls.enableDamping = true; // Плавность вращения
controls.dampingFactor = 0.05; // Скорость затухания
controls.enableZoom = true;    // Включить или отключить приближение
controls.enablePan = false;    // Отключить смещение камеры
controls.minDistance = 5;  // Минимальное расстояние (ближе нельзя)
controls.maxDistance = 20; // Максимальное расстояние (дальше нельзя)


starsGroup = new THREE.Group();
createStars(300);
starsGroup.position.set(-10, 2, 2);
scene.add(starsGroup);

function createStars(count) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3); // x, y, z для каждой звезды
    const colors = new Float32Array(count * 3); // r, g, b для каждой звезды

    for (let i = 0; i < count; i++) {
        // Случайные позиции для звёзд
        positions[i * 3] = (Math.random() - 0.5) * 20; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 15; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 100; // z
        // Случайный цвет для каждой звезды
        colors[i * 3] = Math.random(); // r
        colors[i * 3 + 1] = Math.random(); // g
        colors[i * 3 + 2] = Math.random(); // b
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });
    points = new THREE.Points(geometry, material);
    // scene.add(points);
    starsGroup.add(points);
}

// Floor
// const floorGeometry = new THREE.PlaneGeometry(20, 20);
// const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x420f0f });
// const floor = new THREE.Mesh(floorGeometry, floorMaterial);
// floor.rotation.x = -Math.PI / 2; // Поворот пола
// floor.position.set(10, 0, 4);
// floor.receiveShadow = true
// scene.add(floor);

function createChessBoard(size, tileSize, lineWidth) {
    const boardGroup = new THREE.Group();
    for (let x = 0; x < size; x++) {
        for (let z = 0; z < size; z++) {
            // Определение цвета плитки
            const color = (x + z) % 2 === 0 ? 0xFFFFFF : 0x000000; // Белый и черный цвет
            // Создание плитки с небольшой высотой для объема
            const tileGeometry = new THREE.BoxGeometry(tileSize, 0.1, tileSize); // Высота плитки 0.1
            const tileMaterial = new THREE.MeshStandardMaterial({ color: color });
            const tile = new THREE.Mesh(tileGeometry, tileMaterial);
            // Позиционирование плитки
            tile.position.set(x * tileSize - (size * tileSize) / 2 + tileSize / 2, 0.05, z * tileSize - (size * tileSize) / 2 + tileSize / 2);
            tile.receiveShadow = true;
            boardGroup.add(tile);
        }
    }
    return boardGroup;
}
// Создаем шахматную доску с объемными плитками и настраиваем ее позицию
const chessBoard = createChessBoard(20, 1, 0.05); // Размер доски: 8x8 плиток с размером плитки в 1 единицу
chessBoard.position.set(10, 0, 4); // Установка позиции шахматной доски
chessBoard.receiveShadow = true
scene.add(chessBoard);


// Wall
// const wallGeometryLeft = new THREE.PlaneGeometry(20, 10);
// const wallMaterialLeft = new THREE.MeshBasicMaterial({ color: 0xa1abad });
// const wallMaterialLeft = new THREE.MeshBasicMaterial({ color: 0xd63636 });
const wallGeometryBack = new THREE.PlaneGeometry(20, 10);
const wallMaterialBack = new THREE.MeshStandardMaterial({ color: 0x8c0b0b });

// Left Wall
// const leftWall = new THREE.Mesh(wallGeometryLeft, wallMaterialLeft);
// leftWall.position.set(0, 5, 4); // Позиция левой стены
// leftWall.rotation.y = Math.PI / 2; // Поворот стены на 90 градусов
// scene.add(leftWall);

// Back Wall
const backWall = new THREE.Mesh(wallGeometryBack, wallMaterialBack);
backWall.position.set(10, 5, -6);
backWall.rotation.y = 0;
// backWall.castShadow = true;
backWall.receiveShadow = true;
scene.add(backWall);


// Logo text
const loader = new FontLoader();
loader.load('fonts/caveat_regular.json', function (font) {
    const textGeo = new TextGeometry('Severin\nBogucharsky', {
        font: font,
        size: 1,
        depth: 0.1,
        opacity: 0.5,
        curveSegments: 10,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelEnabled: true
    });
    textGeo.computeBoundingBox();

    const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00]; // Цвета для смены
    let colorIndex = 0;
    const textMaterial = new THREE.MeshPhongMaterial({ color: colors[colorIndex], specular: 0xffffff });
    
    const mesh = new THREE.Mesh(textGeo, textMaterial);
    mesh.position.set(-0.02, 5, 7);
    mesh.rotation.y = Math.PI / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
    const shadowMesh = new THREE.Mesh(textGeo, shadowMaterial);
    shadowMesh.position.set(-0.02, 5, 9);
    shadowMesh.rotation.y = Math.PI / 2;

    scene.add(shadowMesh);
    scene.add(mesh);

    // Функция для анимации смены цвета
    function animateColor() {
        setTimeout(() => {
            // Двойное мигание
            textMaterial.color.setHex(0xffffff); // Вспышка белого цвета
            setTimeout(() => {
                textMaterial.color.setHex(colors[colorIndex]); // Возвращение к исходному цвету
                setTimeout(() => {
                    textMaterial.color.setHex(0xffffff); // Вспышка белого цвета
                    setTimeout(() => {
                        // Смена цвета на следующий в массиве
                        colorIndex = (colorIndex + 1) % colors.length;
                        textMaterial.color.setHex(colors[colorIndex]);
                        // Повтор анимации через 2 секунды
                        animateColor();
                    }, 100);
                }, 100);
            }, 100);
        }, 4000);
    }
    animateColor();
});



// Jpg Bruegel
const textureLoaderBru = new THREE.TextureLoader();
textureLoaderBru.load('images/pic-bruegel.jpg', function(texture) {
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(5, 3.5);
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(5, 4, -5.95);
    scene.add(plane);
    const frameThickness = 0.1; // Толщина рамки
    const frameColor = 0xffffff;
    // Создаем верхнюю и нижнюю части рамки с BoxGeometry
    const topFrame = new THREE.Mesh(new THREE.BoxGeometry(5 + frameThickness * 2, frameThickness, 0.3), new THREE.MeshStandardMaterial({ color: frameColor }));
    const bottomFrame = new THREE.Mesh(new THREE.BoxGeometry(5 + frameThickness * 2, frameThickness, 0.3), new THREE.MeshStandardMaterial({ color: frameColor }));
    // Создаем боковые части рамки с BoxGeometry
    const leftFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, 3.5 + frameThickness * 2, 0.3), new THREE.MeshStandardMaterial({ color: frameColor }));
    const rightFrame = new THREE.Mesh(new THREE.BoxGeometry(frameThickness, 3.5 + frameThickness * 2, 0.3), new THREE.MeshStandardMaterial({ color: frameColor }));
    // Позиционирование верхней и нижней рамки
    topFrame.position.set(5, 4 + (3.5 / 2) + (frameThickness / 2), -5.95);
    bottomFrame.position.set(5, 4 - (3.5 / 2) - (frameThickness / 2), -5.95);
    // Позиционирование боковых рамок
    leftFrame.position.set(5 - (5 / 2) - (frameThickness / 2), 4, -5.95);
    rightFrame.position.set(5 + (5 / 2) + (frameThickness / 2), 4, -5.95);
    // Добавляем все части рамки в сцену
    scene.add(topFrame);
    scene.add(bottomFrame);
    scene.add(leftFrame);
    scene.add(rightFrame);
    topFrame.castShadow = true;
    topFrame.receiveShadow = true;
    bottomFrame.castShadow = true;
    bottomFrame.receiveShadow = true;
    leftFrame.castShadow = true;
    leftFrame.receiveShadow = true;
    rightFrame.castShadow = true;
    rightFrame.receiveShadow = true;
    plane.castShadow = true;
    plane.receiveShadow = true;
});

function createTextPanel(scene) {
    const loader = new FontLoader();
    // Загружаем шрифт
    loader.load('fonts/commissioner-regular.json', function (font) {
        const textGeo = new TextGeometry('The Hunters\nin the Snow.\nPieter Bruegel\nthe Elder.\n1555', {
            font: font,
            size: 0.06,
            depth: 0,
            height: 0.05,
            curveSegments: 10,
            bevelThickness: 0.01,
            bevelSize: 0.001,
            bevelEnabled: true
        });
        const textMaterial = new THREE.MeshStandardMaterial({ color: 0x000000 });
        const textMesh = new THREE.Mesh(textGeo, textMaterial);
        textMesh.position.set(-0.3, 0.3, 0.05);
        const panelGeometry = new THREE.BoxGeometry(0.8, 1, 0.05);
        const panelMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });
        const panelMesh = new THREE.Mesh(panelGeometry, panelMaterial);
        panelMesh.add(textMesh);
        panelMesh.position.set(8.3, 4, -5.95);
        scene.add(panelMesh);
        panelMesh.castShadow = true;
        panelMesh.receiveShadow = true;
    });
}
createTextPanel(scene)


// Table
function createTableLegs() {
    const radiusTop = 0.1; // Радиус верхней части конуса
    const radiusBottom = 0.05; // Радиус нижней части конуса
    const height = 2.0; // Высота ножки
    const radialSegments = 50; // Количество сегментов для сглаживания
    const legGeometry = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, radialSegments);
    const legMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 }); // Коричневый цвет для имитации дерева
    const positions = [
        { x: 5.8, y: 0, z: -0.2, rz: 36, ry: -72, rx: -72 }, //нижняя левая
        { x: 5.8, y: 0, z: -1.8, rz: 36, ry: 72, rx: 72 }, //нижняя правая
        { x: 4.2, y: 0, z: -0.2, rz: -36, ry: 72, rx: -72 }, //верхняя левая
        { x: 4.2, y: 0, z: -1.8, rz: -36, ry: -72, rx: 72 } //верхняя правая
    ];
    positions.forEach(pos => {
        const tableLeg = new THREE.Mesh(legGeometry, legMaterial);
        tableLeg.position.set(pos.x, pos.y + height / 2, pos.z);
        tableLeg.rotation.y = Math.PI / pos.ry;
        tableLeg.rotation.z = Math.PI / pos.rz;
        tableLeg.rotation.x = Math.PI / pos.rx;
        scene.add(tableLeg);
        tableLeg.castShadow = true;
    });

    const tabletopRadius = 1.8;
    const tabletopThickness = 0.1;
    const tabletopGeometry = new THREE.CylinderGeometry(tabletopRadius, tabletopRadius, tabletopThickness, radialSegments);
    const tabletopMaterial = new THREE.MeshLambertMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.6,
        side: THREE.DoubleSide // Чтобы грани были видны с обеих сторон
    });
    const tabletop = new THREE.Mesh(tabletopGeometry, tabletopMaterial);
    tabletop.position.set(5, height + tabletopThickness / 2, -1);
    scene.add(tabletop);
    tabletop.castShadow = true;
    tabletop.receiveShadow = true;
}
createTableLegs();


// Magazine
let magazine;
function createFrame() {
    const width = 0.75;
    const height = 1;
    const depth = 0.1;
    const frameGeometry = new THREE.BoxGeometry(width, height, depth);
    const frameMaterial = new THREE.MeshPhongMaterial({ color: 0xffffff });
    magazine = new THREE.Mesh(frameGeometry, frameMaterial);
    magazine.position.set(4.5, 2.16, -1);
    magazine.rotation.x = Math.PI / -2;
    magazine.rotation.z += Math.PI / 6;
    scene.add(magazine);
    magazine.castShadow = true;
    magazine.receiveShadow = true;
}
createFrame();

// Cover magazine
const textureLoaderCover = new THREE.TextureLoader();
textureLoaderCover.load('images/cover.jpg', function(texture) {
    const material = new THREE.MeshStandardMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(0.75, 1);
    const plane = new THREE.Mesh(geometry, material);
    plane.castShadow = true;
    plane.receiveShadow = true;
    plane.position.set(4.5, 2.211, -1)
    plane.rotation.x = Math.PI / -2;
    plane.rotation.z += Math.PI / 6;
    scene.add(plane);
});

// Aluminum can
function createAluminumCan(scene) {
    const scale = 0.05;
    const topRadius = 3 * scale;
    const bottomRadius = 3 * scale;
    const bodyHeight = 9 * scale;
    const bevelRadius = 0.5 * scale;
    const totalHeight = bodyHeight + 2 * bevelRadius;
    const canProfile = [];
    canProfile.push(new THREE.Vector2(topRadius - bevelRadius, totalHeight));
    canProfile.push(new THREE.Vector2(topRadius, totalHeight - bevelRadius));
    canProfile.push(new THREE.Vector2(topRadius, bevelRadius));
    canProfile.push(new THREE.Vector2(bottomRadius, bevelRadius));
    canProfile.push(new THREE.Vector2(bottomRadius - bevelRadius, 0));
    const segments = 64;
    const canGeometry = new THREE.LatheGeometry(canProfile, segments);
    const canMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x3A7189,
      metalness: 0.3,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
      transparent: false,
    });

    const canMesh = new THREE.Mesh(canGeometry, canMaterial);
    const topCapColor = 0xc0c0c0; // Example color (red), change as needed
    const topCapMaterial = new THREE.MeshPhysicalMaterial({
      color: topCapColor,
      metalness: 0.3,
      roughness: 0.3,
      clearcoat: 1,
      clearcoatRoughness: 0.1,
      side: THREE.DoubleSide,
      transparent: false,
    });

    const topCapGeometry = new THREE.CircleGeometry(topRadius - bevelRadius, segments);
    const topCapMesh = new THREE.Mesh(topCapGeometry, topCapMaterial);
    topCapMesh.rotation.x = -Math.PI / 2; // Align the disc horizontally
    topCapMesh.position.y = totalHeight - bevelRadius; // Place it at the correct height
    canMesh.add(topCapMesh);
    const bottomCapGeometry = new THREE.CircleGeometry(bottomRadius - bevelRadius, segments);
    const bottomCapMesh = new THREE.Mesh(bottomCapGeometry, canMaterial);
    bottomCapMesh.rotation.x = Math.PI / 2; // Align the disc horizontally
    bottomCapMesh.position.y = bevelRadius; // Place it at the correct height
    canMesh.add(bottomCapMesh);
    canMesh.position.set(6, 2.1, -1);
    scene.add(canMesh);
    canMesh.castShadow = true;
    canMesh.receiveShadow = true;
}
createAluminumCan(scene)

// Ibri logo
let ibri;
const loaderIbri = new FontLoader();
loaderIbri.load('fonts/commissioner-extrabold-regular.json', function (font) {
    const textGeo = new TextGeometry('Ibri', {
        font: font,
        size: 0.2,
        depth: 0,
        curveSegments: 10,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelEnabled: true
    });
    textGeo.center();
    const textMaterial = new THREE.MeshPhongMaterial({ color: 0xffb7b4, specular: 0xffffff });
    ibri = new THREE.Mesh(textGeo, textMaterial);
    ibri.position.set(6, 2.7, -1);
    ibri.castShadow = true
    scene.add(ibri);

    ibri.callback = function () {
        window.open('https://drinkibri.ru/', '_blank');
    };
});


// Light
// const light1 = new THREE.DirectionalLight(0xffffff, 3);
// light1.castShadow = true
// light1.position.set(40, 60, 10);
// scene.add(light1);

// const light2 = new THREE.DirectionalLight(0xffffff, 3);
// light2.castShadow = true
// light2.position.set(5, 35, 50);
// scene.add(light2);

const sphere2 = new THREE.SphereGeometry( 0.1, 16, 20 );
const light2 = new THREE.PointLight( 0xffffff, 50 );
light2.add( new THREE.Mesh( sphere2, new THREE.MeshBasicMaterial( {  } ) ) );
light2.position.set(4, 6, 4);
light2.castShadow = true
scene.add( light2 );

const sphere3 = new THREE.SphereGeometry( 0, 16, 20 );
const light3 = new THREE.PointLight( 0xffffff, 100 );
light3.add( new THREE.Mesh( sphere3, new THREE.MeshBasicMaterial( {  } ) ) );
light3.position.set(6, 7, -1);
light3.castShadow = true
scene.add( light3 );

// scene.fog = new THREE.Fog(0xffc8d2, 0.3, 30);

const clock = new THREE.Clock();
function animateStars() {
    const time = clock.getElapsedTime();
    // Получаем атрибуты позиции и цвета звёзд
    const colors = points.geometry.attributes.color;
    const positions = points.geometry.attributes.position;
    const count = colors.count;

    // Анимация яркости звёзд (случайное изменение яркости)
    const index = Math.floor(Math.random() * count);
    const brightness = (Math.sin(time + index) + 1) / 2;
    colors.setX(index, colors.getX(index) * brightness);
    colors.setY(index, colors.getY(index) * brightness);
    colors.setZ(index, colors.getZ(index) * brightness);
    colors.needsUpdate = true;

    // Эффект движения звёзд вдоль оси x
    for (let i = 0; i < count; i++) {
        let x = positions.getX(i);
        x -= 0.005; // Скорость движения звёзд по оси x
        if (x < -10) {  // Если звезда выходит за пределы видимости с левой стороны
            x = 10; // Сбрасываем её на правую сторону
            positions.setY(i, (Math.random() - 0.5) * 15); // Случайная y-позиция
            positions.setZ(i, (Math.random() - 0.5) * 100); // Случайная z-позиция
        }
        positions.setX(i, x);
    }
    positions.needsUpdate = true;

    // Продолжаем анимацию
    requestAnimationFrame(animateStars);
}
animateStars();

// Функция для генерации случайного числа в заданном диапазоне
function getRandomInRange(min, max) {
    return Math.random() * (max - min) + min;
}

// Генерация массива с восемью случайными точками
const points2 = Array.from({ length: 8 }, () => ({
    x: getRandomInRange(-2, 8),
    z: getRandomInRange(-4, 10)
}));

let currentPoint = 0; // Индекс текущей точки
const speed = 0.01; // Скорость перемещения

function animateLight2() {
    // Получаем текущую и следующую точки
    const startPoint = points2[currentPoint];
    const endPoint = points2[(currentPoint + 1) % points2.length];

    // Вычисляем направление движения
    const direction = {
        x: endPoint.x - light2.position.x,
        z: endPoint.z - light2.position.z
    };

    // Вычисляем расстояние до следующей точки
    const distance = Math.sqrt(direction.x * direction.x + direction.z * direction.z);

    // Если расстояние меньше скорости, двигаем к следующей точке
    if (distance < speed) {
        light2.position.x = endPoint.x;
        light2.position.z = endPoint.z;
        currentPoint = (currentPoint + 1) % points2.length;
    } else {
        // Нормализуем направление и перемещаем light2
        light2.position.x += (direction.x / distance) * speed;
        light2.position.z += (direction.z / distance) * speed;
    }
}

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    // const time = Date.now() * 0.001;
    // scene.fog.near = 5 + Math.sin(time) * 5;
    // scene.fog.far = 30 + Math.cos(time) * 5;
   
    if (ibri) {
        ibri.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.01);
    }
    animateLight2()
}

// Raycaster for detecting mouse clicks
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2();
function onMouseClick(event) {
    // Calculate mouse position in normalized device coordinates
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    // Update the raycaster with the camera and mouse position
    raycaster.setFromCamera(mouse, camera);
    // Calculate objects intersecting the picking ray
    const intersects = raycaster.intersectObjects(scene.children);
    if (intersects.length > 0) {
        // Call the callback if the mesh is clicked
        if (intersects[0].object === ibri) {
            ibri.callback();
        }
    }
}




// Add event listener to handle mouse clicks
window.addEventListener('click', onMouseClick, false);

if (WebGL.isWebGL2Available()) {
    animate();
} else {
    const warning = WebGL.getWebGL2ErrorMessage();
    document.getElementById('container').appendChild(warning);
}

