/*global THREE, requestAnimationFrame, console*/
'use strict';

var scene, renderer;

var geometry, material, mesh;

var prism ;
var prism1;
var prism2;

var limit = 50;

var keyMap = [];

var moveVec = new THREE.Vector3(0,0,0);

var clock = new THREE.Clock();

var mov_speed = 5; //units a second	
var rot_speed = 1;
var delta;

//Cameras
var camera = new Array(3);
var activeCamera = 0;


function createPlanet(x, y, z){
	
	var planet = new THREE.Object3D();
	
	
	geometry = new THREE.SphereGeometry( 12, 32, 16 );
	material = new THREE.MeshBasicMaterial( { color: 0x000080, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
	
	planet.add(mesh);
	planet.position.set(x, y, z);
	
	scene.add(planet);
}


function createScene(){
	
	scene = new THREE.Scene();
	
	scene.add(new THREE.AxisHelper(10));
	
	
	createPlanet(0, 0, 0);

}

function createFrontalCamera() {

    camera[0] = new THREE.OrthographicCamera(-50, 50, 25, -25, 0.1, 10000);

    camera[0].lookAt(scene.position);
    camera[0].position.y = 0;
    camera[0].position.z = 70;

}



function update(){
	
}

function createCameras(){
	
	createFrontalCamera();
    //createTopCamera();
    //createLateralCamera();

}

function init() {

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCameras();

    //document.addEventListener("keydown", onDocumentKeyDown, true);
    //document.addEventListener("keyup", onDocumentKeyUp, true);

}

function animate() {

    update();

    renderer.render(scene, camera[activeCamera]);

    requestAnimationFrame( animate );

}
