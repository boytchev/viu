
// create the static frame of the model

import {GLASS_OBJECT_TYPE, PLATE_INDENT, PLATE_SIZE, FRAME_HEIGHT} from './config.js';
import {saveGLTF, MAX_ANISOTROPY, scene, renderer} from './init.js';
import {BufferGeometryUtils} from '../js/BufferGeometryUtils.js';



export var texture = new THREE.TextureLoader().load( '../textures/marble.jpg' );
	texture.wrapS = THREE.RepeatWrapping;
	texture.wrapT = THREE.RepeatWrapping;
	texture.repeat.set( 5, 5 );
	texture.anisotropy = MAX_ANISOTROPY;


class GlassObject extends THREE.Group
{
	constructor ( )
	{
		super();
		
		this.pattern = 0b11111;
		this.generateGeometry( GLASS_OBJECT_TYPE );
		
		var glassMaterial = new THREE.MeshPhysicalMaterial({
				color: 'hotpink',
				clearcoat: 1,
				roughness: 0,
				metalness: 0,
				map: texture,
				ior: 1.3,
				reflectivity: 0.2,
				thickness: 15,
				transmission: 1,
				emissiveIntensity: 0.2,
				emissive: 'navy',
				sheen: new THREE.Color( 'white' ),
				opacity: 0.85,
				polygonOffset: true,
				polygonOffsetFactor: 1,
				polygonOffsetUnits: 1,
		});
		
		var backMaterial = glassMaterial.clone();
			backMaterial.side = THREE.BackSide;

		var frontMaterial = glassMaterial.clone();
			frontMaterial.side = THREE.FrontSide;
			frontMaterial.transparent = true;

		var backObject = new THREE.Mesh( this.geometry, backMaterial ),
			frontObject = new THREE.Mesh( this.geometry, frontMaterial );

		this.position.y = PLATE_SIZE/2+FRAME_HEIGHT-PLATE_INDENT;
		
		this.add( frontObject, backObject );
	} // GlassObject.constructor


	generateGeometry( objectType )
	{
		var a = Math.PI/4;
		
		var patterns = [0b00100, 0b01010, 0b10101, 0b11111];

		switch( objectType )
		{
			case 1: // sphere -------------------------------------------------
				this.geometry = this.sphereGeometry();
				break;

			case 2: // cube ---------------------------------------------------
				patterns = [0b00100, 0b01010, 0b01110];
				this.geometry = this.cubeGeometry();
				break;

			case 3: // cube
				patterns = [0b00100, 0b01010, 0b01110];
				this.geometry = this.cubeGeometry().rotateX( a );
				break;

			case 4: // cube
				this.geometry = this.cubeGeometry().rotateY( a );
				break;

			case 5: // brick --------------------------------------------------
 				this.geometry = this.brickGeometry();
				break;

			case 6: // brick
				this.geometry = this.brickGeometry().rotateY( a );
				break;

			case 7: // torus --------------------------------------------------
				this.geometry = this.torusGeometry();
				break;

			case 8: // torus
				patterns = [0b00100, 0b01110];
				this.geometry = this.torusGeometry().rotateY( 2*a );
				break;

			case 9: // torus
				patterns = [0b00100, 0b01010, 0b01110];
				this.geometry = this.torusGeometry().rotateY( a );
				break;

			case 10: // cyl ---------------------------------------------------
				this.geometry = this.cylinderGeometry();
				break;

			case 11: // cyl
				this.geometry = this.cylinderGeometry().rotateZ( 2*a );
				break;

			case 12: // cyl
				this.geometry = this.geometry = this.cylinderGeometry().rotateZ( a );
				break;

			case 13: // cone --------------------------------------------------
				this.geometry = this.coneGeometry();
				this.resetNormals();
				break;

			case 14: // cone
				this.geometry = this.coneGeometry().rotateZ( 2*a );
				this.resetNormals();
				break;
				
			case 15: // cone
				patterns = [0b00100, 0b01001, 0b01111];
				this.geometry = this.coneGeometry().rotateZ( Math.atan2(0.35,0.8) ).translate( -0.05, 4, 0 );
				break;

			case 16: // cone
				this.geometry = this.coneGeometry().rotateZ( a ).translate( -5, 5, 0 );
				break;

			case 17: // pyramid -----------------------------------------------
				this.geometry = this.pyramidGeometry().rotateY( a );
				break;
				
			case 18: // pyramid
				this.geometry = this.pyramidGeometry();
				break;
				
			case 19: // pyramid
				patterns = [0b00100, 0b01010, 0b01111];
				this.geometry = this.pyramidGeometry().rotateY( a ).rotateZ( a );
				break;
				
			case 20: // capsule -----------------------------------------------
				patterns = [0b00100, 0b01010, 0b01110];
				this.geometry = this.capsuleGeometry();
				this.resetNormals( );
				break;
				
			case 21: // capsule
				this.geometry = this.capsuleGeometry().rotateZ( 2*a );
				this.resetNormals( );
				break;
				
			case 22: // capsule
				patterns = [0b00100, 0b01010, 0b01110];
				this.geometry = this.capsuleGeometry().rotateZ( a );
				this.resetNormals( );
				break;
				
			case 23: // lens --------------------------------------------------
				this.geometry = this.lensGeometry();
				this.resetNormals( );
				break;
				
			case 24: // lens
				patterns = [0b00100, 0b01010, 0b01110];
				this.geometry = this.lensGeometry().rotateZ( 2*a );
				this.resetNormals( );
				break;
				
			case 25: // lens
				patterns = [0b00100, 0b01010, 0b01110];
				this.geometry = this.lensGeometry().rotateZ( a );
				this.resetNormals( );
				break;
				
			default: // same as cube #2
				this.geometry = this.sphereGeometry();
				break;
		} // switch( GLASS_OBJECT_TYPE )

		this.pattern = patterns[ patterns.length-1 ];
	}
	
	
	sphereGeometry()
	{
		return new THREE.SphereGeometry( 0.325*PLATE_SIZE, 100, 50 ).rotateZ( Math.PI/2 );
	}
	
	
	cubeGeometry()
	{
		return new THREE.BoxGeometry( 0.5*PLATE_SIZE, 0.5*PLATE_SIZE, 0.5*PLATE_SIZE );
	}
	
	
	brickGeometry()
	{
		return new THREE.BoxGeometry( 0.85*PLATE_SIZE, 0.3*PLATE_SIZE, 0.1*PLATE_SIZE );
	}
	
	
	torusGeometry()
	{
		return new THREE.TorusGeometry( 0.28*PLATE_SIZE, 0.1205*PLATE_SIZE, 100, 100 );
	}
	
	
	cylinderGeometry()
	{
		return new THREE.CylinderGeometry( 0.325*PLATE_SIZE, 0.325*PLATE_SIZE, 0.7*PLATE_SIZE, 100 );
	}
	
	
	coneGeometry()
	{
		return new THREE.CylinderGeometry( 0.01, 0.35*PLATE_SIZE, 0.8*PLATE_SIZE, 150 );
	}
	
	
	pyramidGeometry()
	{
		return new THREE.CylinderGeometry( 0.01, 0.46*PLATE_SIZE, 0.7*PLATE_SIZE, 4 );
	}
	
	
	capsuleGeometry()
	{
		var geometry1 = new THREE.CylinderGeometry( 0.17*PLATE_SIZE, 0.17*PLATE_SIZE, 0.32*PLATE_SIZE, 80, 1, true ),
			geometry2 = new THREE.SphereGeometry( 0.17*PLATE_SIZE, 80, 60, 0, 2*Math.PI, 0, Math.PI/2).translate( 0, 0.32*PLATE_SIZE/2, 0 ),
			geometry3 = new THREE.SphereGeometry( 0.17*PLATE_SIZE, 80, 60, 0,  2*Math.PI, Math.PI/2, Math.PI/2 ).translate( 0, -0.32*PLATE_SIZE/2, 0 );
			
		return BufferGeometryUtils.mergeBufferGeometries ( [geometry1,geometry2,geometry3], false );
	}


	lensGeometry()
	{
		var alpha = 0.9,
			radius = 0.35*PLATE_SIZE;
		var geometry1 = new THREE.SphereGeometry( radius/Math.sin(alpha), 100, 40, 0, 2*Math.PI, 0, alpha ).translate(0, -radius/Math.tan(alpha), 0),
			geometry2 = new THREE.SphereGeometry( radius/Math.sin(alpha), 100, 40, 0, 2*Math.PI, Math.PI-alpha, alpha ).translate(0, radius/Math.tan(alpha), 0);
			
		return BufferGeometryUtils.mergeBufferGeometries ( [geometry1,geometry2], false );
	}
	
	
	resetNormals( k = 1)
	{
		var pos = this.geometry.getAttribute( 'position' ),
			nor = this.geometry.getAttribute( 'normal' );
			
		for( var i=0; i<pos.count; i++ )
		{
			var x = pos.getX( i ),
				y = pos.getY( i ),
				z = pos.getZ( i ),
				d = k*Math.sqrt(x*x+y*y+z*z);
				
			var nx = nor.getX( i ),
				ny = nor.getY( i ),
				nz = nor.getZ( i );
				
			nor.setXYZ( i, x/d+nx, y/d+ny, z/d+nz );
		}
	}

	saveAllGLTF()
	{
		for( var objectType=20; objectType<=26; objectType++ )
		{
			this.generateGeometry( objectType );
			saveGLTF( this.geometry, `object_${objectType}.glb` );
		}
	}
	
} // GlassObject


export var glassObject = new GlassObject();


// generate gass objects as GLTF binary files
//glassObject.saveAllGLTF();

scene.add( glassObject );
