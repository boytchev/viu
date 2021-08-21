
// configuration of the model


// sizes of the frame

export const FRAME_SIZE 	= 60;	// inner size, must be = A+B
export const FRAME_WIDTH	= 5;	// width of edge, outside the frame size
export const FRAME_HEIGHT 	= 4;	// outer height of the frame
export const FRAME_RADIUS 	= 6;	// outer corner radius of the frame
export const FRAME_DENT 	= 2;	// inset in the frame for tiles

export const INNER_RADIUS 	= 3;	// internal corner radius of the frame

export const GROOVE_DENT = 1/3;
export const GROOVE_RADIUS = 2;

export const TILE_HEIGHT = 1;


// sides of the triangle tiles

export const A = 15; // from FRAME_SIZE/6 to FRAME_SIZE/2
export const B = FRAME_SIZE-A;
export const C = Math.sqrt(A*A+B*B);

export const ANGLE = Math.atan2(A,B);
export const MATRIX = new THREE.Matrix4().makeRotationY( -ANGLE );

console.assert( A <= 0.50*FRAME_SIZE );
