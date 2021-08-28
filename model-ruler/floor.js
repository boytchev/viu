
// create the textile floor

import {RULER_HEIGHT} from './config.js';
import {MAX_ANISOTROPY, scene} from './init.js';


const SIZE = 1000;

				
var texture = new THREE.TextureLoader().load( '../textures/fabric.jpg' );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.magFilter = THREE.LinearFilter;
	texture.repeat.set( 50, 50 );
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


var floor = new THREE.Mesh( geometry, material );
	floor.receiveShadow = true;
	floor.rotation.x = -Math.PI/2;

	
scene.add( floor );

export {floor};