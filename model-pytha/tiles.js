
// create four tiles

//
// tile4
//
import {FRAME_SIZE, TILE_HEIGHT, FRAME_WIDTH, A, B, GROOVE_DENT, GROOVE_RADIUS, MATRIX, ANGLE} from './config.js';
import {scene} from './init.js';
import {gapPos} from './frame.js';


const COLOR_COLLISSIONS = false;

export var activeTile;



function intersecting( box1, box2 )
{
	var eps = 1;
	
	// touching boxes count as NON intersecting
	return box1.max.x < box2.min.x+eps || box1.min.x > box2.max.x-eps ||
		box1.max.z < box2.min.z+eps || box1.min.z > box2.max.z-eps ? false : true;

}

function trintersecting( trig1, trig3)
{
	return (trig1.containsPoint(trig3.a) ||
			trig1.containsPoint(trig3.b) ||
			trig1.containsPoint(trig3.c) ||
			trig3.containsPoint(trig1.a) ||
			trig3.containsPoint(trig1.b) ||
			trig3.containsPoint(trig1.c));
}

function hasCollissions()
{
	if( COLOR_COLLISSIONS )
	{
		tile1.children[1].material.color = new THREE.Color( 'white' );
		tile2.children[1].material.color = new THREE.Color( 'white' );
		tile3.children[1].material.color = new THREE.Color( 'white' );
		tile4.children[1].material.color = new THREE.Color( 'white' );
	}
	
	var box1 = new THREE.Box3().setFromObject( tile1 ),
		box2 = new THREE.Box3().setFromObject( tile2 ),
		box3 = new THREE.Box3().setFromObject( tile3 ),
		box4 = new THREE.Box3().setFromObject( tile4 );
	
	var eps = 0.2;
	var trig1 = new THREE.Triangle(
					new THREE.Vector3(box1.min.x+eps,0,box1.min.z+eps),
					new THREE.Vector3(box1.min.x+eps,0,box1.max.z+eps),
					new THREE.Vector3(box1.max.x+eps,0,box1.max.z+eps) ),
		trig2 = new THREE.Triangle(
					new THREE.Vector3(box2.max.x+eps,0,box2.min.z+eps),
					new THREE.Vector3(box2.min.x+eps,0,box2.max.z+eps),
					new THREE.Vector3(box2.max.x+eps,0,box2.max.z+eps) ),
		trig3 = new THREE.Triangle(
					new THREE.Vector3(box3.max.x+eps,0,box3.min.z+eps),
					new THREE.Vector3(box3.min.x+eps,0,box3.min.z+eps),
					new THREE.Vector3(box3.max.x+eps,0,box3.max.z+eps) ),
		trig4 = new THREE.Triangle(
					new THREE.Vector3(box4.max.x+eps,0,box4.min.z+eps),
					new THREE.Vector3(box4.min.x+eps,0,box4.min.z+eps),
					new THREE.Vector3(box4.min.x+eps,0,box4.max.z+eps) );


	if( intersecting(box1,box2) && trintersecting(trig1,trig2) )
	{
		if( COLOR_COLLISSIONS )
		{
			tile1.children[1].material.color = new THREE.Color( 'crimson' );
			tile2.children[1].material.color = new THREE.Color( 'crimson' );
		}
		return true;
	}
	
	if( intersecting(box1,box3) && trintersecting(trig1,trig3) )
	{
		if( COLOR_COLLISSIONS )
		{
			tile1.children[1].material.color = new THREE.Color( 'crimson' );
			tile3.children[1].material.color = new THREE.Color( 'crimson' );
		}
		return true;
	}
	
	if( intersecting(box1,box4) && trintersecting(trig1,trig4) )
	{
		if( COLOR_COLLISSIONS )
		{
			tile1.children[1].material.color = new THREE.Color( 'crimson' );
			tile4.children[1].material.color = new THREE.Color( 'crimson' );
		}
		return true;
	}
	
	if( intersecting(box2,box3) && trintersecting(trig2,trig3) )
	{
		if( COLOR_COLLISSIONS )
		{
			tile2.children[1].material.color = new THREE.Color( 'crimson' );
			tile3.children[1].material.color = new THREE.Color( 'crimson' );
		}
		return true;
	}
	
	if( intersecting(box2,box4) && trintersecting(trig2,trig4) )
	{
		if( COLOR_COLLISSIONS )
		{
			tile2.children[1].material.color = new THREE.Color( 'crimson' );
			tile4.children[1].material.color = new THREE.Color( 'crimson' );
		}
		return true;
	}
	
	if( intersecting(box3,box4) && trintersecting(trig3,trig4) )
	{
		if( COLOR_COLLISSIONS )
		{
			tile3.children[1].material.color = new THREE.Color( 'crimson' );
			tile4.children[1].material.color = new THREE.Color( 'crimson' );
		}
		return true;
	}

	return false;
}
		


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
				ior: 2,
				transparent: true,
				opacity: 1,
			});
					
		this.plateMesh = new THREE.Mesh( geometry, material );
		this.plateMesh.rotation.x = -Math.PI/2;
		this.plateMesh.position.set( -A/2, 0, A/2 );
		this.plateMesh.castShadow = true;
					
		this.lineMesh = new THREE.LineSegments( 
				new THREE.EdgesGeometry( geometry, 90 ),
				new THREE.LineBasicMaterial( { color: 'white', transparent: true, opacity: 0.35 } ) );
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


	focus( raise = true )
	{
		this.position.y = raise?1.2:0.1;
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
		var origPos = this.position.clone(),
			bestDist = Infinity;
	
		var j = -1;
		
		for( var i=0; i<gapPos.length; i++ )
		{
			var d = origPos.distanceTo( gapPos[i] );
			if( d < bestDist )
			{
				bestDist = d;
				j = i;
			}
		}
		
		this.position.copy( gapPos[j] );
		if( !hasCollissions() )
			this.gapPosIndex = j;
		
		this.position.copy( gapPos[this.gapPosIndex] );
		
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


function EchoGeometry()
{
	const R = GROOVE_RADIUS;
			
	var shape = new THREE.Shape();
		shape.moveTo( A/2, 0 );
		shape.lineTo( R, 0 );
		shape.quadraticCurveTo( 0, 0, 0, R );
		shape.lineTo( 0, B-R );
		shape.quadraticCurveTo( 0, B, R/B*A, B-R );
		shape.lineTo( A, 0 );
				
	return new THREE.ExtrudeGeometry( shape, {
			steps: 1,
			depth: TILE_HEIGHT,
			bevelEnabled: false,
		}).rotateX(-Math.PI/2).translate(-A/2, 0, A/2 ).rotateY( -ANGLE );
}

// blur a focused tile (if any)
export function blur()
{
	if( activeTile ) activeTile.blur();
}
		
				
		
var x = A/2-FRAME_SIZE/2;
			
var tile1 = new Tile();
	tile1.gapPosIndex = 1;
	tile1.position.copy( gapPos[1] );
	tile1.name = 'tile1';
	tile1.snap = {
					minX: Math.min( gapPos[0].x, gapPos[1].x, gapPos[5].x, gapPos[12].x ),
					maxX: Math.max( gapPos[0].x, gapPos[1].x, gapPos[5].x, gapPos[12].x ),
					minZ: Math.min( gapPos[0].z, gapPos[1].z, gapPos[5].z, gapPos[12].z ),
					maxZ: Math.max( gapPos[0].z, gapPos[1].z, gapPos[5].z, gapPos[12].z ),
				};
			
var tile2 = new Tile();
	tile2.gapPosIndex = 0;
	tile2.position.copy( gapPos[0] );
	tile2.rotation.y = Math.PI/2;
	tile2.name = 'tile2';
	tile2.snap = {
					minX: Math.min( gapPos[0].x, gapPos[3].x, gapPos[4].x, gapPos[15].x ),
					maxX: Math.max( gapPos[0].x, gapPos[3].x, gapPos[4].x, gapPos[15].x ),
					minZ: Math.min( gapPos[0].z, gapPos[3].z, gapPos[4].z, gapPos[15].z ),
					maxZ: Math.max( gapPos[0].z, gapPos[3].z, gapPos[4].z, gapPos[15].z ),
				};
			
var tile3 = new Tile();
	tile3.gapPosIndex = 3;
	tile3.position.copy( gapPos[3] );
	tile3.rotation.y = 2*Math.PI/2;
	tile3.name = 'tile3';
	tile3.snap = {
					minX: Math.min( gapPos[2].x, gapPos[3].x, gapPos[7].x, gapPos[14].x ),
					maxX: Math.max( gapPos[2].x, gapPos[3].x, gapPos[7].x, gapPos[14].x ),
					minZ: Math.min( gapPos[2].z, gapPos[3].z, gapPos[7].z, gapPos[14].z ),
					maxZ: Math.max( gapPos[2].z, gapPos[3].z, gapPos[7].z, gapPos[14].z ),
				};
			
var tile4 = new Tile();
	tile4.gapPosIndex = 2;
	tile4.position.copy( gapPos[2] );
	tile4.rotation.y = 3*Math.PI/2;
	tile4.name = 'tile4';
	tile4.snap = {
					minX: Math.min( gapPos[1].x, gapPos[2].x, gapPos[6].x, gapPos[13].x ),
					maxX: Math.max( gapPos[1].x, gapPos[2].x, gapPos[6].x, gapPos[13].x ),
					minZ: Math.min( gapPos[1].z, gapPos[2].z, gapPos[6].z, gapPos[13].z ),
					maxZ: Math.max( gapPos[1].z, gapPos[2].z, gapPos[6].z, gapPos[13].z ),
				};

//	[ 2]	[ 6][15]	[ 3]
//
//	[14]	[10][11]	[ 7]
//	[ 5]	[ 9][ 8]	[12]
//
//	[ 1]	[13][ 4]	[ 0]

// impossible positions
//
// tile1 & tile2
//	
export var tiles = [tile1, tile2, tile3, tile4];

scene.add( ...tiles );

