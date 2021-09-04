
// create the static frame of the model

import {PLATE_WIDTH, PLATE_SIZE, FRAME_HEIGHT} from './config.js';
import {MAX_ANISOTROPY, scene} from './init.js';
import {BufferGeometryUtils} from '../js/BufferGeometryUtils.js';
import {Braille} from './braille.js';


export var texture = new THREE.TextureLoader().load( '../textures/marble.jpg' );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.anisotropy = MAX_ANISOTROPY;


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
				
			var ny = nor.getY( i );

			// generate vertex colors 
			if( false )
				color.push( 0.6,0.5,0.4 );
			else
				color.push( 0.6, 0.5, 0.4 );
			
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

var plate = new Plate( coneGeometry );
	plate.position.y = PLATE_SIZE/2+FRAME_HEIGHT;

scene.add( plate );

