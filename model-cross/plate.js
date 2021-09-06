
// create the static frame of the model

import {PLATE_DISTANCE, PLATE_SIZE_IN, PLATE_RADIUS_IN, PLATE_RADIUS, PLATE_INDENT, HOLDER_DISTANCE, PLATE_WIDTH, PLATE_SIZE, FRAME_HEIGHT} from './config.js';
import {MAX_ANISOTROPY, scene} from './init.js';
import {BufferGeometryUtils} from '../js/BufferGeometryUtils.js';
import {Braille} from './braille.js';
import {glassObject} from './glassobject.js';


export var texture = new THREE.TextureLoader().load( '../textures/marble.jpg' );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.anisotropy = MAX_ANISOTROPY;

class Plate extends THREE.Group
{
	constructor ( x )
	{
		super();
		// STEP 1. START WITH A ROUNDED PLATFORM

		this.posX = x*HOLDER_DISTANCE;
		
		// 1.1: two crossed bars
		var base = new THREE.BoxGeometry( PLATE_WIDTH/20, PLATE_SIZE-PLATE_RADIUS_IN/3, PLATE_SIZE-PLATE_RADIUS_IN/3 ).translate( this.posX, 0, 0 );

		var N = PLATE_SIZE/2,
			R = PLATE_RADIUS;
		const shape = new THREE.Shape();
			shape.moveTo( 0, -N );
			shape.lineTo( N-R, -N );
			shape.quadraticCurveTo( N, -N, N, -N+R );
			shape.lineTo( N, N-R );
			shape.quadraticCurveTo( N, N, N-R, N );
			shape.lineTo( -N+R, N );
			shape.quadraticCurveTo( -N, N, -N, N-R );
			shape.lineTo( -N, -N+R );
			shape.quadraticCurveTo( -N, -N, -N+R, -N );
			shape.lineTo( 0, -N );
		var N = PLATE_SIZE_IN/2,
			R = PLATE_RADIUS_IN;
		const hole = new THREE.Shape();
			hole.moveTo( 0, -N );
			hole.lineTo( N-R, -N );
			hole.quadraticCurveTo( N, -N, N, -N+R );
			hole.lineTo( N, N-R );
			hole.quadraticCurveTo( N, N, N-R, N );
			hole.lineTo( -N+R, N );
			hole.quadraticCurveTo( -N, N, -N, N-R );
			hole.lineTo( -N, -N+R );
			hole.quadraticCurveTo( -N, -N, -N+R, -N );
			hole.lineTo( 0, -N );
		shape.holes = [hole];
		var border = new THREE.ExtrudeGeometry( shape, {steps: 30, depth: PLATE_WIDTH, bevelEnabled: false, curveSegments: 32 } ).rotateY( -Math.PI/2 );
			border.translate( this.posX+PLATE_WIDTH/2, 0, 0 );

		var csg = CSG.union( [base, border] );
		var csg = CSG.subtract( [csg, glassObject.geometry] );

		var	geometry = CSG.BufferGeometry(csg);
		geometry = BufferGeometryUtils.mergeVertices( geometry, 0.001 );

		var color = [];
		var uv = [];

		var pos = geometry.getAttribute( 'position' );
		var nor = geometry.getAttribute( 'normal' );

		// 4.3: scan all vertices
						
		for( var i=0; i<pos.count; i++ )
		{
			var x = pos.getX( i ),
				y = pos.getY( i ),
				z = pos.getZ( i );
				
			var nx = nor.getX( i ),
				ny = nor.getY( i ),
				nz = nor.getZ( i );

			// generate vertex colors 
//			if( Math.abs(nz)>0.1 )
//				color.push( 0.6,0.5,0.4 );
//			else
				color.push( 1, 1, 1 );
			
			// generate uv coordinates
			if( ny>0.5 )
				uv.push( 0.02*x, 0.02*z );
			else
				uv.push( 0.02*(x+z), 0.02*y );
		}

		// 4.4: set attributes

		geometry.setAttribute( 'uv', new THREE.BufferAttribute(new Float32Array(uv),2) );
		geometry.setAttribute( 'color', new THREE.BufferAttribute(new Float32Array(color),3) );


		geometry.computeVertexNormals();


		var material = new THREE.MeshStandardMaterial( {
				color: 'white',
				roughness: 0.7,
				metalness: 0,
				map: texture,
				vertexColors: true,
		} );	
	
									
		var mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;
			mesh.receiveShadow = true;
			this.add( mesh );
			
		this.isPlate = true;
		this.position.y = PLATE_SIZE/2+FRAME_HEIGHT-PLATE_INDENT;
		this.position.z = -PLATE_DISTANCE;
		
	} // Plate.constructor

	// defines whether given position is available
	snapToZone( newZ )
	{
		this.position.z = newZ;

		// clamp to border
		this.position.z = THREE.Math.clamp( this.position.z, -PLATE_DISTANCE, 0 );
		
	} // Plate.snapToZone

	snap( )
	{
		if( this.position.z < -PLATE_DISTANCE/2 )
			this.position.z = -PLATE_DISTANCE
		else
			this.position.z = 0;
	} // Plate.snap

}


var light = new THREE.SpotLight( 'crimson', 0.3 );
	light.position.set( glassObject.position.x, 15, 0 );
	light.target = new THREE.Object3D();
	light.angle = Math.PI*0.5;
	light.penumbra = 1;
	scene.add( light );

light.target.position.x = glassObject.position.x;
scene.add( light.target );	
	
export var plates = [];
	if( glassObject.pattern & 0b10000 ) plates.push( new Plate( -2 ) );
	if( glassObject.pattern & 0b01000 ) plates.push( new Plate( -1 ) );
	if( glassObject.pattern & 0b00100 ) plates.push( new Plate(  0 ) );
	if( glassObject.pattern & 0b00010 ) plates.push( new Plate( +1 ) );
	if( glassObject.pattern & 0b00001 ) plates.push( new Plate( +2 ) );
	
scene.add( ...plates );

export var sensorPlate = new THREE.Mesh(
		new THREE.PlaneGeometry( 4*PLATE_SIZE, 4*PLATE_SIZE ),
		new THREE.MeshBasicMaterial( {side: THREE.DoubleSide} )
	);
sensorPlate.rotation.y = Math.PI/2;
sensorPlate.visible = false;
scene.add( sensorPlate );

