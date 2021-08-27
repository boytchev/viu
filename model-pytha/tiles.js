
// create four tiles

//
// tile4
//
import {FRAME_SIZE, TILE_HEIGHT, FRAME_WIDTH, A, B, GROOVE_DENT, GROOVE_RADIUS, MATRIX, ANGLE, TILE_RADIUS} from './config.js';
import {scene, MAX_ANISOTROPY} from './init.js';
import {gapPos, texture} from './frame.js';
import {Braille} from './braille.js';


const COLOR_COLLISSIONS = !false;

export var activeTile;


// load textures

var mapA = new THREE.TextureLoader().load( '../textures/a.jpg' );
	mapA.anisotropy = MAX_ANISOTROPY;

var normalA = new THREE.TextureLoader().load( '../textures/a-normal.jpg' );
	normalA.anisotropy = MAX_ANISOTROPY;

var mapB = new THREE.TextureLoader().load( '../textures/b.jpg' );
	mapB.anisotropy = MAX_ANISOTROPY;

var normalB = new THREE.TextureLoader().load( '../textures/b-normal.jpg' );
	normalB.anisotropy = MAX_ANISOTROPY;

var mapC = new THREE.TextureLoader().load( '../textures/c.jpg' );
	mapC.anisotropy = MAX_ANISOTROPY;

var normalC = new THREE.TextureLoader().load( '../textures/c-normal.jpg' );
	normalC.anisotropy = MAX_ANISOTROPY;



// Modified from https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
function isect( p0, p1, p2, p3 )
{
    var s1_x = p1.x - p0.x,
		s1_z = p1.z - p0.z,
		s2_x = p3.x - p2.x,
		s2_z = p3.z - p2.z;

	var s = (-s1_z * (p0.x - p2.x) + s1_x * (p0.z - p2.z)) / (-s2_x * s1_z + s1_x * s2_z),
		t = ( s2_x * (p0.z - p2.z) - s2_z * (p0.x - p2.x)) / (-s2_x * s1_z + s1_x * s2_z);

	const eps = 0.01;
	
    return s>eps && s<1-eps && t>eps && t<1-eps;
}

// intersection of two triangles
function tsect( t1, t2 )
{
	if( isect(t1.a,t1.b, t2.a,t2.b ) ) return true;
	if( isect(t1.a,t1.b, t2.b,t2.c ) ) return true;
	if( isect(t1.a,t1.b, t2.c,t2.a ) ) return true;

	if( isect(t1.b,t1.c, t2.a,t2.b ) ) return true;
	if( isect(t1.b,t1.c, t2.b,t2.c ) ) return true;
	if( isect(t1.b,t1.c, t2.c,t2.a ) ) return true;

	if( isect(t1.c,t1.a, t2.a,t2.b ) ) return true;
	if( isect(t1.c,t1.a, t2.b,t2.c ) ) return true;
	if( isect(t1.c,t1.a, t2.c,t2.a ) ) return true;
	
	return false;
}


function hasCollissions()
{
	var box1 = new THREE.Box3().setFromObject( tile1 ),
		box2 = new THREE.Box3().setFromObject( tile2 ),
		box3 = new THREE.Box3().setFromObject( tile3 ),
		box4 = new THREE.Box3().setFromObject( tile4 );
	
	var trig1 = new THREE.Triangle(
					new THREE.Vector3(box1.min.x,0,box1.min.z),
					new THREE.Vector3(box1.min.x,0,box1.max.z),
					new THREE.Vector3(box1.max.x,0,box1.max.z) ),
		trig2 = new THREE.Triangle(
					new THREE.Vector3(box2.max.x,0,box2.min.z),
					new THREE.Vector3(box2.min.x,0,box2.max.z),
					new THREE.Vector3(box2.max.x,0,box2.max.z) ),
		trig3 = new THREE.Triangle(
					new THREE.Vector3(box3.max.x,0,box3.min.z),
					new THREE.Vector3(box3.min.x,0,box3.min.z),
					new THREE.Vector3(box3.max.x,0,box3.max.z) ),
		trig4 = new THREE.Triangle(
					new THREE.Vector3(box4.max.x,0,box4.min.z),
					new THREE.Vector3(box4.min.x,0,box4.min.z),
					new THREE.Vector3(box4.min.x,0,box4.max.z) );

	if( tsect( trig1, trig2 ) ) return true;
	if( tsect( trig1, trig3 ) ) return true;
	if( tsect( trig1, trig4 ) ) return true;
	if( tsect( trig2, trig3 ) ) return true;
	if( tsect( trig2, trig4 ) ) return true;
	if( tsect( trig3, trig4 ) )	return true;

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
		
		const R = TILE_RADIUS;
				
		var shape = new THREE.Shape();
			shape.moveTo( A/2, 0 );
			shape.lineTo( R, 0 );
			shape.quadraticCurveTo( 0, 0, 0, R );
			shape.lineTo( 0, B-2*R );
			shape.quadraticCurveTo( 0, B, 2*R/B*A, B-2*R );
			shape.lineTo( A, 0 );
					
		var geometry = new THREE.ExtrudeGeometry( shape, {
				steps: 1,
				depth: TILE_HEIGHT,
				bevelEnabled: false,
			}).rotateX(-Math.PI/2);

		var pos = geometry.getAttribute( 'position' ),
			uv = geometry.getAttribute( 'uv' );

		for( var i=0; i<pos.count; i++ )
		{
			var x = pos.getX( i ),
				z = pos.getZ( i );
				
			uv.setXY( i, 0.02*x+this.tileId/5, 0.02*z+this.tileId/2 );
		}

		var material = new THREE.MeshPhysicalMaterial( {
				color: new THREE.Color(0.6,0.5,0.4),
				roughness: 0.9,
				metalness: 0,
				side: THREE.DoubleSide,
				map: texture,
			});
					
		this.plateMesh = new THREE.Mesh( geometry, material );
		this.plateMesh.position.set( -A/2, 0, A/2 );
		this.plateMesh.castShadow = true;
		this.plateMesh.receiveShadow = true;

		var scriptGeometry = new THREE.PlaneGeometry( 3, 3 ).rotateX( -Math.PI/2 );

		// "A"
		var braille = new Braille( 3, 3, mapA, normalA );
			braille.position.set( -1, TILE_HEIGHT, A/2-2 );
			this.add( braille );
		
		// "B"
		var braille = new Braille( 3, 3, mapB, normalB );
			braille.position.set( -A/2+2, TILE_HEIGHT, A/2-B/2 );
			braille.rotation.y = -Math.PI/2;
			this.add( braille );
		
		// "C"
		var braille = new Braille( 3, 3, mapC, normalC );
			braille.position.set( -2, TILE_HEIGHT, -B/2+A/2+2 );
			braille.rotation.y = ANGLE+Math.PI/2;
			this.add( braille );
		
		this.lineMesh = new THREE.LineSegments( 
				new THREE.EdgesGeometry( geometry, 90 ),
				new THREE.LineBasicMaterial( { color: 'black', transparent: true, opacity: 0.25 } ) );
		this.plateMesh.add( this.lineMesh );

		var shape = new THREE.Shape();
			shape.moveTo( 0, 0 );
			shape.absarc( 0, 0, R, 0, 2*Math.PI );
				
		const points = [];
		for ( let i = 0; i < 20; i ++ ) {
			points.push( new THREE.Vector2( 2*R*i/20, 0.1*Math.cos( i/20 * Math.PI )+TILE_HEIGHT/2 ) );
		}
		var geometry = new THREE.LatheGeometry( points, 40 ),
			pos = geometry.getAttribute( 'position' ),
			uv = geometry.getAttribute( 'uv' );

		for( var i=0; i<pos.count; i++ )
		{
			var x = pos.getX( i ),
				z = pos.getZ( i );
				
			uv.setXY( i, 0.02*x+this.tileId/5, 0.02*z+this.tileId/2 );
		}
		
		this.bumpMesh = new THREE.Mesh( geometry, material );
		this.bumpMesh.position.y = TILE_HEIGHT;

		this.isTile = true;
		this.add( this.bumpMesh, this.plateMesh );
	} // Tile.constructor


	focus( raise = true )
	{
		this.position.y = raise?0.15:0.1;
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

