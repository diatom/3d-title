import * as p from 'https://cdn.jsdelivr.net/npm/@mitranim/js@0.1.25/prax.mjs'
const {E} = p.Ren.native()

import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
// import { DecalGeometry } from 'three/examples/jsm/geometries/DecalGeometry.js';


// Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(12, 10, 8);

// Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true
// renderer.setClearColor(0xb02828);
document.getElementById('container').appendChild(renderer.domElement);

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false; // Prevents panning in screen space

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
const wallMaterialLeft = new THREE.MeshBasicMaterial({ color: 0xd63636 });
const wallMaterialBack = new THREE.MeshBasicMaterial({ color: 0x8c0b0b });

// Left Wall
const leftWall = new THREE.Mesh(wallGeometryLeft, wallMaterialLeft);
leftWall.position.set(0, 5, 4); // Позиция левой стены
leftWall.rotation.y = Math.PI / 2; // Поворот стены на 90 градусов
scene.add(leftWall);

// Back Wall
const backWall = new THREE.Mesh(wallGeometryBack, wallMaterialBack);
backWall.position.set(10, 5, -6); // Позиция задней стены
backWall.rotation.y = 0; // Поворот стены (по умолчанию)
scene.add(backWall);

// Box
const boxGeometry = new THREE.BoxGeometry(4, 2, 2)
const boxMaterial = new THREE.MeshStandardMaterial({color: 0x00ffff})
const box = new THREE.Mesh(boxGeometry, boxMaterial)
box.position.set(5, 1, -1)
box.castShadow = true
scene.add(box)

// Book
function createBook(position) {
    const bookWidth = 1; // Ширина книги
    const bookHeight = 1.3; // Высота книги
    const bookThickness = 0.2; // Толщина книги
    // Создание обложки книги
    const coverMaterial = new THREE.MeshStandardMaterial({ color: 0x8B4513 }); // Коричневый цвет для обложки
    const coverGeometryFront = new THREE.BoxGeometry(bookWidth, bookHeight, bookThickness);
    const coverFront = new THREE.Mesh(coverGeometryFront, coverMaterial);
    coverFront.position.set(position.x, position.y, position.z + bookThickness / 2); // Позиция передней обложки
    const coverGeometryBack = new THREE.BoxGeometry(bookWidth, bookHeight, bookThickness);
    const coverBack = new THREE.Mesh(coverGeometryBack, coverMaterial);
    coverBack.position.set(position.x, position.y, position.z - bookThickness / 2); // Позиция задней обложки
    // Создание страниц книги
    const pageMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); // Белый цвет для страниц
    const pageGeometry = new THREE.BoxGeometry(bookWidth - 0.02, bookHeight - 0.02, bookThickness - 0.01); // Немного меньше по размерам
    const pages = new THREE.Mesh(pageGeometry, pageMaterial);
    pages.position.set(position.x, position.y, position.z); // Позиция страниц
    // Поворот книги на 90 градусов вокруг оси X
    coverFront.rotation.x = Math.PI / 2; // Поворот передней обложки
    coverBack.rotation.x = Math.PI / 2; // Поворот задней обложки
    pages.rotation.x = Math.PI / 2; // Поворот страниц
    // Добавляем все части книги в сцену
    scene.add(coverFront);
    scene.add(coverBack);
    scene.add(pages);
}
const bookPosition = new THREE.Vector3(4, 2.03, -1); // Задайте нужные координаты
createBook(bookPosition);

// Bottle
const scale = 0.05;
const neckRadius = 1.5 * scale;
const neckHeight = 5 * scale;
const bodyRadius = 3 * scale;
const bodyHeight = 15 * scale;
const totalHeight = neckHeight + bodyHeight;

// Create bottle profile
const bottleProfile = [];
bottleProfile.push(new THREE.Vector2(neckRadius, totalHeight));
bottleProfile.push(new THREE.Vector2(neckRadius, totalHeight - neckHeight));
bottleProfile.push(new THREE.Vector2(bodyRadius, totalHeight - neckHeight));
bottleProfile.push(new THREE.Vector2(bodyRadius, 0));

// Create LatheGeometry
const segments = 64;
const bottleGeometry = new THREE.LatheGeometry(bottleProfile, segments);

// Create glass material
const bottleMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0,
  roughness: 0,
//   transmission: 1,
  thickness: 0.5,
  side: THREE.DoubleSide,
  transparent: true,
  opacity: 1.0,
});
// Create bottle mesh
const bottleMesh = new THREE.Mesh(bottleGeometry, bottleMaterial);
// Load SVG logo and apply as decal
const fileLoader = new THREE.FileLoader();
function loadLogoAndApplyToBottle(svgUrl) {
  fileLoader.load(svgUrl, function (svgData) {
    const svgBlob = new Blob([svgData], {type: 'images/ibri-logo-white.png'});
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();

    img.onload = function () {
      const texture = new THREE.Texture(img);
      texture.needsUpdate = true;

      const decalMaterial = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthTest: true,
        depthWrite: false,
        polygonOffset: true,
        polygonOffsetFactor: -4,
      });
      const decalPosition = new THREE.Vector3(0, bodyHeight / 2, bodyRadius - 0.1);
      const decalOrientation = new THREE.Euler(0, 0, 0);
      const decalSize = new THREE.Vector3(4 * scale, 4 * scale, 0.1 * scale);
      const decalGeometry = new THREE.DecalGeometry(
        bottleMesh,
        decalPosition,
        decalOrientation,
        decalSize
      );
      const decalMesh = new THREE.Mesh(decalGeometry, decalMaterial);
      bottleMesh.add(decalMesh);
      URL.revokeObjectURL(url);
    };
    img.onerror = function () {
      console.error('Error loading SVG image.');
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}
bottleMesh.position.set(6, 2, -1)
scene.add(bottleMesh)



// Light
const light = new THREE.DirectionalLight(0xffffff, 3);
light.castShadow = true
light.position.set(40, 60, 10);
scene.add(light);


// Animation Loop
function animate() {
    controls.update(); // Update controls for damping effect
    renderer.render(scene, camera);
    renderer.setAnimationLoop(animate);
}

if (WebGL.isWebGL2Available()) {
    animate();
} else {
    const warning = WebGL.getWebGL2ErrorMessage();
    document.getElementById('container').appendChild(warning);
}