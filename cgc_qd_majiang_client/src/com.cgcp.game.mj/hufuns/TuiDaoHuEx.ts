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
				var mjval:number = mjList[i];
				var row:number = (mjval==9 || mjval == 18 || mjval == 27)? 9:mjval%9;
				var col:number = (mjval==9 || mjval == 18 || mjval == 27)?Math.floor(mjval/9) - 1:Math.floor(mjval/9);
				mjListModel[col][0]++;
				mjListModel[col][row]++;
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
				var jiangMj:number = jiangPos*9 + i;
				if(mjListModel[jiangPos][i]>=2 && this.is258(jiangMj)){//258做将玩法
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
		public findTing(mjList:number[]):any[]{
			var mjListModel:number[][] = [[0,0,0,0,0,0,0,0,0,0]
										 ,[0,0,0,0,0,0,0,0,0,0]
										 ,[0,0,0,0,0,0,0,0,0,0]
										 ,[0,0,0,0,0,0,0,0,0,0]];
			//将一维数组转换成二维
			var len:number = mjList.length;
			for(var i:number=0;i<len;i++){
				var mjval:number = mjList[i];
				var row:number = (mjval==9 || mjval == 18 || mjval == 27)? 9:mjval%9;
				var col:number = (mjval==9 || mjval == 18 || mjval == 27)?Math.floor(mjval/9) - 1:Math.floor(mjval/9);
				mjListModel[col][0]++;
				mjListModel[col][row]++;
			}
			//装可能胡的牌，缺牌可以忽略
			var allMjs:number[] = [];
			for(var i:number = 1;i<=34;i++){
				if((i>=1 && i<=9 && mjListModel[0][0]>0) 
					||(i>=10 && i<=18 && mjListModel[1][0]>0)
					||(i>=19 && i<=27 && mjListModel[2][0]>0)
					||(i>=28 && i<=34 && mjListModel[3][0]>0)){
					allMjs.push(i);
				}
			}
			var huMjs:number[][] = [];
			var tingMjs:number[][] = [];
			var chuMjs:number[] = [];
			//遍历出牌
			for(var i=0;i<mjList.length;i++){
				var _mjList:number[] = MajiangConstant.clone_array(mjList);
				_mjList.splice(i,1);
				//遍历胡牌
				for(var j=0;j<allMjs.length;j++){
					var __mjList:number[] = MajiangConstant.clone_array(_mjList);
					__mjList.push(allMjs[j]);
					if(this.hu(__mjList)){
						//记录出这个麻将可以听牌
						if(chuMjs.indexOf(mjList[i]) == -1){
							chuMjs.push(mjList[i]);
						}
						//记录出这个牌能胡的牌
						if(chuMjs.length - huMjs.length == 1){
							huMjs.push([allMjs[j]]);
						}else{
							huMjs[huMjs.length - 1].push(allMjs[j]);
						}
						//记录出这个牌，听的牌
						if(chuMjs.length - tingMjs.length == 1){
							tingMjs.push(this.getTingVal(__mjList,allMjs[j]));
						}else{
							var result:number[] = this.getTingVal(__mjList,allMjs[j])
							if(result)
								for(var k in result){
									if(tingMjs[tingMjs.length - 1].indexOf(result[k]) == -1){
										tingMjs[tingMjs.length - 1].push(result[k]);
									}
								}
						}
					}
				}
			}
			//[听，出，胡]index一一对应
			return [tingMjs,chuMjs,huMjs];
		}
		/** 找出具体听的哪些牌，根据胡牌 */
		public getTingVal(mjList:number[],huMj:number):number[]{
			var mjListModel:number[][] = [[0,0,0,0,0,0,0,0,0,0]
										 ,[0,0,0,0,0,0,0,0,0,0]
										 ,[0,0,0,0,0,0,0,0,0,0]
										 ,[0,0,0,0,0,0,0,0,0,0]];
			//将一维数组转换成二维
			var len:number = mjList.length;
			var curCol:number = 0;
			for(var i:number=0;i<len;i++){
				var mjval:number = mjList[i];
				var row:number = (mjval==9 || mjval == 18 || mjval == 27)? 9:mjval%9;
				var col:number = (mjval==9 || mjval == 18 || mjval == 27)?Math.floor(mjval/9) - 1:Math.floor(mjval/9);
				if(mjval == huMj){
					curCol = col;
				}
				mjListModel[col][0]++;
				mjListModel[col][row]++;
			}
			var tingObjs:number[] = [];
			//是否做将的一门
			if(mjListModel[curCol][0] % 3 == 2){
				for(var i=1;i<10;i++){
					var jiangMj:number = curCol*9 + i;
					if(mjListModel[curCol][i]>=2 && this.is258(jiangMj)){//258做将玩法
						var _mjlistmodel:number[] = MajiangConstant.clone_array(mjListModel[curCol]) ;
						_mjlistmodel[i] -= 2;
						_mjlistmodel[0] -= 2;
						var result:any[] = this.ting_zhaoPuPai(_mjlistmodel,curCol,huMj);
						if(result[0]){
							tingObjs = result.length>1?result[1]:[];
							//如果将牌是胡的那张牌，为对倒
							if(jiangMj == huMj){
								tingObjs.push(huMj);
							}
							break;
						}
					}
				}
			}else{
				var result:any[] = this.ting_zhaoPuPai(mjListModel[curCol],curCol,huMj);
				tingObjs = result.length>1?result[1]:[];
			}
			return tingObjs;
		}
		/** 
		 * 递归寻找和胡牌相关的铺牌 
		 * */
		public ting_zhaoPuPai(mjListModel:number[],col:number,huMj:number):any[]{
			if(mjListModel[0] == 0){
				return [true];
			}
			var i:number=1;
			for(;i<10;i++){
				if(mjListModel[i] != 0){
					break;
				}
			}
			var curMj:number = col*9 + i;
			var result:any[] = [false];
			if(mjListModel[i]>=3){
				var _mjlistmodel:number[] = MajiangConstant.clone_array(mjListModel);
				_mjlistmodel[i] -= 3;
				_mjlistmodel[0] -= 3;
				result = this.ting_zhaoPuPai(_mjlistmodel,col,huMj);
				if(result[0] && result.length == 1){
					if(curMj == huMj){
						result[1] = [huMj]
					}
				}
				return result;
			}
			if(col != 3 && i<8 &&(mjListModel[i+1] > 0) && (mjListModel[i+2] > 0)){
				var _mjlistmodel:number[] = MajiangConstant.clone_array(mjListModel);
				_mjlistmodel[i] -= 1;
				_mjlistmodel[i+1] -= 1;
				_mjlistmodel[i+2] -= 1;
				_mjlistmodel[0] -= 3;
				result = this.ting_zhaoPuPai(_mjlistmodel,col,huMj);
				if(result[0] && result.length == 1){
					var curMjs:number[] = [curMj,curMj+1,curMj+2];
					if(curMjs.indexOf(huMj) != -1){
						curMjs.splice(curMjs.indexOf(huMj),1);
						result[1] = curMjs;
					}
				}
				return result;
			}
			return result;
		}
	}
}