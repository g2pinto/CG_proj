/*global THREE, requestAnimationFrame, console*/
'use strict';

var scene, renderer;

var geometry, material, mesh;

var planet;
var shipAux;
var shipBody;

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

    planet = new THREE.Object3D();
	
	
	geometry = new THREE.SphereGeometry( 12, 32, 16 );
	material = new THREE.MeshBasicMaterial( { color: 0x000080, wireframe: true } );
	mesh = new THREE.Mesh(geometry, material);
	
	planet.add(mesh);
	planet.position.set(0,0,0);
	
	scene.add(planet);
	createTrashCones()
	
	shipBody = new THREE.Object3D();
	
	
	geometry = new THREE.CylinderGeometry( 3, 3, 5,64);
	material = new THREE.MeshBasicMaterial( { color: 0x0600560, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
	
	shipBody.add(mesh);
	shipAux = new THREE.Object3D();

    shipAux.add(shipBody);
    scene.add(shipAux);
    //shipBody.position.y = 14.4;
    shipBody.position.x = 14.4;
}


function createFrontalCamera() {

    camera[0] = new THREE.OrthographicCamera(-50, 50, 25, -25, 0.1, 10000);

    camera[0].lookAt(scene.position);
    camera[0].position.y = 0;
    camera[0].position.z = 70;

}

function createShipCamera() {

    camera[1] = new THREE.OrthographicCamera(-50, 50, 25, -25, 0.1, 10000);
    var objectPosition = new THREE.Vector3();
    shipBody.getWorldPosition(objectPosition);
    camera[1].lookAt(objectPosition);
    camera[1].position.y = objectPosition.y+5.0;
    camera[1].position.z = objectPosition.z-5.0;
    camera[1].position.x = objectPosition.x;

}

function onDocumentKeyDown(event){
    var keyCode = event.keyCode;
    keyMap[keyCode] = true;

    if(keyMap[52]) { //4
      material.wireframe = !material.wireframe;
    }
}

function onDocumentKeyUp(event){
    var keyCode = event.keyCode;
    keyMap[keyCode] = false;
}



function update(){
	
    if (keyMap[37]) {//left
        shipAux.rotateY(0.05);
    }

    if (keyMap[38]) {//up
        shipAux.rotateX(0.05);

    }
    if (keyMap[39]) {//right
        shipAux.rotateY(-0.05);

    }
    if (keyMap[40]) {//down
        shipAux.rotateX(-0.05);
    }
    
    if(keyMap[49]) { //1
        activeCamera = 0;
    }
    if(keyMap[50]) { //2
        activeCamera = 1;
    }
    if(keyMap[51]) { //3
        activeCamera = 2;
    }



}

function createCameras(){
	
	createFrontalCamera();
    createShipCamera();
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

    document.addEventListener("keydown", onDocumentKeyDown, true);
    document.addEventListener("keyup", onDocumentKeyUp, true);

}

function animate() {


    update();

    renderer.render(scene, camera[activeCamera]);

    requestAnimationFrame( animate );

    
    //planet.rotateY(0.004);

    //shipAux.rotateY(-0.05);
    /*shipAux.rotateX(0.0005); */

}
