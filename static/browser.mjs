import * as p from 'https://cdn.jsdelivr.net/npm/@mitranim/js@0.1.25/prax.mjs'
const {E} = p.Ren.native()

import * as THREE from 'three'
import WebGL from 'three/addons/capabilities/WebGL.js'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Scene
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
camera.position.set( 0, 0, 100 );
camera.lookAt( 0, 0, 0 );

//Gradient
// const canvas = document.createElement('canvas');
// const context = canvas.getContext('2d');
// canvas.width = window.innerWidth;
// canvas.height = window.innerHeight;

// const gradient = context.createLinearGradient(0, 0, 0, canvas.height);
// gradient.addColorStop(0, `#d51313`);
// gradient.addColorStop(0.8, `#cc1212`);
// context.fillStyle = gradient;
// context.fillRect(0, 0, canvas.width, canvas.height);
// const texture = new THREE.CanvasTexture(canvas);
// scene.background = texture;

// Render
const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setClearColor(0xc43131)
document.getElementById('container').appendChild(renderer.domElement)

// Line
const material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
const points = [];
points.push( new THREE.Vector3( - 10, 0, 0 ) );
points.push( new THREE.Vector3( 0, 10, 0 ) );
points.push( new THREE.Vector3( 10, 0, 0 ) );

const geometry = new THREE.BufferGeometry().setFromPoints( points );
const line = new THREE.Line( geometry, material );
scene.add( line );

// Model table
const loader = new GLTFLoader();
loader.load( '3d/scene.gltf', function ( gltf ) {
    const model = gltf.scene;
    model.position.set(0, 0, 0);
    model.scale.set(5, 5, 5);
    scene.add(model);
}, undefined, function ( error ) {
	console.error( error );
} );


// Animation
function animate() {
    line.rotation.x += 0.01
    line.rotation.y += 0.01
    renderer.render( scene, camera )
    renderer.setAnimationLoop( animate )
}

if ( WebGL.isWebGL2Available() ) {
	animate()
} else {
	const warning = WebGL.getWebGL2ErrorMessage()
	document.getElementById( 'container' ).appendChild( warning )
}