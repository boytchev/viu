
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

export const HOLDER_HEIGHT = 3;
export const HOLDER_LENGTH = 10;
export var   HOLDER_WIDTH = 8;
export var   HOLDER_DISTANCE = 8;

var urlParams = new URLSearchParams( window.location.search );

export const GLASS_OBJECT_TYPE = Math.max(1,Math.min(26,parseInt(urlParams.get('a'))||1)); // [1..26]
