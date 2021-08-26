
// create the static frame of the model

import {RULER_LENGTH, RULER_WIDTH, RULER_HEIGHT, MARK_WIDTH, MARK_HEIGHT} from './config.js';
import {MAX_ANISOTROPY, scene} from './init.js';


var marks = [];
for( var i = 100; i<300;   i+=5 ) marks.push( i );
for( var i = 300; i<600;   i+=10 ) marks.push( i );
for( var i = 600; i<=1000; i+=20 ) marks.push( i );


var texture = new THREE.TextureLoader().load( '../textures/concrete.jpg' );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.anisotropy = MAX_ANISOTROPY;


function markPos( index )
{
	return RULER_LENGTH * Math.log(marks[index]/100) / Math.log(10) - RULER_LENGTH/2;
}

export class Ruler extends THREE.Group
{
	constructor()
	{
		super();
		
		const SLICES = 4*marks.length-4;
		
		var geometry = new THREE.BoxGeometry( RULER_LENGTH, RULER_HEIGHT, RULER_WIDTH, SLICES, 1, 3 );

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

			// generate bumpScale
			if( y>-10.1 )
			{
				var vi = Math.round( (x+RULER_LENGTH/2)/ (RULER_LENGTH/SLICES) ); // vertex index [0..SLICES]
				var mi = Math.floor( vi/4 ); // mark index
//console.log(mi,markPos( mi ),MARK_WIDTH/2);
				switch( vi%4 )
				{
					case 0:
						x = markPos( mi ) - MARK_WIDTH/2;
						break;
					case 1:
						x = markPos( mi ) - MARK_WIDTH/2;
						if( y>0.1 && z>2.5 ) y += MARK_HEIGHT;
						break;
					case 2:
						x = markPos( mi ) + MARK_WIDTH/2;
						if( y>0.1 && z>2.5 ) y += MARK_HEIGHT;
						break;
					case 3:
						x = markPos( mi ) + MARK_WIDTH/2;
						break;
				}
					;
			}
			
			// generate vertex colors 
			if( y > RULER_HEIGHT/2 + MARK_HEIGHT/2 && (vi%4==1 || vi%2) )
				color.push( 0,0,0 );
			else
				color.push( 1,1,1 );
			
			// generate uv coordinates
			if( ny>0.5 )
				uv.push( 0.02*x, 0.02*z );
			else
				uv.push( 0.02*(x+z), 0.02*y );
			
			pos.setXY( i, x, y );
		}

		geometry.setAttribute( 'uv', new THREE.BufferAttribute(new Float32Array(uv),2) );
		geometry.setAttribute( 'color', new THREE.BufferAttribute(new Float32Array(color),3) );


		geometry.computeVertexNormals();


		var material = new THREE.MeshStandardMaterial( {
				color: 'white',
				roughness: 1,
				metalness: 0,
				//emissive: 'white',
				//emissiveIntensity: 0.3,
				//map: texture,
				//bumpMap: texture,
				//bumpScale: 0.05,
				vertexColors: true,
				flatShading: true,
		} );	

									
		var mesh = new THREE.Mesh( geometry, material );
			mesh.castShadow = true;
			mesh.receiveShadow = true;

		this.add( mesh );
	}
}

var ruler1 = new Ruler();

scene.add( ruler1 );


