module lj.cgcp.game.qdmj_705 {
	export class MajiangConstant {

		private static huFuns:BaseHu[];
		private static tingFuns:BaseHu[];

		

		/**
		 * 获取麻将所处区间
		 */
		public static findMajiangStartEnd(mjVal:number):number[]{
			if(mjVal >= 28){
				return [-1,-1];
			}
			var start:number = -1;
        	var end:number = -1;
			var seArray:number[][] = [[1,9],[10,18],[19,27]];
			var val:number[];
			for(var i:number = 0; i < 3 ; i++){
				val = seArray[i];
				if(mjVal >= val[0] && mjVal <= val[1]){
					start = val[0];
					end = val[1];
					break;
				}
			}
			return [start,end];
		}

		/**
		 * 获取麻将类型
		 */
		public static findMajiangType(mjVal:number):number{
			if(mjVal >= 28){
				return 3;
			}
			var start:number = -1;
        	var end:number = -1;
			var seArray:number[][] = [[1,9],[10,18],[19,27]];
			var val:number[];
			for(var i:number = 0; i < 3 ; i++){
				val = seArray[i];
				if(mjVal >= val[0] && mjVal <= val[1]){
					return i;
				}
			}
			return -1;
		}
	
		
		/**
		 * 找出可以胡的牌
		 */
		public static findHu(mjVal:number,mjList:number[]):boolean{
			var tmpMjList:number[] = MajiangConstant.clone_array(mjList);
			if(mjVal != -1) tmpMjList.push(mjVal);

			if(MajiangConstant.huFuns == null){
				MajiangConstant.huFuns = [new TuiDaoHuExWn()];
			}

			var huFuns:BaseHu[] = MajiangConstant.huFuns;
			var len:number = huFuns.length;
			for(var i:number = 0; i < len ; i++){
				huFuns[i].ispao = mjVal != -1;
				if(huFuns[i].hu(tmpMjList)){
					return true;
				}
			}
			return false;
		}
		
		/**
		 * 获取万能牌个数
		 */
		public static getWannengCount(mjList:number[],wnmjVal:number):number{
			MajiangConstant.sortMjList(mjList,0);
			var wannengCount:number = 0;
			var countVals:any = MajiangConstant.array_values_count(mjList);
			if(countVals[wnmjVal]){
				wannengCount = countVals[wnmjVal];
				mjList.splice(mjList.indexOf(wnmjVal),wannengCount);
			}
			return wannengCount;
		}

		/**
		 * 是否是万能牌
		 */
		public static isWanneng(mjVal:number):boolean{
			return mjVal == 0;
		}

		/**
		 * 检测连续的元素是否存在
		 */
		public static getconsecutive(arr:number[],n:number):boolean{
			var m:number = 1;
			var i:number;
			var t:number;
			for(i=0,t = arr.length - 1;i < t;i++) {
				m = arr[i] + 1 == arr[i + 1] ? m + 1 : 1;
				if(m >= n) return true;
			}
			return false;
		}

		/**
		 * 找出数组中每个元素的个数
		 */
		public static array_values_count(nums:number[]):any{
			var result:any = {};
			var len:number = nums.length;
			var val:number;
			for(var i:number = 0; i < len ;i++){
				val = nums[i];
				if(result[val] != null){
					result[val]++;
				}else{
					result[val] = 1;
				}
			}
			return result;
		}

		/**
		 * 克隆数组
		 */
		public static clone_array(nums:number[]):any{
			var nums2:number[] = [];
			var len:number = nums.length;
			for(var i : number = 0; i < len ;i++){
				nums2.push(nums[i]);
			}
			return nums2;
		}
		/**
		 * 克隆数组
		 */
		public static clone_2darray(nums:number[][]):any{
			var nums2:number[][] = [];
			var len:number = nums.length;
			for(var i : number = 0; i < len ;i++){
				nums2.push(this.clone_array(nums[i]));
			}
			return nums2;
		}
		/**
		 * 数组 indexOf 方法
		 */

		public static indexOfFunc(huUid:number[],huVal:number){
			var count:number = 0;
			for(var i:number = 0;i< huUid.length;i++){
				 var index = huUid[i];
				 if(index == huVal){
					count++;
				 }else{
					 continue;
				 }
			}
			if(count > 0) return true;
			else return false;
		}

		/**
		 * 排序
		 */
		public static sortMjList(mjList:number[],type:number):void{
			if(mjList == null || mjList.length == 0) return;
			if(type == 0){
				mjList.sort(function(a:number,b:number):number{
					if(a < b) return -1; else if(a > b) return 1; return 0;
				});
			}else{
				mjList.sort(function(a:number,b:number):number{
					if(a < b) return 1; else if(a > b) return -1; return 0;
				});
			}
		}

		


	}
}