import * as p from 'https://cdn.jsdelivr.net/npm/@mitranim/js@0.1.25/prax.mjs'
const {E} = p.Ren.native()

import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { FontLoader } from 'three/addons/loaders/FontLoader.js';
import { TextGeometry } from 'three/addons/geometries/TextGeometry.js';

let scene, camera, renderer;
const stars = [];

function init() {
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
    camera.position.set(12, 10, 8);

    const renderer = new THREE.WebGLRenderer({antialias: true, alpha: true});
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true
    document.getElementById('container').appendChild(renderer.domElement);
    createStars(100);
    // animate();

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
    controls.dampingFactor = 0.25;
    controls.screenSpacePanning = false; // Prevents panning in screen space
}
function createStars(count) {
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count * 3); // x, y, z для каждой звезды
    const colors = new Float32Array(count * 3); // r, g, b для каждой звезды

    for (let i = 0; i < count; i++) {
        // Случайные позиции для звёзд
        positions[i * 3] = (Math.random() - 0.5) * 10; // x
        positions[i * 3 + 1] = (Math.random() - 0.5) * 10; // y
        positions[i * 3 + 2] = (Math.random() - 0.5) * 10; // z
        // Случайный цвет для каждой звезды
        colors[i * 3] = Math.random(); // r
        colors[i * 3 + 1] = Math.random(); // g
        colors[i * 3 + 2] = Math.random(); // b
    }
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
    const material = new THREE.PointsMaterial({ size: 0.1, vertexColors: true });
    const points = new THREE.Points(geometry, material);
    scene.add(points);
}


// // Scene
// const scene = new THREE.Scene();
// const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
// camera.position.set(12, 10, 8);

// // Render
// const renderer = new THREE.WebGLRenderer({antialias: true});
// renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setPixelRatio(window.devicePixelRatio);
// renderer.shadowMap.enabled = true
// // renderer.setClearColor(0xb02828);
// document.getElementById('container').appendChild(renderer.domElement);

// Initialize OrbitControls
// const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
// controls.dampingFactor = 0.25;
// controls.screenSpacePanning = false; // Prevents panning in screen space

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
const wallGeometryLeft = new THREE.PlaneGeometry(20, 10);
const wallGeometryBack = new THREE.PlaneGeometry(20, 10);
const wallMaterialLeft = new THREE.MeshBasicMaterial({ color: 0xa1abad });
// const wallMaterialLeft = new THREE.MeshBasicMaterial({ color: 0xd63636 });
const wallMaterialBack = new THREE.MeshBasicMaterial({ color: 0x8c0b0b });

// Left Wall
// const leftWall = new THREE.Mesh(wallGeometryLeft, wallMaterialLeft);
// leftWall.position.set(0, 5, 4); // Позиция левой стены
// leftWall.rotation.y = Math.PI / 2; // Поворот стены на 90 градусов
// scene.add(leftWall);

// Back Wall
const backWall = new THREE.Mesh(wallGeometryBack, wallMaterialBack);
backWall.position.set(10, 5, -6); // Позиция задней стены
backWall.rotation.y = 0; // Поворот стены (по умолчанию)
scene.add(backWall);


// Logo text
const loader = new FontLoader();
loader.load('fonts/caveat_regular.json', function (font) {
    const textGeo = new TextGeometry('Severin\nBogucharsky', {
        font: font,
        size: 1,
        depth: 0.1,
        curveSegments: 10,
        bevelThickness: 0.01,
        bevelSize: 0.01,
        bevelEnabled: true
    });
    textGeo.computeBoundingBox();
    const textMaterial = new THREE.MeshPhongMaterial( { color: 0xff0000, specular: 0xffffff } );
    const mesh = new THREE.Mesh( textGeo, textMaterial );
    mesh.position.set(-0.02, 5, 7)
    mesh.rotation.y = Math.PI / 2;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    const shadowMaterial = new THREE.ShadowMaterial({ opacity: 0.5 });
    const shadowMesh = new THREE.Mesh(textGeo, shadowMaterial);
    shadowMesh.position.set(-0.02, 5, 9);
    shadowMesh.rotation.y = Math.PI / 2;
    scene.add(shadowMesh);
    scene.add(mesh);
});


// Jpg Bruegel
const textureLoaderBru = new THREE.TextureLoader();
textureLoaderBru.load('images/pic-bruegel.jpg', function(texture) {
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(5, 3.5);
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(5, 4, -5.9);
    scene.add(plane);
    const frameThickness = 0.1;
    const frameColor = 0xffffff;
    const topFrame = new THREE.Mesh(new THREE.PlaneGeometry(5 + frameThickness * 2, frameThickness), new THREE.MeshBasicMaterial({ color: frameColor }));
    const bottomFrame = new THREE.Mesh(new THREE.PlaneGeometry(5 + frameThickness * 2, frameThickness), new THREE.MeshBasicMaterial({ color: frameColor }));
    const leftFrame = new THREE.Mesh(new THREE.PlaneGeometry(frameThickness, 3.5 + frameThickness * 2), new THREE.MeshBasicMaterial({ color: frameColor }));
    const rightFrame = new THREE.Mesh(new THREE.PlaneGeometry(frameThickness, 3.5 + frameThickness * 2), new THREE.MeshBasicMaterial({ color: frameColor }));
    topFrame.position.set(5, 4 + (3.5 / 2) + (frameThickness / 2), -5.9);
    bottomFrame.position.set(5, 4 - (3.5 / 2) - (frameThickness / 2), -5.9);
    leftFrame.position.set(5 - (5 / 2) - (frameThickness / 2), 4, -5.9);
    rightFrame.position.set(5 + (5 / 2) + (frameThickness / 2), 4, -5.9);
    scene.add(topFrame);
    scene.add(bottomFrame);
    scene.add(leftFrame);
    scene.add(rightFrame);
});


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
    });

    const tabletopRadius = 1.8;
    const tabletopThickness = 0.1;
    const tabletopGeometry = new THREE.CylinderGeometry(tabletopRadius, tabletopRadius, tabletopThickness, radialSegments);
    const tabletopMaterial = new THREE.MeshPhongMaterial({
        color: 0xFFFFFF,
        transparent: true,
        opacity: 0.7,
        side: THREE.DoubleSide // Чтобы грани были видны с обеих сторон
    });
    const tabletop = new THREE.Mesh(tabletopGeometry, tabletopMaterial);
    tabletop.position.set(5, height + tabletopThickness / 2, -1);
    scene.add(tabletop);
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
    magazine.position.set(4.5, 2.13, -1);
    magazine.rotation.x = Math.PI / -2;
    magazine.rotation.z += Math.PI / 6;
    scene.add(magazine);
}
createFrame();

// Cover magazine
const textureLoaderCover = new THREE.TextureLoader();
textureLoaderCover.load('images/cover.jpg', function(texture) {
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const geometry = new THREE.PlaneGeometry(0.75, 1);
    const plane = new THREE.Mesh(geometry, material);
    plane.position.set(4.5, 2.182, -1)
    plane.rotation.x = Math.PI / -2;
    plane.rotation.z += Math.PI / 6;
    scene.add(plane);
});

// Aluminum can
const scale = 0.05;
const topRadius = 3 * scale;
const bottomRadius = 3 * scale;
const bodyHeight = 9 * scale;
const bevelRadius = 0.5 * scale;
const totalHeight = bodyHeight + 2 * bevelRadius;
// Create can profile with bevels on both ends
const canProfile = [];
// Top bevel
canProfile.push(new THREE.Vector2(topRadius - bevelRadius, totalHeight));
canProfile.push(new THREE.Vector2(topRadius, totalHeight - bevelRadius));
// Body
canProfile.push(new THREE.Vector2(topRadius, bevelRadius));
canProfile.push(new THREE.Vector2(bottomRadius, bevelRadius));
// Bottom bevel
canProfile.push(new THREE.Vector2(bottomRadius - bevelRadius, 0));
// Create LatheGeometry
const segments = 64;
const canGeometry = new THREE.LatheGeometry(canProfile, segments);
// Create aluminum material
const canMaterial = new THREE.MeshPhysicalMaterial({
  color: 0x3A7189, // Aluminum color
  metalness: 0.3,
  roughness: 0.3,
  clearcoat: 1,
  clearcoatRoughness: 0.1,
  side: THREE.DoubleSide,
  transparent: false,
});
// Create can mesh
const canMesh = new THREE.Mesh(canGeometry, canMaterial);
// Create a separate material for the top cap with customizable color
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
// Create top cap (disc) geometry
const topCapGeometry = new THREE.CircleGeometry(topRadius - bevelRadius, segments);
const topCapMesh = new THREE.Mesh(topCapGeometry, topCapMaterial);
// Position the top cap
topCapMesh.rotation.x = -Math.PI / 2; // Align the disc horizontally
topCapMesh.position.y = totalHeight - bevelRadius; // Place it at the correct height
// Add top cap to the can
canMesh.add(topCapMesh);
// Create bottom cap (disc) geometry
const bottomCapGeometry = new THREE.CircleGeometry(bottomRadius - bevelRadius, segments);
const bottomCapMesh = new THREE.Mesh(bottomCapGeometry, canMaterial);
// Position the bottom cap
bottomCapMesh.rotation.x = Math.PI / 2; // Align the disc horizontally
bottomCapMesh.position.y = bevelRadius; // Place it at the correct height
// Add bottom cap to the can
canMesh.add(bottomCapMesh);
// Position and add can to scene
canMesh.position.set(6, 2.1, -1);
scene.add(canMesh);


// Ibri logo
let mesh;
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
    mesh = new THREE.Mesh(textGeo, textMaterial);
    mesh.position.set(6, 2.7, -1);
    mesh.castShadow = true
    scene.add(mesh);
    animate();
});


// Light
const light = new THREE.DirectionalLight(0xffffff, 3);
light.castShadow = true
light.position.set(40, 60, 10);
scene.add(light);

scene.fog = new THREE.Fog(0xffc8d2, 0.8, 20);

// function animate() {
//     controls.update();
//     renderer.render(scene, camera);
//     renderer.setAnimationLoop(animate);
//     const time = Date.now() * 0.001;
//     scene.fog.near = 5 + Math.sin(time) * 5;
//     scene.fog.far = 60 + Math.cos(time) * 5;

//     if (mesh) {
//         mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.01);
//     }
// }

function animate() {
    requestAnimationFrame(animate);
    controls.update();
    renderer.render(scene, camera);
    const time = Date.now() * 0.002;
    const positions = points.geometry.attributes.position.array;

    scene.fog.near = 5 + Math.sin(time) * 5;
    scene.fog.far = 60 + Math.cos(time) * 5;
    
    for (let i = 0; i < positions.length; i += 3) {
        const scaleFactor = Math.sin(time + i) * 0.5 + 0.5; 
        positions[i + 2] *= scaleFactor; // Изменяем Z для создания эффекта мерцания
    }

    points.geometry.attributes.position.needsUpdate = true; // Указываем Three.js обновить позиции
   
    if (mesh) {
        mesh.rotateOnAxis(new THREE.Vector3(0, 1, 0), 0.01);
    }
}


if (WebGL.isWebGL2Available()) {
    animate();
    init();
} else {
    const warning = WebGL.getWebGL2ErrorMessage();
    document.getElementById('container').appendChild(warning);
}

