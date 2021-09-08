
// create the static frame of the model

import {PLATE_ANGLE, GLASS_OBJECT_TYPE, PLATE_INDENT, PLATE_SIZE, FRAME_HEIGHT} from './config.js';
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
		this.rotation.x = PLATE_ANGLE;
		
//var geo = this.geometry.clone();
//geo = geo.rotateX(PLATE_ANGLE).translate(0,PLATE_SIZE/2+FRAME_HEIGHT-PLATE_INDENT,0);
//const helper = new THREE.VertexNormalsHelper( new THREE.Mesh(geo), 7, 0x00ff00, 1 );
//scene.add( helper );
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

			case 5: // cube
				this.geometry = this.cubeGeometry().rotateX( a ).rotateY( a ).rotateX( -2*a );
				break;

			case 6: // brick --------------------------------------------------
 				this.geometry = this.brickGeometry();
				break;

			case 7: // brick
				this.geometry = this.brickGeometry().rotateY( a );
				break;

			case 8: // torus --------------------------------------------------
				this.geometry = this.torusGeometry();
				break;

			case 9: // torus
				patterns = [0b00100, 0b01110];
				this.geometry = this.torusGeometry().rotateY( 2*a );
				break;

			case 10: // torus
				patterns = [0b00100, 0b01010, 0b01110];
				this.geometry = this.torusGeometry().rotateY( a );
				break;

			case 11: // cyl ---------------------------------------------------
				this.geometry = this.cylinderGeometry();
				break;

			case 12: // cyl
				this.geometry = this.cylinderGeometry().rotateZ( 2*a );
				break;

			case 13: // cyl
				this.geometry = this.geometry = this.cylinderGeometry().rotateZ( a );
				break;

			case 14: // cone --------------------------------------------------
				this.geometry = this.coneGeometry();
				this.resetNormals();
				break;

			case 15: // cone
				this.geometry = this.coneGeometry().rotateZ( 2*a );
				this.resetNormals();
				break;
				
			case 16: // cone
				this.geometry = this.coneGeometry().rotateZ( a ).translate( -5, 5, 0 );
				break;

			case 17: // cone
				patterns = [0b00100, 0b01001, 0b01111];
				this.geometry = this.coneGeometry().rotateZ( Math.atan2(0.35,0.8) ).translate( -0.05, 4, 0 );
				break;

			case 18: // pyramid -----------------------------------------------
				this.geometry = this.pyramidGeometry().rotateY( a );
				break;
				
			case 19: // pyramid
				this.geometry = this.pyramidGeometry();
				break;
				
			case 20: // pyramid
				patterns = [0b00100, 0b01010, 0b01111];
				this.geometry = this.pyramidGeometry().rotateY( a ).rotateZ( a );
				break;
				
			case 21: // capsule -----------------------------------------------
				patterns = [0b00100, 0b01010, 0b01110];
				this.geometry = this.capsuleGeometry();
				this.resetNormals( );
				break;
				
			case 22: // capsule
				this.geometry = this.capsuleGeometry().rotateZ( 2*a );
				this.resetNormals( );
				break;
				
			case 23: // capsule
				patterns = [0b00100, 0b01010, 0b01110];
				this.geometry = this.capsuleGeometry().rotateZ( a );
				this.resetNormals( );
				break;
				
			case 24: // lens --------------------------------------------------
				this.geometry = this.lensGeometry();
				this.resetNormals( );
				break;
				
			case 25: // lens
				patterns = [0b00100, 0b01010, 0b01110];
				this.geometry = this.lensGeometry().rotateZ( 2*a );
				this.resetNormals( );
				break;
				
			case 26: // lens
				patterns = [0b00100, 0b01010, 0b01110];
				this.geometry = this.lensGeometry().rotateZ( a );
				this.resetNormals( );
				break;
/*				
			case 27: // moebius strip --------------------------------------------------
				this.geometry = this.moebiusGeometry().translate(0,-4,0);
				break;
				
			case 28: // moebius strip
				this.geometry = this.moebiusGeometry().rotateY( 2*a ).rotateZ( 2*a ).translate(4,0,0);
				break;
				
			case 29: // moebius strip
				this.geometry = this.moebiusGeometry().rotateY( -a ).rotateZ( a );
				break;
*/				
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

/*
	moebiusGeometry()
	{
	
// buffers

		var geometry = new THREE.BufferGeometry();
		
		const indices = [];
		const vertices = [];
		const normals = [];
		const uvs = [];

		// helper variables

		const center = new THREE.Vector3();
		const vertex = new THREE.Vector3();
		const normal = new THREE.Vector3();

		var radialSegments = 4;
		var tubularSegments = 400;
		var arc = Math.PI * 2;
		var radius = 0.3*PLATE_SIZE;
		var tube = 0.17*PLATE_SIZE;
		var ka = 0.07;
		var arr = [ka,Math.PI-ka,Math.PI+ka,-ka,ka];

		// generate vertices, normals and uvs

		for ( let j = 0; j <= radialSegments; j ++ ) {

			for ( let i = 0; i <= tubularSegments; i ++ ) {
				var u = i / tubularSegments * arc;
				var v = arr[j]+1*(u/2 - Math.PI/4);//j / radialSegments * Math.PI * 2;

				// vertex

				vertex.x = ( radius + tube * Math.cos( v ) ) * Math.cos( u );
				vertex.y = ( radius + tube * Math.cos( v ) ) * Math.sin( u );
				vertex.z = tube * Math.sin( v );

				vertices.push( vertex.x, vertex.y, vertex.z );

				// normal

				v = u/2+(1+4*( (j>>1)%2 ))*Math.PI/4;
				normals.push( Math.cos(u)*Math.cos(v), Math.sin(u)*Math.cos(v), Math.sin(v) );

				// uv

				uvs.push( i / tubularSegments );
				uvs.push( j / radialSegments );

			}

		}

		// generate indices

		for ( let j = 1; j <= radialSegments; j ++ ) {

			for ( let i = 1; i <= tubularSegments; i ++ ) {

				// indices

				const a = ( tubularSegments + 1 ) * j + i - 1;
				const b = ( tubularSegments + 1 ) * ( j - 1 ) + i - 1;
				const c = ( tubularSegments + 1 ) * ( j - 1 ) + i;
				const d = ( tubularSegments + 1 ) * j + i;

				// faces

				indices.push( a, b, d );
				indices.push( b, c, d );

			}

		}

		// build geometry

		geometry.setIndex( indices );
		geometry.setAttribute( 'position', new THREE.Float32BufferAttribute( vertices, 3 ) );
		geometry.setAttribute( 'normal', new THREE.Float32BufferAttribute( normals, 3 ) );
		geometry.setAttribute( 'uv', new THREE.Float32BufferAttribute( uvs, 2 ) );
		
		return geometry;
	}
*/	
	
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
