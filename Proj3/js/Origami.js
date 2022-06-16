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
var origami10;
var origami11 = new THREE.Object3D();

var origami20;
var origami21;

var material = [], material1 = [];
var material2 = [], material3 = [];

function createFloor(){
    var geometry = new THREE.PlaneGeometry( 120, 120, 1, 1 );
	var material = new THREE.MeshBasicMaterial( { color: 0x964B00} );
	var floor = new THREE.Mesh( geometry, material );
	floor.material.side = THREE.DoubleSide;
	floor.rotation.x = 90;
	scene.add( floor );
}


function createFirstOrigami(){
    origami10 = new THREE.Object3D();
    const geometry = new THREE.BufferGeometry();
    // create a simple square shape. We duplicate the top left and bottom right
    // vertices because each vertex needs to appear once per triangle.
    const vertices = new Float32Array( [
        5*5**0.5, 15,  10,
        0,0,0,
        0,30,0

    ] );

    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    const material = new THREE.MeshBasicMaterial( { color: 0xff0000, wireframe: false, side: THREE.DoubleSide } );
    const mesh = new THREE.Mesh( geometry, material );
    //geom.faces.push(new THREE.Face3(0, 1, 2, normal));

    origami10.add(mesh);

    origami11 = origami10.clone(true);
    origami11.rotateY(Math.PI);
    origami10.add(origami11);

    origami10.position.set(-40, 0, 0);
    //console.log(origami11.position);

    scene.add(origami10);
    //scene.add(origami11);


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
    material[0] = new THREE.MeshPhongMaterial({ color: 0xff0000, wireframe: false, specular: 0xffffff, shininess: 60 });
	material[1] = new THREE.MeshLambertMaterial({ color: 0xff0000, wireframe: false });
	const mesh = new THREE.Mesh( geometry, material[1] );

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
    material1[0] = new THREE.MeshPhongMaterial({ color: 0xfff000, wireframe: false, specular: 0xffffff, shininess: 60 });
	material1[1] = new THREE.MeshLambertMaterial({ color: 0xfff000, wireframe: false });
    const mesh1 = new THREE.Mesh( geometry1, material1[1] );

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
    material2[0] = new THREE.MeshPhongMaterial({ color: 0x5fff00, wireframe: false, specular: 0xffffff, shininess: 60 });
	material2[1] = new THREE.MeshLambertMaterial({ color: 0x5fff00, wireframe: false });
    const mesh2 = new THREE.Mesh( geometry2, material2[1] );

    origami20.add(mesh2);


    const geometry3 = new THREE.BufferGeometry();
    const vertices3 = new Float32Array( [
        0,22.96,0,
        0,0,0,
        4.21,21.21,0.28
    ] );

    geometry3.setAttribute( 'position', new THREE.BufferAttribute( vertices3, 3 ) );
    const material3 = new THREE.MeshBasicMaterial( { color: 0x3333ff, wireframe: true } );
    material3[0] = new THREE.MeshPhongMaterial({ color: 0x3333ff, wireframe: false, specular: 0xffffff, shininess: 60 });
	material3[1] = new THREE.MeshLambertMaterial({ color: 0x3333ff, wireframe: false });
    const mesh3 = new THREE.Mesh( geometry3, material3[1] );

    origami20.add(mesh3);
    /* origami21 = origami20.clone()
    origami21.rotateY(Math.PI)
    origami20.add(origami21) */
    scene.add(origami20);

}

function createDirectionalLight(){
    const directionalLight = new THREE.DirectionalLight( 0xffffff, 1 );
    directionalLight.position.set( 10, 10, 10 ); //default; light shining from top
    directionalLight.castShadow = true; // default false

    directionalLight.shadow.mapSize.width = 512; // default
    directionalLight.shadow.mapSize.height = 512; // default
    directionalLight.shadow.camera.near = 0.5; // default
    directionalLight.shadow.camera.far = 500; // default
    scene.add( directionalLight );
}



function createScene(){
	
	scene = new THREE.Scene();
	
	scene.add(new THREE.AxesHelper(10));
    createFloor();
    createFirstOrigami();
    createSecondOrigami();
    createDirectionalLight();

	
}


function createFrontalCamera() {

    camera[0] = new THREE.OrthographicCamera(-60, 60, 30, -30, 0.1, 10000);

    camera[0].lookAt(scene.position);
    camera[0].position.x = 0;
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
