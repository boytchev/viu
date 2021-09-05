
// create the static frame of the model

import {GLASS_OBJECT_TYPE, PLATE_INDENT, PLATE_SIZE, FRAME_HEIGHT} from './config.js';
import {MAX_ANISOTROPY, scene, renderer} from './init.js';
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
		
		switch( GLASS_OBJECT_TYPE )
		{
			case 100:
				this.geometry = new THREE.SphereGeometry( PLATE_SIZE/2.5, 50, 100 );
				break;
			case 200:
				this.geometry = new THREE.CylinderGeometry( PLATE_SIZE/300, PLATE_SIZE/2.5, 2*PLATE_SIZE/2.5, 100 );
				break;
			case 300:
				this.geometry = new THREE.BoxGeometry( PLATE_SIZE/3, PLATE_SIZE/3, PLATE_SIZE/3 ).rotateX(Math.PI/4).rotateY(Math.PI/4);
				break;
		} // switch( GLASS_OBJECT_TYPE )

		this.geometry.computeVertexNormals();
		
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
		});
		
		var backMaterial = glassMaterial.clone();
			backMaterial.side = THREE.BackSide;

		var frontMaterial = glassMaterial.clone();
			frontMaterial.side = THREE.FrontSide;

		var backObject = new THREE.Mesh( this.geometry, backMaterial ),
			frontObject = new THREE.Mesh( this.geometry, frontMaterial );

		this.position.y = PLATE_SIZE/2+FRAME_HEIGHT-PLATE_INDENT;
		
		this.add( backObject, frontObject );
		
	} // GlassObject.constructor

} // GlassObject


export var glassObject = new GlassObject();
scene.add( glassObject );
