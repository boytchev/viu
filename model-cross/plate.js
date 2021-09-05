
// create the static frame of the model

import {PLATE_INDENT, HOLDER_DISTANCE, PLATE_WIDTH, PLATE_SIZE, FRAME_HEIGHT} from './config.js';
import {MAX_ANISOTROPY, scene} from './init.js';
import {BufferGeometryUtils} from '../js/BufferGeometryUtils.js';
import {Braille} from './braille.js';
import {glassObject} from './glassobject.js';


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
	constructor ( x )
	{
		super();
		// STEP 1. START WITH A ROUNDED PLATFORM

		// 1.1: two crossed bars
		var base = new THREE.BoxGeometry( PLATE_WIDTH, PLATE_SIZE, PLATE_SIZE ).translate( x*HOLDER_DISTANCE, 0, 0 );

		var csg = CSG.subtract( [base, glassObject.geometry] );

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
			
		this.position.y = PLATE_SIZE/2+FRAME_HEIGHT-PLATE_INDENT;
	}
	
}


var light = new THREE.SpotLight( 'crimson', 0.3 );
	light.position.set( glassObject.position.x, 15, 0 );
	light.target = new THREE.Object3D();
	light.angle = Math.PI*0.5;
	light.penumbra = 1;
	scene.add( light );

light.target.position.x = glassObject.position.x;
scene.add( light.target );	
	
var plates = [
	new Plate( -2 ),
	new Plate( -1 ),
	new Plate(  0 ),
	new Plate(  1 ),
	new Plate(  2 )
];
	
scene.add( ...plates );

