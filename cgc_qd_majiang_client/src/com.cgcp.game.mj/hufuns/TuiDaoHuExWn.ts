module lj.cgcp.game.qdmj_705 {
	export class TuiDaoHuExWn extends BaseHu {
		public zhaopupaiCount:number = 0;
		/**
		 * 胡牌
		 * 采用递归找True
		 */
		public hu(mjList:number[]):boolean{
			var mjListModel:number[][] = [[0,0,0,0,0,0,0,0,0,0,0]
										 ,[0,0,0,0,0,0,0,0,0,0,0]
										 ,[0,0,0,0,0,0,0,0,0,0,0]
										 ,[0,0,0,0,0,0,0,0,0,0,0]];
			var _mjlsit:number[] = MajiangConstant.clone_array(mjList);
			if(_mjlsit.length%3 != 2){
				return false;
			}
			var wannengCount:number = MajiangConstant.getWannengCount(_mjlsit,this.ispao);
			//将一维数组转换成二维
			var len:number = _mjlsit.length;
			if(wannengCount == 2 && len == 0){
				return true;
			}
			for(var i:number=0;i<len;i++){
				var mjval:number = _mjlsit[i];
				var row:number = (mjval==9 || mjval == 18 || mjval == 27)? 9:mjval%9;
				var col:number = (mjval==9 || mjval == 18 || mjval == 27)?Math.floor(mjval/9) - 1:Math.floor(mjval/9);
				mjListModel[col][0]++;
				mjListModel[col][row]++;
			}
			//遍历做将
			if(wannengCount > 0){
				for(var i=0;i<4;i++){
					if(mjListModel[i][0] > 0 && this.buWanNeng(i,mjListModel,wannengCount)){
						egret.log("zhaoPuPaiCount:"+this.zhaopupaiCount);
						return true;
					}
				}
			}else{
				//没有万能牌省略不需要的将牌遍历
				var jiangPos:number = -1;
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
				var result:boolean = this.buWanNeng(jiangPos,mjListModel,wannengCount);
				egret.log("zhaoPuPaiCount:"+this.zhaopupaiCount);
				return result;
			}
			
			
			

			egret.log("zhaoPuPaiCount:"+this.zhaopupaiCount);
			return false;
		}
		/**补万能*/
		public buWanNeng(jiangPos:number,mjListModel:number[][],_wncount:number):boolean{
			//mjListModel 下划线越多说明循环阶数越高
			var _mjListModel:number[][] = MajiangConstant.clone_2darray(mjListModel);
			var wannengCount:number = _wncount;
			for(var i=0;i<4;i++){
				if(i == jiangPos){
					if(_mjListModel[i][0]>0 && _mjListModel[i][0] % 3 == 1 && wannengCount > 0){
						//补万能 1 张
						_mjListModel[i][10] += 1;
						_mjListModel[i][0] += 1;
						wannengCount--;
					}
					 if(_mjListModel[i][0]>0 && _mjListModel[i][0] % 3 == 0 && wannengCount > 1){
						//补万能 2 张
						_mjListModel[i][10] += 2;
						_mjListModel[i][0] += 2;
						wannengCount -= 2;
					}
				}else{
					if(_mjListModel[i][0]>0 && _mjListModel[i][0] % 3 == 2 && wannengCount > 0){
						//补万能 1 张
						_mjListModel[i][10] += 1;
						_mjListModel[i][0] += 1;
						wannengCount--;
					}
					if(_mjListModel[i][0]>0 && _mjListModel[i][0] % 3 == 1 && wannengCount > 1){
						//补万能 1 张
						_mjListModel[i][10] += 2;
						_mjListModel[i][0] += 2;
						wannengCount -= 2;
					}
				}
			}
			var jiangExt:boolean = false;
			//有且仅有一组牌能做将，数量余数必须为2(通过补牌后判断)
			for(var i=0;i<4;i++){
				if(_mjListModel[i][0]>0 && _mjListModel[i][0] % 3 == 1){
					return false;
				}
				if(_mjListModel[i][0]>0 && _mjListModel[i][0] % 3 == 2){
					if(!jiangExt){
						jiangExt = true;
					}else{
						return false;
					}
				}
			}
			if(!jiangExt){
				return false;
			}
			
			var success:boolean = false;
			if(wannengCount >= 3){
				//遍历相同花色补三张万能
				for(var i=0;i<4;i++){
					if(_mjListModel[i][0]>0){
						var __mjlistmodel:number[][] = MajiangConstant.clone_2darray(_mjListModel);
						__mjlistmodel[i][0] += 3;
						__mjlistmodel[i][10] += 3;
						//开始找铺牌递归
						for(var j=0;j<4;j++){
							if(j!=jiangPos){
								if(!this.zhaoPuPai(__mjlistmodel[j],j==3)){
									return false;
								}
							}
						}
						var success:boolean = false;
						for(var j=1;j<10;j++){
							if(_mjListModel[jiangPos][j] > 0 && (__mjlistmodel[jiangPos][j] + __mjlistmodel[jiangPos][10])>=2){
								var ___mjlistmodel:number[] = MajiangConstant.clone_array(__mjlistmodel[jiangPos]) ;
								//万能牌做将
								var jiangMjCount:number = ___mjlistmodel[j]>2?2:___mjlistmodel[j];
								___mjlistmodel[j] -= jiangMjCount;
								___mjlistmodel[10] -= (2-jiangMjCount);
								___mjlistmodel[0] -= 2;
								if(this.zhaoPuPai(___mjlistmodel,jiangPos==3)){
									success = true;
								}
								if(success){
									break;
								}
							}
						}
					}
				}
			}else{
				//开始找铺牌递归
				for(var i=0;i<4;i++){
					if(i!=jiangPos){
						if(!this.zhaoPuPai(_mjListModel[i],i==3)){
							return false;
						}
					}
				}
				
				for(var i=1;i<10;i++){
					if(_mjListModel[jiangPos][i] > 0 && (_mjListModel[jiangPos][i] + _mjListModel[jiangPos][10])>=2){
						var ___mjlistmodel:number[] = MajiangConstant.clone_array(_mjListModel[jiangPos]) ;
						//万能牌做将
						var jiangMjCount:number = ___mjlistmodel[i]>2?2:___mjlistmodel[i];
						___mjlistmodel[i] -= jiangMjCount;
						___mjlistmodel[10] -= (2-jiangMjCount);
						___mjlistmodel[0] -= 2;
						if(this.zhaoPuPai(___mjlistmodel,jiangPos==3)){
							success = true;
						}
						if(success){
							break;
						}
					}
				}
			}
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
			if((mjListModel[i] + mjListModel[10])>=3){
				var _mjlistmodel:number[] = MajiangConstant.clone_array(mjListModel);
				//当前使用万能牌数量
				var usewncount:number = _mjlistmodel[i] < 3?(3-_mjlistmodel[i]):0;
				_mjlistmodel[i] -= (3 - usewncount);
				_mjlistmodel[10] -= usewncount;
				_mjlistmodel[0] -= 3;
				result = this.zhaoPuPai(_mjlistmodel,isWord);
				if(result){//万能牌多种可能性，所以不在此返回false;
					return result;
				}
			}
			if(!isWord){
				var num2Count:number = 0;
				var num3Count:number = 0;
				var index2:number = -1;
				var index3:number = -1;
				if(i < 8){
					index2 = i+1;
					index3 = i+2;
				}else if(i == 8){
					index2 = i-1;
					index3 = i+1;
				}else if(i == 9){
					index2 = i-1;
					index3 = i-2;
				}
				num2Count = mjListModel[index2] > 0?1:0;
				num3Count = mjListModel[index3] > 0?1:0;
				
				if((num2Count + num3Count + mjListModel[10]) >= 2){
					var _mjlistmodel:number[] = MajiangConstant.clone_array(mjListModel);
					_mjlistmodel[i] -= 1;
					_mjlistmodel[index2] -= num2Count;
					_mjlistmodel[index3] -= num3Count;
					_mjlistmodel[10] -= (2 - num2Count - num3Count);
					_mjlistmodel[0] -= 3;
					result = this.zhaoPuPai(_mjlistmodel,isWord);
					if(result){//万能牌多种可能性，所以不在此返回false;
						return result;
					}
				}
				
			}
			return result;//万能牌多种可能性，递归结束返回false
		}
	}
}