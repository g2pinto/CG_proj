/*global THREE, requestAnimationFrame, console*/


'use strict';
var controls;

var spotLightHF1, spotLightHF2, spotLightHF3;


var scene, renderer;
var pauseScene, pauseCamera;
var ispause = false;

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
var directionalLight;

var origami20;
var origami21;

var material = [], material1 = [];
var material2 = [], material3 = [];

var meshOr1, meshOr20, meshOr21, meshOr22, meshOr23;

var floor, podium;

var Phong = true;
var Basic = false;
var Lambert = false;

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
    const sprite = new THREE.TextureLoader().load("js/textures/pattern1.jpg");
    
    // itemSize = 3 because there are 3 values (components) per vertex
    geometry.setAttribute( 'position', new THREE.BufferAttribute( vertices, 3 ) );
    geometry.computeVertexNormals();
    material[0] = new THREE.MeshPhongMaterial({map: sprite, wireframe: false, side: THREE.DoubleSide, specular: 0xffffff, shininess: 60 });
	material[1] = new THREE.MeshLambertMaterial({map: sprite,wireframe: false, side: THREE.DoubleSide });
    meshOr1 = new THREE.Mesh( geometry, material[1] );
    
    //geom.faces.push(new THREE.Face3(0, 1, 2, normal));

    origami10.add(meshOr1);

    origami11 = origami10.clone(true);
    origami11.rotateY(6*Math.PI/5);
    //origami11.mesh = new THREE.Mesh( geometry,new THREE.MeshBasicMaterial( { color: 0xffff00, wireframe: false, side: THREE.DoubleSide } ))
    origami10.add(origami11);

    origami10.position.set(-40, 5, 0);

    scene.add(origami10);
    //scene.add(origami11);


}

function createSecondOrigami(){
    const sprite = new THREE.TextureLoader().load("js/textures/pattern1.jpg");
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
    geometry.computeVertexNormals();
    material[0] = new THREE.MeshPhongMaterial({map: sprite, wireframe: false, side: THREE.DoubleSide, specular: 0xffffff, shininess: 60 });
	material[1] = new THREE.MeshLambertMaterial({map: sprite, wireframe: false, side: THREE.DoubleSide });
	material[2] = new THREE.MeshBasicMaterial({map: sprite, wireframe: false});
    meshOr20 = new THREE.Mesh( geometry, material[1] );

    origami20.add(meshOr20);

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
    geometry1.computeVertexNormals();
    material1[0] = new THREE.MeshPhongMaterial({map: sprite, wireframe: false, side: THREE.DoubleSide, specular: 0xffffff, shininess: 60 });
	material1[1] = new THREE.MeshLambertMaterial({map: sprite, wireframe: false, side: THREE.DoubleSide });
    material1[2] = new THREE.MeshBasicMaterial({map: sprite, wireframe: false});
    meshOr21 = new THREE.Mesh( geometry1, material1[1] );
    origami20.add(meshOr21);

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
    geometry2.computeVertexNormals();
    material2[0] = new THREE.MeshPhongMaterial({map: sprite, wireframe: false, side: THREE.DoubleSide, specular: 0xffffff, shininess: 60 });
	material2[1] = new THREE.MeshLambertMaterial({map: sprite, wireframe: false, side: THREE.DoubleSide });
    material2[2] = new THREE.MeshBasicMaterial({map: sprite, wireframe: false});
    meshOr22 = new THREE.Mesh( geometry2, material2[1] );
    origami20.add(meshOr22);


    const geometry3 = new THREE.BufferGeometry();
    const vertices3 = new Float32Array( [
        0,22.96,0,
        0,0,0,
        4.21,21.21,0.28
    ] );

    geometry3.setAttribute( 'position', new THREE.BufferAttribute( vertices3, 3 ) );
    geometry3.computeVertexNormals();
    material3[0] = new THREE.MeshPhongMaterial({map: sprite, wireframe: false, side: THREE.DoubleSide, specular: 0xffffff, shininess: 60 });
	material3[1] = new THREE.MeshLambertMaterial({map: sprite, wireframe: false, side: THREE.DoubleSide});
    material3[2] = new THREE.MeshBasicMaterial({map: sprite, wireframe: false});
    meshOr23 = new THREE.Mesh( geometry3, material3[1] );

    origami20.add(meshOr23);
    origami21 = origami20.clone();
    origami21.rotateY(Math.PI);
    origami20.add(origami21);

    origami20.position.set(0, 5, 0);
    scene.add(origami20);

}

function createDirectionalLight(){
    var directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(-40, 0, 100);
    //directionalLight.castShadow = true;
    scene.add( directionalLight );
}

function createHolofoteLight() {

    spotLightHF1 = new THREE.SpotLight(0xffffff, 5, 50, Math.PI / 50);
    spotLightHF2 = new THREE.SpotLight(0xffffff, 5, 50, Math.PI / 10);
    //spotLightHF3 = new THREE.SpotLight(0xffffff, 5, 50, Math.PI / 10); */

    spotLightHF1.position.set(0,0,10);
     spotLightHF2.position.set(0, 0,10);
    //spotLightHF3.position.set(0, 45, -20); */

    spotLightHF1.target.position.set(0,0, 0);
     spotLightHF2.target.position.set(0, 0, 0);
    //spotLightHF3.target.position.set(0, 10, 0); */

    spotLightHF1.castShadow = true;
     spotLightHF2.castShadow = true;
    //spotLightHF3.castShadow = true; */

    origami20.add(spotLightHF1.target);
    origami10.add(spotLightHF2.target);
    

    origami20.add(spotLightHF1);

    spotLightHF1.intensity = 5;
    origami10.add(spotLightHF2);
    

}
function createFloor(){
    floor = new THREE.Object3D();


    geometry = new THREE.PlaneGeometry(1000, 1000);
    material = new THREE.MeshBasicMaterial ({ color: 0x964B00, wireframe: false });
    mesh = new THREE.Mesh(geometry, material);
    mesh.material.side = THREE.DoubleSide;

    floor.add(mesh);
    floor.rotateX(-Math.PI/2);
    scene.add(floor);
}


function createPodium(){
    podium = new THREE.Object3D();

    geometry = new THREE.BoxGeometry(120, 6, 15);
    material = new THREE.MeshBasicMaterial ({ color: 0x0000ff, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);

    podium.add(mesh);


    geometry = new THREE.BoxGeometry(5, 4, 3);
    material = new THREE.MeshBasicMaterial ({ color: 0x0000ff, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0,-1, 9);

    podium.add(mesh);

    geometry = new THREE.BoxGeometry(5, 2, 3);
    material = new THREE.MeshBasicMaterial ({ color: 0x0000ff, wireframe: true });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, -2, 12);

    podium.add(mesh);

    podium.position.set(0,0,0);

    scene.add(podium);
    

}

function ilumination() {
	if (!Basic) {
		meshOr20.material = material[0];
		meshOr21.material = material1[0];
		meshOr22.material = material2[0];
		meshOr23.material = material3[0];
		
		

		Phong = false;
		Basic = true;
		Lambert = false;
	}
	else {
		meshOr20.material = material[1];
		meshOr21.material = material1[1];
		meshOr22.material = material2[1];
		meshOr23.material = material3[1];
		

		Phong = true;
		Basic = false;
		Lambert = false;
	}
}

function createScene(){
	
	scene = new THREE.Scene();
	
	scene.add(new THREE.AxesHelper(10));
    createFloor();
    createFirstOrigami();
    createSecondOrigami();
    createDirectionalLight();
    createHolofoteLight();
    createFloor();
    createPodium();
    //createPauseSign();

	
}

function createPauseScene(){

    //createFloor();
    //createPodium();

	
	pauseScene = new THREE.Scene();
	
	scene.add(new THREE.AxesHelper(10));
    //createFloor();
    createPauseCamera();
    createPauseSign();
    createHolofoteLight();

	
}

function createPauseSign(){
    var geometry = new THREE.PlaneGeometry( 40, 20, 1, 1 );
    const texture = new THREE.TextureLoader().load( 'textures/pause.png' );
	var material = new THREE.MeshPhongMaterial( { map: texture } );
	var sign = new THREE.Mesh( geometry, material );
	//sign.material.side = THREE.DoubleSide;
    sign.position.z = 10
	scene.add( sign );
}

function createPauseCamera() {

    pauseCamera = new THREE.OrthographicCamera(-60, 60, 30, -30, 0.1, 10000);

    pauseCamera.lookAt(scene.position);
    pauseCamera.position.x = 0;
    pauseCamera.position.y = 0;
    pauseCamera.position.z = 70;

}


function createFrontalCamera() {

    camera[0] = new THREE.OrthographicCamera(-70, 70, 45, -45, 0.1, 10000);

    camera[0].lookAt(scene.position);
    camera[0].position.x = 0;
    camera[0].position.y = 0;
    camera[0].position.z = 100;

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
    if(keyMap[32]){
        ispause = !ispause;
    }
    if(keyMap[65]){ //a(A)
        /* if (!Lambert) {
            meshOr20.material = material[0];
            meshOr21.material = material1[0];
            meshOr22.material = material2[0];
            meshOr23.material = material3[0];
            
    
            Phong = false;
            Basic = false;
            Lambert = true;
        }
        else { */
            meshOr20.material = material[1];
            meshOr21.material = material1[1];
            meshOr22.material = material2[1];
            meshOr23.material = material3[1];
            
    
            Phong = true;
            Basic = false;
            Lambert = false;
        //}
    }


}

function createCameras(){
	
	createFrontalCamera();  

}

function initializeVR(){
    document.body.appendChild( VRButton.createButton (renderer));
    var vrCamera = new THREE.StereoCamera();
    renderer.setAnimationLoop(scene, vrCamera );
}


function init() {

    renderer = new THREE.WebGLRenderer({
        antialias: true
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.xr.enabled = true;

    document.body.appendChild(renderer.domElement);

    createScene();
    createCameras();

    initializeVR();
    

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

function render() {
    //'use strict';
    renderer.autoClear = false;
    renderer.clear();
    
    if (activeCamera == 0) {
        renderer.render(scene, camera[0]);
    }
    if (ispause){
      renderer.clearDepth();
      renderer.render(pauseScene, pauseCamera);
    }
}
