
// create the static frame of the model

import {HOLDER_DISTANCE,HOLDER_HEIGHT,HOLDER_WIDTH,PLATE_WIDTH,FRAME_SIZE,FRAME_HEIGHT,FRAME_RADIUS} from './config.js';
import {MAX_ANISOTROPY, scene} from './init.js';
import {BufferGeometryUtils} from '../js/BufferGeometryUtils.js';
import {Braille} from './braille.js';


export var texture = new THREE.TextureLoader().load( '../textures/marble.jpg' );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.anisotropy = MAX_ANISOTROPY;


class HolderGeometry extends THREE.ExtrudeGeometry
{
	constructor( distance )
	{
		const shape = new THREE.Shape();
		shape.moveTo( -HOLDER_WIDTH/2, -1 );
		shape.moveTo( -HOLDER_WIDTH/2, 0 );
		shape.quadraticCurveTo( 
				-1.5*PLATE_WIDTH, 0,
				-1.5*PLATE_WIDTH, HOLDER_HEIGHT );
		shape.bezierCurveTo(
				-1.5*PLATE_WIDTH, HOLDER_HEIGHT+PLATE_WIDTH/1,
				-0.5*PLATE_WIDTH, HOLDER_HEIGHT+PLATE_WIDTH/1,
				-0.5*PLATE_WIDTH, HOLDER_HEIGHT/1.0 );
		shape.lineTo( -0.5*PLATE_WIDTH, 0.1 );
		shape.lineTo( 0.5*PLATE_WIDTH, 0.1 );
		shape.lineTo( 0.5*PLATE_WIDTH, HOLDER_HEIGHT/1.0 );
		shape.bezierCurveTo( 0.5*PLATE_WIDTH, HOLDER_HEIGHT+PLATE_WIDTH/1, 1.5*PLATE_WIDTH, HOLDER_HEIGHT+PLATE_WIDTH/1, 1.5*PLATE_WIDTH, HOLDER_HEIGHT );
		shape.quadraticCurveTo( 1.5*PLATE_WIDTH, 0, HOLDER_WIDTH/2, 0  );
		shape.lineTo( HOLDER_WIDTH/2, -1 );
		shape.lineTo( -HOLDER_WIDTH/2, -1 );

		super( shape, {steps: 1, depth: FRAME_SIZE, bevelEnabled: false, curveSegments: 32 } );
		
		this.translate( distance, FRAME_HEIGHT/2, -FRAME_SIZE/2 );

		var color = [];
		var uv = [];

		var pos = this.getAttribute( 'position' );
		var nor = this.getAttribute( 'normal' );

		// 4.3: scan all vertices
						
		for( var i=0; i<pos.count; i++ )
		{
			var x = pos.getX( i ),
				y = pos.getY( i ),
				z = pos.getZ( i );
				
			var ny = nor.getY( i );

			// generate vertex colors 
			color.push( 1,1,1 );
			
			// generate uv coordinates
			if( ny>0.5 )
				uv.push( 0.02*x, 0.02*z );
			else
				uv.push( 0.02*(x+z), 0.02*y );
		}

		// 4.4: set attributes

		this.setAttribute( 'uv', new THREE.BufferAttribute(new Float32Array(uv),2) );
		this.setAttribute( 'color', new THREE.BufferAttribute(new Float32Array(color),3) );
	}
}


class Frame extends THREE.Group
{
	constructor ()
	{
		super();
		// STEP 1. START WITH A ROUNDED PLATFORM

		// 1.1: two crossed bars
		var base1 = new THREE.BoxGeometry( FRAME_SIZE, FRAME_HEIGHT, FRAME_SIZE-2*FRAME_RADIUS ),
			base2 = new THREE.BoxGeometry( FRAME_SIZE-2*FRAME_RADIUS, FRAME_HEIGHT, FRAME_SIZE );

		// 1.2: cylinders at the corners

		var x = FRAME_SIZE/2-FRAME_RADIUS,
			z = FRAME_SIZE/2-FRAME_RADIUS;
						
		var corner1 = new THREE.CylinderGeometry( FRAME_RADIUS, FRAME_RADIUS, FRAME_HEIGHT, 60 ).translate( x, 0, z ),
			corner2 = new THREE.CylinderGeometry( FRAME_RADIUS, FRAME_RADIUS, FRAME_HEIGHT, 60 ).translate(-x, 0, z ),
			corner3 = new THREE.CylinderGeometry( FRAME_RADIUS, FRAME_RADIUS, FRAME_HEIGHT, 60 ).translate( x, 0,-z ),
			corner4 = new THREE.CylinderGeometry( FRAME_RADIUS, FRAME_RADIUS, FRAME_HEIGHT, 60 ).translate(-x, 0,-z );
							
		// 1.3: merge bars and corners into one rounded platform

		var csg = CSG.union( [base1, base2, corner1, corner2, corner3, corner4] );


		
		// 4. FINALIZATION

		// 4.1: convert CSG to BufferGeometry

		var	geometry = CSG.BufferGeometry(csg);
		geometry = BufferGeometryUtils.mergeVertices( geometry, 0.001 );

		// 4.2: set vertex colour of grooves and uv texture coordinates

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
				color.push( 1,1,1 );
			
			// generate uv coordinates
			if( ny>0.5 )
				uv.push( 0.02*x, 0.02*z );
			else
				uv.push( 0.02*(x+z), 0.02*y );
		}

		// 4.4: set attributes

		geometry.setAttribute( 'uv', new THREE.BufferAttribute(new Float32Array(uv),2) );
		geometry.setAttribute( 'color', new THREE.BufferAttribute(new Float32Array(color),3) );


		console.log('frame',geometry.getAttribute( 'position' ).count);

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
			
			
		// holder
		var geometry = new HolderGeometry( 0 )
		var holder = new THREE.Mesh( geometry, material );
			holder.castShadow = true;
			holder.receiveShadow = true;
			this.add( holder );
		
		var geometry = new HolderGeometry( HOLDER_DISTANCE )
		var holder = new THREE.Mesh( geometry, material );
			holder.castShadow = true;
			holder.receiveShadow = true;
			this.add( holder );
		
		var geometry = new HolderGeometry( -HOLDER_DISTANCE )
		var holder = new THREE.Mesh( geometry, material );
			holder.castShadow = true;
			holder.receiveShadow = true;
			this.add( holder );
		
		
		// "Viu"
		var mapViu = new THREE.TextureLoader().load( '../textures/viu.png' );
			mapViu.anisotropy = MAX_ANISOTROPY;

		var normalViu = new THREE.TextureLoader().load( '../textures/viu-normal.png' );
			normalViu.anisotropy = MAX_ANISOTROPY;

		var braille = new Braille( 2, 1, mapViu, normalViu );
			braille.material.color = new THREE.Color( 'white' );
			braille.position.set( FRAME_SIZE/2-3.5, 0, FRAME_SIZE/2+0.1 );
			braille.rotation.x = Math.PI/2;
			this.add( braille );
	}

}

var frame = new Frame();
	frame.position.y = FRAME_HEIGHT/2;

scene.add( frame );

