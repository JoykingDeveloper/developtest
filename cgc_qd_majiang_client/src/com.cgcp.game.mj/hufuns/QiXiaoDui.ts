module lj.cgcp.game.qdmj_705 {
	export class QiXiaoDui extends BaseHu {

		/**
		 * 胡牌
		 */
		public hu(mjList:number[]):boolean{
			if(mjList.length != 14){
				return false;
			}
			var tmpmjList:number[] = MajiangConstant.clone_array(mjList);
			var wnCount:number = MajiangConstant.getWannengCount(tmpmjList,this.ispao);
			var countVals:any = MajiangConstant.array_values_count(tmpmjList);
			var duizi:number = 0;
			var count:number;
			for(var mj in countVals){
				count = countVals[mj];
				if(count == 1 || count == 3){
					if(wnCount > 0){
						count++;
						wnCount--;
					}else{
						return false;
					}
				}
				if(count >= 2){
					duizi++;
				}
				if(count >= 4){
					duizi++;
				}
			}
			if(wnCount > 0 && wnCount%2 == 0){
				duizi += wnCount/2;
			}
			if(duizi == 7){
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
			var tmpmjList:number[] = MajiangConstant.clone_array(mjList);
			var wnCount:number = MajiangConstant.getWannengCount(tmpmjList,this.ispao);
			var countVals:any = MajiangConstant.array_values_count(tmpmjList);
			var duizi:number = 0;
			var count:number;
			for(var mj in countVals){
				count = countVals[mj];
				if((count == 1 || count == 3) && wnCount > 0){
					count ++;
					wnCount--;
				}
				if(count >= 2){
					duizi++;
				}
				if(count >= 4){
					duizi++;
				}
			}
			if(wnCount > 0 && wnCount%2 == 0){
				duizi += wnCount/2;
			}
			if(duizi >= 6){
				return true;
			}
			return false;
		}

		/**
		 * 找听牌
		 */
		public findTing(mjList:number[]):any[]{
			mjList = MajiangConstant.clone_array(mjList);

			var countVals:any = MajiangConstant.array_values_count(mjList);
			var count:number;
			var index:number;
			var duizi:number = 0;
			for(var mj in countVals){
				count = countVals[mj];
				if(count >= 2){
					index = mjList.indexOf(parseInt(mj.toString()));
					mjList.splice(index,2);
					duizi++;
					if(duizi >= 6) break;
				}
				if(count >= 4){
					index = mjList.indexOf(parseInt(mj.toString()));
					mjList.splice(index,2);
					duizi++;
					if(duizi >= 6) break;
				}
			}
			if(mjList.length > 2){
				return null;
			}
			var result:any[] = [];
			result.push([[mjList[0]],mjList[0],mjList[1]]);
			result.push([[mjList[1]],mjList[1],mjList[0]]);
			return result;
		}

	}
}