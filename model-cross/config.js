
// configuration of the model


export const FRAME_SIZE = 50;
export const FRAME_RADIUS = 2;
export const FRAME_HEIGHT = 2;

export const PLATE_WIDTH = 1;
export const PLATE_SIZE = FRAME_SIZE;
export const PLATE_INDENT = 0.3;
export const PLATE_RADIUS = 2;
export const PLATE_SIZE_IN = FRAME_SIZE-3;
export const PLATE_RADIUS_IN = 7;
export const PLATE_DISTANCE = PLATE_SIZE+4;
export const PLATE_ANGLE = Math.PI/2 * Math.floor( 4*Math.random() ); // 0, 90, 180, 270 (but in radians)

export const HOLDER_HEIGHT = 3;
export const HOLDER_LENGTH = 10;
export const HOLDER_WIDTH = 8;
export const HOLDER_DISTANCE = 8;


var urlParams = new URLSearchParams( window.location.search );

export const GLASS_OBJECT_TYPE = Math.max(1,Math.min(29,parseInt(urlParams.get('a'))||1)); // [1..29]


//
// IMPORT=true EXPORT=false -- plates geometries are loaded from external files (default case)
// IMPORT=false EXPORT=false -- plates geometries are generated at run time
// IMPORT=false EXPORT=true -- plates geometries are generated at run time and saved to files

export const IMPORT_PLATES = true; // set to true to load GLTF for plates
export const EXPORT_PLATES = false; // set to true to generate GLTF and saves them

