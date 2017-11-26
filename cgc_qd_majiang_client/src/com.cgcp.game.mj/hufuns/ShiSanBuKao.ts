module lj.cgcp.game.qdmj_705 {
	export class ShiSanBuKao extends BaseHu {

		/**
		 * 胡牌
		 */
		public hu(mjList:number[]):boolean{
			if(mjList.length != 14){
				return false;
			}
			var countVals:any = MajiangConstant.array_values_count(mjList);
			var count:number;
			for(var mj in countVals){
				count = countVals[mj];
				if(count > 1){//不能有重复的牌
					return false;
				}
			}
			var tmpMjList:number[] = MajiangConstant.clone_array(mjList);
			MajiangConstant.sortMjList(tmpMjList,0);
			var mjVal:number;
			var index:number;
			for(var i:number = 28; i <= 34 ; i++){
				//移除风
				index = tmpMjList.indexOf(i);
				if(index != -1) tmpMjList.splice(index,1);
			}
			//风不够5张
			if(tmpMjList.length > 9){
				return false;
			}
			var _147258369:number[][][] = [
				[[1,4,7],[2,5,8],[3,6,9]],
				[[10,13,16],[11,14,17],[12,15,18]],
				[[19,22,25],[20,23,26],[21,24,27]]
			];
			var _canUse_i:number[] = [0,1,2];
			var _canUse_j:number[] = [0,1,2];
			var _arr:number[][];
			var _arr1:number[];
			var _removeCount:number;
			var _findCount:number = 0;
			for(var i:number = 0; i < 3 ; i++){
				if(_canUse_i.indexOf(i) == -1){
					continue;
				}
				_arr = _147258369[i];
				for(var j:number = 0; j < 3 ; j++){
					if(_canUse_j.indexOf(j) == -1){
						continue;
					}
					_arr1 = _arr[j];
					_removeCount = 0;
					for(var k:number = 0; k < 3 ; k++){
						mjVal = _arr1[k];
						index = tmpMjList.indexOf(mjVal);
						if(index != -1){
							tmpMjList.splice(index,1);
							_removeCount++;
						}
					}
					if(_removeCount > 0){
						index = _canUse_j.indexOf(j);
						_canUse_j.splice(index,1);
						_findCount++;

						index = _canUse_i.indexOf(i);
						_canUse_i.splice(index,1);
						break;
					}
				}
				if(_findCount == i){
					break;
				}
			}
			if(tmpMjList.length == 0){
				return true;
			}
			return false;
		}

		/**
		 * 检测牌型
		 */
		public checkType(mjList:number[]):boolean{
			if(mjList.length != 14){
				return false;
			}
			var countVals:any = MajiangConstant.array_values_count(mjList);
			var count:number;
			var sameCount:number = 0;
			for(var mj in countVals){
				count = countVals[mj];
				if(count > 1){
					sameCount += count - 1;
					//重复的牌有两种以上，不能做十三不靠了
					if(sameCount > 1){
						return false;
					}
				}
			}
			var tmpMjList:number[] = MajiangConstant.clone_array(mjList);
			MajiangConstant.sortMjList(tmpMjList,0);
			var mjVal:number;
			var index:number;
			for(var i:number = 28; i <= 34 ; i++){
				//移除风
				index = tmpMjList.indexOf(i);
				if(index != -1) tmpMjList.splice(index,1);
			}
			//风最少4张
			if(tmpMjList.length > 10){
				return false;
			}
			var _147258369:number[][][] = [
				[[1,4,7],[2,5,8],[3,6,9]],
				[[10,13,16],[11,14,17],[12,15,18]],
				[[19,22,25],[20,23,26],[21,24,27]]
			];
			var _canUse_i:number[] = [0,1,2];
			var _canUse_j:number[] = [0,1,2];
			var _arr:number[][];
			var _arr1:number[];
			var _removeCount:number;
			var _removeVals:number[] = [];
			var _findCount:number = 0;
			var _sameCount:number = 0;
			var realRemoveVals:number[] = null;
			var realRemoveCount:number = 0;
			var realRemoveJ:number = -1;
			for(var i:number = 0; i < 3 ; i++){
				if(_canUse_i.indexOf(i) == -1){
					continue;
				}
				_arr = _147258369[i];

				realRemoveVals = null;
				realRemoveCount = 0;
				realRemoveJ = -1;
				_sameCount = 0;
				for(var j:number = 0; j < 3 ; j++){
					if(_canUse_j.indexOf(j) == -1){
						continue;
					}
					_arr1 = _arr[j];
					_removeCount = 0;
					_removeVals = [];
					for(var k:number = 0; k < 3 ; k++){
						mjVal = _arr1[k];
						index = tmpMjList.indexOf(mjVal);
						if(index != -1){
							_removeVals.push(mjVal);
							_removeCount++;
						}
					}
					if(_removeCount > 0 && (realRemoveJ == -1 || _removeCount > realRemoveCount)){
						realRemoveJ = j;
						realRemoveCount = _removeCount;
						realRemoveVals = _removeVals;
					}else if(realRemoveJ != -1 && _removeCount == realRemoveCount){
						_sameCount++;
					}
				}
				if(realRemoveCount > 0 && _sameCount == 0){
					for(var k:number = 0; k < realRemoveCount ; k++){
						mjVal = realRemoveVals[k];
						index = tmpMjList.indexOf(mjVal);
						tmpMjList.splice(index,1);
					}
					index = _canUse_j.indexOf(realRemoveJ);
					_canUse_j.splice(index,1);
					_findCount++;

					index = _canUse_i.indexOf(i);
					_canUse_i.splice(index,1);
				}else if(_sameCount > 0){
					_findCount++;
				}
				if(_findCount == i){
					break;
				}
			}
			if(_canUse_i.length == 1 && _canUse_j.length == 1){
				_arr1 = _147258369[_canUse_i[0]][_canUse_j[0]];
				for(var k:number = 0; k < 3 ; k++){
					mjVal = _arr1[k];
					index = tmpMjList.indexOf(mjVal);
					if(index != -1){
						tmpMjList.splice(index,1);
					}
				}
			}
			if(tmpMjList.length < 2){
				return true;
			}
			return false;
		}

		/**
		 * 找听牌
		 */
		public findTing(mjList:number[]):any[]{
			var tmpMjList:number[] = MajiangConstant.clone_array(mjList);
			MajiangConstant.sortMjList(tmpMjList,0);
			var mjVal:number;
			var index:number;
			for(var i:number = 28; i <= 34 ; i++){
				//移除风
				index = tmpMjList.indexOf(i);
				if(index != -1) tmpMjList.splice(index,1);
			}
			var _147258369:number[][][] = [
				[[1,4,7],[2,5,8],[3,6,9]],
				[[10,13,16],[11,14,17],[12,15,18]],
				[[19,22,25],[20,23,26],[21,24,27]]
			];
			var _canUse_i:number[] = [0,1,2];
			var _canUse_j:number[] = [0,1,2];
			var _arr:number[][];
			var _arr1:number[];
			var _removeCount:number;
			var _removeVals:number[] = [];
			var _findCount:number = 0;
			var _sameCount:number = 0;
			var realRemoveVals:number[] = null;
			var realRemoveCount:number = 0;
			var realRemoveJ:number = -1;
			for(var i:number = 0; i < 3 ; i++){
				if(_canUse_i.indexOf(i) == -1){
					continue;
				}
				_arr = _147258369[i];

				realRemoveVals = null;
				realRemoveCount = 0;
				realRemoveJ = -1;
				_sameCount = 0;
				for(var j:number = 0; j < 3 ; j++){
					if(_canUse_j.indexOf(j) == -1){
						continue;
					}
					_arr1 = _arr[j];
					_removeCount = 0;
					_removeVals = [];
					for(var k:number = 0; k < 3 ; k++){
						mjVal = _arr1[k];
						index = tmpMjList.indexOf(mjVal);
						if(index != -1){
							_removeVals.push(mjVal);
							_removeCount++;
						}
					}
					if(_removeCount > 0 && (realRemoveJ == -1 || _removeCount > realRemoveCount)){
						realRemoveJ = j;
						realRemoveCount = _removeCount;
						realRemoveVals = _removeVals;
					}else if(realRemoveJ != -1 && _removeCount == realRemoveCount){
						_sameCount++;
					}
				}
				if(realRemoveCount > 0 && _sameCount == 0){
					for(var k:number = 0; k < realRemoveCount ; k++){
						mjVal = realRemoveVals[k];
						index = tmpMjList.indexOf(mjVal);
						tmpMjList.splice(index,1);
					}
					index = _canUse_j.indexOf(realRemoveJ);
					_canUse_j.splice(index,1);
					_findCount++;

					index = _canUse_i.indexOf(i);
					_canUse_i.splice(index,1);
				}else if(_sameCount > 0){
					_findCount++;
				}
				if(_findCount == i){
					break;
				}
			}
			if(_canUse_i.length == 1 && _canUse_j.length == 1){
				_arr1 = _147258369[_canUse_i[0]][_canUse_j[0]];
				for(var k:number = 0; k < 3 ; k++){
					mjVal = _arr1[k];
					index = tmpMjList.indexOf(mjVal);
					if(index != -1){
						tmpMjList.splice(index,1);
					}
				}
			}
			if(tmpMjList.length == 0){
				return [[[],1,mjList[0]]];
			}
			return [[[],1,tmpMjList[0]]];
		}

	}
}