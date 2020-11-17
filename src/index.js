///Dependencies Webpack  and threeJS, npm install webpack webpack-cli, npm install threeJS
// npm run-script build to compile, work on this file.
// dont change package.json
 /**************************

//Llamada de la librerias
const THREE = require('three');
// CommonJS:
const dat = require('dat.gui');
const Stats = require('stats.js');




import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//Model loaders



// CameraControls.install( { THREE: THREE } );
const canvas = document.getElementById('canvas');
const clock = new THREE.Clock();
 // Optional: Pre-fetch Draco WASM/JS module.
// dracoLoader.preload();
//Scene and render
var renderer, scene, bgScene, camera, cameraControls;
var bgMesh;
var engine;
var controls;
var mixer, mixer2,mixerCap;
//Lights
var spotLight, light, hemisLight;
var spotLightHelper;
//Skybox
var materiall;
var Skybox;
var video;
var guiALLF4;
var guiALLF24;

//Interface
var gui;
var obj;
var stats;

function init() 
{
	
	//DAT GUI
	gui = new dat.gui.GUI();
	obj = {
		explode: function () {
		alert('Bang!');
		},
	
		//spotlight
		posX: -25, 
		posY: 8, 
		posZ: 7,
		colorL: "#ffffff", // RGB array
		penunmbra: 0.2,
		helpSpot:true,
		intSpot:1,
		
		intAmbien:1,
		color0: "#443333", 
		intHemis:1,
		colorg: "#111122", 
	};
	
	renderer = new THREE.WebGLRenderer({ canvas });
	scene = new THREE.Scene();
    // scene.fog = new THREE.Fog( 0x443333, 1, 4 );
 
       var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 2, FAR = 5000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
     
		
	
	
	//Lights
	// spotLight = new THREE.SpotLight( 0xffff00 );
	light = new THREE.AmbientLight( obj.color0 ); // soft white light
	hemisLight = new THREE.HemisphereLight( obj.color0, obj.colorg, 1 );
	

	stats = new Stats();
}


function addLights() 
{
	
	//Hemisphere light
	scene.add( hemisLight );
	spotLight = new THREE.SpotLight();
    spotLight.angle = Math.PI / 16;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    spotLight.position.set( obj.posX, obj.posY, obj.posZ );
	scene.add( spotLight );
	spotLightHelper = new THREE.SpotLightHelper( spotLight );
	//scene.add( spotLightHelper );
	//fireworklight
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
}


function main() {

	
	//Renderer
	renderer.setClearColor(0x222222);
	renderer.autoClearColor = false;
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	
    renderer.gammaFactor = 2.2;

	
	//Camera
	camera.position.x = 14;
	camera.position.y = 2;
	camera.position.z = 6;
	camera.lookAt( 0, 0.1, 0 );
    controls = new OrbitControls( camera, renderer.domElement );

	addLights();

	 
	
	

        var floorTexture = new THREE.TextureLoader().load( '../client/js/images/checkerboard.jpg' )
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	
	var plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 30, 30 ),
		new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010, map: floorTexture, side: THREE.DoubleSide} )
		);
    plane.rotation.x = - Math.PI / 2;
    plane.receiveShadow = true;
	scene.add( plane );

	
	addGUIChooseSkybox();
	addGUIChooseSkyboxTime ();

	
	addSkybox(0,false);//Create animated sky

	//SkyTimeWarp(0);
	//addGUI();
	
	addGUISkyboxproperties();
	
     
	
	
}
 
        function addGUISkyboxproperties(){//Create animated sky
	
			stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
			document.body.appendChild( stats.dom );
	
	var guiSLSky = gui.addFolder('Skybox Properties');
	guiSLSky.add(materiall, 'roughness').min(0).max(1).step(0.1).onChange(function (val) {
		materiall.roughness = val;
		//materiall.update();
	});
	guiSLSky.add(materiall, 'metalness').min(0).max(1).step(0.1).onChange(function (val) {
		materiall.metalness = val;
		//materiall.update();

	});
	

}
function addGUIChooseSkybox (){
	var parameters = 
   {
		four_minutes:   function() { addSkybox( 0, true ); },
		twentyfour_minutes:   function() { addSkybox(  1, true ); },
	
   };
  var guiALL= gui.addFolder('Choose Video');
   guiALL.add( parameters, 'four_minutes'   ).name("Short Video (4)");
   guiALL.add( parameters, 'twentyfour_minutes'   ).name("Long Video (24)");
}

function addSkybox(num,	isnotfirsttime){//Create animated sky

	if (num== 0){// 4 minutes video
		video= document.createElement('video');
		video.load();
		video.autoplay= true; 
		video.needsUpdate= true;
		video.loop	= true;
		video.src	= "../client/js/images/Amanecer.mp4";
		video.volume	= 0;
		video.playbackRate=0.066;//4 minutos /60minutos = 0.066
		
		video.play();
		video.currentTime=0 ;
		
		
		guiALLF4.show();			
		guiALLF24.hide();
		guiALLF24.close();
		
	
	} 
	if (num== 1){ // 24 minutes video
		video= document.createElement('video');
		video.load();
		video.autoplay= true; 
		video.needsUpdate= true;
		video.loop	= true;
		video.src	= "../client/js/images/Sky.mp4";
		video.volume	= 0;
		video.playbackRate= 0.4;//24 minutos /60minutos = 0.4
		
		video.play();
		
			guiALLF4.hide();
			guiALLF24.show();
			guiALLF4.close();
	} 
	

	var texture;
	
	
	texture = new THREE.VideoTexture( video );
	
	

    var skyGeo;
    //add sphere
	skyGeo=	new THREE.SphereGeometry( 300, 30, 30 );
	
	//adding the video to the sphere
 	//var material = new THREE.MeshBasicMaterial({ map: texture,});
     materiall = new THREE.MeshStandardMaterial( {

    //color: 0xffffff,

    roughness: 1,
    metalness: 1,
    map: texture,

	} );
	if (isnotfirsttime){
		
	 
		scene.remove( Skybox );
	}
	
	 Skybox = new THREE.Mesh(skyGeo, materiall);
	// put the video both sides of the sphere
	Skybox.material.side = THREE.DoubleSide;
	//Skybox.Side = THREE.DoubleSide;
	//add sky
	scene.add(Skybox);
}
function SkyTimeWarp(TimeWarp,VideoTime){//Create animated sky

	//choose the video
	if (VideoTime== 0){
	
		SkyTimeWarp_4min(TimeWarp);
		 
	} 
	if (VideoTime== 1){
		SkyTimeWarp_24min(TimeWarp) ;
	} 	
}
function SkyTimeWarp_4min(num){//Create animated sky

	//choose the video
	if (num== 0){
	
		video.currentTime=0 ;
		 
	} 
	if (num== 1){
		video.currentTime=60 ;
	} 
	if (num==2){
	
		video.currentTime=120 ;
	} 
	if (num==3){
	
		video.currentTime=180 ;
	} 
	
	
}
function SkyTimeWarp_24min(num){//Create animated sky

	//choose the video
	if (num== 0){
	
		video.currentTime=0 ;
		 
	} 
	if (num== 1){
		video.currentTime=360 ;
	} 
	if (num==2){
	
		video.currentTime=720 ;
	} 
	if (num==3){
	
		video.currentTime=1080 ;
	} 
	
	
}
     


 
        

function addGUIChooseSkyboxTime (){
	
	var parameters4 = 
   {
		sunrise:   function() { SkyTimeWarp( 0, 0 ); },
		day:   function() { SkyTimeWarp(  1, 0 ); },
		sunset:   function() { SkyTimeWarp( 2, 0  ); },			
		nigth:   function() { SkyTimeWarp( 3, 0 ); }
   };
   var parameters24 = 
   {
		sunrise:   function() { SkyTimeWarp( 0, 1 ); },
		day:   function() { SkyTimeWarp(  1, 1 ); },
		sunset:   function() { SkyTimeWarp( 2, 1  ); },			
		nigth:   function() { SkyTimeWarp( 3, 1 ); }
   };
   guiALLF4= gui.addFolder('Time Warp 4');
   guiALLF4.add( parameters4, 'sunrise'   ).name("Sunrise");
   guiALLF4.add( parameters4, 'day'   ).name("Day");
   guiALLF4.add( parameters4, 'sunset'   ).name("Sunset"); 
   guiALLF4.add( parameters4, 'nigth'   ).name("Nigth");
  
   guiALLF24= gui.addFolder('Time Warp 24');
   guiALLF24.add( parameters24, 'sunrise'   ).name("Sunrise");
   guiALLF24.add( parameters24, 'day'   ).name("Day");
   guiALLF24.add( parameters24, 'sunset'   ).name("Sunset"); 
   guiALLF24.add( parameters24, 'nigth'   ).name("Nigth");
   
}

function displayWindowSize(){
	// Get width and height of the window excluding scrollbars
	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;
	
	// Display result inside a div element
	// console.log("Width: " + w + ", " + "Height: " + h);
	renderer.setSize(w, h);
	// camera.fov = Math.atan(window.innerHeight / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
}

// Attaching the event listener function to window's resize event
window.addEventListener("resize", displayWindowSize);
// document.addEventListener( 'keydown', onKeyDown, false );
// document.addEventListener( 'keyup', onKeyUp, false );

function animate() 
{

  requestAnimationFrame(animate);
  render();
  renderer.render(scene, camera);
  controls.update();
  stats.update();
  var dt = clock.getDelta();
  	
  //controls.update();
}


function render() 
{
	const delta = clock.getDelta();
	//Para la animacion
	if ( mixer ) mixer.update( delta );
	if ( mixer2 ) mixer2.update( delta );
	if ( mixerCap ) mixerCap.update( delta );
	
	
}

init();
main();
animate();
***FINISH DOMEVIDEOPLAYER**************/
/**START DOWNLOADER*************
//Dependencies Webpack  and threeJS, npm install webpack webpack-cli, npm install threeJS
// npm run-script build to compile, work on this file.
// dont change package.json
 

//Llamada de la librerias
const THREE = require('three');
// CommonJS:
const dat = require('dat.gui');
const Stats = require('stats.js');
 


import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//Model loaders
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
//Basis Texture loader




// CameraControls.install( { THREE: THREE } );
const canvas = document.getElementById('canvas');
const clock = new THREE.Clock();
 // Optional: Pre-fetch Draco WASM/JS module.
// dracoLoader.preload();
//Scene and render
var renderer, scene, bgScene, camera, cameraControls;
var bgMesh;
var engine;
var controls;
var mixer, mixer2,mixerCap;
//Lights
var spotLight, light, hemisLight;
var spotLightHelper;
//Skybox
var materiall;
var Skybox;
var video=[];
//Interface
var gui;
var obj;
var stats;
var childd=[];
var childdd;
//DownLoader
var INTERSECTED = null;
var raycaster = new THREE.Raycaster();
var mouse = new THREE.Vector2( Infinity, Infinity );
var group = new THREE.Object3D();
var Gltf_number=0;
var indexmodel=0;
var action;
function init() 
{
	
	//DAT GUI
	gui = new dat.gui.GUI();
	obj = {
		explode: function () {
		alert('Bang!');
		},
	
		//spotlight
		posX: -25, 
		posY: 8, 
		posZ: 7,
		colorL: "#ffffff", // RGB array
		penunmbra: 0.2,
		helpSpot:true,
		intSpot:1,
		
		intAmbien:1,
		color0: "#443333", 
		intHemis:1,
		colorg: "#111122", 
	};
	
	renderer = new THREE.WebGLRenderer({ canvas });
	scene = new THREE.Scene();
    // scene.fog = new THREE.Fog( 0x443333, 1, 4 );
       var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 2, FAR = 5000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
     
		
	
	
	//Lights
	// spotLight = new THREE.SpotLight( 0xffff00 );
	light = new THREE.AmbientLight( obj.color0 ); // soft white light
	hemisLight = new THREE.HemisphereLight( obj.color0, obj.colorg, 1 );
	

	stats = new Stats();
}

function addLights() 
{
	
	//Hemisphere light
	scene.add( hemisLight );
	spotLight = new THREE.SpotLight();
    spotLight.angle = Math.PI / 16;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    spotLight.position.set( obj.posX, obj.posY, obj.posZ );
	scene.add( spotLight );
	spotLightHelper = new THREE.SpotLightHelper( spotLight );
	scene.add( spotLightHelper );
	//fireworklight
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
}


function main() {

	
	//Renderer
	renderer.setClearColor(0x222222);
	renderer.autoClearColor = false;
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	//renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
   // renderer.shadowMap.enabled = true;
//	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
document.body.appendChild( renderer.domElement );
	//Camera
	camera.position.x = 14;
	camera.position.y = 2;
	camera.position.z = 6;
	camera.lookAt( 0, 0.1, 0 );
    controls = new OrbitControls( camera, renderer.domElement );

	addLights();




	loadFBX('model/fbx/avatar1.fbx', [2, 0, 10], [0.01, 0.01, 0.01]).then(function(obj1){
		console.log('termine!');
		mixer = new THREE.AnimationMixer( obj1 );
	var action = mixer.clipAction( obj1.animations[ 0 ] );
		action.play();

	})
	
	loadModels();
	
	 
	 //action.play();
	 boxes();
        var floorTexture = new THREE.TextureLoader().load( '../client/js/images/checkerboard.jpg' );
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	
	var plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 30, 30 ),
		new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010, map: floorTexture, side: THREE.DoubleSide} )
		);
    plane.rotation.x = - Math.PI / 2;
   

		scene.add( plane );
	
	
	 //renderer.domElement.addEventListener( 'click', onMouseClick );
}

function loadFBX(path,pos,scale) {
	const promise = new Promise(function (resolve, reject) {
		var loader = new FBXLoader();
		loader.load( path, function ( object ) {
	
			console.log(object);
			object.scale.set(scale[0], scale[1], scale[2]);
			object.position.set(pos[0], pos[1], pos[2]);
				
			object.traverse( function ( child ) {
				if ( child.isMesh ) {
					child.castShadow = true;
					child.receiveShadow = true;
				}
				//childd[Gltf_number]=child;// Downloader
			} );
			scene.add( object );
			//childd[Gltf_number]=object;// Downloader
			console.log(object);
			if (object == null) {
				reject();
			}else{
				resolve(object);
			}
	
		} );
		
	})
	

	return promise;
}


     



function displayWindowSize(){
	// Get width and height of the window excluding scrollbars
	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;
	
	// Display result inside a div element
	// console.log("Width: " + w + ", " + "Height: " + h);
	renderer.setSize(w, h);
	// camera.fov = Math.atan(window.innerHeight / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
	
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize( window.innerWidth, window.innerHeight );

}

// Attaching the event listener function to window's resize event
window.addEventListener("resize", displayWindowSize);


function animate() 
{
	

  requestAnimationFrame(animate);
  
  raycast();
  render();
  renderer.render(scene, camera);
  controls.update();
  stats.update();
  var dt = clock.getDelta();
  
}


function render() 
{
	const delta = clock.getDelta();
	//Para la animacion
	if ( mixer ) mixer.update( delta );
	if ( mixer2 ) mixer2.update( delta );
	if ( mixerCap ) mixerCap.update( delta );
	
	
}
//------------------------------------------------------------download
function raycast() {
      
	raycaster.setFromCamera( mouse, camera );
	
  var intersects = raycaster.intersectObjects(group.children );
  
		  if ( intersects.length > 0 ) {
  
			  if ( INTERSECTED != intersects[ 0 ].object ) {
	
				 
	  
				  INTERSECTED = intersects[ 0 ].object;
				 
			  }
	
		  } else {
  
			 
	
			  INTERSECTED = null;
	
		  }
		  
	

}
function onMouseMove( event ) {
      
	event.preventDefault();
  
		  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
		  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;

}

function onMouseClick( event ) {

	if ( INTERSECTED !== null ) INTERSECTED.link.click(); 
}

	  
function loadModels() {

	const loader = new GLTFLoader();
	var dracoLoader = new DRACOLoader();
		// dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
		dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
		loader.setDRACOLoader( dracoLoader );
		
	const onLoad = (gltf, position,scale,path,name) => {
		
	  const model = gltf.scene.children[0];
	  model.scale.set(scale[0], scale[1], scale[2]);
	  model.position.copy(position);
	 
	
	  model.castShadow = true;
	  model.receiveShadow = true;
	  
	  model.traverse( function ( child ) {
		  if ( child.isMesh ) {
			  child.castShadow = true;
			  child.receiveShadow = true;
			  
		  

		  }
		  
	  } );

	  scene.add(model);
	  model.animations; // Array<THREE.AnimationClip>
	  model.scene; // THREE.Group
	  model.scenes; // Array<THREE.Group>
	  model.cameras; // Array<THREE.Camera>
	  model.asset; // Object
	 
	 
			
	  var link = document.createElement('a');
	  link.download = name;
	  link.href = path;
	  
  
	  function clicked( event ) {
	  
		  mouse.x = ( event.clientX / window.innerWidth ) * 2 - 1;
			  mouse.y = - ( event.clientY / window.innerHeight ) * 2 + 1;
			  
		raycaster.setFromCamera( mouse, camera );
	  
		  var intersects = raycaster.intersectObject(model, true);
	  
		console.log(intersects.length)
  
		if (intersects.length > 0) {
			
			var position = {
				x: controls.target.x,
				y: controls.target.y,
				z: controls.target.z
			  };
			
			console.log("position", position);
	
			var target = {
			  x: intersects[0].point.x,
			  y: intersects[0].point.y,
			  z: intersects[0].point.z
			}
	
			console.log("target", target);
			console.log("clicked");
	

		 
		  link.click();
		} else {
		
  
		  INTERSECTED = null;
		}
	  }
  
	  renderer.domElement.addEventListener('click', function(event) {
		// find intersections
  
		clicked(event);
		//camera.updateMatrixWorld();
  
  
	  });
  
	};
  
  
	const onProgress = (xhr) => {console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );};
  
  
	const onError = (errorMessage) => {
		console.log( 'An error happened' );
		reject(errorMessage);
	};
  
  
	const parrotPosition = new THREE.Vector3(0, 2, 15);
	loader.load('https://threejs.org/examples/models/gltf/Parrot.glb', gltf => onLoad(gltf, parrotPosition,[0.01, 0.01, 0.01] , "images/Lluvia.mp4","Lluvia.mp4"), onProgress, onError);
  
	const flamingoPosition = new THREE.Vector3(0, 2, 10);
	loader.load('https://threejs.org/examples/models/gltf/Flamingo.glb', gltf => onLoad(gltf, flamingoPosition,[0.01, 0.01, 0.01] ,"images/Sky.mp4","Sky.mp4"), onProgress, onError);
  
	const storkPosition = new THREE.Vector3(0, 2, 5);
	loader.load('https://threejs.org/examples/models/gltf/Stork.glb', gltf => onLoad(gltf, storkPosition,[0.01, 0.01, 0.01]  ,"images/crate.gif", "crate.gif"), onProgress, onError);
  
	const AssetPackPosition = new THREE.Vector3(-10, 0, -10);
	loader.load('https://assets-test-o-zone.s3.amazonaws.com/assets2021/Scenes/LilaStudios/AssetPack.gltf', gltf => onLoad(gltf, AssetPackPosition,[0.1, 0.1, 0.1] , "images/moondust-xneg.png","moondust-xneg.png"), onProgress, onError);
		
	
	const ShiseidoPosition = new THREE.Vector3(10, 0, -10);
	loader.load('https://assets-test-o-zone.s3.amazonaws.com/assets2021/Scenes/Shiseido/Shiseido_Preview/Shiseido.glb', gltf => onLoad(gltf, ShiseidoPosition,[2, 2, 2] , "images/moondust-xneg.png","moondust-xneg.png"), onProgress, onError);
		
  
  
	const GLTFMAPPosition = new THREE.Vector3(10,  0.001, 10);
	loader.load('../client/model/gltf/GLTFMATCAP/scene.gltf', gltf => onLoad(gltf, GLTFMAPPosition,[0.1, 0.1, 0.1] ,"images/fibranet.pdf","fibranet.pdf"), onProgress, onError);
  
	const miguelangeloPosition = new THREE.Vector3(-10,  0.001, 10);
	loader.load('../client/model/gltf/miguelangelo/scene.gltf', gltf => onLoad(gltf, miguelangeloPosition,[0.1, 0.1, 0.1]  ,"images/grass-512.jpg", "grass-512.jpg"), onProgress, onError);
  
	
	const CapoeiraPosition = new THREE.Vector3(1, 0, 10);
	loader.load('../client/model/gltf/capoeira/Capoeira.gltf', gltf => onLoad(gltf, CapoeiraPosition,[0.01, 0.01, 0.01] , "images/moondust-xneg.png","moondust-xneg.png"), onProgress, onError);
		
	
  }
  

 function boxes(){
		
	var geometry = new THREE.BoxBufferGeometry( 5, 5 );
	var material = new THREE.MeshLambertMaterial( { color: 0xdd3322 } );
	var box = new THREE.Mesh( geometry, material );
box.position.set( - 10, 0, 0 );
box.link = document.createElement('a');
box.link.download = "Amanecer.mp4";
box.link.href = "images/Amanecer.mp4";
	group.add( box );

	material = new THREE.MeshLambertMaterial( { color: 0x22dd33 } );
	box = new THREE.Mesh( geometry, material );
box.position.set( 0, 0, 0 );
box.link = document.createElement('a');
box.link.download = "checkerboard.jpg";
box.link.href = "images/checkerboard.jpg";

	group.add( box );

material = new THREE.MeshLambertMaterial( { color: 0x3322dd } );
	box = new THREE.Mesh( geometry, material );
box.position.set( 10, 0, 0 );
box.link = document.createElement('a');
box.link.download = "fibranet.pdf";
box.link.href = "images/fibranet.pdf";
	group.add( box );

scene.add( group )
renderer.domElement.addEventListener( 'click', onMouseClick );
renderer.domElement.addEventListener( 'mousemove', onMouseMove );
 }
init();
main();
animate();
*********************FIN DOWNLOADER**************************/

/*********************Inicio Skybox3.0**************************

//Dependencies Webpack  and threeJS, npm install webpack webpack-cli, npm install threeJS
// npm run-script build to compile, work on this file.
// dont change package.json
 

//Llamada de la librerias
const THREE = require('three');
// CommonJS:
const dat = require('dat.gui');
const Stats = require('stats.js');



import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//Model loaders





// CameraControls.install( { THREE: THREE } );
const canvas = document.getElementById('canvas');
const clock = new THREE.Clock();
 // Optional: Pre-fetch Draco WASM/JS module.
// dracoLoader.preload();
//Scene and render
var renderer, scene, bgScene, camera, cameraControls;
var bgMesh;
var engine;
var controls;
var mixer, mixer2,mixerCap;
//Lights
var spotLight, light, hemisLight;
var spotLightHelper;
//Skybox
var materiall;
var Skybox;
var video=[];
//Interface
var gui;
var obj;
var stats;
var childd;
var childdd;
function init() 
{
	
	//DAT GUI
	gui = new dat.gui.GUI();
	obj = {
		explode: function () {
		alert('Bang!');
		},
	
		//spotlight
		posX: -25, 
		posY: 8, 
		posZ: 7,
		colorL: "#ffffff", // RGB array
		penunmbra: 0.2,
		helpSpot:true,
		intSpot:1,
		
		intAmbien:1,
		color0: "#443333", 
		intHemis:1,
		colorg: "#111122", 
	};
	
	renderer = new THREE.WebGLRenderer({ canvas });
	scene = new THREE.Scene();
    // scene.fog = new THREE.Fog( 0x443333, 1, 4 );
 
       var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 2, FAR = 5000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
    
		
	
	
	//Lights
	// spotLight = new THREE.SpotLight( 0xffff00 );
	light = new THREE.AmbientLight( obj.color0 ); // soft white light
	hemisLight = new THREE.HemisphereLight( obj.color0, obj.colorg, 1 );
	

	stats = new Stats();
}

function addLights() 
{
	
	//Hemisphere light
	scene.add( hemisLight );
	spotLight = new THREE.SpotLight();
    spotLight.angle = Math.PI / 16;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    spotLight.position.set( obj.posX, obj.posY, obj.posZ );
	scene.add( spotLight );
	spotLightHelper = new THREE.SpotLightHelper( spotLight );
	scene.add( spotLightHelper );
	//fireworklight
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
}

function addGUI() 
{
	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );
	var guiALL= gui.addFolder('Light');
	var guiSL = guiALL.addFolder('SpotLight');
	guiSL.add(obj, 'helpSpot').onChange(function (val) {
		spotLightHelper.visible = val;
	});
	guiSL.add(obj, 'posX').onChange(function (val) {
		spotLight.position.x = val;
		spotLightHelper.update();
	});
	guiSL.add(obj, 'posY').onChange(function (val) {
		spotLight.position.y = val;
		spotLightHelper.update();

	});
	guiSL.add(obj, 'posZ').onChange(function (val) {
		spotLight.position.z = val;
		spotLightHelper.update();

	});
	//Ambient Light
	var guiAL = guiALL.addFolder('AmbientLight');
	guiAL.addColor(obj, 'color0').onChange(function (val) {
		light.color.set(val);
		hemisLight.color.set(val);
	});
	guiAL.add(obj, 'intAmbien').min(0).max(1).step(0.1).onChange(function (val) {
		light.intensity = val;
	}).name('Intensity');

	//Hemisphere Light
	var guiHL = guiALL.addFolder('HemisphereLight');
	guiHL.addColor(obj, 'colorg').onChange(function (val) {
		hemisLight.groundColor.set(val);
	});
	guiHL.add(obj, 'intHemis').min(0).max(1).step(0.1).onChange(function (val) {
		hemisLight.intensity = val;
	}).name('Intensity');
	

	
}

function main() {

	
	//Renderer
	renderer.setClearColor(0x222222);
	renderer.autoClearColor = false;
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	//renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
   // renderer.shadowMap.enabled = true;
//	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	
	//Camera
	camera.position.x = 14;
	camera.position.y = 2;
	camera.position.z = 6;
	camera.lookAt( 0, 0.1, 0 );
    controls = new OrbitControls( camera, renderer.domElement );

	addLights();

	
	 
	 //create video
	 for (let index = 0; index < 3; index++) {
		 video[index]= document.createElement('video');
		 video[index].load();
		 video[index].autoplay= true;
		 video[index].needsUpdate= true;
		 video[index].loop	= true;
		
	 }
	 
	 
        var floorTexture = new THREE.TextureLoader().load( '../client/js/images/checkerboard.jpg' )
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	
	var plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 30, 30 ),
		new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010, map: floorTexture, side: THREE.DoubleSide} )
		);
    plane.rotation.x = - Math.PI / 2;
    plane.receiveShadow = true;
	scene.add( plane );




	
	

	addSkybox(0,false);
	addGUI();
	
	addGUISkybox();
	addGUIChooseSkybox ();
     
	
	
}

        function addGUISkybox(){//Create animated sky
	
	
	
	var guiSLSky = gui.addFolder('Skybox');
	guiSLSky.add(materiall, 'roughness').min(0).max(1).step(0.1).onChange(function (val) {
		materiall.roughness = val;
		//materiall.update();
	});
	guiSLSky.add(materiall, 'metalness').min(0).max(1).step(0.1).onChange(function (val) {
		materiall.metalness = val;
		//materiall.update();

	});
	

}
function addSkybox(num,	isnotfirsttime){//Create animated sky

	
	var texture;
	
	//choose the video
	if (num== 0){
		video[2].src	= "../client/js/images/Lluvia.mp4";
		video[0].src	= "../client/js/images/Sky.mp4";
		video[0].autoplay= true;	
		video[2].autoplay= true;
		 texture = new THREE.VideoTexture( video[0] );
	} 
	if (num== 1){
		video[1].autoplay= true;
		video[2].autoplay= true;
		video[2].src	= "../client/js/images/Sky.mp4"; 
		video[1].src	= "../client/js/images/Lluvia.mp4";
		 texture = new THREE.VideoTexture( video[1] );
	} 
	if (num==2){
		video[2].autoplay= true;
		video[2].src	= "../client/js/images/Amanecer.mp4";
		 texture = new THREE.VideoTexture( video[2] );
		 
	} 
	
	
	
	

    var skyGeo;
    //add sphere
	skyGeo=	new THREE.SphereGeometry( 300, 30, 30 );
	
	//adding the video to the sphere
 	//var material = new THREE.MeshBasicMaterial({ map: texture,});
     materiall = new THREE.MeshStandardMaterial( {

    //color: 0xffffff,

    roughness: 1,
    metalness: 1,
    map: texture,

	} );
	if (isnotfirsttime){
		scene.remove( Skybox );
	}
	
	 Skybox = new THREE.Mesh(skyGeo, materiall);
	// put the video both sides of the sphere
	Skybox.material.side = THREE.DoubleSide;
	//Skybox.Side = THREE.DoubleSide;
	//add sky
	scene.add(Skybox);
}
 

function addGUIChooseSkybox (){
	var parameters = 
   {
	   blueSky:   function() { addSkybox( 0 , true  ); },
	   rain:   function() { addSkybox( 1 , true  ); },		
	   sunrise:   function() { addSkybox( 2 , true  ); }	
	
   };
   var guiALLF= gui.addFolder('Choose Sky');
   guiALLF.add( parameters, 'blueSky'   ).name("BlueSky");
   guiALLF.add( parameters, 'rain'   ).name("Rainning");
   guiALLF.add( parameters, 'sunrise'   ).name("Sunrise");

}
     

function displayWindowSize(){
	// Get width and height of the window excluding scrollbars
	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;
	
	// Display result inside a div element
	// console.log("Width: " + w + ", " + "Height: " + h);
	renderer.setSize(w, h);
	// camera.fov = Math.atan(window.innerHeight / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
}

// Attaching the event listener function to window's resize event
window.addEventListener("resize", displayWindowSize);
// document.addEventListener( 'keydown', onKeyDown, false );
// document.addEventListener( 'keyup', onKeyUp, false );

function animate() 
{
	

  requestAnimationFrame(animate);
  render();
  renderer.render(scene, camera);
  controls.update();
  stats.update();
  var dt = clock.getDelta();
  engine.update( dt * 0.5);	
  //controls.update();
}


function render() 
{
	const delta = clock.getDelta();
	//Para la animacion
	if ( mixer ) mixer.update( delta );
	if ( mixer2 ) mixer2.update( delta );
	if ( mixerCap ) mixerCap.update( delta );
	
	
}

init();
main();
animate();
*********************FIN Skybox3.0**************************/
/*********************INICIO GLTF-Emissive Loader**************************

//Dependencies Webpack  and threeJS, npm install webpack webpack-cli, npm install threeJS
// npm run-script build to compile, work on this file.
// dont change package.json
 

//Llamada de la librerias
const THREE = require('three');
// CommonJS:
const dat = require('dat.gui');
const Stats = require('stats.js');




import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
//Model loaders
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';



// CameraControls.install( { THREE: THREE } );
const canvas = document.getElementById('canvas');
const clock = new THREE.Clock();
 // Optional: Pre-fetch Draco WASM/JS module.
// dracoLoader.preload();
//Scene and render
var renderer, scene, bgScene, camera, cameraControls;
var bgMesh;
var engine;
var controls;
var mixer, mixer2,mixerCap;
//Lights
var spotLight, light, hemisLight;
var spotLightHelper;
var materiall;
//Interface
var gui;
var obj;
var stats;
var childd;
var childdd;
function init() 
{
	
	//DAT GUI
	gui = new dat.gui.GUI();
	obj = {
		explode: function () {
		alert('Bang!');
		},
	
		//spotlight
		posX: -25, 
		posY: 8, 
		posZ: 7,
		colorL: "#ffffff", // RGB array
		penunmbra: 0.2,
		helpSpot:true,
		intSpot:1,
		
		intAmbien:1,
		color0: "#443333", 
		intHemis:1,
		colorg: "#111122", 
	};
	
	renderer = new THREE.WebGLRenderer({ canvas });
	scene = new THREE.Scene();
    // scene.fog = new THREE.Fog( 0x443333, 1, 4 );
 
       var SCREEN_WIDTH = window.innerWidth, SCREEN_HEIGHT = window.innerHeight;
	var VIEW_ANGLE = 45, ASPECT = SCREEN_WIDTH / SCREEN_HEIGHT, NEAR = 2, FAR = 5000;
	camera = new THREE.PerspectiveCamera( VIEW_ANGLE, ASPECT, NEAR, FAR);
     
		
	
	
	//Lights
	// spotLight = new THREE.SpotLight( 0xffff00 );
	light = new THREE.AmbientLight( obj.color0 ); // soft white light
	hemisLight = new THREE.HemisphereLight( obj.color0, obj.colorg, 1 );
	

	stats = new Stats();
}

function addLights() 
{
	
	//Hemisphere light
	scene.add( hemisLight );
	spotLight = new THREE.SpotLight();
    spotLight.angle = Math.PI / 16;
    spotLight.penumbra = 0.5;
    spotLight.castShadow = true;
    spotLight.position.set( obj.posX, obj.posY, obj.posZ );
	scene.add( spotLight );
	spotLightHelper = new THREE.SpotLightHelper( spotLight );
	scene.add( spotLightHelper );
	//fireworklight
	var light = new THREE.PointLight(0xffffff);
	light.position.set(0,250,0);
	scene.add(light);
}

function addGUI() 
{
	stats.showPanel( 0 ); // 0: fps, 1: ms, 2: mb, 3+: custom
	document.body.appendChild( stats.dom );
	var guiALL= gui.addFolder('Light');
	var guiSL = guiALL.addFolder('SpotLight');
	guiSL.add(obj, 'helpSpot').onChange(function (val) {
		spotLightHelper.visible = val;
	});
	guiSL.add(obj, 'posX').onChange(function (val) {
		spotLight.position.x = val;
		spotLightHelper.update();
	});
	guiSL.add(obj, 'posY').onChange(function (val) {
		spotLight.position.y = val;
		spotLightHelper.update();

	});
	guiSL.add(obj, 'posZ').onChange(function (val) {
		spotLight.position.z = val;
		spotLightHelper.update();

	});
	//Ambient Light
	var guiAL = guiALL.addFolder('AmbientLight');
	guiAL.addColor(obj, 'color0').onChange(function (val) {
		light.color.set(val);
		hemisLight.color.set(val);
	});
	guiAL.add(obj, 'intAmbien').min(0).max(1).step(0.1).onChange(function (val) {
		light.intensity = val;
	}).name('Intensity');

	//Hemisphere Light
	var guiHL = guiALL.addFolder('HemisphereLight');
	guiHL.addColor(obj, 'colorg').onChange(function (val) {
		hemisLight.groundColor.set(val);
	});
	guiHL.add(obj, 'intHemis').min(0).max(1).step(0.1).onChange(function (val) {
		hemisLight.intensity = val;
	}).name('Intensity');
	

	
}

function main() {

	
	//Renderer
	renderer.setClearColor(0x222222);
	renderer.autoClearColor = false;
    renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	//renderer.gammaOutput = true;
    renderer.gammaFactor = 2.2;
   // renderer.shadowMap.enabled = true;
//	renderer.shadowMap.type = THREE.PCFSoftShadowMap; // default THREE.PCFShadowMap
	
	//Camera
	camera.position.x = 14;
	camera.position.y = 2;
	camera.position.z = 6;
	camera.lookAt( 0, 0.1, 0 );
    controls = new OrbitControls( camera, renderer.domElement );

	addLights();

	
    loadGLTFF('../client/model/gltf/GLTFMATCAP/scene.gltf', [-10,  0.001, 0], [0.5, 0.5, 0.5]).then(function(gltf){
		console.log('termine gltf!');
		mixerCap = new THREE.AnimationMixer( gltf.scene );
		var action = mixerCap.clipAction( gltf.animations[ 0 ] );
		action.play();
		
	}).catch(function (err) {
		console.log(err);
	});/*
	loadGLTFF('../client/model/gltf/miguelangelo/scene.gltf', [10,  0.001, 0], [0.5, 0.5, 0.5]).then(function(gltf){
		console.log('termine gltf!');
		mixerCap = new THREE.AnimationMixer( gltf.scene );
		var action = mixerCap.clipAction( gltf.animations[ 0 ] );
		action.play();
		
	}).catch(function (err) {
		console.log(err);
	});
    
        var floorTexture = new THREE.TextureLoader().load( '../client/js/images/checkerboard.jpg' )
	floorTexture.wrapS = floorTexture.wrapT = THREE.RepeatWrapping; 
	floorTexture.repeat.set( 10, 10 );
	
	var plane = new THREE.Mesh(
        new THREE.PlaneBufferGeometry( 30, 30 ),
		new THREE.MeshPhongMaterial( { color: 0x999999, specular: 0x101010, map: floorTexture, side: THREE.DoubleSide} )
		);
    plane.rotation.x = - Math.PI / 2;
    plane.receiveShadow = true;
	scene.add( plane );




	
	

	
	addSkybox();
	addGUI();
	

	addGUISkybox();
     
	
	
}
 
        function addGUISkybox(){//Create animated sky
	
	
	
	var guiSLSky = gui.addFolder('Skybox');
	guiSLSky.add(materiall, 'roughness').min(0).max(1).step(0.1).onChange(function (val) {
		materiall.roughness = val;
		//materiall.update();
	});
	guiSLSky.add(materiall, 'metalness').min(0).max(1).step(0.1).onChange(function (val) {
		materiall.metalness = val;
		//materiall.update();

	});
	

}
function addSkybox(){//Create animated sky

	//create video
	var video= document.createElement('video');
	video.load();
	video.autoplay= true;
	video.needsUpdate= true;
	video.loop	= true;
	//choose the video
	video.src	= "../client/js/images/Sky.mp4";
	//video.src	= "../client/js/images/Lluvia.mp4";
	//video.src	= "../client/js/images/Amanecer.mp4";
	
	var texture = new THREE.VideoTexture( video );

    var skyGeo;
    //add sphere
	skyGeo=	new THREE.SphereGeometry( 300, 30, 30 );
	
	//adding the video to the sphere
 	//var material = new THREE.MeshBasicMaterial({ map: texture,});
     materiall = new THREE.MeshStandardMaterial( {

    //color: 0xffffff,

    roughness: 1,
    metalness: 1,
    map: texture,

    } );
	var Skybox = new THREE.Mesh(skyGeo, materiall);
	// put the video both sides of the sphere
	Skybox.material.side = THREE.DoubleSide;
	//Skybox.Side = THREE.DoubleSide;
	//add sky
	scene.add(Skybox);
}
    
function loadGLTFF(path, pos,scale) {
	
	return new Promise((resolve, reject)=>{

		// Instantiate a loader
		var loader = new GLTFLoader();
	
		// Optional: Provide a DRACOLoader instance to decode compressed mesh data
		var dracoLoader = new DRACOLoader();
		// dracoLoader.setDecoderPath( '/examples/js/libs/draco/' );
		dracoLoader.setDecoderPath('https://www.gstatic.com/draco/v1/decoders/');
		loader.setDRACOLoader( dracoLoader );
	
		// Load a glTF resource
		loader.load(
			// resource URL
			path,
			// called when the resource is loaded
			function ( gltf ) {
				//Transformations
				gltf.scene.scale.set(scale[0], scale[1], scale[2]);
				gltf.scene.position.set(pos[0], pos[1], pos[2]);
				gltf.scene.castShadow = true;
				gltf.scene.receiveShadow = true;
				gltf.scene.traverse( function ( child ) {
					
					if ( child.isMesh ) {
						child.castShadow = true;
						child.receiveShadow = true;
					}
					if(child instanceof THREE.Mesh){
						
						child.material.emissive ;
						child.material.emissiveIntensity ;console.log(child.material);
					
					}childdd=child;
				} );
				scene.add( gltf.scene );
				childd=gltf.scene;
				console.log(gltf);
				addGUIGLTF();
				gltf.animations; // Array<THREE.AnimationClip>
				gltf.scene; // THREE.Group
				gltf.scenes; // Array<THREE.Group>
				gltf.cameras; // Array<THREE.Camera>
				gltf.asset; // Object

				
				resolve(gltf);
	
			},
			// called while loading is progressing
			function ( xhr ) {
	
				console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
	
			},
			// called when loading has errors
			function ( error ) {
	
				console.log( 'An error happened' );
				reject(error);
			});	
	});
}
function addGUIGLTF(){//Create animated sky
	
	
	
	var guigltf = gui.addFolder('GLTF');
	guigltf.add(childdd.material, 'emissiveIntensity').min(0).max(1).step(0.1).onChange(function (val) {
		
		childd.traverse( function ( child ) {
					
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
			if(child instanceof THREE.Mesh){
				
				
				child.material.emissiveIntensity = val;
			}
		});
	}).name('Intensity');
	guigltf.addColor(childdd.material, 'emissive').onChange(function (val) {
		
		childd.traverse( function ( child ) {
					
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
			if(child instanceof THREE.Mesh){
				
				child.material.emissive=val;
				
			}
		});
	}).name('Emissive');

	
	guigltf.add(childdd.material,'emissiveIntensity').min(0).max(1).step(0.1).onChange(function (val) {
		
		
		childd.traverse( function ( child ) {
					
			if ( child.isMesh ) {
				child.castShadow = true;
				child.receiveShadow = true;
			}
			if(child instanceof THREE.Mesh){
				
				
				child.material.matcap = val;
			}
		});
	}).name('Map');
	
	
}

function displayWindowSize(){
	// Get width and height of the window excluding scrollbars
	var w = document.documentElement.clientWidth;
	var h = document.documentElement.clientHeight;
	
	// Display result inside a div element
	// console.log("Width: " + w + ", " + "Height: " + h);
	renderer.setSize(w, h);
	// camera.fov = Math.atan(window.innerHeight / 2 / camera.position.z) * 2 * THREE.Math.RAD2DEG;
	camera.aspect = w / h;
	camera.updateProjectionMatrix();
}

// Attaching the event listener function to window's resize event
window.addEventListener("resize", displayWindowSize);
// document.addEventListener( 'keydown', onKeyDown, false );
// document.addEventListener( 'keyup', onKeyUp, false );

function animate() 
{
	

  requestAnimationFrame(animate);
  render();
  renderer.render(scene, camera);
  controls.update();
  stats.update();
  var dt = clock.getDelta();
  
  //controls.update();
}


function render() 
{
	const delta = clock.getDelta();
	//Para la animacion
	if ( mixer ) mixer.update( delta );
	if ( mixer2 ) mixer2.update( delta );
	if ( mixerCap ) mixerCap.update( delta );
	
	
}

init();
main();
animate();

* *********************FIN GLTF-Emissive Loader**************************/