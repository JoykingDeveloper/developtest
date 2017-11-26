module lj.cgcp.game.scmj_204 {
	export class MajiangConstant {

		private static huFuns:BaseHu[];
		private static tingFuns:BaseHu[];
		public static mjArr = [[1,9],[10,18],[19,27]];
		public static isShangjia():boolean{
			var room:Room = RoomData.getCurrentRoom();
			var index1 = MajiangConstant.getPlayerIndexInRoom(room,RoleData.getRole().uid);
			var index2 = MajiangConstant.getPlayerIndexInRoom(room,MajiangGameData.getCurrentGame().currentUid);
			if((index1 - index2) == 1){
				return true;
			}
			if(index1 == 1 && index2 == 4){
				return true;
			}
			return false;
		}
		/**
		 * 是否为缺牌
		*/
		public static isLackMj(mjVal:number,lack:number):boolean{
			if(mjVal>=this.mjArr[lack-1][0] && mjVal<=this.mjArr[lack-1][1]){
				return true;
			}
			return false;
		}
		/*
         *是否包含缺牌
         */
        public static hasLackMj(mjList:number[],lack:number):boolean{
            if(mjList){
                for(var i in mjList){
                    if(!this.isLackMj(mjList[i],lack)){
                        continue;
                    }else{
                        return true;
                    }
                }
            }
            return false;

        }

		public static isSameType(mjs:number[]):boolean{
			if(mjs == null)return false;
			var typeArr:number[] = [];
			for(var key in mjs){
				if(typeArr.length==0){
					for(var key1 in this.mjArr){
						if(mjs[key]>=this.mjArr[key1][0] && mjs[key]<=this.mjArr[key1][1]){
							typeArr = this.mjArr[key1];
						}
					}
				}else{
					if(mjs[key]>=typeArr[0] && mjs[key]<=typeArr[1]){
						continue;
					}else{
						return false;
					}
				}
			}
			return true;
		}
		public static getPlayerIndexInRoom(room:Room,uid):number{
			var players:any = room.players;
			var varUid:string;
			var index:number = 1;
			for(var k in players){
				varUid = players[k];
				if(varUid == uid){
					return index;
				}
				index++;
			}
			return -1;
		}

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
		 * 找出可以吃的牌
		 */
		public static findChi(mjVal:number,mjList:number[]){
			if(mjVal >= 28 || !MajiangConstant.isShangjia()){
				return [];
			}
			var arr:number[] = MajiangConstant.findMajiangStartEnd(mjVal);
			var chiStart:number = arr[0];
        	var chiEnd:number = arr[1];

			var matchs1:number[][] = [];
			matchs1.push([mjVal - 1,mjVal + 1]);
			matchs1.push([mjVal + 1,mjVal + 2]);
			matchs1.push([mjVal - 1,mjVal - 2]);

			var matchs:number[][] = [];
			var tmpVal1:number;
			var tmpVal2:number;
			for(var i:number = 0; i < 3 ;i++){
				tmpVal1 = matchs1[i][0];
				tmpVal2 = matchs1[i][1];
				if(tmpVal1 >= chiStart  && tmpVal1 <= chiEnd && tmpVal2 >= chiStart  && tmpVal2 <= chiEnd){
					matchs.push(matchs1[i]);
				}
			}

			var vals:number[][] = [];
			var match:number[];
			var index:number;
			var index2:number;
			var len:number = matchs.length;
			for(var i:number = 0; i < len ;i++){
				match = matchs[i];
				index = mjList.indexOf(match[0]);
				index2 = mjList.indexOf(match[1]);

				if(index == -1 || index2 == -1) continue;
				vals.push([index,index2]);
			}
			return vals;
		}

		/**
		 * 找出可以碰的牌
		 */
		public static findPeng(mjVal:number,mjList:number[]){
			//判断是否缺牌
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var uid = RoleData.getRole().uid;
			var mjArr= [[1,9],[10,18],[19,27]];
			var type:number = game.lackTypes[uid];
			if(mjVal>=mjArr[type-1][0] && mjVal<=mjArr[type-1][1]){
				return -1;
			}
			var countVal:any = MajiangConstant.array_values_count(mjList);
			if(countVal[mjVal] >= 2){
				return mjList.indexOf(mjVal);
			}
			return -1;
		}

		/**
		 * 找出可以杠的牌
		 */
		public static findGang(mjVal:number,mjList:number[]){
			//最后一张牌不能杠
            if(MajiangGameData.getMjCount() == 0){
                return -1;
            }

			//判断是否缺牌
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var uid = RoleData.getRole().uid;
			var mjArr= [[1,9],[10,18],[19,27]];
			var type:number = game.lackTypes[uid];
			if(mjVal>=mjArr[type-1][0] && mjVal<=mjArr[type-1][1]){
				return -1;
			}
			var countVal:any = MajiangConstant.array_values_count(mjList);
			if(countVal[mjVal] === 3 ){
				return mjList.indexOf(mjVal) + 1;
			}
			return -1;
		}

		/**
		 * 找出可以胡的牌
		 */
		public static findHu(mjVal:number,mjList:number[]):boolean{
			//判断是否缺牌
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var uid = RoleData.getRole().uid;
			var mjArr= [[1,9],[10,18],[19,27]];
			var type:number = game.lackTypes[uid];
			
			var tmpMjList:number[] = MajiangConstant.clone_array(mjList);
			if(mjVal != -1) tmpMjList.push(mjVal);
			//包含缺牌不能胡牌
			for( var index in mjList){
				if(this.isLackMj(mjList[index],type)){
					return false;
				}
			}
			if(MajiangConstant.huFuns == null){
				MajiangConstant.huFuns = [new TuidaoHu(),new QiXiaoDui()];
			}

			var huFuns:BaseHu[] = MajiangConstant.huFuns;
			var len:number = huFuns.length;
			for(var i:number = 0; i < len ; i++){
				if(huFuns[i].hu(tmpMjList)){
					return true;
				}
			}
			return false;
		}
		
		/**
		 * 获取万能牌个数
		 */
		// public static getWannengCount(mjList:number[]):number{
		// 	var wannengVal:number = MajiangGameData.getCurrentGame().da2;
		// 	var wannengCount:number = 0;
		// 	var countVals:any = MajiangConstant.array_values_count(mjList);
		// 	if(countVals[wannengVal]){
		// 		wannengCount = countVals[wannengVal];
		// 		mjList.splice(mjList.indexOf(wannengVal),wannengCount);
		// 	}
		// 	return wannengCount;
		// }

		/**
		 * 是否是万能牌
		 */
		// public static isWanneng(mjVal:number):boolean{
		// 	return mjVal == MajiangGameData.getCurrentGame().da2;
		// }

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
		 * 获取元素个数
		*/
		public static getAnyCount(val:any):number{
			var count:number = 0;
			for(var key in val){
				count++;
			}
			return count;
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
		 * 排序
		 */
		public static sortMjList(mjList:number[],type:number,lacktype:number = 0):void{
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
			//缺一门排后面
			if(lacktype >= 1 && lacktype <=3){
				var arr:number[] = this.mjArr[lacktype-1];
				var temp:number[] = [];
				for(var i = 0;i<mjList.length;i++){
					if(mjList[i]>=arr[0]&&mjList[i]<=arr[1]){
						temp.push(mjList[i]);
						mjList.splice(i,1);
						i--;
					}
				}
				for(var index in temp){
					mjList.push(temp[index]);
				}
			}
		}

		

		public static getTingSameKey(tingObj:any):string{
			return tingObj[2];
		}

		

		/**
		 * 找出听牌之后需要显示出来的牌
		 */
		public static findTingShowVals(mjList:number[],tingObj:any){
			var kao:number[] = tingObj[0];//靠牌
			var remove:number = tingObj[2];//需要删除的牌
			var type:number = tingObj[3];//听牌类型
			var kaoLen:number = kao.length;
			var tuidaohu:TuidaoHu = new TuidaoHu();

			if(kaoLen == 0 || type == 1){
				return kao;
			}

			//如果靠牌是风牌 那么直接返回即可
			if(kao[0] >= 28){
				return kao;
			}

			//麻将分类 饼条万
			var len:number = mjList.length;
			var bing:number[] = [];
			var tiao:number[] = [];
			var wan:number[] = [];
			var mjVal:number;
			for(var i:number = 0; i < len ; i++){
				mjVal = mjList[i];
				if(mjVal == remove) continue;
				if(mjVal >= 1 && mjVal <= 9) bing.push(mjVal);
				else if(mjVal >= 10 && mjVal <= 18) tiao.push(mjVal);
				else if(mjVal >= 19 && mjVal <= 27) wan.push(mjVal);
			}

			var mjList:number[] = MajiangConstant.clone_array(mjList);
			var index:number = mjList.indexOf(remove);
			mjList.splice(index,1);

			//摸到哪些些牌可以胡
			var huMjs:number[] = MajiangConstant.findTingShowVals_getHuMjs(0,bing,mjList,[]);
			huMjs = MajiangConstant.findTingShowVals_getHuMjs(1,tiao,mjList,huMjs);
			huMjs = MajiangConstant.findTingShowVals_getHuMjs(2,wan,mjList,huMjs);

			Log.log("huMjs huMjs huMjs");
			Log.log(huMjs);

			if(huMjs.length == 1){
				return kao;
			}
			
			var countVals:any = MajiangConstant.array_values_count(mjList);
			var kaopais:any[] = [];
			var sameKaoPais:string[] = [];
			len = huMjs.length;
			for(var i:number = 0; i < len ;i++){
				MajiangConstant.findTingShowVals_getKaopai(huMjs[i],mjList,countVals,kaopais,sameKaoPais);
			}
			Log.log("huMjs222222 huMjs huMjs");
			Log.log(kaopais);

			len = kaopais.length;
			kao = [];
			var kaopai:number[];
			var len2:number;
			for(var i:number = 0; i < len ; i++){
				kaopai = kaopais[i];
				len2 = kaopai.length;
				for(var j:number = 0; j < len2 ; j++){
					mjVal = kaopai[j];
					if(countVals[mjVal] > 0){
						kao.push(mjVal);
						countVals[mjVal] -= 1;
					}
				}
			}

			Log.log(kao);

			len = kao.length;
			var addPais:number[] = [];
			for(var i:number = 0; i < len - 1 ; i++){
				var kao1:number = kao[i];
				var kao2:number = kao[i + 1];
				if((kao2 - kao1 == 3) && MajiangConstant.findMajiangType(kao1) == MajiangConstant.findMajiangType(kao2)){
					var index1:number = mjList.indexOf(kao2 - 2);
					var index2:number = mjList.indexOf(kao2 - 1);
					if(index1 != -1 && index2 != -1){
						addPais.push(kao2 - 2);
						addPais.push(kao2 - 1);
					}
				}
			}
			if(len > 2){
				for(var i:number = 0; i < len - 1 ; i++){
					var kao1:number = kao[i];
					var kao2:number = kao[i + 1];
					if((kao2 - kao1 == 2) && MajiangConstant.findMajiangType(kao1) == MajiangConstant.findMajiangType(kao2)){
						var index1:number = mjList.indexOf(kao2 - 1);
						if(index1 != -1){
							addPais.push(kao2 - 1);
						}
					}
				}
			}
			len = addPais.length;
			for(var i:number = 0; i < len ; i++){
				kao.push(addPais[i]);
			}

			MajiangConstant.sortMjList(kao,0);

			if(kao.length == 5){//6,7,7,8,9      2,3,4,4,5
				countVals = MajiangConstant.array_values_count(kao);
				if(countVals[kao[1]] == 2){
					kao = [kao[0],kao[1]];
				}else if(countVals[kao[3]] == 2){
					kao = [kao[3],kao[4]];
				}
			}

			return kao;
		}

		/**
		 * 找出可以胡的麻将
		 */
		public static findTingShowVals_getHuMjs(type:number,typeList:number[],mjList:number[],huMjs:number[]):number[]{
			var len = typeList.length;
			if(len <= 0){
				return huMjs;
			}
			var seArray:number[][] = [[1,9],[10,18],[19,27]];
			var se:number[] = seArray[type];
			var start:number = (typeList[0] - 1) < se[0] ? se[0] : (typeList[0] - 1);
			var end:number = (typeList[len - 1] + 1) > se[1] ? se[1] : (typeList[len - 1] + 1);
			var tuidaohu:TuidaoHu = new TuidaoHu();
			for(var i:number = start; i <= end ; i++){
				var tmpMjList:number[] = MajiangConstant.clone_array(mjList);
				tmpMjList.push(i);
				if(tuidaohu.hu(tmpMjList)){
					huMjs.push(i);
				}
			}
			return huMjs;
		}

		/**
		 * 获取某一个牌靠在哪些牌上可以胡
		 */
		public static findTingShowVals_getKaopai(huMj:number,mjList:number[],countVals:any,returnVals:any[],sameVals:string[]):any[]{
			var tuidaohu:TuidaoHu = new TuidaoHu();
			var tmpMjList:number[];
			var has:boolean = false;
			//靠前面两个
			var num1:number = huMj - 1;
			var num2:number = huMj - 2;
			var index1:number = mjList.indexOf(num1);
			var index2:number = mjList.indexOf(num2);
			if(index1 != -1 && index2 != -1){
				tmpMjList = MajiangConstant.clone_array(mjList);
				tmpMjList.splice(index2,1);
				tmpMjList.splice(index1 - 1,1);
				if(tuidaohu.hu(tmpMjList)){
					if(sameVals.indexOf(num2 + "_" + num1) == -1){
						returnVals.push([num2,num1]);
						sameVals.push(num2 + "_" + num1);
					}
					has = true;
				}
			}
			//靠后面两个
			num1 = huMj + 1;
			num2 = huMj + 2;
			index1 = mjList.indexOf(num1);
			index2 = mjList.indexOf(num2);
			if(index1 != -1 && index2 != -1){
				tmpMjList = MajiangConstant.clone_array(mjList);
				tmpMjList.splice(index1,1);
				tmpMjList.splice(index2 - 1,1);
				if(tuidaohu.hu(tmpMjList)){
					if(sameVals.indexOf(num1 + "_" + num2) == -1){
						returnVals.push([num1,num2]);
						sameVals.push(num1 + "_" + num2);
					}
					has = true;
				}
			}
			//靠前后各一个
			num1 = huMj - 1;
			num2 = huMj + 1;
			index1 = mjList.indexOf(num1);
			index2 = mjList.indexOf(num2);
			if(index1 != -1 && index2 != -1){
				tmpMjList = MajiangConstant.clone_array(mjList);
				tmpMjList.splice(index1,1);
				tmpMjList.splice(index2 - 1,1);
				if(tuidaohu.hu(tmpMjList)){
					if(sameVals.indexOf(num1 + "_" + num2) == -1){
						returnVals.push([num1,num2]);
						sameVals.push(num1 + "_" + num2);
					}
					has = true;
				}
			}
			
			var index:number;
			if(!has){
				//四个
				if(countVals[huMj] >= 3){
					tmpMjList = MajiangConstant.clone_array(mjList);
					index = mjList.indexOf(huMj);
					tmpMjList.splice(index,3);
					if(tuidaohu.hu(tmpMjList)){
						returnVals.push([huMj,huMj,huMj]);
					}
				}
				//三个
				if(countVals[huMj] >= 2){
					tmpMjList = MajiangConstant.clone_array(mjList);
					index = mjList.indexOf(huMj);
					tmpMjList.splice(index,2);
					if(tuidaohu.hu(tmpMjList)){
						returnVals.push([huMj,huMj]);
					}
				}
			}
			
			//单调将头
			if(countVals[huMj] == 1){
				var jiangpai:number[] = [-1,-1];
				tmpMjList = MajiangConstant.clone_array(mjList);
				tmpMjList.push(huMj);
				if(tuidaohu.hu(tmpMjList,jiangpai)){
					if(jiangpai[0] == huMj){
						returnVals.push([huMj]);
					}
				}
			}
			return returnVals;
		}

    /*
    *获取麻将牌型，的基础番数
    */
    public static getBaseFan(mj:number,mjList:number[]):number{
        var mjList:number[] = MajiangConstant.clone_array(mjList);
		if(mj != -1) mjList.push(mj);
		var game:MajiangGame = MajiangGameData.getCurrentGame();
		var uid:string = RoleData.getRole().uid;
		var pengList:number[] = game.pengList[uid];
		var gangList:number[] = game.gangList[uid];
		var angangList:number[] = game.angangList[uid];
        var fancount:number = 0;
        //判断各大胡法，加倍分数
		var huFuns:BaseHu[] = [new QiXiaoDui(),new JinGouDiao(),new PengPengHu(),new QingYiSe()];
        if(game.menqingType){
			huFuns.push(new MenQingHu());
			huFuns.push(new ZhongZhangHu());
		}
        if(game.jiangduiType){
			huFuns.push(new ShiSanYao());
			huFuns.push(new JiangYiSe());
        }

        var len:number = huFuns.length;
        for(var i = 0; i < len ; i++){
            /* @var $huObj BaseHu */
            var huObj:BaseHu = huFuns[i];
            var info:any = huFuns[i].checkType(mjList);
            if(info){
				fancount += parseInt(info[1]);
			}

        }
        //算根番
        var geng:number = 0;
        var mj_count:any = MajiangConstant.array_values_count(mjList);
        for(var val in mj_count){
            if(mj_count[val] == 4){
                geng++;
			}else if(mj_count[val] == 1 && pengList != null && pengList.indexOf(parseInt(val)) != -1){
                geng++;
            }
        }
        if(geng > 0){
            Log.log("算根"+geng+"番");
            fancount += geng;
        }
        //算杠番
        if(gangList){
			fancount += gangList.length;
            Log.log("算根"+gangList.length+"番");
        }
        if(angangList){
			fancount += angangList.length;
            Log.log("算根"+angangList.length+"番");
        }
		//杠上炮
		if(game.lastUid == game.lOpUid && game.lOpVal == 3){
			fancount++;
		}
        //限制番
        if(game.maxFan != -1 && fancount > game.maxFan){
            fancount = game.maxFan;
        }
        return fancount;

    }

	}
}