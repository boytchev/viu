
// Braille text with normal text stampped on it

export class Braille extends THREE.Mesh
{
	constructor( sizeX, sizeZ, textMap, brailleMap )
	{
		var geometry = new THREE.PlaneGeometry( sizeX, sizeZ ).rotateX( -Math.PI/2 ),
			pos = geometry.getAttribute( 'position' ),
			uv = geometry.getAttribute( 'uv' );

		for( var i=0; i<pos.count; i++ )
		{
			var x = pos.getX( i ),
				z = pos.getZ( i );
				
			uv.setXY( i, x/sizeX+0.5, -z/sizeZ+0.5 );
		}		

		var material = new THREE.MeshPhysicalMaterial({
				color: new THREE.Color( 0.6, 0.5, 0.4 ),
				roughness: 0.6,
				metalness: 0,
				map: textMap,
				normalMap: brailleMap,
				normalScale: new THREE.Vector2( 1/3, 1/3 ),
				polygonOffset: true,
				polygonOffsetFactor: -2,
				polygonOffsetUnits: -2,
			});
			
		super( geometry, material );
		this.receiveShadow = true;
	}
}