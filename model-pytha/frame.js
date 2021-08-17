
// create the static frame of the model

import {FRAME_HEIGHT, FRAME_SIZE, FRAME_RADIUS, FRAME_WIDTH, FRAME_DENT, INNER_RADIUS, A, B, GROOVE_DENT, GROOVE_RADIUS, ANGLE} from './config.js';
import {MAX_ANISOTROPY, scene} from './init.js';


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

var x = z = FRAME_SIZE/2-A/2;

var y = FRAME_HEIGHT/2-FRAME_DENT;

/*var corner1 = new THREE.CylinderGeometry( GROOVE_RADIUS/6, GROOVE_RADIUS/6, GROOVE_DENT, 40 ).translate( x, y, x ),
	corner2 = corner1.clone().rotateY( Math.PI/2 ),
	corner3 = corner2.clone().rotateY( Math.PI/2 ),
	corner4 = corner3.clone().rotateY( Math.PI/2 );
*/

//const axesHelper = new THREE.AxesHelper( 35 );
//axesHelper.position.set(x-A*A*B/(A*A+B*B),0, x-A*B*B/(A*A+B*B));
//scene.add( axesHelper );

var gapPos = [];

function addGapPos( )
{
	gapPos.push( new THREE.Vector3(  x, y,  z ) );
	gapPos.push( new THREE.Vector3( -z, y,  x ) );
	gapPos.push( new THREE.Vector3( -x, y, -z ) );
	gapPos.push( new THREE.Vector3(  z, y, -x ) );
}

addGapPos( );

x = x-A;
addGapPos( );

z = z-A;
addGapPos( );

x = x+A;
addGapPos( );


var gapGeometry = new THREE.OctahedronGeometry( GROOVE_RADIUS, 2 ).scale(1,GROOVE_DENT/GROOVE_RADIUS,1),
	gaps = [];

for( var pos of gapPos )
{
	gaps.push( new THREE.OctahedronGeometry( GROOVE_RADIUS, 2 ).scale(1,GROOVE_DENT/GROOVE_RADIUS,1).translate( pos.x, pos.y, pos.z ) );
}

/* // possibly unused gaps
var gap1 = new THREE.OctahedronGeometry( GROOVE_RADIUS, 2 ).scale(1,GROOVE_DENT/GROOVE_RADIUS,1).translate( x, y, x ),
var gap1d = gap1.clone().translate( A*(B-A)/B-B, 0, -A ),
	gap2d = gap1d.clone().rotateY( Math.PI/2 ),
	gap3d = gap2d.clone().rotateY( Math.PI/2 ),
	gap4d = gap3d.clone().rotateY( Math.PI/2 );
var gap1e = gap1.clone().translate( A*A/B-B, 0, -B+A ),
	gap2e = gap1e.clone().rotateY( Math.PI/2 ),
	gap3e = gap2e.clone().rotateY( Math.PI/2 ),
	gap4e = gap3e.clone().rotateY( Math.PI/2 );
var gap1f = gap1.clone().translate( -A*A*B/(A*A+B*B), 0, -A*B*B/(A*A+B*B) ),
	gap2f = gap1f.clone().rotateY( Math.PI/2 ),
	gap3f = gap2f.clone().rotateY( Math.PI/2 ),
	gap4f = gap3f.clone().rotateY( Math.PI/2 );
*/

// 3.2: bars at the sides
var x = FRAME_SIZE/2-A/2;

var side1 = new THREE.BoxGeometry( GROOVE_DENT, GROOVE_DENT, 2*x ).rotateZ( Math.PI/4 ).scale(1,1/3,1).translate( x, y, 0 ),
	side2 = side1.clone().rotateY( Math.PI/2 ),
	side3 = side2.clone().rotateY( Math.PI/2 ),
	side4 = side3.clone().rotateY( Math.PI/2 );

// 3.2: bars at the sides

var inside1 = side1.clone().translate( -A, 0, 0 ),
	inside2 = inside1.clone().rotateY( Math.PI/2 ),
	inside3 = inside2.clone().rotateY( Math.PI/2 ),
	inside4 = inside3.clone().rotateY( Math.PI/2 );

// 3.3: internal cross-bars

var len = 2*x/Math.cos(ANGLE);

var groove1 = new THREE.BoxGeometry( GROOVE_DENT, GROOVE_DENT, len ).rotateZ( Math.PI/4 ).translate( 0, 0, len/2 ).rotateY( ANGLE ).scale(1,1/3,1).translate( -x, y, -x ),
	groove2 = groove1.clone().rotateY( Math.PI/2 ),
	groove3 = groove2.clone().rotateY( Math.PI/2 ),
	groove4 = groove3.clone().rotateY( Math.PI/2 );

// 3.4: cut off from rounded platform

csg = CSG.subtract([ csg, side1, side2, side3, side4, inside1, inside2, inside3, inside4, groove1, groove2, groove3, groove4, ...gaps/*gap1d, gap2d, gap3d, gap4d, gap1e, gap2e, gap3e, gap4e, gap1f, gap2f, gap3f, gap4f*/]);




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



// create invisible sensitive frame to check pointer by the user position

export var sensorPlane = new THREE.Mesh( 
		new THREE.PlaneGeometry( 2*FRAME_SIZE, 2*FRAME_SIZE ).rotateX( -Math.PI/2 ).translate( 0, FRAME_HEIGHT/2-1/2, 0 ),
		new THREE.MeshBasicMaterial( {color: 'yellow', transparent: true, opacity: 0.3} ) // temporary visible
	);
	
export var sensorPoint = new THREE.Mesh( 
		new THREE.SphereGeometry( 1 ),
		new THREE.MeshBasicMaterial( {color: 'yellow'} ) // temporary existing
	);
//scene.add( sensorPlane, sensorPoint );