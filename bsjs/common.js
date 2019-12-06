//commonly used stuff
export class common
{
  static random(f,t)
  {
    return((Math.random()*(t-f))+f);
  }

  static array2D(numrows, numcols, initial)
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
}
