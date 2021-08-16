
// create the textile floor

import {FRAME_HEIGHT} from './config.js';
import {MAX_ANISOTROPY, scene} from './init.js';


const SIZE = 1000;

				
var texture = new THREE.TextureLoader().load( '../textures/fabric.jpg' );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 10, 10 );
	texture.anisotropy = MAX_ANISOTROPY;


var geometry = new THREE.PlaneGeometry( SIZE, SIZE );


var material = new THREE.MeshStandardMaterial( {
	color: 'dimgray',
	roughness: 1,
	metalness: 0,
	emissive: 'cornflowerblue',
	emissiveIntensity: 0.1,
	map: texture,
	bumpMap: texture
} );

		
var mesh = new THREE.Mesh( geometry, material );
	mesh.position.y = -FRAME_HEIGHT/2;
	mesh.receiveShadow = true;
	mesh.rotation.x = -Math.PI/2;

	
scene.add( mesh );
