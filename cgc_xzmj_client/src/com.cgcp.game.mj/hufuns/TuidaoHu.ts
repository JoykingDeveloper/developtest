module lj.cgcp.game.scmj_204 {

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
			if(mjListResult.length == 2 && mjListResult[0] == mjListResult[1]){
				if(jiangPai != null){
					jiangPai[0] = mjListResult[0];
					jiangPai[1] = mjListResult[1];
				}
				return true;
			}

			mjListResult = MajiangConstant.clone_array(mjList);
			MajiangConstant.sortMjList(mjListResult,1);
			mjListResult = this.zhaoPuPai(mjListResult,false);
			if(mjListResult.length == 2 && mjListResult[0] == mjListResult[1]){
				if(jiangPai != null){
					jiangPai[0] = mjListResult[0];
					jiangPai[1] = mjListResult[1];
				}
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

			// 找出对牌
			var countVals:any = MajiangConstant.array_values_count(mjList);
			var count:number;
			var hasDuipai:boolean = false;//是否有对牌
			var duipaiCount:number = 0;//获取有几个对子
			var has3pai:boolean = false;
			for(var mj in countVals){
				count = countVals[mj];
				if(count == 2 || count == 3){
					hasDuipai = true;
					if(count == 2) duipaiCount++;
					if(count == 3) has3pai = true;
				}
			}
			Log.log(mjList);
			//检测麻将是否是3个一连
			var seArr:number[];
			var index:number = 0;
			var whileCount:number = mjList.length;
			var continueDuipai:boolean = hasDuipai;//对牌是否跳过检测
			var _continue:boolean = false;
			var _3continue:boolean = __3continue;
			while(index < whileCount){
				var num1:number = mjList[index];
				var num1Count:number = countVals[num1];
				if((num1Count == 2 || num1Count == 3) && continueDuipai){
					index += num1Count;
					if(index >= whileCount){
						index = 0;
						whileCount = mjList.length;
						continueDuipai = false;
					}
					continue;
				}
				//只有一个将牌 需要跳过
				// if(num1Count == 2 && duipaiCount == 1 && this.is258(num1)){
				// 	index++;
				// 	continue;
				// }
				seArr = MajiangConstant.findMajiangStartEnd(num1);
				if(seArr[0] == -1){
					index++;
					continue;
				}
				var num2:number = posArrow ? num1 + 1 : num1 - 1;
				var num3:number = posArrow ? num1 + 2 : num1 - 2;
				var index2:number = mjList.indexOf(num2);
				var index3:number = mjList.indexOf(num3);
				if(num2 >= seArr[0]  && num2 <= seArr[1] && num3 >= seArr[0]  && num3 <= seArr[1]){
					_continue = false;
					if(index2 == -1 || index3 == -1){
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
						if(continueDuipai && index >= whileCount){
							index = 0;
							whileCount = mjList.length;
							if(continueDuipai){
								continueDuipai = false;
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
					if(continueDuipai && index >= whileCount){
						index = 0;
						whileCount = mjList.length;
						if(continueDuipai){
							continueDuipai = false;
						}
					}
					continue;
				}
				index++;
				if(continueDuipai && index >= whileCount){
					index = 0;
					whileCount = mjList.length;
					if(continueDuipai){
						continueDuipai = false;
					}
				}
			}

			//找出3个 或者4个 相同的 移除掉
			countVals = MajiangConstant.array_values_count(mjList);
			var hasSingleKaoPai:boolean = false;
			for(var mj in countVals){
				count = countVals[mj];
				if(count == 3 || count == 4){
					if(!this.has258(mjList,parseInt(mj))){
						continue;
					}
					index = mjList.indexOf(parseInt(mj));
					hasSingleKaoPai = this.hasSingleKaoPai(mjList,parseInt(mj),countVals);
					if(hasSingleKaoPai && count == 4){
						mjList.splice(index,3);
					}else if(hasSingleKaoPai && count == 3){
						continue;
					}else{
						mjList.splice(index,count);
					}
				}
			}

			Log.log(mjList);

			if(has3pai && __3continue && (mjList.length > 2 || (mjList.length == 2 && mjList[0] != mjList[1]))){
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
		public checkType(mjList:number[]):string[]{
			return null;
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
				if(countVals[mj] >= 2){
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