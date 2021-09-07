
// initialize the scene

// WebGL renderer + shadows

export var clock = new THREE.Clock();

var renderer = new THREE.WebGLRenderer( {antialias:true} );
	renderer.setAnimationLoop( animate );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.VSMShadowMap

	document.body.appendChild( renderer.domElement );


const MAX_ANISOTROPY = renderer.capabilities.getMaxAnisotropy();

// scene

var scene = new THREE.Scene();
	scene.background = new THREE.Color(0.05,0.055,0.1);


// perspective camera

var camera = new THREE.PerspectiveCamera( 60, 1, 1, 1000 );
	camera.position.set( 30, 60, 60 );
	camera.lookAt( scene.position );


// main light + shadow

var light = new THREE.SpotLight( 'white', 1.3 );
	light.position.set( 80*10, 50*10, 40*10 );
	light.target = scene;
	light.angle = Math.PI/3/10;
	light.penumbra = 1/2;
	light.castShadow = true;
	light.shadow.mapSize.width = 2024/8; 
	light.shadow.mapSize.height = 2024/8; 
	light.shadow.camera.near = 900; 
	light.shadow.camera.far = 1800; 
	light.shadow.camera.left = -300; 
	light.shadow.camera.right = 300; 
	light.shadow.camera.top = -300; 
	light.shadow.camera.bottom = 300; 
	//light.shadow.bias = 0.0001; 
	light.shadow.radius = 3;

	scene.add( light );

// additional light without shadow

var subLight = new THREE.SpotLight( 'white', 0.3 );
	subLight.position.set( -80*10, 50*10, -40*10 );
	subLight.target = scene;
	subLight.angle = Math.PI/3/20;
	subLight.penumbra = 1/2;

	scene.add( subLight );


// coordinate system
//
//var axesHelper = new THREE.AxesHelper( 100 );
//	scene.add( axesHelper );
	
// interactive mouse and touch controllers

// 	the definition is extended by
//		this.resetState = function () {
//				state = STATE.NONE;
//			}; // added by P. Boytchev

var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI * 0.45;
	controls.minDistance = 20;
	controls.maxDistance = 200;
	controls.enableDamping = !true;
	controls.dampingFactor = 0.5;
	controls.rotateSpeed = 0.3;
	controls.panSpeed = 0.7;
	controls.screenSpacePanning = false;
	controls.target.set( 0, 10, 0 );
	controls.update();
	
// manage window rezie or smartphone rotation
			
window.addEventListener( 'resize', onWindowResize, false );
onWindowResize();

function onWindowResize( event )
{
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight, true );
}			


// main animation cycle

function animate( time )
{
	//controls.update( time );
	renderer.render( scene, camera );
}


// for GLTF download
const link = document.createElement( 'a' );
	link.style.display = 'none';
	document.body.appendChild( link );

function save( blob, filename )
{
	link.href = URL.createObjectURL( blob );
	link.download = filename;
	link.click();
}

function saveString( text, filename )
{
	save( new Blob( [ text ], { type: 'text/plain' } ), filename );
}

function saveArrayBuffer( buffer, filename )
{
	save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );
}

const exporter = new THREE.GLTFExporter();

function saveGLTF( geometry, filename )
{
	var obj = new THREE.Mesh( this.geometry );
	
	exporter.parse( obj, function ( gltf ) {
		//saveArrayBuffer( gltf, 'sphere.glb' );
		saveString( JSON.stringify( gltf, null, 2 ), `object_${GLASS_OBJECT_TYPE}.gltf` );
	}, {binary: false} );
}

export {scene, camera, controls, MAX_ANISOTROPY, renderer, saveGLTF};