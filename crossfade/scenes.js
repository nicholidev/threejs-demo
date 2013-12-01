function generateGeometry(objectType, numObjects) {

	var geometry = new THREE.Geometry();
	
	function applyVertexColors( g, c ) {

		g.faces.forEach( function( f ) {

			var n = ( f instanceof THREE.Face3 ) ? 3 : 4;

			for( var j = 0; j < n; j ++ ) {

				f.vertexColors[ j ] = c;

			}

		} );

	}

	for ( var i = 0; i < numObjects; i ++ ) {
	
		var position = new THREE.Vector3();

		position.x = Math.random() * 10000 - 5000;
		position.y = Math.random() * 6000 - 3000;
		position.z = Math.random() * 8000 - 4000;

		var rotation = new THREE.Euler();

		rotation.x = Math.random() * 2 * Math.PI;
		rotation.y = Math.random() * 2 * Math.PI;
		rotation.z = Math.random() * 2 * Math.PI;

		var scale = new THREE.Vector3();

		var geom;

		scale.x = Math.random() * 200 + 100;

		if ( objectType == "cube" )
		{
			geom = new THREE.CubeGeometry( 1, 1, 1 );
			scale.y = Math.random() * 200 + 100;
			scale.z = Math.random() * 200 + 100;
		}
		else if ( objectType == "sphere" )
		{
			geom = new THREE.IcosahedronGeometry( 1, 1 )
			scale.y = scale.z = scale.x;
		}

		// give the geom's vertices a random color, to be displayed
		var color = new THREE.Color( Math.random() * 0xffffff );
		applyVertexColors( geom, color );

		var cube = new THREE.Mesh( geom );
		cube.position.copy( position );
		cube.rotation.copy( rotation );
		cube.scale.copy( scale );

		THREE.GeometryUtils.merge( geometry, cube );

	}

	return geometry;

}

function Scene ( type, numObjects, cameraZ, fov, rotationSpeed, clearColor ) {
	
	this.clearColor = clearColor;
	
	this.camera = new THREE.PerspectiveCamera( fov, window.innerWidth / window.innerHeight, 1, 10000 );
	this.camera.position.z = cameraZ;
	
	// Setup scene
	this.scene = new THREE.Scene();
	this.scene.add( new THREE.AmbientLight( 0x555555 ) );

	var light = new THREE.SpotLight( 0xffffff, 1.5 );
	light.position.set( 0, 500, 2000 );
	this.scene.add( light );

	this.rotationSpeed = rotationSpeed;
	defaultMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff, shading: THREE.FlatShading, vertexColors: THREE.VertexColors	} );
	this.mesh = new THREE.Mesh( generateGeometry( type, numObjects ), defaultMaterial );
	this.scene.add( this.mesh );

	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
	this.fbo = new THREE.WebGLRenderTarget( window.innerWidth, window.innerHeight, renderTargetParameters );
	
	this.render = function( delta, rtt ) {
		
		this.mesh.rotation.x += delta*this.rotationSpeed.x;
		this.mesh.rotation.y += delta*this.rotationSpeed.y;
		this.mesh.rotation.z += delta*this.rotationSpeed.z;
		
		renderer.setClearColor( this.clearColor, 1 );
		
		if (rtt)
			renderer.render( this.scene, this.camera, this.fbo, true );
		else
			renderer.render( this.scene, this.camera );
		
	};
}
