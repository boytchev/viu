﻿
// create the static frame of the model

import {FRAME_HEIGHT, FRAME_SIZE, FRAME_RADIUS, FRAME_WIDTH, FRAME_DENT, INNER_RADIUS, A, K, GROOVE_DENT, GROOVE_RADIUS, ANGLE} from './config.js';
import {scene, MAX_ANISOTROPY} from './init.js';


var texture = new THREE.TextureLoader().load( '../textures/concrete.jpg' );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.anisotropy = MAX_ANISOTROPY;




// STEP 1. START WITH A ROUNDED PLATFORM

// 1.1: two crossed bars
				
var base1 = new THREE.BoxGeometry( FRAME_SIZE+2*FRAME_WIDTH, FRAME_HEIGHT, FRAME_SIZE ),
	base2 = base1.clone().rotateY( Math.PI/2 );

// 1.2: cylinders at the corners

var x = FRAME_SIZE/2+FRAME_WIDTH-FRAME_RADIUS+0.04;
				
var corner1 = new THREE.CylinderGeometry( FRAME_RADIUS, FRAME_RADIUS, FRAME_HEIGHT, 60 ).translate( x, 0, x ),
	corner2 = corner1.clone().rotateY( Math.PI/2 ),
	corner3 = corner2.clone().rotateY( Math.PI/2 ),
	corner4 = corner3.clone().rotateY( Math.PI/2 );
					
// 1.3: merge bars and corners into one rounded platform

var csg = CSG.union( [base1, base2, corner1, corner2, corner3, corner4] );




// STEP 2. CUT THE AREA FOR THE TILES

// 2.1: two crossed bars

var y = FRAME_HEIGHT/2-FRAME_DENT/2; // vertical offset

var base1 = new THREE.BoxGeometry( FRAME_SIZE-2*INNER_RADIUS, FRAME_DENT, FRAME_SIZE ).translate( 0, y, 0 ),
	base2 = base1.clone().rotateY( Math.PI/2 );
	
// 2.2: cylinders at the corners
					
var x = FRAME_SIZE/2-INNER_RADIUS;

var corner1 = new THREE.CylinderGeometry( INNER_RADIUS, INNER_RADIUS, FRAME_DENT, 60 ).translate( x, y, x ),
	corner2 = corner1.clone().rotateY( Math.PI/2 ),
	corner3 = corner2.clone().rotateY( Math.PI/2 ),
	corner4 = corner3.clone().rotateY( Math.PI/2 );
	
// 2.3: cut off from rounded platform
	
csg = CSG.subtract( [csg, base1, base2, corner1, corner2, corner3, corner4 ]);

				
// STEP 3. CUT THE GROOVES

// 3.1: cylinders at the corners

var x = FRAME_SIZE/2-A/K;

var y = FRAME_HEIGHT/2-FRAME_DENT-GROOVE_DENT/2;

var corner1 = new THREE.CylinderGeometry( GROOVE_RADIUS, GROOVE_RADIUS, GROOVE_DENT, 40 ).translate( x, y, x ),
	corner2 = corner1.clone().rotateY( Math.PI/2 ),
	corner3 = corner2.clone().rotateY( Math.PI/2 ),
	corner4 = corner3.clone().rotateY( Math.PI/2 );

// 3.2: bars at the sides

var side1 = new THREE.BoxGeometry( 2*GROOVE_RADIUS, GROOVE_DENT, 2*x ).translate( x, y, 0 ),
	side2 = side1.clone().rotateY( Math.PI/2 ),
	side3 = side2.clone().rotateY( Math.PI/2 ),
	side4 = side3.clone().rotateY( Math.PI/2 );

// 3.3: internal cross-bars

var len = 2*x/Math.cos(ANGLE);

var groove1 = new THREE.BoxGeometry( 2*GROOVE_RADIUS, GROOVE_DENT, len ).translate( 0, 0, len/2 ).rotateY( ANGLE ).translate( -x, y, -x ),
	groove2 = groove1.clone().rotateY( Math.PI/2 ),
	groove3 = groove2.clone().rotateY( Math.PI/2 ),
	groove4 = groove3.clone().rotateY( Math.PI/2 );

// 3.4: cut off from rounded platform

csg = CSG.subtract([ csg, corner1, corner2, corner3, corner4, side1, side2, side3, side4, groove1, groove2, groove3, groove4]);




// 4. FINALIZATION

// 4.1: convert CSG to BufferGeometry

var	geometry = CSG.BufferGeometry(csg);

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
		color.push( 0.7,0.6,0.5 );
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


geometry.computeVertexNormals();


var material = new THREE.MeshStandardMaterial( {
		color: 'white',
		roughness: 1,
		metalness: 0,
		emissive: 'ivory',
		emissiveIntensity: 0.13,
		map: texture,
		bumpMap: texture,
		bumpScale: 0.15,
		//side: THREE.DoubleSide,
		vertexColors: true,
		//wireframe: true,
		
} );	

							
var mesh = new THREE.Mesh( geometry, material );
	mesh.castShadow = true;
	mesh.receiveShadow = true;

		
scene.add( mesh );
