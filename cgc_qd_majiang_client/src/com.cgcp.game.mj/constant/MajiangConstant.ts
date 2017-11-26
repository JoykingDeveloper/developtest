module lj.cgcp.game.qdmj_705 {
	export class MajiangConstant {

		private static huFuns:BaseHu[];
		private static tingFuns:BaseHu[];

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
		 * 找到可以扭的牌
		 */
		public static findNiu(mjList:number[]):number[]{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var niuVals:number[] = game.niuList[RoleData.getRole().uid][0];
			var niuGroup:number[][] = this.niuGroup(niuVals);
			var canNiuVals:number[] = [];
			var zfb_list:number[] = [28,29,30];
			var dny_list:number[] = [31,32,10];
			var feng_list:number[] = [31,32,33,34];
			//将万能牌转化为普通牌
			for(var i=0;i<niuGroup.length;i++){
				var data:number[] = niuGroup[i];
				for(var j=0;j<data.length;j++){
					if(data.length == 3){
						if(data[j] == game.hunMj){
							if(j == 2){//全万能组合
								if(zfb_list.indexOf(data[j]) != -1){
									niuGroup[i] = zfb_list;
									break;
								}else if(dny_list.indexOf(data[j]) != -1){
									niuGroup[i] = dny_list;
									break;
								}
							}
							continue;
						}else{
							if(zfb_list.indexOf(data[j]) != -1){
								niuGroup[i] = zfb_list;
								break;
							}else if(dny_list.indexOf(data[j]) != -1){
								niuGroup[i] = dny_list;
								break;
							}
						}
					}else{
						if(data[j] == game.hunMj){
							if(j == 3){//全万能组合
								niuGroup[i] = feng_list;
							}
							continue;
						}else{
							if(feng_list.indexOf(data[j]) != -1){
								niuGroup[i] = feng_list;
								break;
							}
						}
					}
				}
				data = niuGroup[i];
				//存入可扭列表
				for(var j=0;j<data.length;j++){
					if(canNiuVals.indexOf(data[j]) == -1){
						canNiuVals.push(data[j]);
					}
				}
			}
			var resultVals:number[] = [];
			//查找手牌中可扭的牌
			for(var i= 0;i<mjList.length;i++){
				if(canNiuVals.indexOf(mjList[i]) != -1 && resultVals.indexOf(mjList[i]) == -1){
					resultVals.push(mjList[i]);
				}
			}
			
			return resultVals;
		}
		/**
		 * 找到所有的扭牌成功情况下的扭牌数字
		 */
		public static findAllNiu(mjList:number[]){
			var niuArray = [10,28,29,30,31,32,33,34];
			var allNiuNum:number[] = [];
			for(var i = 0;i<mjList.length;i++){
				if(niuArray.indexOf(mjList[i]) != -1){
					allNiuNum.push(mjList[i]);
				}
			}
			return allNiuNum;
		}
		/**创建扭牌组合 */
		public static niuGroup(mjList:number[]):number[][]{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var niuStartValsList:number[] = MajiangConstant.clone_array(mjList);
			var wncounts:number = MajiangConstant.getWannengCount(niuStartValsList); 
			var niuGp:number[] = [28,29,30];
		
			var niuFinal:number[][] =[];
			var data:number[] = [];
			for(var i:number = 0;i<niuGp.length;i++){
				//判断中发白
				if(niuStartValsList.indexOf(niuGp[i]) != -1){
					data.push(niuGp[i]);
					niuStartValsList.splice(niuStartValsList.indexOf(niuGp[i]),1);
				}
			}
			if(data.length > 0){
				//使用万能牌
				var useWnCount:number = 3 - data.length;
				for(var i=0;i<useWnCount;i++){
					data.push(game.hunMj);
					wncounts--;
				}
				niuFinal.push(data);
			}
			data = [];
			niuGp = [31,32,33,34];
			//判断东南西北
			if((niuStartValsList.length + wncounts) % 3 == 1 ){		
				for(var i:number = 0;i<niuGp.length;i++){
					if(niuStartValsList.indexOf(niuGp[i]) != -1){
						data.push(niuGp[i]);
						niuStartValsList.splice(niuStartValsList.indexOf(niuGp[i]),1);
					}
				}
				if(data.length > 0){
					//使用万能牌
					var useWnCount:number = 4 - data.length;
					for(var i=0;i<useWnCount;i++){
						data.push(game.hunMj);
						wncounts--;
					}
					niuFinal.push(data);
				}
			}
			//判断东南幺
			data = [];
			niuGp = [10,31,32];
			for(var i:number = 0;i<niuGp.length;i++){
				if(niuStartValsList.indexOf(niuGp[i]) != -1){
					data.push(niuGp[i]);
					niuStartValsList.splice(niuStartValsList.indexOf(niuGp[i]),1);
				}
			}
			if(data.length > 0){
				//使用万能牌
				var useWnCount:number = 3 - data.length;
				for(var i=0;i<useWnCount;i++){
					data.push(game.hunMj);
					wncounts--;
				}
				niuFinal.push(data);
			}
			//判断万能牌组合
			if(wncounts > 0){
				niuFinal.push([]);
				for(var i:number = 0;i<wncounts;i++){
					niuFinal[niuFinal.length - 1].push(game.hunMj);
				}
			}
			return niuFinal;
		}
		/**
		 * 判断手牌中是否有扭牌组合，是在所有操作之前判断
		*/
		public static hasStartNiu(mjList:number[]):boolean{
			var mjList:number[] = MajiangConstant.clone_array(mjList);
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var WannengFigure:number = MajiangConstant.getWannengCount(mjList);   //返回万能牌的张数
			var allNiuNums:number[] = MajiangConstant.findAllNiu(mjList);  //所有成功条件的下的扭牌的数字
			var data:number[] = [];
			var niuList:number[] = game.niuList[RoleData.getRole().uid][0];
			//判断已经扭过的牌的组合里面是否含有该组合
			
			//中发白
			var templist:number[] = [28,29,30];
			for(var i:number = 0;i<allNiuNums.length;i++) { //遍历所有手牌中符合扭牌数字的牌
				var index:number = templist.indexOf(allNiuNums[i]);//手牌中含有扭牌的数字
				if(index != -1){//如果在templist中含有手牌中扭牌对的数字
					templist.splice(index,1);//将templist中的和手牌中扭牌数字相同的数删除，剩下的都为需要万能数补充的数
				}
				//当手牌中已经含有成对的扭牌组合时， 直接返回data
			}
			
			if(templist.length <= 2 && templist.length <= WannengFigure){ //templist 中的数据是为手牌中没有的数据
				var tem:number[] =  [28,29,30];
				for(var i:number = 0;i<tem.length;i++){
					if(niuList.indexOf(tem[i]) != -1){
						tem.splice(i,1);
						break;
					}
				}
				if(tem.length == 3){
					return true;
				}
			}
			
			//东南幺
			templist = [10,31,32];
			for(var i:number = 0;i<allNiuNums.length;i++) { // 遍历所有手牌中符合扭牌数字的牌
				var index:number = templist.indexOf(allNiuNums[i]);//手牌中含有扭牌的数字
				if(index != -1){//如果在templist中含有手牌中扭牌对的数字
					templist.splice(index,1);//将templist中的和手牌中扭牌数字相同的数删除，剩下的都为需要万能数补充的数
				}
				//当手牌中已经含有成对的扭牌组合时，直接返回data
			}
			if(templist.length <= 2 && templist.length <= WannengFigure){ //templist 中的数据是为手牌中没有的数据
				var tem:number[] =  [10,31,32];
				for(var i:number = 0;i<tem.length;i++){
					if(niuList.indexOf(tem[i]) != -1){
						tem.splice(i,1);
						break;
					}
				}
				if(tem.length == 3){
					return true;
				}
			}
			//东南西北
			templist = [31,32,33,34];
			for(var i:number = 0;i<allNiuNums.length;i++) { //遍历所有手牌中符合扭牌数字的牌
				var index:number = templist.indexOf(allNiuNums[i]);//手牌中含有扭牌的数字
				if(index != -1){//如果在templist中含有手牌中扭牌对的数字
					templist.splice(index,1);//将templist中的和手牌中扭牌数字相同的数删除，剩下的都为需要万能数补充的数
				}
				//当手牌中已经含有成对的扭牌组合时，直接返回data
			}
			if(templist.length <= 3 && templist.length <= WannengFigure){ //templist 中的数据是为手牌中没有的数据
				tem = [31,32,33,34];
				for(var i:number = 0;i<tem.length;i++){
					if(niuList.indexOf(tem[i]) != -1){
						tem.splice(i,1);
						break;
					}
					if(tem.length == 4){
						return true;
					}
				}
				
			}
			templist = [28,29,30,31,32,10];
			if(WannengFigure == 3 && templist.indexOf(game.hunMj) != -1){
				return true;
			}
			templist = [31,32,33,34];
			if(WannengFigure == 4 && templist.indexOf(game.hunMj) != -1){
				return true;
			}
			return false;
		}
		public static checkStartNiu(mjList:number[]):boolean{
			if(mjList == null || mjList.length < 1){
				return false;
			}
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var mjList:number[] = MajiangConstant.clone_array(mjList);
			/** 检测扭牌组合是否合法 */
			var wncount:number = MajiangConstant.getWannengCount(mjList);
			//中发白
			var hascount:number = 0;
			for(var mj = 28;mj<=30;mj++){
				var index:number = mjList.indexOf(mj);
				if(index != -1){
					hascount++;
					mjList.splice(index,1);
				}
			}
			if(hascount > 0){
				if(wncount < (3 - hascount)) return false;
				 else wncount -= (3 - hascount);
			}
			//东南西北
			hascount = 0;
			if((mjList.length + wncount)%3 != 0){
				for(var mj = 31;mj<=34;mj++){
					var index:number = mjList.indexOf(mj);
					if(index != -1){
						hascount++;
						mjList.splice(index,1);
					}
				}
			}
			if(hascount > 0){
				if(wncount < (4 - hascount) ) return false;
				else wncount -= (4 - hascount);
			}
			//东南幺
			hascount = 0;
			var vals:number[] = [31,32,10];
			if(mjList.length > 0){
				for(var i:number = 0;i<vals.length;i++){
					var index:number = mjList.indexOf(vals[i]);
					if(index != -1){
						hascount++;
						mjList.splice(index,1);
					}
				}
			}
			if(hascount > 0){
				if(wncount < (3 - hascount))return false;else wncount -= (3 - hascount);
			}
			if(mjList.length > 0){
				return false;
			}
			if((mjList.length + wncount) == 0){
				return true;
			}
			if(wncount == 3){
				var vals:number[] = [28,29,30,31,32,10];
				if(vals.indexOf(game.hunMj) != -1){
					return true;
				}
			}
			if(wncount == 4){
				var vals:number[] = [31,32,33,34];
				if(vals.indexOf(game.hunMj) != -1){
					return true;
				}
			}
			return false;
   		}
		
		/**
		 * 找出可以吃的牌
		 */
		public static findChi(mjVal:number,mjList:number[]){
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var chilist:number[][] = game.chiList[RoleData.getRole().uid];

			if(game.hunMj == mjVal){
				return [];
			}

			if(chilist != null && chilist.length > 1){
				return [];
			}

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
				if(game.hunMj == mjList[index] || game.hunMj == mjList[index2]){
					continue;
				}
				vals.push([index,index2]);
			}
			
			return vals;
		}

		/**
		 * 找出可以碰的牌
		 */
		public static findPeng(mjVal:number,mjList:number[]){
			if(MajiangConstant.isWanneng(mjVal)){
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
			if(MajiangConstant.isWanneng(mjVal)){
				return -1;
			}
			var countVal:any = MajiangConstant.array_values_count(mjList);
			if(countVal[mjVal] === 3){
				return mjList.indexOf(mjVal) + 1;
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
				MajiangConstant.huFuns = [new TuiDaoHuExWn(),new QiXiaoDui()];
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
		public static getWannengCount(mjList:number[],ispao:boolean = false,sortType:number = 0):number{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			MajiangConstant.sortMjList(mjList,sortType);
			var wannengCount:number = 0;
			var countVals:any = MajiangConstant.array_values_count(mjList);
			if(countVals[game.hunMj]){
				wannengCount = countVals[game.hunMj];
				if(ispao && game.lastMj == game.hunMj){
					wannengCount --;
				}
				mjList.splice(mjList.indexOf(game.hunMj),wannengCount);
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

		/**
		 * 找听牌
		 */
		public static findTing(mjList:number[]):any{
			if(MajiangConstant.tingFuns == null){
				MajiangConstant.tingFuns = [new TuidaoHu(),new QiXiaoDui(),new JiangYiSe(),new FengYiSe(),new ShiSanBuKao(),new ShiSanYao(),new YiTiaoLong()];
			}

			var len:number = MajiangConstant.tingFuns.length;
			var basehu:BaseHu;
			var tings:any[] = [];
			var tingObjs:any[];
			var tingObj:any[];
			var sames:any = {};
			var sameKey:string;
			var jiangVal:number;
			for(var i:number = 0; i < len ;i++){
				basehu = MajiangConstant.tingFuns[i];
				if(!basehu.checkType(mjList)) {
					continue;
				}
				tingObjs = basehu.findTing(mjList);
				if(tingObjs != null && tingObjs.length > 0){
					for(var j:number = 0; j < tingObjs.length ;j++){
						tingObj = tingObjs[j];
						sameKey = MajiangConstant.getTingSameKey(tingObj);
						if(sames[sameKey]){
							continue;
						}
						sames[sameKey] = 1;
						if(tingObj.length == 4){
							jiangVal = tingObj[3];
							tingObj[3] = i;
							tingObj.push(jiangVal);
						}else{
							tingObj.push(i);
							tingObj.push(-1);
						}
						//tingObj 靠牌 胡哪张 打哪张 胡牌类型 将牌
						tings.push(tingObj);
					}
					if(i > 1){
						break;
					}
				}
			}

			return tings;
		}

		public static getTingSameKey(tingObj:any):string{
			return tingObj[2];
		}

		/**
		 * 找出听牌之后需要显示出来的牌
		 */
		// public static findTingShowVals(mjList:number[],tingObj:any){
		// 	var kao:number[] = tingObj[0];//靠牌
		// 	var remove:number = tingObj[2];//需要删除的牌
		// 	var type:number = tingObj[3];//听牌类型
		// 	var kaoLen:number = kao.length;
		// 	var baseHu:BaseHu = new BaseHu();

		// 	if(kaoLen == 0 || type == 1){
		// 		return kao;
		// 	}
			
		// 	var countVals:any = MajiangConstant.array_values_count(mjList);
		// 	var count:number;
		// 	var val:number;
		// 	if(kaoLen == 2 && Math.abs(kao[0] - kao[1]) != 1 && kao[0] != kao[1]){//听夹牌 6,7,7,8,9
		// 		var huNum:number = tingObj[1];
		// 		var se:number[] = MajiangConstant.findMajiangStartEnd(huNum);
		// 		var startVal:number = se[0];
		// 		var endVal:number = se[1];
		// 		if(huNum - 3 >= startVal){
		// 			var num1:number = huNum - 1;
		// 			var num2:number = huNum - 2;
		// 			var index1:number = mjList.indexOf(num1);
		// 			var index2:number = mjList.indexOf(num2);
		// 			if(index1 != -1 && index2 != -1){
		// 				var count1:number = countVals[num1];
		// 				var count2:number = countVals[num2];
		// 				if(count1 - count2 == 1){
		// 					return [num2,num1];
		// 				}
		// 			}
		// 		}
		// 		return kao;
		// 	}
			
		// 	var returnArray:number[];
		// 	var se:number[] = MajiangConstant.findMajiangStartEnd(kao[0]);
		// 	var startVal:number = se[0];
		// 	var endVal:number = se[1];
		// 	var tmpArray:number[] = [];
		// 	var len:number = mjList.length;
		// 	var jiangVal:number = tingObj[4];
		// 	var continueJiang:number = 0;
		// 	for(var i:number = 0; i < len ;i++){
		// 		val = mjList[i];
		// 		count = countVals[val];
		// 		if(val == remove) {
		// 			remove = -1;
		// 			continue;
		// 		}
		// 		if(kaoLen == 2 && jiangVal == val && continueJiang < 2){
		// 			continueJiang++;
		// 			continue;
		// 		}
		// 		if(count <= 3 && val >= startVal && val <= endVal){
		// 			tmpArray.push(val);
		// 		}
		// 	}
		// 	len = tmpArray.length;
		// 	if(len >= 4){
		// 		MajiangConstant.sortMjList(tmpArray,0);
		// 		var index:number = 1;
		// 		var start:number = tmpArray[0];
		// 		var tmpArray2:number[] = [start];
		// 		var indexVal:number;
		// 		while(index < len){
		// 			indexVal = tmpArray[index];
		// 			if(indexVal == start + 1 || (indexVal == start && countVals[indexVal] > 1)){
		// 				tmpArray2.push(indexVal);
		// 				if(indexVal != start){
		// 					start++;
		// 				}
		// 				if(tmpArray2.length > 5 && countVals[indexVal - 1] > 2){
		// 					tmpArray2 = [indexVal];
		// 					start = indexVal;
		// 				}
		// 			}else if(tmpArray2.length > 3 && kaoLen == 1 && tmpArray2.indexOf(kao[0]) != -1){
		// 				break;
		// 			}else if(tmpArray2.length > 3 && tmpArray2.indexOf(kao[0]) != -1 && tmpArray2.indexOf(kao[1]) != -1){
		// 				break;
		// 			}else{
		// 				tmpArray2 = [indexVal];
		// 				start = indexVal;
		// 			}
		// 			index++;
		// 		}
		// 		if(tmpArray2.length > 3 && tmpArray2.indexOf(kao[0]) != -1){
		// 			if(tmpArray2.length == 5 && kaoLen == 2){
		// 				countVals = MajiangConstant.array_values_count(tmpArray2);
		// 				if(kao[0] == kao[1] && countVals[kao[0]] == 3){//55567
		// 					index = tmpArray2.indexOf(kao[0]);
		// 					tmpArray2.splice(index,3);
		// 					returnArray = tmpArray2;
		// 				}else if(countVals[kao[0]] == 2 || countVals[kao[1]] == 2){//23445
		// 					returnArray = kao;
		// 				}else{
		// 					returnArray = tmpArray2;
		// 				}
		// 			}else if(tmpArray2.length == 4 && (!baseHu.is258(tmpArray2[0]) || !baseHu.is258(tmpArray2[3]))){
		// 				if(kaoLen == 1 && baseHu.is258(kao[0]) && countVals[kao[0]] == 2){
		// 					index = tmpArray2.indexOf(kao[0]);
		// 					tmpArray2.splice(index,2);
		// 					returnArray = tmpArray2;
		// 				}else{
		// 					returnArray = kao;
		// 				}
		// 			}else{
		// 				returnArray = tmpArray2;
		// 			}
		// 		}
		// 	}
		// 	if(returnArray == null){
		// 		returnArray = kao;
		// 	}
		// 	countVals = MajiangConstant.array_values_count(mjList);
		// 	//靠牌是对子
		// 	if(kaoLen == 2 && kao[0] == kao[1]){
		// 		//不是将牌 那么直接返回
		// 		if(baseHu.is258(kao[0])){
		// 			for(var mj in countVals){
		// 				count = countVals[mj];
		// 				val = parseInt(mj.toString());
		// 				if(count == 2 && baseHu.is258(val) && val != kao[0]){
		// 					returnArray.push(val);
		// 					returnArray.push(val);
		// 				}
		// 			}
		// 		}
		// 	}

		// 	if(returnArray.length == 2 && returnArray[0] == returnArray[1]){//2,2,2,3,4,8,8,33
		// 		for(var mj in countVals){
		// 			count = countVals[mj];
		// 			val = parseInt(mj.toString());
		// 			if(returnArray.indexOf(val) != -1){
		// 				continue;
		// 			}
		// 			if(count == 3){
		// 				se = MajiangConstant.findMajiangStartEnd(val);
		// 				startVal = se[0];
		// 				endVal = se[1];
		// 				var num1:number = val + 1;
		// 				var num2:number = val - 1;
		// 				var index1:number = mjList.indexOf(num1);
		// 				var index2:number = mjList.indexOf(num2);
		// 				if(index1 != -1 && num1 <= endVal && index2 != -1 && num2 >= startVal){
		// 					continue;
		// 				}
		// 				if(val + 2 > endVal){
		// 					index1 = -1;
		// 				}
		// 				if(val - 2 < startVal){
		// 					index2 = -1;
		// 				}
		// 				if(index1 != -1 && countVals[num1] == 1){
		// 					num1 = val + 1;
		// 					num2 = val + 2;
		// 					if(mjList.indexOf(num2) != -1 && countVals[num2] == 1){
		// 						returnArray.push(num1);
		// 						returnArray.push(num2);
		// 					}
		// 				}else if(index2 != -1 && countVals[num2] == 1){
		// 					num1 = val - 2;
		// 					num2 = val - 1;
		// 					if(mjList.indexOf(num1) != -1 && countVals[num1] == 1){
		// 						returnArray.push(num1);
		// 						returnArray.push(num2);
		// 					}
		// 				}
		// 			}
		// 		}
		// 	}
		// 	MajiangConstant.sortMjList(returnArray,0);
		// 	return returnArray;
		// }

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



	}
}