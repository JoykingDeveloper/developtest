module lj.cgcp.game.jinhua {
	export class JinHuaGame {

		/** 游戏id */
		public id:string;
		/** 游戏是否开始 */
		public isStart:boolean;
		/** 当前操作者 */
		public currentUid:string;
		/* 记录是否有人没有看过牌 */
		public lastSee:number;
		/* 最后一次下注的类型 */
		public lastMoneyType:number;
		/* 最后一次下注钱 */
		public lastMoney:number;
		/** 当前的最大注 */
		public allMoney:number;
		/** 当前参与游戏的人 */
		public players:any;
		/** 当前的看牌信息 */
		public see:any;
		/** 放弃信息 */
		public giveup:any;
		/** 当前玩家的赌资信息 */
		public money:any;
		/** 当前的准备信息 */
		public ready:any;
		/** 最后一把是谁赢了 */
		public lastWin:string;
		/** 最大局数 */
		public maxCount:number;
		/** 当前局数 */
		public currentCount:number;
		/** 操作次数 需要每个人至少操作一次 才能开牌 */
		public operateCount:number;


		/**
		 * 获取当前房间有多少人准备了
		 */
		public static getReadyCount(game:JinHuaGame):number{
			if(game.ready == null){
				return 0;
			}
			var count:number = 0;
			for(var k in game.ready){
				count++;
			}
			return count;
		}
		
	}
}