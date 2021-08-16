
// create four tiles

import {FRAME_SIZE, TILE_HEIGHT, FRAME_WIDTH, A, B, K, GROOVE_DENT, GROOVE_RADIUS
/*FRAME_HEIGHT, FRAME_RADIUS, FRAME_DENT, INNER_RADIUS, B, ANGLE*/} from './config.js';
import {scene} from './init.js';


export var activeTile;



// create and return a new tile1

export class Tile extends THREE.Group
{
	constructor()
	{
		super();
		
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
					
		this.plateMesh = new THREE.Mesh( geometry, material );
		this.plateMesh.rotation.x = -Math.PI/2;
		this.plateMesh.position.set( -A/K, 0, A/K );
		this.plateMesh.castShadow = true;
					
		this.lineMesh = new THREE.LineSegments( 
				new THREE.EdgesGeometry( geometry, 90 ),
				new THREE.LineBasicMaterial( { color: 'navy', transparent: true, opacity: 0.35 } ) );
		this.plateMesh.add( this.lineMesh );

		var shape = new THREE.Shape();
			shape.moveTo( 0, 0 );
			shape.absarc( 0, 0, R, 0, 2*Math.PI );
				
		var geometry = new THREE.ExtrudeGeometry( shape, {
				steps: 1,
				depth: 2*GROOVE_DENT+TILE_HEIGHT,
				bevelEnabled: false,
		});
				
		var material = new THREE.MeshPhysicalMaterial( {
				roughness: 1,
				metalness: 0,
				color: 'cornflowerblue',
				clearcoat: 1,
				sheen: new THREE.Color('crimson'),
			});
					
		this.bumpMesh = new THREE.Mesh( geometry, material );
		this.bumpMesh.rotation.x = -Math.PI/2;
		this.bumpMesh.position.set( 0, -GROOVE_DENT, 0 );
		this.bumpMesh.castShadow = true;
		this.bumpMesh.receiveShadow = true;

		this.isTile = true;
		this.add( this.bumpMesh, this.plateMesh );
	} // Tile.constructor


	focus()
	{
		if( activeTile == this ) return;
		
		if( activeTile ) activeTile.blur();
		this.plateMesh.material.emissiveIntensity = 1;
		activeTile = this;
	} // Tile.focus
	
	blur()
	{
		this.plateMesh.material.emissiveIntensity = 0.5;
		activeTile = undefined;
	} // Tile.focus
	
} // Tile			
		

// blur a focused tile (if any)
export function blur()
{
	if( activeTile ) activeTile.blur();
}
		
		
		
		
var x = A/K-FRAME_SIZE/2;
			
var tile1 = new Tile();
	tile1.position.set( x, 0.1, -x );
			
var tile2 = new Tile();
	tile2.position.set( -x, 0.1, -x );
	tile2.rotation.y = Math.PI/2;
			
var tile3 = new Tile();
	tile3.position.set( -x, 0.1, x );
	tile3.rotation.y = 2*Math.PI/2;
			
var tile4 = new Tile();
	tile4.position.set( x, 0.1, x );
	tile4.rotation.y = 3*Math.PI/2;


export var tiles = [tile1, tile2, tile3, tile4];

scene.add( ...tiles );

