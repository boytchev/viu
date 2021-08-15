
// initialize the scene


// WebGL renderer + shadows

var renderer = new THREE.WebGLRenderer( {antialias:true} );
	renderer.setAnimationLoop( animate );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.VSMShadowMap

	document.body.appendChild( renderer.domElement );


// scene

var scene = new THREE.Scene();
	scene.background = new THREE.Color(0.05,0.055,0.1);


// perspective camera

var camera = new THREE.PerspectiveCamera( 60, 1, 1, 1000 );
	camera.position.set( 40, 80, 40 );
	camera.lookAt( scene.position );


// main light + shadow

var light = new THREE.SpotLight( 'white', 1.3 );
	light.position.set( 80*10, 50*10, 40*10 );
	light.target = scene;
	light.angle = Math.PI/3/20;
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


// interactive mouse and touch controllers

var controls = new THREE.OrbitControls( camera, renderer.domElement );
	controls.maxPolarAngle = Math.PI * 0.495;
	controls.minDistance = 20;
	controls.maxDistance = 100;
	controls.enableDamping = true;
	controls.dampingFactor = 0.25;
	controls.rotateSpeed = 0.3;
	controls.panSpeed = 0.7;
	controls.screenSpacePanning = false;
	controls.target.set( 0, 0, 0 );
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
	controls.update();
	renderer.render( scene, camera );
}


const MAX_ANISOTROPY = renderer.capabilities.getMaxAnisotropy();


export {scene, MAX_ANISOTROPY}