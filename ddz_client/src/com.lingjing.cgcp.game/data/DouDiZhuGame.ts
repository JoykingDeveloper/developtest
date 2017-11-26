module lj.cgcp.game.doudizhu {
	export class DouDiZhuGame {

		/** 游戏id */
		public $id;
		/** 游戏是否开始 */
		// public isStart = false;
		/** 当前操作者 */
		public currentUid;
		/** 上一个操作者 */
		public perUid;
		/**当前阶段
		 * 0未开始
		 * 1抢地主
		 * 2出牌阶段*/
		public currentState;
		/** 当前的准备信息 */
		public ready;
		/** 地主uid */
		public dizhuUid;
		/** 当前叫分信息 */
		public score;
		/** 底分 */
		public difen;
		/** 农民加倍信息 */
		public jiabei;
		/** 倍数 */
		public beishu;
		/** 每个人的卡牌信息 */
		public cardsInfo;
		/**游戏结束收所有玩家剩余牌*/
		public cards;
		/** 当前玩家的金币信息 */
		public money;	
		/** 当前的出牌信息 */
		public outCards;
		/** 所出牌为炸弹或者火箭的次数 */
		public isZhadan = 0;
		/** 此局是否为春天 */
		public isSpring = 0;
		/** 最后一把是谁赢了 */
		public lastWin;
		/** 最大局数 */
		public maxCount;
		/** 当前局数 */
		public currentCount;
		/** 需要的房卡数量 */
		public needRoomCard;
		/**
		 * 规则:1日照模式 2传统模式
		*/
		public ruleType;
		
	}
}