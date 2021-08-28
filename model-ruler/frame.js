
// create the static frame of the model

import {FRAME_WIDTH, FRAME_HEIGHT, FRAME_LENGTH, FRAME_RADIUS, RULER_HEIGHT, RULER_WIDTH, FRAME_INSET, MARK_WIDTH, MARK_HEIGHT, RULER_LENGTH} from './config.js';
import {MAX_ANISOTROPY, scene} from './init.js';
import {rulers} from './ruler.js';
import {BufferGeometryUtils} from '../js/BufferGeometryUtils.js';
import {Braille} from './braille.js';


export var texture = new THREE.TextureLoader().load( '../textures/marble.jpg' );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.anisotropy = MAX_ANISOTROPY;


class Frame extends THREE.Group
{
	constructor ()
	{
		super();
		// STEP 1. START WITH A ROUNDED PLATFORM

		// 1.1: two crossed bars
						
		this.snap = { minX: -60, maxX: 60 };

		var base1 = new THREE.BoxGeometry( FRAME_WIDTH, FRAME_HEIGHT, FRAME_LENGTH-2*FRAME_RADIUS ),
			base2 = new THREE.BoxGeometry( FRAME_WIDTH-2*FRAME_RADIUS, FRAME_HEIGHT, FRAME_LENGTH );

		// 1.2: cylinders at the corners

		var x = FRAME_WIDTH/2-FRAME_RADIUS,
			z = FRAME_LENGTH/2-FRAME_RADIUS;
						
		var corner1 = new THREE.CylinderGeometry( FRAME_RADIUS, FRAME_RADIUS, FRAME_HEIGHT, 60 ).translate( x, 0, z ),
			corner2 = new THREE.CylinderGeometry( FRAME_RADIUS, FRAME_RADIUS, FRAME_HEIGHT, 60 ).translate(-x, 0, z ),
			corner3 = new THREE.CylinderGeometry( FRAME_RADIUS, FRAME_RADIUS, FRAME_HEIGHT, 60 ).translate( x, 0,-z ),
			corner4 = new THREE.CylinderGeometry( FRAME_RADIUS, FRAME_RADIUS, FRAME_HEIGHT, 60 ).translate(-x, 0,-z );
							
		// 1.3: merge bars and corners into one rounded platform

		var csg = CSG.union( [base1, base2, corner1, corner2, corner3, corner4] );


		// STEP 2. CUT THE AREA FOR THE TILES

		// 2.1: two crossed bars

		var base1 = new THREE.BoxGeometry( FRAME_WIDTH, FRAME_HEIGHT, 2*RULER_WIDTH-2*FRAME_INSET ).translate( 0, (FRAME_HEIGHT-RULER_HEIGHT)/2, 0 ),
			base2 = new THREE.BoxGeometry( FRAME_WIDTH, RULER_HEIGHT+0.1, 2*RULER_WIDTH ),
			base3 = new THREE.BoxGeometry( MARK_WIDTH, (FRAME_HEIGHT-RULER_HEIGHT)/2, FRAME_WIDTH ).translate( 0, (FRAME_HEIGHT-RULER_HEIGHT)/4+RULER_HEIGHT/2+0.3, 0 ),
			slope1 = new THREE.BoxGeometry( FRAME_WIDTH, 2, 2).rotateX( Math.PI/4 ).scale(1,1/2,1).translate(0,FRAME_HEIGHT/2,RULER_WIDTH-FRAME_INSET),
			slope2 = new THREE.BoxGeometry( FRAME_WIDTH, 2, 2).rotateX( Math.PI/4 ).scale(1,1/2,1).translate(0,FRAME_HEIGHT/2,-RULER_WIDTH+FRAME_INSET);
				
		csg = CSG.subtract( [csg, base1, base2, base3, slope1, slope2]);
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
			if( ny>0.5 && y<0 )
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
			
		
		// "Viu"
		var mapViu = new THREE.TextureLoader().load( '../textures/viu.png' );
			mapViu.anisotropy = MAX_ANISOTROPY;

		var normalViu = new THREE.TextureLoader().load( '../textures/viu-normal.png' );
			normalViu.anisotropy = MAX_ANISOTROPY;

		var braille = new Braille( 2, 1, mapViu, normalViu );
			braille.material.color = new THREE.Color( 'white' );
			braille.position.set( FRAME_WIDTH/2-2.5, -0.5, FRAME_LENGTH/2+0.1 );
			braille.rotation.x = Math.PI/2;
			this.add( braille );

		// thread
		var material = new THREE.MeshBasicMaterial( {color: 'black'} ),
			threadShadow = new THREE.Mesh(
							new THREE.BoxGeometry( 3*MARK_WIDTH/2, FRAME_LENGTH, MARK_WIDTH/10 ),
							new THREE.MeshBasicMaterial( {color: 'black', transparent: true, opacity:0.2} ), ),
			thread = new THREE.Mesh(
							new THREE.CylinderGeometry( MARK_WIDTH/4, MARK_WIDTH/4, FRAME_LENGTH+4*MARK_WIDTH ),
							material ),
			node1 = new THREE.Mesh(
							new THREE.IcosahedronGeometry( 2*MARK_WIDTH, 2 ),
							material ),
			node2 = node1.clone();
			
		this.add( thread );
		thread.add( node1, node2, threadShadow );
		thread.rotation.x = Math.PI/2;
		node1.position.y = FRAME_LENGTH/2+1*MARK_WIDTH;
		node2.position.y = -FRAME_LENGTH/2-1*MARK_WIDTH;
		thread.position.y = RULER_HEIGHT/2+MARK_WIDTH/2+MARK_HEIGHT;
		threadShadow.position.x = 0;
		//threadShadow.position.z = +0.2;
		//threadShadow.position.x = -1/2;
		thread.castShadow = true;
		//threadShadow.castShadow = true;
		
		this.isRuler = true;
	}

	// defines whether given position is available
	snapToZone( newX, newZ )
	{
		this.position.x = newX;

		// if no snap data, exit
		if( !this.snap ) return;
		
		// clamp to border
		this.position.x = THREE.Math.clamp( this.position.x, this.snap.minX, this.snap.maxX );
		
	} // Tile.availablePosition
}

var frame = new Frame();
	frame.position.y = FRAME_HEIGHT/2;

scene.add( frame );

rulers.push( frame );

export {frame};
