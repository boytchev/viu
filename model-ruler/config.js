
// configuration of the model

// URL parameter: ...html?a=[0.3 .. 3]&b=[0.3 .. 3] - sized or rulers, default a=b=1


export const RULER_LENGTH = 100;
export const RULER_WIDTH = 8;
export const RULER_HEIGHT = 1;

export const MARK_WIDTH = 0.15;
export const MARK_HEIGHT = 0.2;

export const FRAME_WIDTH = 20;
export const FRAME_HEIGHT = RULER_HEIGHT+3;
export const FRAME_LENGTH = 2*RULER_WIDTH+4;
export const FRAME_RADIUS = 1;
export const FRAME_INSET = 0.5;

var urlParams = new URLSearchParams( window.location.search );

export const SCALE_A = Math.max(0.3,Math.min(3,parseFloat(urlParams.get('a'))||1));
export const SCALE_B = Math.max(0.3,Math.min(3,parseFloat(urlParams.get('b'))||1));
