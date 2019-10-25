class bsSky{
  sky;
  sphere = [];
  sphereCount = 0;
  turbidity = 10;
  rayleigh = 2;
  mieCoefficient = 0.005;
  mieDirectionalG = 0.8;
  luminance = 1;        // sunlight luminance
  inclination = 0.49;   // elevation / inclination
  azimuth = 0.25;       // Facing front,
  sun = !true;          //display sun
  distance = 400000;     //sky distance

  constructor(scene)
  {
    this.sky = new THREE.Sky();
    this.sky.scale.setScalar( 450000 );
    scene.add(this.sky);
  }

  addSphere()
  {
    // Add Sun Helper
    var sphere = new THREE.Mesh(
      new THREE.SphereBufferGeometry( 20000, 16, 8 ),
      new THREE.MeshBasicMaterial( { color: 0xfffff } )
    );
    sphere.position.y = - 700000;
    sphere.visible = false;
    this.sphere[this.sphereCount]=sphere;
    this.update(this.sphereCount);
    scene.add(this.sphere[this.sphereCount]);
    this.sphereCount++;
  }

  update(delta)
  {
    this.inclination=this.inclination+delta;
    if(this.inclination > 2) this.inclination=0.0;
  }

  updateSphere(which)
  {
    var uniforms = this.sky.material.uniforms;
    uniforms[ "turbidity" ].value = this.turbidity;
    uniforms[ "rayleigh" ].value = this.rayleigh;
    uniforms[ "mieCoefficient" ].value = this.mieCoefficient;
    uniforms[ "mieDirectionalG" ].value = this.mieDirectionalG;
    uniforms[ "luminance" ].value = this.luminance;

    var theta = Math.PI * ( this.inclination - 0.5 );
    var phi = 2 * Math.PI * ( this.azimuth - 0.5 );
    this.sphere[which].position.x = this.distance * Math.cos( phi );
    this.sphere[which].position.y = this.distance * Math.sin( phi ) * Math.sin( theta );
    this.sphere[which].position.z = this.distance * Math.sin( phi ) * Math.cos( theta );
    uniforms[ "sunPosition" ].value.copy( this.sphere[which].position );
  }
}
