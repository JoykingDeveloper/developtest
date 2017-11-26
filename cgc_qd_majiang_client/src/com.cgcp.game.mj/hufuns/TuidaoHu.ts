module lj.cgcp.game.qdmj_705 {

	/**
	 * 推倒胡
	 */
	export class TuidaoHu extends BaseHu {
		/**
		 * 胡牌
		 */
		public hu(mjList:number[],jiangPai:number[] = null):boolean{
			var mjListResult:number[] = MajiangConstant.clone_array(mjList);
			MajiangConstant.sortMjList(mjListResult,0);
			mjListResult = this.zhaoPuPai(mjListResult);
			if(mjListResult.length == 0){
				return true;
			}

			mjListResult = MajiangConstant.clone_array(mjList);
			MajiangConstant.sortMjList(mjListResult,1);
			mjListResult = this.zhaoPuPai(mjListResult,false);
			if(mjListResult.length == 0){
				return true;
			}
			return false;
		}

		/**
		 * 找铺牌
		 */
		public zhaoPuPai(mjList:number[],posArrow:boolean = true,__3continue:boolean = true):number[]{
			var _tMjlist:number[] = MajiangConstant.clone_array(mjList);
			Log.log(mjList);
			//万能牌个数
			var wannengCount:number = MajiangConstant.getWannengCount(mjList,this.ispao,posArrow?0:1);
			Log.log(mjList);

			// 找出对牌
			var countVals:any = MajiangConstant.array_values_count(mjList);
			var count:number;
			var hasDuipai:boolean = false;//是否有对牌
			var duipaiCount:number = 0;//获取有几个对子
			var initDuiPaiCount:number = 0;
			var has3pai:boolean = false;
			for(var mj in countVals){
				count = countVals[mj];
				if(count == 2 || count == 3){
					hasDuipai = true;
					if(count == 2) duipaiCount++;
					if(count == 3) has3pai = true;
				}
			}
			initDuiPaiCount = duipaiCount;
			Log.log(mjList);
			//检测麻将是否是3个一连
			var seArr:number[];
			var index:number = 0;
			var whileCount:number = mjList.length;
			var useWanNeng:boolean = false;
			var useWanNenged:boolean = false;//万能牌是否用过了
			var continueDuipai:boolean = hasDuipai;//对牌是否跳过检测
			var continueTwoWanneng:boolean = true;//是否跳过需求两张万能牌的组合
			var _continue:boolean = false;
			var _3continue:boolean = __3continue;
			while(index < whileCount){
				var num1:number = mjList[index];
				var num1Count:number = countVals[num1];
				if((num1Count == 2 || num1Count == 3) && continueDuipai){
					index += num1Count;
					if(index >= whileCount){
						//剩下的牌能胡直接跳出while循环
						if((duipaiCount - wannengCount) == 1){
							var canHu = true;
							for(var m in countVals){
								if(countVals[m] != 0 && countVals[m] != 2 && countVals[m] != 3){
									canHu = false;
									break;
								}
							}
							if(canHu){
								continue;
							}
						}
						index = 0;
						if(useWanNeng){
							mjList = MajiangConstant.clone_array(_tMjlist);
							wannengCount = MajiangConstant.getWannengCount(mjList,this.ispao,posArrow?0:1);
							duipaiCount = initDuiPaiCount;
							countVals = MajiangConstant.array_values_count(mjList);
						}
						whileCount = mjList.length;
						continueDuipai = false;
					}
					continue;
				}
				
				seArr = MajiangConstant.findMajiangStartEnd(num1);
				if(seArr[0] == -1){
					index++;
					if(!useWanNenged && continueTwoWanneng && index >= whileCount){
						continueTwoWanneng = false;
						index = 0;
						mjList = MajiangConstant.clone_array(_tMjlist);
						wannengCount = MajiangConstant.getWannengCount(mjList,this.ispao,posArrow?0:1);
						duipaiCount = initDuiPaiCount;
						countVals = MajiangConstant.array_values_count(mjList);
						whileCount = mjList.length;
						if(continueDuipai){
							continueDuipai = false;
						}else{
							useWanNeng = true;
							useWanNenged = true;
						}
					}
					continue;
				}
				var num2:number = posArrow ? num1 + 1 : num1 - 1;
				var num3:number = posArrow ? num1 + 2 : num1 - 2;
				var index2:number = mjList.indexOf(num2);
				var index3:number = mjList.indexOf(num3);
				if(useWanNeng){
					if(wannengCount < 1){
						// index++;
						useWanNeng = false;
						useWanNenged = true;
						continue;
					}
					if(num1Count == 2 && duipaiCount < 2){
						index++;
						if(continueTwoWanneng && index >= whileCount){
							continueTwoWanneng = false;
							index = 0;
							mjList = MajiangConstant.clone_array(_tMjlist);
							wannengCount = MajiangConstant.getWannengCount(mjList,this.ispao,posArrow?0:1);
							duipaiCount = initDuiPaiCount;
							countVals = MajiangConstant.array_values_count(mjList);
							whileCount = mjList.length;
						}
						continue;
					}

					if(posArrow){
						if(num2 > seArr[1]){
							num2 = num1 - 2;
							num3 = num1 - 1;
						}else if(num3 > seArr[1]){
							num2 = num1 - 1;
							num3 = num1 + 1;
						}
					}else{
						if(num2 < seArr[0]){
							num2 = num1 + 2;
							num3 = num1 + 1;
						}else if(num3 < seArr[0]){
							num2 = num1 + 1;
							num3 = num1 - 1;
						}
					}

					index2 = mjList.indexOf(num2);
					index3 = mjList.indexOf(num3);
					
					//2-3-0 该模式跳过顺子检测
					if(num2 >= seArr[0]  && num2 <= seArr[1] && num3 >= seArr[0]  && num3 <= seArr[1]){
						if((num1Count == 2 && countVals[num2] == 3 && index3 == -1) 
							|| (num1Count == 2 && countVals[num3] == 3 && index2 == -1) 
							|| (num1Count == 3 && countVals[num2] == 2 && index3 == -1)
							|| (num1Count == 3 && countVals[num3] == 2 && index2 == -1) ){
							index += num1Count;
							continue;
						}
					}
					//2-2-0 该模式跳过顺子检测
					if(num1Count == 2 && ((countVals[num2] == 2 && index3 == -1) || (index2 == -1 && countVals[num3] == 2))){
						index += 2;
						continue;
					}
					//3-3-0 该模式跳过顺子检测
					if(num1Count == 3 && ((countVals[num2] == 3 && index3 == -1) || (index2 == -1 && countVals[num3] == 3))){
						index += 3;
						continue;
					}
					if(index2 == -1 && index3 == -1 && wannengCount < 2) {
						index++;
						continue;//万能牌小于2
					}
					if((index2 == -1 || index3 == -1) && wannengCount < 1) {
						index++;
						continue;//万能牌小于1
					}
					//如果需要消耗两张万能，那么先看看后面是否有需求一张万能牌的情况
					if(continueTwoWanneng && index2 == -1 && index3 == -1){
						index++;
						if(index >= whileCount){
							continueTwoWanneng = false;
							index = 0;
							mjList = MajiangConstant.clone_array(_tMjlist);
							wannengCount = MajiangConstant.getWannengCount(mjList,this.ispao,posArrow?0:1);
							duipaiCount = initDuiPaiCount;
							countVals = MajiangConstant.array_values_count(mjList);
							whileCount = mjList.length;
						}
						continue;
					}
					if(num1Count == 2 && index2 == -1 && index3 == -1){
						index += num1Count;
						continue;
					}
					if(index3 == -1) {
						wannengCount -= 1;
					}else {
						mjList.splice(index3,1);
						whileCount -= 1;
						if(countVals[num3] == 2){
							duipaiCount--;
						}
						countVals[num3] -= 1;
					}
					if(index2 == -1) {
						wannengCount -= 1;
					}else {
						index2 = mjList.indexOf(num2);
						mjList.splice(index2,1);
						whileCount -= 1;
						if(countVals[num2] == 2){
							duipaiCount--;
						}
						countVals[num2] -= 1;
					}
					index = mjList.indexOf(num1);
					mjList.splice(index,1);
					whileCount -= 1;
					if(countVals[num1] == 2){
						duipaiCount--;
					}
					countVals[num1] -= 1;
					
					Log.log("-----");
					Log.log(wannengCount);
					Log.log(mjList);
					Log.log("-----");

					if(continueTwoWanneng && index >= whileCount){
						continueTwoWanneng = false;
						index = 0;
						mjList = MajiangConstant.clone_array(_tMjlist);
						wannengCount = MajiangConstant.getWannengCount(mjList,this.ispao,posArrow?0:1);
						duipaiCount = initDuiPaiCount;
						countVals = MajiangConstant.array_values_count(mjList);
						whileCount = mjList.length;
					}
					continue;
				}else if(num2 >= seArr[0]  && num2 <= seArr[1] && num3 >= seArr[0]  && num3 <= seArr[1]){
					_continue = false;
					if(!useWanNeng && (index2 == -1 || index3 == -1)){
						_continue = true;
					}else if(_3continue){
						var _3continueVal:number = this._3Continue(num1,num2,num3,countVals,posArrow);
						if(_3continueVal == -1){
							_3continue = false;
							index -= 1;
							continue;
						}else{
							_continue = _3continueVal == 1;
						}
					}
					if(_continue){
						index++;
						if(!useWanNenged && index >= whileCount){
							index = 0;
							mjList = MajiangConstant.clone_array(_tMjlist);
							wannengCount = MajiangConstant.getWannengCount(mjList,this.ispao,posArrow?0:1);
							duipaiCount = initDuiPaiCount;
							countVals = MajiangConstant.array_values_count(mjList);
							whileCount = mjList.length;
							if(continueDuipai){
								continueDuipai = false;
							}else{
								useWanNeng = true;
								useWanNenged = true;
							}
						}
						continue;
					}
					mjList.splice(index3,1);
					mjList.splice(index2,1);
					mjList.splice(index,1);
					whileCount -= 3;
					if(countVals[num3] == 2){
						duipaiCount--;
					}
					countVals[num3] -= 1;
					if(countVals[num2] == 2){
						duipaiCount--;
					}
					countVals[num2] -= 1;
					if(countVals[num1] == 2){
						duipaiCount--;
					}
					countVals[num1] -= 1;
					Log.log(mjList);
					if(!useWanNenged && !useWanNeng && index >= whileCount){
						index = 0;
						mjList = MajiangConstant.clone_array(_tMjlist);
						wannengCount = MajiangConstant.getWannengCount(mjList,this.ispao,posArrow?0:1);
						duipaiCount = initDuiPaiCount;
						countVals = MajiangConstant.array_values_count(mjList);
						whileCount = mjList.length;
						if(continueDuipai){
							continueDuipai = false;
						}else{
							useWanNeng = true;
							useWanNenged = true;
						}
					}
					continue;
				}
				if(useWanNeng && num1Count == 2){
					index += 2;
					if(continueTwoWanneng && index >= whileCount){
						continueTwoWanneng = false;
						index = 0;
						mjList = MajiangConstant.clone_array(_tMjlist);
						wannengCount = MajiangConstant.getWannengCount(mjList,this.ispao,posArrow?0:1);
						duipaiCount = initDuiPaiCount;
						countVals = MajiangConstant.array_values_count(mjList);
						whileCount = mjList.length;
					}
					continue;
				}
				if(useWanNeng && num1Count == 3){
					index += 3;
					if(continueTwoWanneng && index >= whileCount){
						continueTwoWanneng = false;
						index = 0;
						mjList = MajiangConstant.clone_array(_tMjlist);
						wannengCount = MajiangConstant.getWannengCount(mjList,this.ispao,posArrow?0:1);
						duipaiCount = initDuiPaiCount;
						countVals = MajiangConstant.array_values_count(mjList);
						whileCount = mjList.length;
					}
					continue;
				}
				index++;
				if(!useWanNenged && !useWanNeng && index >= whileCount){
					index = 0;
					mjList = MajiangConstant.clone_array(_tMjlist);
					wannengCount = MajiangConstant.getWannengCount(mjList,this.ispao,posArrow?0:1);
					duipaiCount = initDuiPaiCount;
					countVals = MajiangConstant.array_values_count(mjList);
					whileCount = mjList.length;
					if(continueDuipai){
						continueDuipai = false;
					}else{
						useWanNeng = true;
						useWanNenged = true;
					}
				}
			}

			//找出3个 或者4个 相同的 移除掉
			countVals = MajiangConstant.array_values_count(mjList);
			for(var mj in countVals){
				count = countVals[mj];
				if(count == 2 && wannengCount > 0){
					index = mjList.indexOf(parseInt(mj));
					mjList.splice(index,count);
					wannengCount--;
					continue;
				}
				if(count == 3 || count == 4){
					index = mjList.indexOf(parseInt(mj));
					mjList.splice(index,count);
				}
			}

			Log.log(mjList);

			if(mjList.length == 0 && wannengCount > 1){
				return mjList;
			}

			if(wannengCount == 0){
				if(mjList.length == 0){
					return mjList;
				}else if(mjList.length == 2 && (mjList[0] == mjList[1])){
					mjList.splice(0,2);
				}
				if(has3pai && __3continue && mjList.length > 0){
					return this.zhaoPuPai(_tMjlist,posArrow,false);
				}
				return mjList;
			}else if(mjList.length == 1){
				mjList.splice(0,1);
			}

			if(has3pai && __3continue && mjList.length > 0){
				return this.zhaoPuPai(_tMjlist,posArrow,false);
			}

			return mjList;
		}

		/**
		 * 在组连子的时候 遇到其中一个为3个的情况 是否需要跳过
		 */
		public _3Continue(num1:number,num2:number,num3:number,countVals:any,posArrow:boolean):number{
			var count1:number = countVals[num1];
			var count2:number = countVals[num2];
			var count3:number = countVals[num3];
			if(count1 != 3 && count2 != 3 && count3 != 3){
				return 0;
			}
			if(count1 == 2 && count2 == 3 && count3 == 2){//3,4,4,5,5,5,6,6,7
				var tn1:number;
				var tn2:number;
				if(posArrow){
					tn1 = num1 - 1;
					tn2 = num3 + 1;
				}else{
					tn1 = num3 - 1;
					tn2 = num1 + 1;
				}
				var seArr:number[] = MajiangConstant.findMajiangStartEnd(num1);
				if(tn1 >= seArr[0] && tn2 <= seArr[1] && countVals[tn1] == 1 && countVals[tn2] == 1){
					return -1;
				}
			}
			if(count1 == 3 && count2 == count3){
				return 0;
			}else if(count1 == 3 && count2 == count3){
				return 0;
			}else if(count2 == 3 && count1 == count3){
				return 0;
			}else if(count3 == 3 && count1 == count2){
				return 0;
			}
			return 1;
		}

		/**
		 * 当一张牌手中有4张时，移除的时候 看看是否有跟他靠在一起的单张
		 */
		public hasSingleKaoPai(mjList:number[],mjVal:number,countVals:any):boolean{
			var seArr:number[] = MajiangConstant.findMajiangStartEnd(mjVal);
			if(seArr[0] == -1){
				return false;
			}
			var num:number = mjVal + 1;
			var kaoNum:number = 0;
			if(countVals[num] == 1 && num >= seArr[0]  && num <= seArr[1] && mjList.indexOf(num) != -1){
				if(this.has258(mjList,num)){
					if(num < seArr[1]){
						num += 1;
						if(mjList.indexOf(num) != -1){
							kaoNum++;
						}
					}
					if(num < seArr[1]){
						num += 1;
						if(mjList.indexOf(num) != -1){
							kaoNum++;
						}
					}
					if(kaoNum == 0){
						return true;
					}
				}
			}
			num = mjVal - 1;
			if(countVals[num] == 1 && num >= seArr[0]  && num <= seArr[1] && mjList.indexOf(num) != -1){
				if(this.has258(mjList,num)){
					if(num > seArr[0]){
						num -= 1;
						if(mjList.indexOf(num) != -1){
							kaoNum++;
						}
					}
					if(num > seArr[0]){
						num -= 1;
						if(mjList.indexOf(num) != -1){
							kaoNum++;
						}
					}
					if(kaoNum == 0){
						return true;
					}
				}
			}
			return false;
		}

		/**
		 * 检测牌型
		 */
		public checkType(mjList:number[]):boolean{
			return true;
		}

		/**
		 * 找听牌
		 */
		public findTing(mjList:number[]):any[]{
			//一张将牌没有 不能听牌
			if(!this.has258(mjList)){
				return null;
			}

			var tings:any[] = [];
			var len:number = mjList.length;
			var tingObj:any[];
			var tmpMjList:number[];
			var removeMj:number;
			var jiangVal:number = -1;
			for(var i:number = 0; i < len ; i++){
				tmpMjList = MajiangConstant.clone_array(mjList);
				MajiangConstant.sortMjList(tmpMjList,0);
				removeMj = tmpMjList[i];
				tmpMjList.splice(i,1);
				tmpMjList = this.zhaoPuPai(tmpMjList);
				tingObj = this.getTingValue(tmpMjList,true);
				if(tingObj != null){
					jiangVal = tingObj[2];
					tingObj[2] = removeMj;
					tingObj.push(jiangVal);
					tings.push(tingObj);
				}
			}
			for(var i:number = len - 1; i >= 0 ; i--){
				tmpMjList = MajiangConstant.clone_array(mjList);
				MajiangConstant.sortMjList(tmpMjList,1);
				removeMj = tmpMjList[i];
				tmpMjList.splice(i,1);
				tmpMjList = this.zhaoPuPai(tmpMjList,false);
				tingObj = this.getTingValue(tmpMjList,false);
				if(tingObj != null){
					jiangVal = tingObj[2];
					tingObj[2] = removeMj;
					tingObj.push(jiangVal);
					tings.push(tingObj);
				}
			}

			return tings;
		}

		/**
		 * 找出具体是听哪张牌
		 */
		public getTingValue(mjList:number[],posArrow:boolean):any[]{
			//剩下的牌 没有将牌了
			if(!this.has258(mjList)){
				return null;
			}
			var len:number = mjList.length;
			if(len == 1){//单调肯定是将头
				return [mjList,mjList[0],mjList[0]];
			}
			if(len != 4){
				return null;
			}
			var countVals:any = MajiangConstant.array_values_count(mjList);
			var jiangVal:number = -1;
			for(var mj in countVals){
				if(countVals[mj] >= 2 && this.is258(parseInt(mj.toString()))){
					var index:number = mjList.indexOf(parseInt(mj.toString()));
					mjList.splice(index,2);
					len -= 2;
					jiangVal = parseInt(mj.toString());
					break;
				}
			}
			if(len != 2){
				return null;
			}
			if(mjList[0] == mjList[1]){
				return [mjList,mjList[0],jiangVal];
			}
			var num1:number = mjList[0];
			var num2:number = posArrow ? num1 + 1 : num1 - 1;
			var num3:number = posArrow ? num1 + 2 : num1 - 2;
			var seArr:number[] = MajiangConstant.findMajiangStartEnd(num1);
			if(num2 >= seArr[0]  && num2 <= seArr[1] && num3 >= seArr[0]  && num3 <= seArr[1]){
				var index2:number = mjList.indexOf(num2);
				var index3:number = mjList.indexOf(num3);
				if(index2 == -1 && index3 == -1){
					return null;
				}
				if(index2 == -1){
					return [mjList,num2,jiangVal];
				}else if(index3 == -1){
					MajiangConstant.sortMjList(mjList,0);
					return [mjList,num3,jiangVal];
				}
			}
			return null;
		}

		
	}
}