import * as THREE from '../build/three.module.js';

export class blob
{
 mesh;
 mesh2;
 geometry;
 material;
 rude;
 scaleX;
 scaleY;
 scaleZ;
 segments;

 constructor(mat)
 {
   this.material=mat;
   this.rude=2.5;
   this.scaleX=1.0;
   this.scaleY=1.0;
   this.scaleZ=1.0;
   this.segments=4;
 }

 make()
 {
   this.geometry= new THREE.SphereGeometry(1, this.segments, this.segments);
   for (var i = 0; i < this.geometry.vertices.length; i++)
   {
     var p = this.geometry.vertices[i];
     p.x=(p.x+(Math.random()/this.rude))*this.scaleX;
     p.y=(p.y+(Math.random()/this.rude))*this.scaleY;
     p.z=p.z*this.scaleZ;
     //p.normalize().multiplyScalar(Math.random()/4.0);
   }
   this.geometry.computeVertexNormals();
   this.geometry.normalsNeedUpdate = true;
   this.geometry.verticesNeedUpdate = true;
   this.mesh = new THREE.Mesh(this.geometry, this.material);
 }

 getMesh()
 {
   return(this.mesh);
 }

 moveMesh(x,y,z)
 {
   var position = new THREE.Vector3();
   this.mesh.position.x = x;
   this.mesh.position.y = y;
   this.mesh.position.z = z;
 }

 rotate(x,y,z)
 {
   this.mesh.rotateX(x);
   this.mesh.rotateY(y);
   this.mesh.rotateZ(z);
 }
}

/*class bsBuilding
{
 mesh;
 geometry;
 material;

 constructor(x,y,z)
 {
    this.geometry = new THREE.BoxBufferGeometry( x, y, z );
    this.material = new THREE.MeshPhongMaterial( { color: 0x00ccff, wireframe: false } );
    this.mesh = new THREE.Mesh( this.geometry, this.material );
 }

 getMesh()
 {
   return(this.mesh);
 }

 moveMesh(x,y,z)
 {
   var position = new THREE.Vector3();
   this.mesh.position.x = x;
   this.mesh.position.y = y;
   this.mesh.position.z = z;
 }


}*/
