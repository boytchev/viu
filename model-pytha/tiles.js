
// create four tiles

//
// tile4
//
import {FRAME_SIZE, TILE_HEIGHT, FRAME_WIDTH, A, B, GROOVE_DENT, GROOVE_RADIUS
/*FRAME_HEIGHT, FRAME_RADIUS, FRAME_DENT, INNER_RADIUS, B, ANGLE*/} from './config.js';
import {scene} from './init.js';
import {gapPos} from './frame.js';


export var activeTile;



// create and return a new tile1

var tileId = 0;

export class Tile extends THREE.Group
{
	constructor()
	{
		super();

		this.tileId = tileId++;
		
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
				transmission: 1,
				thickness: 0,
				ior: 0,
				transparent: true,
				opacity: 1,
			});
					
		this.plateMesh = new THREE.Mesh( geometry, material );
		this.plateMesh.rotation.x = -Math.PI/2;
		this.plateMesh.position.set( -A/2, 0, A/2 );
		this.plateMesh.castShadow = true;
					
		this.lineMesh = new THREE.LineSegments( 
				new THREE.EdgesGeometry( geometry, 90 ),
				new THREE.LineBasicMaterial( { color: 'navy', transparent: true, opacity: 0.35 } ) );
		this.plateMesh.add( this.lineMesh );

		var shape = new THREE.Shape();
			shape.moveTo( 0, 0 );
			shape.absarc( 0, 0, R, 0, 2*Math.PI );
				
		var geometry = new THREE.SphereGeometry( R, 30, 10, 0, 2*Math.PI, 0, Math.PI/2 ).scale(1,0.5,1);
				
		this.bumpMesh = new THREE.Mesh( geometry, material );
		this.bumpMesh.position.y = TILE_HEIGHT;
		//this.bumpMesh.castShadow = true;
		//this.bumpMesh.receiveShadow = true;

		var material = new THREE.MeshPhysicalMaterial( {
				roughness: 1,
				metalness: 0,
				color: 'cornflowerblue',
				clearcoat: 1,
				sheen: new THREE.Color('crimson'),
				//side: THREE.DoubleSide,
				//transparent: true,
				//opacity: 0.7,
			});
					
		this.bumpSubMesh = new THREE.Mesh( geometry, material );
		this.bumpSubMesh.position.y = TILE_HEIGHT/2;
		this.bumpSubMesh.rotation.x = Math.PI;
		this.bumpSubMesh.castShadow = true;
		this.bumpSubMesh.receiveShadow = true;

		this.isTile = true;
		this.add( this.bumpSubMesh, this.bumpMesh, this.plateMesh );
	} // Tile.constructor


	focus()
	{
		this.position.y = 1.2;
		if( activeTile == this ) return;
		
		if( activeTile ) activeTile.blur();
		this.plateMesh.material.emissiveIntensity = 1;
		activeTile = this;
	} // Tile.focus
	
	blur()
	{
		this.position.y = 0.1;
		this.plateMesh.material.emissiveIntensity = 0.5;
		activeTile = undefined;
	} // Tile.focus
	
	
	// snaps the tile to the nearest groove dot
	snapToDot()
	{
		var snapPos = this.position,
			bestDist = Infinity;
	
		//var j=0;
		for( var i=0; i<gapPos.length; i++ )
		{
			var d = this.position.distanceTo( gapPos[i] );
			if( d < bestDist )
			{
				bestDist = d;
				snapPos = gapPos[i];
				//j=i;
			}
		}
		
		//console.log(j);		
		this.position.copy( snapPos );
		
	} // Tile.snapToDot
	
	
	// defines whether given position is available
	snapToLines( newX, newZ )
	{
		this.position.x = newX;
		this.position.z = newZ;

		// if no snap data, exit
		if( !this.snap ) return;
		
		// clamp to border
		this.position.x = THREE.Math.clamp( this.position.x, this.snap.minX, this.snap.maxX );
		this.position.z = THREE.Math.clamp( this.position.z, this.snap.minZ, this.snap.maxZ );
	} // Tile.availablePosition
	
} // Tile			
		

// blur a focused tile (if any)
export function blur()
{
	if( activeTile ) activeTile.blur();
}
		
				
		
var x = A/2-FRAME_SIZE/2;
			
var tile1 = new Tile();
	tile1.position.set( x, 0.1, -x );
	tile1.snap = {
					minX: Math.min( gapPos[0].x, gapPos[1].x, gapPos[5].x, gapPos[12].x ),
					maxX: Math.max( gapPos[0].x, gapPos[1].x, gapPos[5].x, gapPos[12].x ),
					minZ: Math.min( gapPos[0].z, gapPos[1].z, gapPos[5].z, gapPos[12].z ),
					maxZ: Math.max( gapPos[0].z, gapPos[1].z, gapPos[5].z, gapPos[12].z ),
				};
			
var tile2 = new Tile();
	tile2.position.set( -x, 0.1, -x );
	tile2.rotation.y = Math.PI/2;
	tile2.snap = {
					minX: Math.min( gapPos[0].x, gapPos[3].x, gapPos[4].x, gapPos[15].x ),
					maxX: Math.max( gapPos[0].x, gapPos[3].x, gapPos[4].x, gapPos[15].x ),
					minZ: Math.min( gapPos[0].z, gapPos[3].z, gapPos[4].z, gapPos[15].z ),
					maxZ: Math.max( gapPos[0].z, gapPos[3].z, gapPos[4].z, gapPos[15].z ),
				};
			
var tile3 = new Tile();
	tile3.position.set( -x, 0.1, x );
	tile3.rotation.y = 2*Math.PI/2;
	tile3.snap = {
					minX: Math.min( gapPos[2].x, gapPos[3].x, gapPos[7].x, gapPos[14].x ),
					maxX: Math.max( gapPos[2].x, gapPos[3].x, gapPos[7].x, gapPos[14].x ),
					minZ: Math.min( gapPos[2].z, gapPos[3].z, gapPos[7].z, gapPos[14].z ),
					maxZ: Math.max( gapPos[2].z, gapPos[3].z, gapPos[7].z, gapPos[14].z ),
				};
			
var tile4 = new Tile();
	tile4.position.set( x, 0.1, x );
	tile4.rotation.y = 3*Math.PI/2;
	tile4.snap = {
					minX: Math.min( gapPos[1].x, gapPos[2].x, gapPos[6].x, gapPos[13].x ),
					maxX: Math.max( gapPos[1].x, gapPos[2].x, gapPos[6].x, gapPos[13].x ),
					minZ: Math.min( gapPos[1].z, gapPos[2].z, gapPos[6].z, gapPos[13].z ),
					maxZ: Math.max( gapPos[1].z, gapPos[2].z, gapPos[6].z, gapPos[13].z ),
				};

//	Tile 1			Tile 2			Tile 3			Tile 4
//	[  ]	[  ]	[  ]	[  ]	[  ]	[  ]	[ 2]	[ 6]
//      \				\				\				\
//	[  ]	[  ]	[  ]	[  ]	[  ]	[  ]	[14] \	[10]
//	[  ]	[  ]	[  ]	[  ]	[  ]	[  ]	[ 5]  \	[ 9]
//         \			   \			   \			   \
//	[  ]	[  ]	[  ]	[  ]	[  ]	[  ]	[ 1]	[13]
//


export var tiles = [tile1, tile2, tile3, tile4];

scene.add( ...tiles );

