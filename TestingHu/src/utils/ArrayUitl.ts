class ArrayUitl {
	public static getElementCount(array:number[],value:number):number{
		var count:number = 0;
		if(array != null && array.length > 0){
			for(var k in array){
				if(array[k] === value){
					count ++;
				}
			}
		}
		return count;
	}
}