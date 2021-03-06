/*global THREE, requestAnimationFrame, console*/
'use strict';
var controls;

var scene, renderer;

var geometry, material, mesh;

var planet;
var shipAux;
var shipBody;

var keyMap = [];

var normal = new THREE.Vector3(0,0,0);

var clock = new THREE.Clock();


var delta;

const NUM_CONES = 8;
var cones = new Array(8);
var deleted_cones = 0;
var trash = new THREE.Object3D();

const NUM_CUBES = 12;
var cubes = new Array(12);
var deleted_cubes = 0;
var trashCube = new THREE.Object3D();

var trashNorhEast = new Array();
var trashNorthWest = new Array();
var trashSouthEast = new Array();
var trashSouthWest = new Array();

//Cameras
var camera = new Array(3);
var activeCamera = 0;

var aspectRatio = window.innerWidth / window.innerHeight;

var r = 12;

const raioEsferaLixo = r/22;

function inNorthEast(object, radius){
    if (object.position.x + radius >= 0 && object.position.y + radius >= 0){
        return true;
    } else {
        return false;
    }
}
function inNorthWest(object, radius){
    if (object.position.x - radius <= 0 && object.position.y + radius >= 0){
        return true;
    } else {
        return false;
    }
}
function inSouthEast(object, radius){
    if (object.position.x + radius >= 0 && object.position.y - radius <= 0){
        return true;
    } else {
        return false;
    }
}
function inSouthWest(object, radius){
    if (object.position.x - radius <= 0 && object.position.y - radius <= 0){
        return true;
    } else {
        return false;
    }
}

function divideTrash(){
    var trashArray = cones.concat(cubes);
    console.log(trashArray.length);
    for(var i = 0; i < trashArray.length; i++) {
        if (inNorthEast(trashArray[i], raioEsferaLixo)){
            trashNorhEast.push(trashArray[i]);
        }
        if (inNorthWest(trashArray[i], raioEsferaLixo)){
            trashNorthWest.push(trashArray[i]);
        }
        if (inSouthEast(trashArray[i], raioEsferaLixo)){
            trashSouthEast.push(trashArray[i]);
        }
        if (inSouthWest(trashArray[i], raioEsferaLixo)){
            trashSouthWest.push(trashArray[i]);
        }
    }
}


function checkShipPosition(){
    

    if (inNorthEast(shipBody, raioEsferaLixo)){
        checkCollision(trashNorhEast);
    }
    if (inNorthWest(shipBody, raioEsferaLixo)){
        checkCollision(trashNorthWest);
    }
    if (inSouthEast(shipBody, raioEsferaLixo)){
        checkCollision(trashSouthEast);
    }
    if (inSouthWest(shipBody, raioEsferaLixo)){
        checkCollision(trashSouthWest);
    }
}


function createPlanet(){
	planet = new THREE.Object3D();
	
	
	geometry = new THREE.SphereGeometry( r, 32, 16 );
	material = new THREE.MeshBasicMaterial( { color: 0x000080, wireframe: true } );
	mesh = new THREE.Mesh(geometry, material);
	
	planet.add(mesh);
	planet.position.set(0,0,0);
	
	scene.add(planet);
	
}


function createCone(object, raio, phi, teta, cone) {
	var spherical = new THREE.Spherical();
    cones[cone] = new THREE.Object3D();
	geometry = new THREE.ConeGeometry( r/44, r/22, 32 );
    geometry.computeBoundingSphere();
	material = new THREE.MeshBasicMaterial( {color: 0xffff00, wireframe: false} );
	mesh = new THREE.Mesh( geometry, material );
	
	spherical.set( raio, phi, teta );
    cones[cone].position.setFromSpherical( spherical );
    cones[cone].name = "cone";
		
	cones[cone].add(mesh);
    //object.add(cones[cone]);
    scene.add(cones[cone]);
}

function createTrashCones() {
    var trash = new THREE.Object3D();
    for (let i = 0; i < NUM_CONES; i++){
        var phi = Math.random()*2*Math.PI;
        var teta = Math.random()*2*Math.PI;
        var raio = 1.2*r;
        createCone(trash, raio, phi, teta, i);
    }

	
	//scene.add(trash);
}

function createCube(object, raio, phi, teta, cube){
    var spherical = new THREE.Spherical();
    cubes[cube] = new THREE.Object3D();
    geometry = new THREE.BoxGeometry(r/22, r/22, r/22);
    geometry.computeBoundingSphere();
    material = new THREE.MeshBasicMaterial({color: 0xffff00, wireframe: false});
    mesh = new THREE.Mesh(geometry, material);

    
    spherical.set(raio, phi, teta);
    cubes[cube].position.setFromSpherical(spherical);
    cubes[cube].name = "cube";

    cubes[cube].add(mesh);
    //object.add(cubes[cube]);
    scene.add(cubes[cube]);

}

function createTrashCubes(){
    
    for(let i = 0; i < NUM_CUBES; i++){
        var phi = Math.random()*Math.PI;
        var teta = Math.random()*2*Math.PI;
        var raio = 1.2*r;

        createCube(trashCube, raio, phi, teta, i);
    }

    //scene.add(trashCube);
}


function createShip(){
    shipBody = new THREE.Object3D();
	
    var phi = Math.random()*Math.PI;
    var teta = Math.random()*2*Math.PI;
    var raio = 1.2*r;

    var spherical = new THREE.Spherical();

	
	geometry = new THREE.CylinderGeometry( 3, 3, 10,64);
	material = new THREE.MeshBasicMaterial( { color: 0x0600560, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
	
	shipBody.add(mesh);
	
    
    geometry = new THREE.CylinderGeometry( 0, 3, 2,64);
	material = new THREE.MeshBasicMaterial( { color: 0x6557780, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0,6,0);
    shipBody.add(mesh);

    geometry = new THREE.CapsuleGeometry(2,3,1,90);
	material = new THREE.MeshBasicMaterial( { color: 0x0685560, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(5,-1,0);
	shipBody.add(mesh);

    geometry = new THREE.CapsuleGeometry(2,3,1,90);
	material = new THREE.MeshBasicMaterial( { color: 0x0685560, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(-5,-1,0);
	shipBody.add(mesh);

    geometry = new THREE.CapsuleGeometry(2,3,1,90);
	material = new THREE.MeshBasicMaterial( { color: 0x0685560, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0,-1,5);
	shipBody.add(mesh);

    geometry = new THREE.CapsuleGeometry(2,3,1,90);
	material = new THREE.MeshBasicMaterial( { color: 0x0685560, wireframe: false } );
	mesh = new THREE.Mesh(geometry, material);
	mesh.position.set(0,-1,-5);
	shipBody.add(mesh);


    geometry = new THREE.SphereGeometry(2, 32, 16);
    material = new THREE.MeshBasicMaterial( { color: 0x0685560, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0,0,0);
    shipBody.add(mesh);


    spherical.set( raio, phi, teta );
    shipBody.position.setFromSpherical( spherical );

    //var shipGeometry = shipBody.geometry;
    //shipGeometry.computeBoundingSphere();

    scene.add(shipBody);
    shipBody.scale.setScalar( 1/11 );
}

function createScene(){
	
	scene = new THREE.Scene();
	
	scene.add(new THREE.AxisHelper(10));

    createPlanet();
    createShip();
    createTrashCones();
    createTrashCubes();
    divideTrash();

	
}


function checkCollision(semiHemisphereTrash){

    var spherical = new THREE.Spherical();
    spherical.set(0, 0, 0);

    var lixoMaximo = cubes.concat(cones);
    var position = new THREE.Vector3();
    position = shipBody.position;

    var position2 = new THREE.Vector3();

    for (var i = 0; i < semiHemisphereTrash.length; i++){
        //console.log(semiHemisphereTrash[i].name);
        
        position2 = semiHemisphereTrash[i].position;
        var distance = position.distanceTo(position2);
        if ( distance <  raioEsferaLixo + r/22 ){
            semiHemisphereTrash[i].position.setFromSpherical(spherical);
            semiHemisphereTrash[i].removeFromParent();
            scene.remove( semiHemisphereTrash[i] );
        }
    }
}



function createFrontalCamera() {

    camera[0] = new THREE.OrthographicCamera(-40, 40, 20, -20, 0.1, 10000);

    camera[0].lookAt(scene.position);
    camera[0].position.y = 0;
    camera[0].position.z = 70;

}


function createPerspectiveCamera(){

    camera[1] = new THREE.PerspectiveCamera(45, aspectRatio, 1, 1000);
    
    camera[1].position.y = 20;
    camera[1].position.x = -40;
    camera[1].rotateY(-Math.PI/2);
    camera[1].lookAt(scene.position);
}

function createShipCamera() {

    camera[2] = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 1, 1000);
}



function resizePerspectiveCamera(n){
    if (window.innerHeight > 0 && window.innerWidth > 0){
		camera[n].aspect = aspectRatio;
		camera[n].updateProjectionMatrix();
	}
}

function onDocumentKeyDown(event){
    var keyCode = event.keyCode;
    keyMap[keyCode] = true;
}

function onDocumentKeyUp(event){
    var keyCode = event.keyCode;
    keyMap[keyCode] = false;
}

function onResize(){
    'use strict'

    renderer.setSize(window.innerWidth, window.innerHeight);

    resizePerspectiveCamera(1);
    resizePerspectiveCamera(2);
}

function isNegativeX(){
    if(shipBody.position.x < 0)return true;
    else return false;
}

function update(){
    var sphericalAux = new THREE.Spherical();
    sphericalAux.setFromCartesianCoords(shipBody.position.x, shipBody.position.y, shipBody.position.z);
    
    delta = clock.getDelta();
    //console.log(delta);
    
    
	
    if (keyMap[37]) {//left
        sphericalAux.theta -= Math.PI / 180;
        shipBody.position.setFromSpherical(sphericalAux);
        //checkShipPosition();
    }

    if (keyMap[38]) {//up
        if(isNegativeX()){
            sphericalAux.phi -=0.5* Math.PI / 180;
            shipBody.rotateX(-0.5* Math.PI / 180);
        }
        else sphericalAux.phi +=0.5* Math.PI / 180;
        shipBody.position.setFromSpherical(sphericalAux);
        //checkShipPosition();

    }
    if (keyMap[39]) {//right
        //console.log(sphericalAux.theta);
        sphericalAux.theta += Math.PI / 180;
        shipBody.position.setFromSpherical(sphericalAux);
        //checkShipPosition();
    }
    if (keyMap[40]) {//down
         
        
        if(isNegativeX()){
            sphericalAux.phi +=0.5* Math.PI / 180;
        }
        else sphericalAux.phi -=0.5* Math.PI / 180;
        shipBody.position.setFromSpherical(sphericalAux);
        //checkShipPosition();
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
    createPerspectiveCamera();

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
    window.addEventListener("resize", onResize);

}


function animate() {


    update();

    render();

    checkShipPosition();

    requestAnimationFrame( animate );

}

function render() {
    var followVec = new THREE.Vector3(shipBody.position.x, shipBody.position.y+3,shipBody.position.z)
    if (activeCamera == 0) {
      renderer.render(scene, camera[0]);
   
    }else if (activeCamera == 1){
        renderer.render(scene, camera[1]);
    
    } else if (activeCamera == 2){
      var camPosition = new THREE.Vector3(0, -20, 20);
      var shipPosition = camPosition.applyMatrix4(shipBody.matrixWorld);
  
      camera[2].position.x = shipPosition.x;
      camera[2].position.y = shipPosition.y;
      camera[2].position.z = shipPosition.z;
      camera[2].lookAt(followVec);
  
      renderer.render(scene, camera[2]);
    }
}
