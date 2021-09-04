
// create the static frame of the model

import {PLATE_INDENT, HOLDER_DISTANCE, PLATE_WIDTH, PLATE_SIZE, FRAME_HEIGHT} from './config.js';
import {MAX_ANISOTROPY, scene} from './init.js';
import {BufferGeometryUtils} from '../js/BufferGeometryUtils.js';
import {Braille} from './braille.js';


export var texture = new THREE.TextureLoader().load( '../textures/marble.jpg' );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.anisotropy = MAX_ANISOTROPY;

export var texture2 = new THREE.TextureLoader().load( '../textures/dot-normal.jpg' );
	texture2.wrapS = THREE.RepeatWrapping;
	texture2.wrapT = THREE.RepeatWrapping;
	texture2.repeat = new THREE.Vector2( 10, 10 );
	texture2.anisotropy = MAX_ANISOTROPY;


class Plate extends THREE.Group
{
	constructor ( holeGeometry )
	{
		super();
		// STEP 1. START WITH A ROUNDED PLATFORM

		// 1.1: two crossed bars
		var base = new THREE.BoxGeometry( PLATE_WIDTH, PLATE_SIZE, PLATE_SIZE );

		var csg = CSG.subtract( [base, holeGeometry] );

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
			
	}

}

var sphereGeometry = new THREE.SphereGeometry( PLATE_SIZE/3, 32, 64 );
var coneGeometry = new THREE.CylinderGeometry( PLATE_SIZE/300, PLATE_SIZE/3, 2*PLATE_SIZE/3, 64 ).translate(5,0,0);
var cubeGeometry = new THREE.BoxGeometry( PLATE_SIZE/3, PLATE_SIZE/3, PLATE_SIZE/3 ).translate(10,0,0).rotateX(Math.PI/4).rotateY(Math.PI/4);

var material = new THREE.MeshPhysicalMaterial({
				color: 'pink',
				clearcoat: 0.5,
				roughness: 0,
				metalness: 0,
				map: texture,
				ior: 1.3,
				reflectivity: 0.2,
				thickness: 15,
				//transmissionMap: texture,
				transmission: 1,
				side: THREE.BackSide,
				sheen: new THREE.Color( 'pink' ),
});
var material2 = new THREE.MeshPhysicalMaterial({
				color: 'crimson',
				clearcoat: 0.15,
				roughness: 0,
				metalness: 0,
				map: texture,
				ior: 2.3,
				reflectivity: 0.2,
				thickness: 15,
				envMap: texture2,
				envMapIntensity: 1,
				specularIntensity: 1,
				transmission: 1,
				side: THREE.FrontSide,
				opacity: 0.85,
				transparent: true,
				sheen: new THREE.Color( 'pink' ),
});
var object2 = new THREE.Mesh( coneGeometry, material2 );
	object2.position.x = -15;
	object2.position.y = PLATE_SIZE/2+FRAME_HEIGHT-PLATE_INDENT;
	//object2.castShadow = true;
	object2.renderOrder = 20;
	scene.add( object2 );
var object = new THREE.Mesh( coneGeometry, material );
	object.position.x = -15;
	object.position.y = PLATE_SIZE/2+FRAME_HEIGHT-PLATE_INDENT;
	//object.castShadow = true;
	object.renderOrder = 11;
	scene.add( object );

var light = new THREE.SpotLight( 'crimson', 0.3 );
	light.position.set( object.position.x, 15, 0 );
	light.target = new THREE.Object3D();
	light.angle = Math.PI*0.5;
	light.penumbra = 1;
	scene.add( light );
light.target.position.x = object.position.x;
scene.add( light.target );	
	
var plate = new Plate( coneGeometry );
	plate.position.y = PLATE_SIZE/2+FRAME_HEIGHT-PLATE_INDENT;

var plate2 = new Plate( coneGeometry );
	plate2.position.y = PLATE_SIZE/2+FRAME_HEIGHT-PLATE_INDENT;
	plate2.position.x = -HOLDER_DISTANCE;

scene.add( plate, plate2 );

