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

var r = 20;


function createPlanet(x, y, z){
	
	var planet = new THREE.Object3D();
	
	
	geometry = new THREE.SphereGeometry( r*2, 32, 16 );
	material = new THREE.MeshBasicMaterial( { color: 0x000080, wireframe: true } );
	mesh = new THREE.Mesh(geometry, material);
	
	planet.add(mesh);
	planet.position.set(x, y, z);
	
	scene.add(planet);
}


function createCone(object, x, y, z) {
	geometry = new THREE.ConeGeometry( r/44, r/22, 32 );
	material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	mesh = new THREE.Mesh( geometry, material );
	
	mesh.position.set(x, y, z);
	
	object.add(mesh);
}

function createTrashCones() {
	var phi = Math.random()*4*Math.PI;
	var teta = Math.random()*4*Math.PI;
	var raio = 1.2*r;
	
	var x = raio*Math.sin(teta)*Math.cos(phi)
	var y = raio*Math.sin(teta)*Math.sin(phi)
	var z = raio*Math.cos(teta)
	
	var trash = new THREE.Object3D();
	
	createCone(trash, x, y, z);
	
	scene.add(trash);
}


function createScene(){
	
	scene = new THREE.Scene();
	
	scene.add(new THREE.AxisHelper(10));
	
	
	createPlanet(0, 0, 0);
	createTrashCones();
}


function createFrontalCamera() {

    camera[0] = new THREE.OrthographicCamera(-100, 100, 50, -50, 0.1, 10000);

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
