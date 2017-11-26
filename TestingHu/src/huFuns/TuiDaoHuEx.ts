module lj.cgcp.game.qdmj_705 {
	export class TuiDaoHuEx extends BaseHu {
		public zhaopupaiCount:number = 0;
		/**
		 * 胡牌
		 */
		public hu(mjList:number[]):boolean{
			var mjListModel:number[][] = [[0,0,0,0,0,0,0,0,0,0]
										 ,[0,0,0,0,0,0,0,0,0,0]
										 ,[0,0,0,0,0,0,0,0,0,0]
										 ,[0,0,0,0,0,0,0,0,0,0]];
			//将一维数组转换成二维
			var len:number = mjList.length;
			for(var i:number=0;i<len;i++){
				mjListModel[Math.floor(mjList[i]/9)][0]++;
				mjListModel[Math.floor(mjList[i]/9)][mjList[i]%9]++;
			}
			var jiangPos:number = -1;
			var yuShu:number = 0;
			var jiangExt:boolean = false;
			//有且仅有一组牌能做将，数量余数必须为2
			for(var i=0;i<4;i++){
				if(mjListModel[i][0]>0 && mjListModel[i][0] % 3 == 1){
					return false;
				}
				if(mjListModel[i][0]>0 && mjListModel[i][0] % 3 == 2){
					if(!jiangExt){
						jiangPos = i;
						jiangExt = true;
					}else{
						return false;
					}
				}
			}
			//没有将牌
			if(jiangPos == -1){
				return false;
			}
			for(var i=0;i<4;i++){
				if(i!=jiangPos){
					if(!this.zhaoPuPai(mjListModel[i],i==3)){
						egret.log("zhaoPuPaiCount:"+this.zhaopupaiCount);
						return false;
					}
				}
			}
			var success:boolean = false;
			for(var i=1;i<10;i++){
				if(mjListModel[jiangPos][i]>=2){
					var _mjlistmodel:number[] = MajiangConstant.clone_array(mjListModel[jiangPos]) ;
					_mjlistmodel[i] -= 2;
					_mjlistmodel[0] -= 2;
					if(this.zhaoPuPai(_mjlistmodel,jiangPos==3)){
						success = true;
					}
					if(success){
						break;
					}
				}
			}
			egret.log("zhaoPuPaiCount:"+this.zhaopupaiCount);
			return success;
		}
		public zhaoPuPai(mjListModel:number[],isWord:boolean):boolean{
			this.zhaopupaiCount ++;
			if(mjListModel[0] == 0){
				return true;
			}
			var i:number=1;
			for(;i<10;i++){
				if(mjListModel[i] != 0){
					break;
				}
			}
			var result:boolean = false;
			if(mjListModel[i]>=3){
				var _mjlistmodel:number[] = MajiangConstant.clone_array(mjListModel);
				_mjlistmodel[i] -= 3;
				_mjlistmodel[0] -= 3;
				result = this.zhaoPuPai(_mjlistmodel,isWord);
				return result;
			}
			if(!isWord && i<8 &&(mjListModel[i+1] > 0) && (mjListModel[i+2] > 0)){
				var _mjlistmodel:number[] = MajiangConstant.clone_array(mjListModel);
				_mjlistmodel[i] -= 1;
				_mjlistmodel[i+1] -= 1;
				_mjlistmodel[i+2] -= 1;
				_mjlistmodel[0] -= 3;
				result = this.zhaoPuPai(_mjlistmodel,isWord);
				return result;
			}
			return result;
		}
	}
}