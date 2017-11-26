module lj.cgcp.game.doudizhu {
	export class PokerUtil {
		/**
		 * 获取当前房间有多少人准备了
		 */
		public static getReadyCount(game:DouDiZhuGame):number{
			if(game.ready == null){
				return 0;
			}
			var count:number = 0;
			for(var k in game.ready){
				count++;
			}
			return count;
		}
		/**
		 * 获取他人剩余的排数量
		*/
		public static getCardsCount(cards:any):number{
			
			if(cards == null){
				return 0;
			}
			var count:number = 0;
			for(var k in cards){
				count++;
			}
			return count;
		}
		/**
		 * 判断是什么牌
		 * 1单牌,2对牌，3三不带，4三带一，5三带对，6连牌，7连对，8飞机不带，9飞机带一，10飞机带二，11炸弹，12火箭,13四带二，0非法组合
		*/
		public static getTypeByOutCards(outcards:any):number{
			if(outcards == null){
				return 0;
			}
			var count:number = this.getCardsCount(outcards);
			if(count == 0){
				return 0;
			}
			if(count == 1){
				return 1;
			}
			if(count == 2){
				if(this.isDuiPai(outcards)){
					return 2;
				}
				if(this.isHuoJianPai(outcards)){
					return 12;
				}
			}
			if(count == 3){
				if(this.isThree_0Pai(outcards)){
					return 3;
				}
			}
			if(count == 4){
				if(this.isBoom(outcards)){
					return 11;
				}
				if(this.isThree_1Pai(outcards)){
					return 4;
				}
			}
			if(count == 5){
				if(this.isThree_2Pai(outcards)){
					return 5;
				}
			}
			if(this.isFour_2Pai(outcards)){
				return 13;
			}
			if(this.isLianPai(outcards)){
				return 6;
			}
			
			if(this.isLianDuiPai(outcards)){
				return 7;
			}
			if(this.isFeiJi_0Pai(outcards)){
				return 8;
			}
			if(this.isFeiJi_1Pai(outcards)){
				return 9;
			}
			if(this.isFeiJi_2Pai(outcards)){
				return 10;
			}
			return 0;
		}
		private static isDuiPai(outcards:any):boolean{
			if(this.getCardsCount(outcards)!=2){
				return false;
			}
			if(outcards[0][1] == outcards[1][1]){
				return true;
			}else{
				return false;
			}
		}
		private static isThree_0Pai(outcards:any):boolean{
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(game.ruleType == 1){
				return false;
			}
			if(this.getCardsCount(outcards)!=3){
				return false;
			}
			for(var i = 1;i < 3;i++){
				if(outcards[i][1]!=outcards[i-1][1]){
					return false;
				}
			}
			return true;
		}
		private static isThree_1Pai(outcards:any):boolean{
			if(this.getCardsCount(outcards) != 4){
				return false;
			}
			for(var k in outcards){
				if(this.getNumberCountInCards(outcards,outcards[k][1]) == 3){
					return true;
				}
			}
			return false;
		}
		private static isThree_2Pai(outcards:any):boolean{
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(game.ruleType == 1){
				return false;
			}
			if(this.getCardsCount(outcards) != 5){
				return false;
			}
			var count1:number = 1;
			var count2:number = 0;
			var pai1:number = outcards[0][1];
			var pai2:number = 0;
			for(var i=1;i<5;i++){
				if(pai1 == outcards[i][1]){
					count1++;
				}else if(pai2 == 0){
					pai2 = outcards[i][1];
					count2++;
				}else if(pai2 == outcards[i][1]){
					count2++;
				}
			}
			if((count1 == 3&& count2==2)||(count1 == 2 && count2 == 3)){
				return true;
			}
			return false;
		}
		private static isBoom(outcards:any):boolean{
			if(this.getCardsCount(outcards) != 4){
				return false;
			}
			for(var i = 1;i < 4;i++){
				if(outcards[i][1]!=outcards[i-1][1]){
					return false;
				}
			}
			
			return true;
		}
		private static isFour_2Pai(outcards:any):boolean{
			if(this.getCardsCount(outcards) != 6){
				return false;
			}
			var four=[];
			four.push(outcards[0]);
			for(var i=1;i<6;i++){
				if(four[0][1] == outcards[i][1]){
					four.push(outcards[i]);
				}else{
					if(four.length != 4){
						four = [];
						four.push(outcards[i]);
					}
				}
			}
			if(four.length == 4){
				return true;
			}
			return false;
		}
		private static isLianPai(outcards:any):boolean{
			if(this.getCardsCount(outcards)<5){
				return false;
			}
			outcards = this.sortCards(outcards);
			var count:number = this.getCardsCount(outcards);
			for(var i=1;i<count;i++){
				if(outcards[i-1][1] - outcards[i][1] != 1){
					return false;
				}
			}
			if(outcards[0][1]>=15){//连牌最多到A
				return false;
			}
			return true;
		}
		private static isLianDuiPai(outcards:any):boolean{
			var count:number = this.getCardsCount(outcards);
			if(count<6){
				return false;
			}
			if(count%2 != 0){
				return false;
			}
			outcards = this.sortCards(outcards);
			for(var i=0;i<count;i++){
				if(this.getNumberCountInCards(outcards,outcards[i][1]) != 2){
					return false;
				}else{
					if(i > 1 && outcards[i-2][1] - outcards[i][1] != 1){
						return false;
					}
					i++;
				}
			}
			if(outcards[0][1]>=15){//连牌最多到A
				return false;
			}
			return true;
		}
		private static isFeiJi_0Pai(outcards:any):boolean{
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(game.ruleType == 1){
				return false;
			}
			var count:number = this.getCardsCount(outcards);
			if(count<6){
				return false;
			}
			if(count%3 != 0){
				return false;
			}
			var three_cards = [];//拥有三个的点数
			var temp = [];
			for(var i=0;i<count;i++){
				if(this.getNumberCountInCards(outcards,outcards[i][1]) != 3){
					return false;
				}else{
					i+=2;
					three_cards.push(outcards[i][1]);
					if(three_cards.length > 1 && three_cards[three_cards.length-2] - three_cards[three_cards.length - 1] != 1){
						return false;
					}
				}
				
			}
			if(three_cards[0]>14){//连牌最多到A
				return false;
			}
			if(three_cards.length * 3 == count){
				return true;
			}
			return false;
		}
		private static isFeiJi_1Pai(outcards:any):boolean{
			var count:number = this.getCardsCount(outcards);
			if(count<8){
				return false;
			}
			if(count%4 != 0){
				return false;
			}
			var three_cards = [];
			var other_cards = [];
			var temp = [];
			for(var i=0;i<count;i++){
				if(this.getNumberCountInCards(outcards,outcards[i][1]) == 3){
					three_cards.push(outcards[i][1]);
					i+=2;
					if(three_cards.length > 1 && three_cards[three_cards.length-2] - three_cards[three_cards.length - 1] != 1){
						if(three_cards.length == 2){
							//index->1to other_cards
							for(var index=0;index<3;index++){
								other_cards.push(three_cards[0]);
							}
							three_cards.splice(0,1);
						}else if(three_cards.length == (count/4+1)){
							//index->end to other_cards
							for(var index=0;index<3;index++){
								other_cards.push(three_cards[three_cards.length-1]);
							}
							three_cards.splice(three_cards.length-1,1);
						}else{
							return false;
						}
					}
				}else{
					other_cards.push(outcards[i][1]);
				}
				
			}
			if(three_cards.length > count/4 && count/4 == (other_cards.length + (three_cards.length - count/4)*3) && three_cards[0] == 15){
				//连续的到15，把15当成是带的牌
				return true;
			}
			if(three_cards[0]>14){//连牌最多到A
				return false;
			}
			if(other_cards.length != three_cards.length){
				return false;
			}
			return true;
		}
		private static isFeiJi_2Pai(outcards:any):boolean{
			var game:DouDiZhuGame = DouDiZhuGameData.getCurrentGame();
			if(game.ruleType == 1){
				return false;
			}
			var count:number = this.getCardsCount(outcards);
			if(count<10){
				return false;
			}
			if(count%5 != 0){
				return false;
			}
			var three_cards = [];
			var other_cards = [];
			var temp = [];
			for(var i=0;i<count;i++){
				if(this.getNumberCountInCards(outcards,outcards[i][1]) == 3){
					three_cards.push(outcards[i][1]);
					i+=2;
					if(three_cards.length > 1 && three_cards[three_cards.length-2] - three_cards[three_cards.length - 1] != 1){
						return false;
					}
				}else if( this.getNumberCountInCards(outcards,outcards[i][1]) == 2 || this.getNumberCountInCards(outcards,outcards[i][1]) == 4){
					other_cards.push(outcards[i][1]);
					i++;
				}else{
					return false;
				}
				
			}
			if(three_cards[0]>14){//连牌最多到A
				return false;
			}
			if(other_cards.length != three_cards.length){
				return false;
			}
			return true;
		}
		private static isHuoJianPai(outcards:any):boolean{
			if(this.getCardsCount(outcards) != 2){
				return false;
			}
			//王炸
			if((outcards[0][1] == 16 && outcards[1][1] == 17)
			||(outcards[0][1] == 17 && outcards[1][1] == 16)){
				return true;
			}
			return false;
		}
		/**
		 * 卡牌排序
		 * 大到小
		 * */
		public static sortCards(cards:any):any{
			if(cards == null){
				return null;
			}
			var count:number = this.getCardsCount(cards);
			for(var i=0;i<count;i++){
				for(var j=i;j>0;j--){
					if(cards[j][1]>cards[j-1][1]){
						var temp:any = cards[j];
						cards[j] = cards[j-1];
						cards[j-1] = temp;
					}else if(cards[j][1]==cards[j-1][1]&&cards[j][0]>cards[j-1][0]){
						var temp:any = cards[j];
						cards[j] = cards[j-1];
						cards[j-1] = temp;
					}else{
						break;
					}
				}
			}
			return cards;
		} 
		/**
		 * 小到大
		*/
		public static sortCards1(cards:any):any{
			if(cards == null){
				return null;
			}
			var count:number = this.getCardsCount(cards);
			for(var i=0;i<count;i++){
				for(var j=i;j>0;j--){
					if(cards[j][1]<cards[j-1][1]){
						var temp:any = cards[j];
						cards[j] = cards[j-1];
						cards[j-1] = temp;
					}else if(cards[j][1]==cards[j-1][1]&&cards[j][0]>cards[j-1][0]){
						var temp:any = cards[j];
						cards[j] = cards[j-1];
						cards[j-1] = temp;
					}else{
						break;
					}
				}
			}
			return cards;
		} 
		/**
		 * 找出大于之前出牌
		*/
		public static CheckBigPokerByCards(outcards:any,mycards:any):any{
			var type = this.getTypeByOutCards(outcards);
			//判断出牌是否火箭
			if(this.isHuoJianPai(outcards)){
				return null;
			}
			var _cards:any = {};
			//判断同牌比较大的
			switch(type){
				case 1 :
				_cards = this.checkBigByDanPai(outcards,mycards);
				if(_cards != null && this.getCardsCount(_cards)>0){
					Log.log(_cards);
					return _cards;
				}
				break;
				case 2 :
				_cards = this.checkBigByDuiPai(outcards,mycards);
				if(_cards != null && this.getCardsCount(_cards)>0){
					return _cards;
				}
				break;
				case 3 :
				_cards = this.checkBigByThree_0Pai(outcards,mycards);
				if(_cards != null && this.getCardsCount(_cards)>0){
					return _cards;
				}
				break;
				case 4 :
				_cards = this.checkBigByThree_1Pai(outcards,mycards);
				if(_cards != null && this.getCardsCount(_cards)>0){
					return _cards;
				}
				break;
				case 5 :
				_cards = this.checkBigByThree_2Pai(outcards,mycards);
				if(_cards != null && this.getCardsCount(_cards)>0){
					return _cards;
				}
				break;
				case 6 :
				_cards = this.checkBigByLianPai(outcards,mycards);
				if(_cards != null && this.getCardsCount(_cards)>0){
					return _cards;
				}
				break;
				case 7 :
				_cards = this.checkBigByLianDuiPai(outcards,mycards);
				if(_cards != null && this.getCardsCount(_cards)>0){
					return _cards;
				}
				break;
				case 8 :
				_cards = this.checkBigByFeiJi_0Pai(outcards,mycards);
				if(_cards != null && this.getCardsCount(_cards)>0){
					return _cards;
				}
				break;
				case 9 :
				_cards = this.checkBigByFeiJi_1Pai(outcards,mycards);
				if(_cards != null && this.getCardsCount(_cards)>0){
					return _cards;
				}
				break;
				case 10 :
				_cards = this.checkBigByFeiJi_2Pai(outcards,mycards);
				if(_cards != null && this.getCardsCount(_cards)>0){
					return _cards;
				}
				break;
				case 11 :
				_cards = this.checkBigByBoomPai(outcards,mycards);
				if(_cards != null && this.getCardsCount(_cards)>0){
					return _cards;
				}
				break;
				case 13 :
				_cards = this.checkBigByFour_2Pai(outcards,mycards);
				if(_cards != null && this.getCardsCount(_cards)>0){
					return _cards;
				}
				break;
			}
			//找出我牌中炸弹
			if(!this.isBoom(outcards))
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 4){
					return this.getCardsSameNumArr(mycards,4,mycards[k][1],false);
				}
			}
			_cards = {};
			//找出我牌中火箭
			for(var k in mycards){
				if(mycards[k][1] == 16 || mycards[k][1] == 17){
					_cards[this.getCardsCount(_cards).toString()] = mycards[k];
				}
			}
			if(_cards!=null && this.getCardsCount(_cards) == 2){
				return _cards;
			}else{
				_cards ={};
			}
			return _cards;
		}
		public static checkBigByDanPai(outcards:any,mycards:any):any{
			if(this.getCardsCount(outcards) != 1){
				return null;
			}
			mycards = this.sortCards1(mycards);
			//优先选中单张的
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 1){
					if(mycards[k][1] > outcards[0][1]){
						var _cards:any = {};
						_cards[this.getCardsCount(_cards).toString()] = mycards[k];
						return _cards; 
					}
				}
			}
			//拆单
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) > 1 && this.getNumberCountInCards(mycards,mycards[k][1]) <= 3){
					if(mycards[k][1] > outcards[0][1]){
						var _cards:any = {};
						_cards[this.getCardsCount(_cards).toString()] = mycards[k];
						return _cards; 
					}
				}
			}
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 4){
					return this.getCardsSameNumArr(mycards,4,mycards[k][1],false);
				}
			}
			return null;
		}
		public static checkBigByDuiPai(outcards:any,mycards):any{
			if(!this.isDuiPai(outcards)){
				return null;
			}
			mycards = this.sortCards1(mycards);
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 2){
					if(mycards[k][1] > outcards[0][1]){
						var _cards:any = {};
						var index:number = parseInt(k);
						_cards[this.getCardsCount(_cards).toString()] = mycards[index];
						_cards[this.getCardsCount(_cards).toString()] = mycards[index+1];
						return _cards;
					}
				}
			}
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1])==3){
					if(mycards[k][1]>outcards[0][1]){
						var _cards:any = {};
						var index:number = parseInt(k);
						_cards[this.getCardsCount(_cards).toString()] = mycards[index];
						_cards[this.getCardsCount(_cards).toString()] = mycards[index+1];
						return _cards;
					}
				}
			}
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 4){
					return this.getCardsSameNumArr(mycards,4,mycards[k][1],false);
				}
			}
			return null;
		}
		public static checkBigByThree_0Pai(outcards:any,mycards:any):any{
			if(!this.isThree_0Pai(outcards)){
				return null;
			}
			mycards = this.sortCards1(mycards);
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) > 2){
					if(mycards[k][1] > outcards[0][1]){
						return this.getCardsSameNumArr(mycards,3,mycards[k][1],false);
					}
				}
			}
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 4){
					return this.getCardsSameNumArr(mycards,4,mycards[k][1],false);
				}
			}
			return null;
		}
		public static checkBigByThree_1Pai(outcards:any,mycards:any):any{
			if(!this.isThree_1Pai(outcards)){
				return null;
			}
			mycards = this.sortCards1(mycards);
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) > 2){
					if(mycards[k][1] > this.getAllPaiByCount(outcards,3)[0][1]){
						var _cards:any = {};
						_cards = this.getCardsSameNumArr(mycards,3,mycards[k][1],false);
						// for(var k1 in mycards){
						// 	if(mycards[k1][1] != mycards[k][1] && this.getNumberCountInCards(mycards,mycards[k1][1]) == 3){
						// 		_cards[this.getCardsCount(_cards).toString()] = mycards[k1];
						// 		return _cards;
						// 	}
						// }
						var temp = this.getOneForThree_1(mycards,_cards[0][1]);
						if(temp != null){
							_cards[this.getCardsCount(_cards).toString()] = temp;
							return _cards;
						}
						
					}
				}
			}
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 4){
					return this.getCardsSameNumArr(mycards,4,mycards[k][1],false);
					
				}
			}
			return null;
		}
		/**
		 * 根据从小优先，和不拆优先选中带一的牌
		*/
		public static getOneForThree_1(mycards:any,threeNum:number):any{
			var temp:any = this.getAllPaiByCount(mycards,1); 
			for(var k2 in temp){
				if(temp[k2][1] != threeNum && temp[k2][1] < 16){
					return temp[k2];
				}
			}
			temp = this.getAllPaiByCount(mycards,2);
			for(var k2 in temp){
				if(temp[k2][1] != threeNum && temp[k2][1] < 16){
					return temp[k2];
				}
			}
			temp = this.getAllPaiByCount(mycards,3);
			for(var k2 in temp){
				if(temp[k2][1] != threeNum && temp[k2][1] < 16){
					return temp[k2];
				}
			}
			temp = this.getAllPaiByCount(mycards,4);
			for(var k2 in temp){
				if(temp[k2][1] != threeNum && temp[k2][1] < 16){
					return temp[k2];
				}
			}
			var temp:any = this.getAllPaiByCount(mycards,1); 
			//判断有无大小王
			for(var k2 in temp){
				if(temp[k2][1]>15){
					if(temp[k2][1] == 16){
						return temp[k2];
					}else if(temp[k2][1] == 17){
						return temp[k2];
					}
				}
			}
			
			return null;
		}
		public static checkBigByThree_2Pai(outcards:any,mycards:any):any{
			if(!this.isThree_2Pai(outcards)){
				return null;
			}
			mycards = this.sortCards1(mycards);
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) > 2){
					if(mycards[k][1] > this.getCardsSameMaxNum(outcards,3)){
						var _cards:any = {};
						_cards = this.getCardsSameNumArr(mycards,3,mycards[k][1],false);
						for(var k1 in mycards){
							if(mycards[k1][1] != mycards[k][1] && this.getNumberCountInCards(mycards,mycards[k1][1]) > 1){
								_cards[this.getCardsCount(_cards).toString()] = mycards[k1];
								_cards[this.getCardsCount(_cards).toString()] = mycards[parseInt(k1)+1];
								return _cards;
							}
						}
						
					}
				}
			}
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 4){
					return this.getCardsSameNumArr(mycards,4,mycards[k][1],false);
				}
			}
			return null;
		}
		public static checkBigByBoomPai(outcards:any,mycards:any):any{
			if(!this.isBoom(outcards)){
				return null;
			}
			mycards = this.sortCards1(mycards);
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 4){
					var num1 = mycards[k][1];
					var num2 = outcards[0][1];
					if(num1 > num2){
						return this.getCardsSameNumArr(mycards,4,mycards[k][1],false);
					}
				}
			}
			return null;
		}
		public static checkBigByFour_2Pai(outcards:any,mycards:any):any{
			if(!this.isFour_2Pai(outcards)){
				return null;
			}
			mycards = this.sortCards1(mycards);
			//只有找个炸弹
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 4){
					return this.getCardsSameNumArr(mycards,4,mycards[k][1],false);
				}
			}
			return null;
		}
		public static checkBigByLianPai(outcards:any,mycards:any):any{
			if(!this.isLianPai(outcards)){
				return null;
			}
			outcards = this.sortCards1(outcards);
			var count:number = this.getCardsCount(outcards);
			var startNum:number = outcards[0][1] + 1;
			mycards = this.sortCards1(mycards);
			var _cards:any = this.getSomeContinuousCards(mycards,1,count,startNum);
			if(this.getCardsCount(_cards)==count){
				return _cards;
			}
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 4){
					return this.getCardsSameNumArr(mycards,4,mycards[k][1],false);
				}
			}
			return null;
		}
		public static checkBigByLianDuiPai(outcards:any,mycards:any):any{
			if(!this.isLianDuiPai(outcards)){
				return null;
			}
			outcards = this.sortCards1(outcards);
			var count:number = this.getCardsCount(outcards);
			var startNum:number = outcards[0][1] + 1;
			mycards = this.sortCards1(mycards);
			var _cards:any = this.getSomeContinuousCards(mycards,2,count/2,startNum);
			if(this.getCardsCount(_cards)==count){
				return _cards;
			}
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 4){
					return this.getCardsSameNumArr(mycards,4,mycards[k][1],false);
				}
			}
			return null;
		}
		public static checkBigByFeiJi_0Pai(outcards:any,mycards:any):any{
			if(!this.isFeiJi_0Pai(outcards)){
				return null;
			}
			outcards = this.sortCards1(outcards);
			var count:number = this.getCardsCount(outcards);
			var startNum:number = outcards[0][1] + 1;
			mycards = this.sortCards1(mycards);
			var _cards:any = this.getSomeContinuousCards(mycards,3,count/3,startNum);
			if(this.getCardsCount(_cards)==count){
				return _cards;
			}
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 4){
					return this.getCardsSameNumArr(mycards,4,mycards[k][1],false);
				}
			}
			return null;
		}
		public static checkBigByFeiJi_1Pai(outcards:any,mycards:any):any{
			if(!this.isFeiJi_1Pai(outcards)){
				return null;
			}
			outcards = this.sortCards1(outcards);
			var count:number = this.getCardsCount(outcards);
			var startNum:number = this.getCardsSameMaxNum(outcards,3) - this.getCardsCount(outcards)/4 + 2;
			mycards = this.sortCards1(mycards);

			var _cards:any = this.getSomeContinuousCards(mycards,3,count/4,startNum);
			if(this.getCardsCount(_cards) == count - count / 4){
				//寻找带牌
				for(var k2 in mycards){
					if(this.getNumberCountInCards(_cards,mycards[k2][1]) == 3){
						continue;
					}
					_cards[this.getCardsCount(_cards).toString()] = mycards[k2];
					if(this.getCardsCount(_cards) == count){
						return _cards;
					}
				}
			}
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 4){
					return this.getCardsSameNumArr(mycards,4,mycards[k][1],false);
				}
			}
			return null;
		}
		public static checkBigByFeiJi_2Pai(outcards:any,mycards:any):any{
			if(!this.isFeiJi_2Pai(outcards)){
				return null;
			}
			outcards = this.sortCards1(outcards);
			var count:number = this.getCardsCount(outcards);
			var startNum:number = this.getCardsSameMaxNum(outcards,3) - this.getCardsCount(outcards)/5 + 2;
			mycards = this.sortCards1(mycards);

			var _cards:any = this.getSomeContinuousCards(mycards,3,count/5,startNum);
			if(this.getCardsCount(_cards) == count - count / 5*2){
				//寻找带牌
				for(var k in mycards){
					if(this.getNumberCountInCards(_cards,mycards[k][1]) >= 2){
						continue;
					}
					if(this.getNumberCountInCards(mycards,mycards[k][1]) < 2){
						continue;
					}
					_cards[this.getCardsCount(_cards).toString()] = mycards[k];
					_cards[this.getCardsCount(_cards).toString()] = mycards[parseInt(k)+1];
					if(this.getCardsCount(_cards) == count){
						return _cards;
					}
				}
			}
			for(var k in mycards){
				if(this.getNumberCountInCards(mycards,mycards[k][1]) == 4){
					return this.getCardsSameNumArr(mycards,4,mycards[k][1],false);
				}
			}
			return null;
		}
		/**
		 * 在没有出牌信息，或者上次出牌是自己的时候，选择出一手牌
		 * 如果剩余最后一手牌提示，否则提示最小一手牌
		*/
		public static checkPokerByNone(mycards:any):any{
			
			if(this.getTypeByOutCards(mycards) != 0){
				//如果是最后一手牌全部提示
				return mycards;
			}
			var advicecards:any = {};
			mycards = PokerUtil.sortCards1(mycards);
			for(var i = 0;i<PokerUtil.getNumberCountInCards(mycards,mycards[0][1]);i++){
				advicecards[i] = mycards[i];
			}
			if(DouDiZhuGameData.getCurrentGame().ruleType == 1 && PokerUtil.getNumberCountInCards(mycards,mycards[0][1]) == 3){
				//寻找一个带牌
				if(PokerUtil.getCardsCount(mycards)>3){
					var temp:any = PokerUtil.getOneForThree_1(mycards,mycards[0][1]);
					if(temp != null){
						advicecards[3] = temp;
					}
				}else{
					advicecards = {};
					advicecards[0] = mycards[0];
				}
			}
			return advicecards;
		}
		/**
		 * 比较两组牌的大小
		*/
		public static compareCards(com:any,b_com:any):boolean{
			
			if(this.isHuoJianPai(com)){
				return true;
			}
			if(this.isHuoJianPai(b_com)){
				return false;
			}
			if(this.getTypeByOutCards(com) == this.getTypeByOutCards(b_com)){
				//比大小
				switch(this.getTypeByOutCards(com)){
					case 1:return this.compareDanPai(com,b_com);
					case 2:return this.compareDuiPai(com,b_com);
					case 3:return this.compareThree_0Pai(com,b_com);
					case 4:return this.compareThree_1Pai(com,b_com);
					case 5:return this.compareThree_2Pai(com,b_com);
					case 6:return this.compareLianPai(com,b_com);
					case 7:return this.compareLianDuiPai(com,b_com);
					case 8:return this.compareFeiJi_0Pai(com,b_com);
					case 9:return this.compareFeiJi_1Pai(com,b_com);
					case 10:return this.compareFeiJi_2Pai(com,b_com);
					case 11:return this.compareBoomPai(com,b_com);
					case 13:return this.compareFour_2Pai(com,b_com);
					default:return false;
				}
			}else{

				if(this.isBoom(com)){
					return true;
				}
				//不同类型或者被比的是炸弹都返回小
				return false;
			}
		}
		/**
		 * 比较单牌
		*/
		public static compareDanPai(com:any,b_com:any):boolean{
			if(this.getCardsCount(com)==1 && this.getCardsCount(b_com)==1){
				if(com[0][1]>b_com[0][1]){
					return true;
				}
			}
			return false;
		}
		public static compareDuiPai(com:any,b_com:any):boolean{
			if(this.isDuiPai(com)&&this.isDuiPai(b_com)){
				if(com[0][1]>b_com[0][1]){
					return true;
				}
			}
			return false;
		}
		public static compareThree_0Pai(com:any,b_com:any):boolean{
			if(this.isThree_0Pai(com)&&this.isThree_0Pai(b_com)){
				if(com[0][1]>b_com[0][1]){
					return true;
				}
			}
			return false;
		}
		public static compareThree_1Pai(com:any,b_com:any):boolean{
			if(this.isThree_1Pai(com)&&this.isThree_1Pai(b_com)){

				if(this.getCardsSameMaxNum(com,3)>this.getCardsSameMaxNum(b_com,3)){
					return true;
				}
			}
			return false;
		}
		public static compareThree_2Pai(com:any,b_com:any):boolean{
			if(this.isThree_2Pai(com)&&this.isThree_2Pai(b_com)){
				if(this.getCardsSameMaxNum(com,3)>this.getCardsSameMaxNum(b_com,3)){
					return true;
				}
			}
			return false;
		}
		public static compareBoomPai(com:any,b_com:any):boolean{
			if(this.isBoom(com)&&this.isBoom(b_com)){
				if(com[0][1]>b_com[0][1]){
					return true;
				}
			}
			return false;
		}
		public static compareFour_2Pai(com:any,b_com:any):boolean{
			if(this.isFour_2Pai(com)&&this.isFour_2Pai(b_com)){
				if(this.getCardsSameMaxNum(com,4)>this.getCardsSameMaxNum(b_com,4)){
					return true;
				}
			}
			return false;
		}
		public static compareLianPai(com:any,b_com:any):boolean{
			if(this.isLianPai(com)&&this.isLianPai(b_com)&&this.getCardsCount(com) == this.getCardsCount(b_com)){
				if(com[0][1]>b_com[0][1]){
					return true;
				}
			}
			return false;
		}
		public static compareLianDuiPai(com:any,b_com:any):boolean{
			if(this.isLianDuiPai(com)&&this.isLianDuiPai(b_com)&&this.getCardsCount(com) == this.getCardsCount(b_com)){
				if(com[0][1]>b_com[0][1]){
					return true;
				}
			}
			return false;
		}
		public static compareFeiJi_0Pai(com:any,b_com:any):boolean{
			com = this.sortCards(com);
			b_com = this.sortCards(b_com);
			if(this.isFeiJi_0Pai(com)&&this.isFeiJi_0Pai(b_com)){
				if(com[0][1]>b_com[0][1]){
					return true;
				}
			}
			return false;
		}
		public static compareFeiJi_1Pai(com:any,b_com:any):boolean{
			if(this.isFeiJi_1Pai(com)&&this.isFeiJi_1Pai(b_com)){
				if(this.getCardsSameMaxNum(com,3)>this.getCardsSameMaxNum(b_com,3)&&this.getCardsCount(com) == this.getCardsCount(b_com)){
					return true;
				}
			}
			return false;
		}
		public static compareFeiJi_2Pai(com:any,b_com:any):boolean{
			if(this.isFeiJi_2Pai(com)&&this.isFeiJi_2Pai(b_com)){
				if(this.getCardsSameMaxNum(com,3)>this.getCardsSameMaxNum(b_com,3)&&this.getCardsCount(com) == this.getCardsCount(b_com)){
					return true;
				}
			}
			return false;
		}
		/**
		 * 找出牌中，count数量的牌，最大的点数
		*/
		public static getCardsSameMaxNum(cards:any,count:number):number{
			cards = this.sortCards(cards);
			var arr = {};//点数：个数
			var num:number = cards[0][1];
			
			for(var k in cards){
				if(cards[k][1] == num){
					if(arr[num] == null){
						arr[num] = this.getNumberCountInCards(cards,num);
					}
				}else{
					num = cards[k][1];
					arr[num] = this.getNumberCountInCards(cards,num);
				}
			}
			num = 0;
			for(var k1 in arr){
				if(arr[k1] == count){
					if(num == 0){
						num =  parseInt(k1);
					}else if(num < parseInt(k1)){
						num = parseInt(k1);
					}
				}
			}
			return num;
		}
		/**
		 * 获取count个Num点数的牌组
		*/
		public static getCardsSameNumArr(cards:any,count:number,num:number,issort:boolean = true):any{
			if(issort){
				cards = this.sortCards1(cards);
			}
			for(var k in cards){
				if(cards[k][1] == num && this.getNumberCountInCards(cards,num)>=count){
					var _cards:any = {};
					var index:number = parseInt(k);
					for(var i = 0;i<count;i++){
						_cards[this.getCardsCount(_cards).toString()] = cards[index+i];
					}
					return _cards;
				}
			}
			return null;
		}
		/**
		 * 从牌中找出某个点数的个数
		*/
		public static getNumberCountInCards(cards:any,num:number):number{
			var count = 0;
			for(var k in cards){
				if(cards[k][1] == num){
					count ++;
				}
			}
			return count;
		}
		/**
		 * 取出所有拥有Count个数的牌
		*/
		public static getAllPaiByCount(cards:any,count:number):any{
			cards = this.sortCards1(cards);
			var arr = {};
			var index:number = 0;
			for(var k=0;k<this.getCardsCount(cards);k++){
				if(this.getNumberCountInCards(cards,cards[k][1]) == count){
					for(var i=0;i<count;i++){
						arr[index] = cards[k + i];
						index++;
					}
					k+=(count-1);
				}
			}
			return arr;
		}
		/**
		 * 获取每count个,length个连续组合
		 * eg:[3,3,3,4,4,4] =>count = 3;length = 2;
		*/
		public static getSomeContinuousCards(cards:any,count:number,length:number,startNumber:number = 3):any{
			var count_value:any = this.get_count_value(cards);
			var result:any = {};
			var _length:number = 0;
			for(var value in count_value){
				if(startNumber == -1){
					startNumber = parseInt(value);
				}
				if(parseInt(value) < startNumber){
					continue;
				}
				if(startNumber > 14){
					return {};
				}
				if(parseInt(value) == startNumber && parseInt(count_value[value]) >= count){
					var _cards:any = this.getCardsSameNumArr(cards,count,parseInt(value));
					for(var k in _cards){
						result[_length] = _cards[k];
						_length++;
					}
					startNumber++;
					if(_length == length*count){
						return result;
					}
				}else{
					result = {};
					_length = 0;
					//说明跳过了点数
					if(parseInt(count_value[value]) >= count){//个数符合，从此处开始
						var _cards:any = this.getCardsSameNumArr(cards,count,parseInt(value));
						for(var k in _cards){
							result[_length] = _cards[k];
							_length++;
						}
						startNumber = parseInt(value)+1;
					}else{//不符合，从下一个开始
						startNumber = -1;
					}
				}
			}
			if(_length != length*count){
				return {};
			}
			return result;
		}
		/**
		 * 获取点数对应个数的集合
		 * {number:count}
		*/
		public static get_count_value(cards:any):any{
			var count_value = {};
			if(cards == null && this.getCardsCount(cards) == 0){
				return count_value;
			}
			cards = this.sortCards1(cards);
			var value:number = 0;
			for(var k in cards){
				value = cards[k][1];
				if(count_value[value] == null){
					count_value[value] = 1;
				}else{
					count_value[value] += 1;
				}
			}
			return count_value;
		}
		/** 获取扑克牌的index */
		public static pokerIndexOf(array:number[][],param:number[]):number{
			if(array == null || array.length == 0 || param == null || param.length == 0){
				return -1;
			}
			for(var i:number = 0;i<array.length;i++){
				if(array[i][0] == param[0] && array[i][1] == param[1]){
					return i;
				}
			}
			return -1;
		}
		/**
		 * 点对面碰撞检测
		*/
		public static checkHit(touchP:any,targetP:any,width:number,height:number):boolean{
			if(touchP.x >= targetP.x 
			&& touchP.x <= targetP.x+width 
			&& touchP.y >= targetP.y 
			&& touchP.y <= targetP.y+height){
				return true;
			}
			return false;
		}
	}
}