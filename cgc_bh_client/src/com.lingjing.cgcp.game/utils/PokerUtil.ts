module lj.cgcp.game.baohuang {
	export class PokerUtil {
		/**
		 * 获取当前房间有多少人准备了
		 */
		public static getReadyCount(game:BHGame):number{
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
		 * 获取数量
		*/
		public static getCount(cards:any):number{
			
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
		 * 卡牌排序
		 * 大到小
		 * */
		public static sortCards(cards:any):any{
			if(cards == null){
				return null;
			}
			var count:number = this.getCount(cards);
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
			var count:number = this.getCount(cards);
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
		 * 是否包含大王
		*/
		public static haveBigKingCard(cards:any):boolean{
			for(var key in cards){
				if(cards[key][1] == 17){
					return true;
				}
			}
			return false;
		}
		/**
		 * 是否包含皇牌
		*/
		public static haveEmperorCard(cards:any):boolean{
			for(var key in cards){
				if(cards[key][0] == 1 && cards[key][1] == 17){
					return true;
				}
			}
			return false;
		}
		/**
		 * 是否包含保牌
		*/
		public static haveGuardCard(cards:any):boolean{
			for(var key in cards){
				if(cards[key][0] == 1 && cards[key][1] == 16){
					return true;
				}
			}
			return false;
		}
		/**
		 * 没有对比的推荐
		*/
		public static checkPokerByNone(mycards:any):any{
			if(mycards == null || this.getCount(mycards) == 0){
				return null;
			}
			mycards = this.sortCards1(mycards);
			if(this.getCount(mycards) > this.getNumberCountInCards(mycards,6)){
				//取除了6最小的
				for(var k in mycards){
					if(mycards[k][1] != 6){
						return this.getCardsSameNumArr(mycards,this.getNumberCountInCards(mycards,mycards[k][1]),mycards[k][1]);
					}
				}
			}else{
				//就剩下6了
				if(this.getNumberCountInCards(mycards,6) > 0){
					return mycards;
				}
			}
			return null;
		}
		/**
		 * 推荐比出牌大的牌
		*/
		public static CheckBigPokerByCards(outcards:any,mycards:number[][]):any{
			var allNumbers = {};
			allNumbers = this.getNumbersCountInCards(outcards);
			var mycards:number[][] = this.cloneArray(mycards);
			mycards = this.sortCards1(mycards);
			if(this.getCount(allNumbers) == 3){
				return null;
			}
			if(this.getNumberCountInCards(outcards,17)>0){
				return null;
			}
			var advices:any = {};
			var cards:any = {};
			if(this.getCount(allNumbers) == 1){
				var count = this.getCount(outcards);
				for(var k1 in mycards){//先找非组合
					if(outcards[0][1] < mycards[k1][1] && count==this.getNumberCountInCards(mycards,mycards[k1][1])){
						cards = this.getCardsSameNumArr(mycards,count,mycards[k1][1]);
						break;
					}
				}
				if(this.getCount(cards)<1){//找组合
					var k1_count:number = this.getNumberCountInCards(mycards,17);//大王个数
					var k2_count:number = this.getNumberCountInCards(mycards,16);//小王个数
					for(var k1 in mycards){
						var normal_count:number = 0;
						if(mycards[k1][1]<16){//这里排除大小王检查
							var normal_count:number = this.getNumberCountInCards(mycards,mycards[k1][1]);
						}
						if(outcards[0][1] < mycards[k1][1] && count <= (normal_count+k1_count + k2_count)){
							cards = this.getCardsSameNumArr(mycards,normal_count,mycards[k1][1]);//普通牌填充
							for(var k2 in mycards){//填充小王
								if(this.getCount(cards)<count && mycards[k2][1] == 16 && outcards[0][1]<16){
									cards[this.getCount(cards).toString()] = mycards[k2];
								}
							}
							for(var k2 in mycards){//填充大王
								if(this.getCount(cards)<count && mycards[k2][1] == 17 && outcards[0][1]<17){
									cards[this.getCount(cards).toString()] = mycards[k2];
								}
							}
							break;
						}
					}
				}
				if(this.getCount(cards)<1){
					return null;
				}else if(this.getCount(cards) == this.getCount(outcards)){
					for(var k2 in cards){
						advices[this.getCount(advices)] = cards[k2];
					}
				}else{
					//拆王，2
					for(var i=15;i<=17;i++){
						var count1 = this.getNumberCountInCards(mycards,i);
						advices = {};
						if(count < count1){
							advices = this.getCardsSameNumArr(mycards,count,17);
							break;
						}
					}
					
				}
			}
			if(this.getCount(allNumbers) == 2){
				for(var k in allNumbers){
					var count = parseInt(allNumbers[k]);
					cards = {};
					for(var k1 in mycards){//先找个数相当的
						if(parseInt(k) < mycards[k1][1] && count==this.getNumberCountInCards(mycards,mycards[k1][1])){
							cards = this.getCardsSameNumArr(mycards,count,mycards[k1][1]);
							break;
						}
					}
					if(this.getCount(cards)<1){//尝试才开组合
						for(var k1 in mycards){
							if(parseInt(k) < mycards[k1][1] && count<this.getNumberCountInCards(mycards,mycards[k1][1])){
								cards = this.getCardsSameNumArr(mycards,count,mycards[k1][1]);
								break;
							}
						}
					}
					if(this.getCount(cards)<1){
						return null;
					}else if(this.getCount(cards) == count){
						for(var k2 in cards){
							advices[this.getCount(advices)] = cards[k2];
							mycards.splice(mycards.indexOf(cards[k2]),1);
						}
					}
				}
			}
			
			return advices;
		
		}
		/**
		 * 得到牌组中所有点数的集合
		*/
		public static getNumbersInCards(cards:any):any{
			if(cards == null || this.getCount(cards)==0){
				return null;
			}
			cards = this.sortCards1(cards);
			var numbers = [];
			for(var i=0;i<this.getCount(cards);i++){
				numbers.push(cards[i][1]);
				i+=(this.getNumberCountInCards(cards,cards[i][1])-1);
			}
			return numbers;
		}
		/**
		 * 得到牌组中所有（点数:个数）的集合
		*/
		public static getNumbersCountInCards(cards:any):any{
			if(cards == null || this.getCount(cards)==0){
				return null;
			}
			cards = this.sortCards1(cards);
			var numbers_counts = {};
			for(var i=0;i<this.getCount(cards);i++){
				numbers_counts[cards[i][1]] = this.getNumberCountInCards(cards,cards[i][1]);
				i+=(this.getNumberCountInCards(cards,cards[i][1])-1);
			}
			return numbers_counts;
		}
		/**
		 * 是否合法牌组
		*/
		public static isRightOfCards(cards:any):boolean{
			if(cards == null || this.getCount(cards) == 0){
				return false;
			}
			var numbers = [];
			numbers = this.getNumbersInCards(cards);
			if(numbers.length > 3){
				return false;
			}
			for(var i=0;i<numbers.length;i++){
				if(numbers[i] >= 16){
					numbers.splice(i,1);
					i--;
				}
			}
			if(numbers.length > 1){
				return false;
			}
			return true;
		}
		/**
		 * 比较两牌大小 card1 选牌，card2 出牌信息
		*/
		public static compare2Cards(cards1:any,cards2:any):boolean{
			if(this.getCount(cards1) != this.getCount(cards2)){
				return false;
			}
			cards1 = this.sortCards(cards1);
			cards2 = this.sortCards(cards2);
			var len:number = this.getCount(cards1);
			for(var i=0;i<len;i++){
				if(cards1[i][1] <= cards2[i][1]){
					return false;
				}
			}
			return true;
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
						_cards[this.getCount(_cards).toString()] = cards[index+i];
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
			for(var k=0;k<this.getCount(cards);k++){
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
		public static cloneArray(cards:number[][]):number[][]{
			var clone:number[][] = [];
			for(var i=0;i<cards.length;i++){
				clone.push(cards[i]);
			}
			return clone.length>0?clone:null;
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