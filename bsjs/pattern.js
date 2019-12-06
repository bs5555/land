import {PerlinNoise} from './perlin.js';
import {WorleyNoise} from './worley.js';
import * as THREE from '../build/three.module.js';


export class bsPattern
{
  w = 10;
  h = 10;
  noises;


  constructor(xw,xh)
  {
     this.w=xw;
     this.h=xh;
     this.noises= {};
  }

  _addnoise(bitmap,name)
  {
    var res = this.array2D(this.w,this.h,0);
    var canvas = document.createElement('canvas');
    //document.body.appendChild(canvas);
    canvas.width = this.w;
    canvas.height = this.h;
    var context = canvas.getContext('2d');
    context.drawImage(bitmap, 0, 0 );
    var pix = context.getImageData(0, 0,this.w,this.h).data;
    var i = 0;
    for(var x=0; x<this.w; x++)
    {
      for(var y=0; y<this.h; y++)
      {
        res[x][y]=(pix[i]/255.0);
        i=i+4;
      }
    }
    //res=name;
    this.noises[name]=res;
  }

  addBitmap(path,name)
  {
    var loader = new THREE.ImageBitmapLoader();
    var me = this;
    loader.setOptions({ resizeWidth: this.w, resizeHeight: this.h, resizeQuality:'high'});
    loader.load(path,
    // onLoad callback
    function(imageBitmap){
      me._addnoise(imageBitmap,name)
    }
    ,undefined,
    function( err )
    {
      console.log( 'An error at file loading' );
      console.log( err );
    });
  }

  array2D(numrows, numcols, initial)
  {
    var arr = [];
   for(var i = 0; i < numrows; ++i)
    {
      var columns = [];
      for (var j = 0; j < numcols; ++j)
      {
        columns[j] = initial;
      }
      arr[i] = columns;
    }
    return arr;
  }
    //=================================
    //White noise function
    noise()
    {
      var res = this.array2D(this.w,this.h,0);
      var i = 0;
      for(var x = 0; x<this.w; x++)
      {
        for(var y = 0; y<this.h; y++)
        {
          res[x][y]=Math.random();
        }
      }
      return(res);
    }
    //=================================
    //perlin noise function
    perlin(scale)
    {
      var res = this.array2D(this.w,this.h,0);
      var seed = Math.random();
      var i = 0;
      var p = new PerlinNoise();
      for(var x = 0; x<this.w; x++)
      {
        for(var y = 0; y<this.h; y++)
        {
          res[x][y]=p.noise((x/this.w)*scale,(y/this.h)*scale,seed);
        }
      }
      return(res);
    }
    //=================================
    //Worley noise function
    worley(n)
    {
      var xnoise = new WorleyNoise({ numPoints: n, dim: 2 });
      var buf = xnoise.renderImage(this.w, { normalize: true });
      var res = this.array2D(this.w,this.h);
      var i =0;
      for(var x=0; x<this.w; x++)
      {
        for(var y=0; y<this.h; y++)
        {
          res[x][y]=buf[i];
          i++;
        }
      }
      return(res);
    }

    ready(n)
    {
      console.log(this.noises[n]);
      return(this.noises[n]);
    }

    add(map1,map2,force1,force2)
    {
      var res = this.array2D(this.w,this.h,0);
      var force_sum=force1+force2;
      var i =0;
      for(var x=0; x<this.w; x++)
      {
        for(var y=0; y<this.h; y++)
        {

          res[x][y]=((map1[x][y]*force1)+(map2[x][y]*force2))/force_sum;
          i++;
        }
      }
      return(res);
    }

    lighten(map1,map2)
    {
      let res = this.array2D(this.w,this.h,0);
      var i =0;
      for(var x=0; x<this.w; x++)
      {
        for(var y=0; y<this.h; y++)
        {
          if(map1[x][y] > map2[x][y])
          {
            res[x][y]=map1[x][y];
          }
          else
          {
            res[x][y]=map2[x][y];
          }
          i++;
        }
      }
      return(res);
    }

    neg(map)
    {
      var res = this.array2D(this.w,this.h,0);
      var i =0;
      for(var x=0; x<this.w; x++)
      {
        for(var y=0; y<this.h; y++)
        {
          res[x][y]=1.0-map[x][y];
          i++;
        }
      }
      return(res);
    }



}
