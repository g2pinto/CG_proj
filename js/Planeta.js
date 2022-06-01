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

const NUM_CONES = 8;

//Cameras
var camera = new Array(3);
var activeCamera = 0;

var r = 12;


function createPlanet(x, y, z){
	
	
}


function createCone(object, raio, phi, teta) {
	var spherical = new THREE.Spherical();
	geometry = new THREE.ConeGeometry( r/44, r/22, 32 );
	material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
	mesh = new THREE.Mesh( geometry, material );
	
	spherical.set( raio, phi, teta );
    mesh.position.setFromSpherical( spherical );
		
	object.add(mesh);
}

function createTrashCones() {
    var trash = new THREE.Object3D();
    for (let i = 0; i < NUM_CONES; i++){
        var phi = Math.random()*Math.PI;
        var teta = Math.random()*2*Math.PI;
        var raio = 1.2*r;
        
        createCone(trash, raio, phi, teta);
    }
    createCone(trash, raio, 0, 2*Math.PI);
	
	scene.add(trash);
}

var phii;
var tetaa;
function createShip(){
    shipBody = new THREE.Object3D();
	
    phii = Math.random()*Math.PI;
    tetaa = Math.random()*2*Math.PI;
    var raio = 1.4*r;

    var spherical = new THREE.Spherical();

	
	geometry = new THREE.CylinderGeometry( 3, 3, 15,64);
	material = new THREE.MeshBasicMaterial( { color: 0x0600560, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
	
	shipBody.add(mesh);
	
    
    geometry = new THREE.CylinderGeometry( 0, 3, 2,64);
	material = new THREE.MeshBasicMaterial( { color: 0x6557780, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0,8.5,0);
    shipBody.add(mesh);

    geometry = new THREE.CapsuleGeometry(2,6,1,90);
	material = new THREE.MeshBasicMaterial( { color: 0x0685560, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(5,-2.5,0);
	shipBody.add(mesh);

    geometry = new THREE.CapsuleGeometry(2,6,1,90);
	material = new THREE.MeshBasicMaterial( { color: 0x0685560, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(-5,-2.5,0);
	shipBody.add(mesh);

    geometry = new THREE.CapsuleGeometry(2,6,1,90);
	material = new THREE.MeshBasicMaterial( { color: 0x0685560, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0,-2.5,5);
	shipBody.add(mesh);

    geometry = new THREE.CapsuleGeometry(2,6,1,90);
	material = new THREE.MeshBasicMaterial( { color: 0x0685560, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0,-2.5,-5);
	shipBody.add(mesh);
    spherical.set( raio, phii, tetaa );
    shipBody.position.setFromSpherical( spherical );
    scene.add(shipBody);
    shipBody.scale.setScalar( 1/11 );
}

function createScene(){
	
	scene = new THREE.Scene();
	
	scene.add(new THREE.AxisHelper(10));

    planet = new THREE.Object3D();
	
	
	geometry = new THREE.SphereGeometry( r, 32, 16 );
	material = new THREE.MeshBasicMaterial( { color: 0x000080, wireframe: true } );
	mesh = new THREE.Mesh(geometry, material);
	
	planet.add(mesh);
	planet.position.set(0,0,0);
	
	scene.add(planet);
    createShip();
    createTrashCones();
	
}


function createFrontalCamera() {

    camera[0] = new THREE.OrthographicCamera(-50, 50, 25, -25, 0.1, 10000);

    camera[0].lookAt(scene.position);
    camera[0].position.y = 0;
    camera[0].position.z = 70;

}

function createShipCamera() {

    camera[1] = new THREE.PerspectiveCamera(45,1,1000);
    camera[1].lookAt(shipBody.position);
    camera[1].position.y = shipBody.y+5.0;
    camera[1].position.z = shipBody.z-5.0;
    camera[1].position.x = shipBody.x;

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
    var spherical = new THREE.Spherical();

    delta = clock.getDelta();
	var movement_value = delta;
    
    
	
    if (keyMap[37]) {//left
        
}

    if (keyMap[38]) {//up
        shipBody.rotateX(-0.05);

    }
    if (keyMap[39]) {//right
        shipBody.rotateY(0.05);

    }
    if (keyMap[40]) {//down
        shipBody.rotateX(0.05);
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



    /* var radius = 14.4;
    phi = THREE.MathUtils.degToRad(90);
    theta = THREE.MathUtils.degToRad(270);
    shipAux.position.setFromSphericalCoords(radius, phi, theta);
 */
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
