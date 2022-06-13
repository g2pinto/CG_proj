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

var camera = [];
var activeCamera = 0;


var delta;
var origami1;

function createFirstOrigami(){
    origami1 = new THREE.Object3D();
    const geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array( [
        -14.82, 14.845,  1,
        0,0,0,
        0,29.69,0
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:      true } );
    const mesh = new THREE.Mesh( geometry, material );
    //geom.faces.push(new THREE.Face3(0, 1, 2, normal));

    origami1.add(mesh);
    //scene.add(mesh);

    const geometry1 = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices1 = new Float32Array( [
        14.82, 14.845,  1,
        0,29.69,0,
        0,0,0,
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry1.setAttribute( 'position', new THREE.BufferAttribute( vertices1, 3 ) );
    const material1 = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:      true } );
    const mesh1 = new THREE.Mesh( geometry1, material1 );
    //geom.faces.push(new THREE.Face3(0, 1, 2, normal));
    //scene.add(mesh1);
    origami1.add(mesh1);

    origami1.position.set(-4, 0, 0);

    scene.add(origami1);

}



function createScene(){
	
	scene = new THREE.Scene();
	
	scene.add(new THREE.AxisHelper(10));
    createFirstOrigami();
    

	
}


function createFrontalCamera() {

    camera[0] = new THREE.OrthographicCamera(-60, 60, 30, -30, 0.1, 10000);

    camera[0].lookAt(scene.position);
    camera[0].position.y = 0;
    camera[0].position.z = 70;

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

    //resizePerspectiveCamera(1);
    //resizePerspectiveCamera(2);
}


function update(){
    
    delta = clock.getDelta();
    //console.log(delta);
    
    
	
    if (keyMap[37]) {//left

    }

    if (keyMap[38]) {//up


    }
    if (keyMap[39]) {//right

    }
    if (keyMap[40]) {//down

    }
    
    if(keyMap[49]) { //1
        activeCamera = 0;
    }
    if(keyMap[50]) { //2
    }
    if(keyMap[51]) { //3
    }


}

function createCameras(){
	
	createFrontalCamera();

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

    requestAnimationFrame( animate );

}

function render() {
    //var followVec = new THREE.Vector3(shipBody.position.x, shipBody.position.y+3,shipBody.position.z)
    if (activeCamera == 0) {
      renderer.render(scene, camera[0]);
   
    }/*else if (activeCamera == 1){
        renderer.render(scene, camera[1]);
    
    } else if (activeCamera == 2){
      var camPosition = new THREE.Vector3(0, -20, 20);
      var shipPosition = camPosition.applyMatrix4(shipBody.matrixWorld);
  
      camera[2].position.x = shipPosition.x;
      camera[2].position.y = shipPosition.y;
      camera[2].position.z = shipPosition.z;
      camera[2].lookAt(followVec);
  
      renderer.render(scene, camera[2]);
    }*/
}
