import * as p from 'https://cdn.jsdelivr.net/npm/@mitranim/js@0.1.25/prax.mjs'
const {E} = p.Ren.native()

import * as THREE from 'three';
import WebGL from 'three/addons/capabilities/WebGL.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'; // Import OrbitControls

// Scene
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000);
camera.position.set(17, 13, 3.3);
// camera.rotation.set(-52.13, 58.18, 47.12);
// scene.add(camera);

// Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
// renderer.setClearColor(0xb02828);
document.getElementById('container').appendChild(renderer.domElement);

// Initialize OrbitControls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true; // an animation loop is required when either damping or auto-rotation are enabled
controls.dampingFactor = 0.25;
controls.screenSpacePanning = false; // Prevents panning in screen space

// Floor
const floorGeometry = new THREE.PlaneGeometry(20, 20);
const floorMaterial = new THREE.MeshBasicMaterial({ color: 0x420f0f });
const floor = new THREE.Mesh(floorGeometry, floorMaterial);
floor.rotation.x = -Math.PI / 2; // Поворот пола
scene.add(floor);

// Wall
const wallGeometryLeft = new THREE.PlaneGeometry(20, 10);
const wallGeometryBack = new THREE.PlaneGeometry(20, 10);
const wallMaterialLeft = new THREE.MeshBasicMaterial({ color: 0xd63636 });
const wallMaterialBack = new THREE.MeshBasicMaterial({ color: 0x8c0b0b });

// Left Wall
const leftWall = new THREE.Mesh(wallGeometryLeft, wallMaterialLeft);
leftWall.position.set(-10, 5, 0); // Позиция левой стены
leftWall.rotation.y = Math.PI / 2; // Поворот стены на 90 градусов
scene.add(leftWall);

// // Right Wall
// const rightWall = new THREE.Mesh(wallGeometryRight, wallMaterialRight);
// rightWall.position.set(10, 5, 0); // Позиция правой стены
// rightWall.rotation.y = -Math.PI / 2; // Поворот стены на -90 градусов
// scene.add(rightWall);

// Back Wall
const backWall = new THREE.Mesh(wallGeometryBack, wallMaterialBack);
backWall.position.set(0, 5, -10); // Позиция задней стены
backWall.rotation.y = 0; // Поворот стены (по умолчанию)
scene.add(backWall);

// Light
const light = new THREE.DirectionalLight(0xffffff, 1);
light.position.set(5, 10, 10);
scene.add(light);

// Line
const material = new THREE.LineBasicMaterial({ color: 0xffffff });
const points = [];
points.push(new THREE.Vector3(-10, 0, 0));
points.push(new THREE.Vector3(0, 10, 0));
points.push(new THREE.Vector3(10, 0, 0));

const geometry = new THREE.BufferGeometry().setFromPoints(points);
const line = new THREE.Line(geometry, material);
scene.add(line);

// Animation Loop
function animate() {
    controls.update(); // Update controls for damping effect
    line.rotation.x += 0.01;
    line.rotation.y += 0.01;
    renderer.render(scene, camera);
    renderer.setAnimationLoop(animate);
}

if (WebGL.isWebGL2Available()) {
    animate();
} else {
    const warning = WebGL.getWebGL2ErrorMessage();
    document.getElementById('container').appendChild(warning);
}

// Model table
// const loader = new GLTFLoader();
// loader.load( '3d/scene.gltf', function ( gltf ) {
//     const model = gltf.scene;
//     model.position.set(0, 0, 0);
//     model.scale.set(5, 5, 5);
//     scene.add(model);
// }, undefined, function ( error ) {
// 	console.error( error );
// } );
