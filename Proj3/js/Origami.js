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
var origami10;
var origami11;

var origami20;
var origami21;

function createFirstOrigami(){
    origami10 = new THREE.Object3D();
    const geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array( [
        4*14**0.5, 15,  1,
        0,0,0,
        0,30,0
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe:      true } );
    const mesh = new THREE.Mesh( geometry, material );
    //geom.faces.push(new THREE.Face3(0, 1, 2, normal));

    origami10.add(mesh);
    //scene.add(mesh);

    origami11 = origami10.clone()
    origami11.rotateY(Math.PI)
    origami10.add(origami11)

    origami10.position.set(-40, 0, 0);

    scene.add(origami10);


}

function createSecondOrigami(){
    origami20 = new THREE.Object3D();
    const geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array( [
        0,15*2**0.5,0,
        0,0,0,
        4.21,21.21,0.28
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: true } );
    const mesh = new THREE.Mesh( geometry, material );
    origami20.add(mesh);

    const geometry1 = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices1 = new Float32Array( [
        0,30,0,
        0,0,0,
        4.97,25.02,0.33
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry1.setAttribute( 'position', new THREE.BufferAttribute( vertices1, 3 ) );
    const material1 = new THREE.MeshBasicMaterial( { color: 0xfff000, wireframe: true } );
    const mesh1 = new THREE.Mesh( geometry1, material1 );
    origami20.add(mesh1);

    const geometry2 = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices2 = new Float32Array( [
        4.97,25.02,0.33,
        0,0,0,
        0,22.96,0
    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry2.setAttribute( 'position', new THREE.BufferAttribute( vertices2, 3 ) );
    const material2 = new THREE.MeshBasicMaterial( { color: 0x5fff00, wireframe: true } );
    const mesh2 = new THREE.Mesh( geometry2, material2 );
    origami20.add(mesh2);


    const geometry3 = new THREE.BufferGeometry();
    const vertices3 = new Float32Array( [
        0,22.96,0,
        0,0,0,
        4.21,21.21,0.28
    ] );

    geometry3.setAttribute( 'position', new THREE.BufferAttribute( vertices3, 3 ) );
    const material3 = new THREE.MeshBasicMaterial( { color: 0x3333ff, wireframe: true } );
    const mesh3 = new THREE.Mesh( geometry3, material3 );
    origami20.add(mesh3);
    origami21 = origami20.clone()
    origami21.rotateY(Math.PI)
    origami20.add(origami21)
    scene.add(origami20);

}



function createScene(){
	
	scene = new THREE.Scene();
	
	scene.add(new THREE.AxisHelper(10));
    createFirstOrigami();
    createSecondOrigami();

	
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

function onDocumentKeyDown(event){
    var keyCode = event.keyCode;
    keyMap[keyCode] = true;
}

function onDocumentKeyUp(event){
    var keyCode = event.keyCode;
    keyMap[keyCode] = false;
}

function update(){
    
    delta = clock.getDelta();
    //console.log(delta);
    
    
	
    if (keyMap[69]) { // second origami left E(e)
        origami20.rotateY(-Math.PI/180)
    }

    if (keyMap[82]) {//second origami right R(r)
        origami20.rotateY(Math.PI/180)

    }
    if (keyMap[81]) {//first origami left Q(q)
        origami10.rotateY(-Math.PI/180)
    }
    if (keyMap[87]) {//first origami right W(w)
        origami10.rotateY(Math.PI/180)
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
