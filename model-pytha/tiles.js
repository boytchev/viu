
// create four tiles

import {FRAME_SIZE, TILE_HEIGHT, FRAME_WIDTH, A, B, K, GROOVE_DENT, GROOVE_RADIUS
/*FRAME_HEIGHT, FRAME_RADIUS, FRAME_DENT, INNER_RADIUS, B, ANGLE*/} from './config.js';
import {scene, MAX_ANISOTROPY} from './init.js';


// create and return a new tile1

function newTile( )
{
	
	const R = GROOVE_RADIUS;
			
	var shape = new THREE.Shape();
		shape.moveTo( A/2, 0 );
		shape.lineTo( R, 0 );
		shape.quadraticCurveTo( 0, 0, 0, R );
		shape.lineTo( 0, B-R );
		shape.quadraticCurveTo( 0, B, R/B*A, B-R );
		shape.lineTo( A, 0 );
				
	var geometry = new THREE.ExtrudeGeometry( shape, {
			steps: 1,
			depth: TILE_HEIGHT,
			bevelEnabled: false,
		});
						
	var material = new THREE.MeshPhysicalMaterial( {
			roughness: 0.2,
			metalness: 0,
			emissive: 'cornflowerblue',
			emissiveIntensity: 0.5,
			clearcoat: 1,
			sheen: new THREE.Color('crimson'),
			transmission: 0.9,
			thickness: 0,
			ior: 3,
			transparent: true,
			opacity: 1,
		});
				
	var plateMesh = new THREE.Mesh( geometry, material );
		plateMesh.rotation.x = -Math.PI/2;
		plateMesh.position.set( -A/K, 0, A/K );
		plateMesh.castShadow = true;
				
//const edges = new THREE.EdgesGeometry( geometry, 90 );
//const line = new THREE.LineSegments( edges, new THREE.LineBasicMaterial( { color: 'navy', transparent: true, opacity: 0.35 } ) );
//plateMesh.add( line );

	var shape = new THREE.Shape();
		shape.moveTo( 0, 0 );
		shape.absarc( 0, 0, R, 0, 2*Math.PI );
			
	var geometry = new THREE.ExtrudeGeometry( shape, {
			steps: 1,
			depth: 2*GROOVE_DENT+TILE_HEIGHT,
			bevelEnabled: false,
	});
			
	var material = new THREE.MeshStandardMaterial( {
			roughness: 0,
			metalness: 0,
			emissive: 'gray',
			emissiveIntensity: 0.2,
	});
	
	var bumpMesh = new THREE.Mesh( geometry, material );
		bumpMesh.rotation.x = -Math.PI/2;
		bumpMesh.position.set( 0, -GROOVE_DENT, 0 );
		bumpMesh.castShadow = true;
		bumpMesh.receiveShadow = true;

	var mesh = new THREE.Group();
		mesh.add( plateMesh, bumpMesh );
		
	scene.add( mesh );
			
	return mesh;
}
			
			
var x = A/K-FRAME_SIZE/2;
			
var tile1 = newTile();
	tile1.position.set( x, 0.1, -x );
			
var tile2 = newTile();
	tile2.position.set( -x, 0.1, -x );
	tile2.rotation.y = Math.PI/2;
			
var tile3 = newTile();
	tile3.position.set( -x, 0.1, x );
	tile3.rotation.y = 2*Math.PI/2;
			
var tile4 = newTile();
	tile4.position.set( x, 0.1, x );
	tile4.rotation.y = 3*Math.PI/2;

export {tile1, tile2, tile3, tile4};