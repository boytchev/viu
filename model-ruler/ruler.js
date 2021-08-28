
// create the static frame of the model

import {RULER_LENGTH, RULER_WIDTH, RULER_HEIGHT, MARK_WIDTH, MARK_HEIGHT, FRAME_HEIGHT, SCALE_A, SCALE_B} from './config.js';
import {MAX_ANISOTROPY, scene} from './init.js';
import {Braille} from './braille.js';

var maps = [],
	normals = [];

for( var i=1; i<10; i++ )
{	
	maps[i] = new THREE.TextureLoader().load( `../textures/${i}.jpg` );
	maps[i].anisotropy = MAX_ANISOTROPY;

	normals[i] = new THREE.TextureLoader().load( `../textures/${i}-normal.jpg` );
	normals[i].anisotropy = MAX_ANISOTROPY;
}

const EPS = 0.01*RULER_HEIGHT;

const
	TYPE_X_00 = 1,
	TYPE_1_00 = 2,
	TYPE_0_05 = 3,
	TYPE_0_10 = 4,
	TYPE_0_20 = 5,
	TYPE_0_50 = 6;
	
var marks = [],
	types = [];
	
for( var i = 100; i<300;   i+=5 )
{
	marks.push( i );
	if( i==100 ) types.push( TYPE_X_00 ); else
	if( i%100 == 0 ) types.push( TYPE_1_00 ); else
	if( i%50 == 0 ) types.push( TYPE_0_50 ); else
	if( i%10 == 0 ) types.push( TYPE_0_10 ); else
	types.push( TYPE_0_05 );
}

for( var i = 300; i<600;   i+=10 )
{
	marks.push( i );
	if( i%100 == 0 ) types.push( TYPE_1_00 ); else
	if( i%50 == 0 ) types.push( TYPE_0_50 ); else
	types.push( TYPE_0_10 );
}

for( var i = 600; i<=1000; i+=20 )
{
	marks.push( i );
	if( i==1000 ) types.push( TYPE_X_00 ); else
	if( i%100 == 0 ) types.push( TYPE_1_00 ); else
	types.push( TYPE_0_20 );
}


const GROOVE_POS = [];
	GROOVE_POS[ TYPE_X_00 ] = '-----------------------';
	GROOVE_POS[ TYPE_1_00 ] = '--------.......--------';
	GROOVE_POS[ TYPE_0_05 ] = '--...................--';
	GROOVE_POS[ TYPE_0_10 ] = '----...............----';
	GROOVE_POS[ TYPE_0_20 ] = '---..--.........--..---';
	GROOVE_POS[ TYPE_0_50 ] = '------.-.......-.------';
	
	
function markPos( index )
{
	return RULER_LENGTH * Math.log(marks[index]/100) / Math.log(10) - RULER_LENGTH/2;
}

export class Ruler extends THREE.Group
{
	constructor( scale, prefix, suffix )
	{
		super();

		this.position.y = FRAME_HEIGHT/2;
		this.snap = { minX: -scale*RULER_LENGTH/2-40, maxX: scale*RULER_LENGTH/2+40 };
		
		this.isRuler = true;
		
		const SLICES = 4*marks.length,
			  Z_SLICES = 24;

		var geometry = new THREE.BoxGeometry( scale*RULER_LENGTH, RULER_HEIGHT, RULER_WIDTH, SLICES, 2, Z_SLICES );

		var color = [];
		var uv = [];

		var pos = geometry.getAttribute( 'position' );
		var nor = geometry.getAttribute( 'normal' );

		for( var i=0; i<pos.count; i++ )
		{
			var x = pos.getX( i ),
				y = pos.getY( i ),
				z = pos.getZ( i );
			
			var ny = nor.getY( i );

			// generate bumps
			var vi = Math.round( (SLICES-1) * (x+scale*RULER_LENGTH/2)/(scale*RULER_LENGTH) ); // vertex index [0..SLICES]
			var ni = Math.floor( vi/4 ); // mark index [0..90]

			var wi = Math.round( Z_SLICES * (z+RULER_WIDTH/2)/RULER_WIDTH ); // z-vertex index [0..Z_SLICES]

			var type = types[ni];

			switch( vi%4 )
			{
				case 0:
					x = scale*markPos( ni ) - MARK_WIDTH/2;
					break;
				case 1:
					x = scale*markPos( ni ) - MARK_WIDTH/3;

					if( y>0.1  ) y += MARK_HEIGHT*((prefix+GROOVE_POS[type]+suffix)[wi]=='-'?1:0);
					break;
				case 2:
					x = scale*markPos( ni ) + MARK_WIDTH/3;
					if( y>0.1 ) y += MARK_HEIGHT*((prefix+GROOVE_POS[type]+suffix)[wi]=='-'?1:0);
					break;
				case 3:
					x = scale*markPos( ni ) + MARK_WIDTH/2;
					break;
			}

			if( -EPS<y && y<RULER_HEIGHT/2-EPS )
				y = RULER_HEIGHT/2-EPS;
			
			// generate vertex colors 
			if( y > RULER_HEIGHT/2 + MARK_HEIGHT/2 && (vi%4==1 || vi%4==2) )
				color.push( 0.6, 0.5, 0.4 );
			else
				color.push( 1,1,1 );
			
			// generate uv coordinates
			if( ny>0.5 )
				uv.push( 0.02*x, 0.02*z );
			else
				uv.push( 0.02*(x+z), 0.02*y );

			pos.setXYZ( i, x, y, z );
		}

		geometry.setAttribute( 'uv', new THREE.BufferAttribute(new Float32Array(uv),2) );
		geometry.setAttribute( 'color', new THREE.BufferAttribute(new Float32Array(color),3) );


		geometry.computeVertexNormals();

		var texture = new THREE.TextureLoader().load( '../textures/marble.jpg' );
			texture.wrapS = THREE.RepeatWrapping;
			texture.wrapT = THREE.RepeatWrapping;
			texture.anisotropy = MAX_ANISOTROPY;
			
		var material = new THREE.MeshStandardMaterial( {
				color: 'white',
				roughness: 0.7,
				metalness: 0,
				map: texture,
				vertexColors: true,
				//wireframe: true,
		} );	

									
		var mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;
			mesh.receiveShadow = true;

		this.add( mesh );

		var textIndices = [];
		for( var i=0; i<types.length; i++ ) if( types[i]==TYPE_1_00 ) textIndices.push(i);
		
		const BRAILLE_SIZE = 1.6,
		      BRAILLE_OFFSET = prefix?0.3:-0.3;
		
		for( var i=0; i<textIndices.length; i++ )
		{
			var braille = new Braille( BRAILLE_SIZE, BRAILLE_SIZE, maps[i+2], normals[i+2] );
				braille.material.color = new THREE.Color( 'white' );
				braille.position.set( scale*markPos(textIndices[i]), RULER_HEIGHT/2, BRAILLE_OFFSET );
				this.add( braille );
		}
		
		var braille = new Braille( BRAILLE_SIZE, BRAILLE_SIZE, maps[1], normals[1] );
			braille.material.color = new THREE.Color( 'white' );
			braille.position.set( scale*markPos(0)+1.2, RULER_HEIGHT/2, BRAILLE_OFFSET );
			this.add( braille );
		
		if( scale>=0.6 )
		{
			var braille = new Braille( BRAILLE_SIZE, BRAILLE_SIZE, maps[1], normals[1] );
				braille.material.color = new THREE.Color( 'white' );
				braille.position.set( scale*markPos(90)-1.2, RULER_HEIGHT/2, BRAILLE_OFFSET );
				this.add( braille );
		}
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

var ruler1 = new Ruler(SCALE_A,'..','');
	ruler1.position.z = -RULER_WIDTH/2-0.03;
	
var ruler2 = new Ruler(SCALE_B,'','..');
	ruler2.position.z = +RULER_WIDTH/2+0.03;

scene.add( ruler1, ruler2 );

export var rulers = [ruler1, ruler2];


