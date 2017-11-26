module lj.cgcp.game.qdmj_705 {
	export class YiTiaoLong extends TuidaoHu {


		/**
		 * 找听牌
		 */
		public findTing(mjList:number[]):any[]{
			//一张将牌没有 不能听牌
			if(!this.has258(mjList)){
				return null;
			}

			mjList = MajiangConstant.clone_array(mjList);
			//找出龙牌
			var ranges:number[][] = [[1,9],[10,18],[19,27]];
			var start:number;
			var end:number;
			var nums:number[];
			var index:number;
			for(var i:number = 0; i < 3 ;i ++){
				nums = [];
				start = ranges[i][0];
				end = ranges[i][1];
				for(var j = start; j <= end ; j++){
					if(mjList.indexOf(j) != -1){
						nums.push(j);
					}
				}
				if(nums.length >= 8){
					var len:number = nums.length;
					for(var j = 0; j < len ; j++){
						index = mjList.indexOf(nums[j]);
						mjList.splice(index,1);
					}
					break;
				}
			}

			if(nums.length < 8){
				return null;
			}
			if(nums.length == 9){
				return super.findTing(mjList);
			}else{
				var remove:number = this.findRemove(mjList);
				if(remove == -1){
					return null;
				}
				var kao:number[] = this.findLongKao(nums,start,end);
				return [[kao,0,remove]];
			}
		}

		public findRemove(mjList:number[]):number{
			var tmpMjList:number[];
			var removeMj:number;
			var len:number = mjList.length;
			for(var i:number = 0; i < len ; i++){
				tmpMjList = MajiangConstant.clone_array(mjList);
				MajiangConstant.sortMjList(tmpMjList,0);
				removeMj = tmpMjList[i];
				tmpMjList.splice(i,1);
				if(this.hu(tmpMjList)){
					return removeMj;
				}
			}
			return -1;
		}

		/**
		 * 寻找差哪一张就是龙了，返回靠牌
		 */
		public findLongKao(mjList:number[],start:number,end:number):number[]{
			for(var i:number = start; i <= end ; i += 3){
				if(mjList.indexOf(i) == -1){
					return [i + 1,i + 2];
				}
				if(mjList.indexOf(i + 1) == -1){
					return [i,i + 2];
				}
				if(mjList.indexOf(i + 2) == -1){
					return [i,i + 1];
				}
			}
			return [];
		}


	}
}