module lj.cgcp.game.baohuang {
	export class BHGame {

		/** 游戏id */
		public $id;
		/** 当前操作者 */
		public currentUid;
		/** 上一个操作者 */
		public perUid;
		/**当前阶段
		 * 0未开始
		 * 1造反
		 * 2登基
		 * 3开始出牌
		 * */
		public currentState;
		/** 当前的准备信息 */
		public ready;
		/**造反情况*/
    	public zaofan;
		/** 皇帝 */
		public emperorUid;
		/** 是否抢独 */
		public isQiangDu = -1;
		/** 侍卫 */
		public guardUid;
		/** 是否明保 */
		public isMingBao = -1;
		public times;
		/** 走掉的顺序 */
		public endQueues;
		/** 每个人的卡牌信息 */
		public cardsInfo;
		/**游戏结束收所有玩家剩余牌*/
		public cards;
		/** 当前玩家的金币信息 */
		public money;	
		/** 当前的出牌信息 */
		public outCards;
		/** 最后一把是谁赢了 */
		public lastWin;
		/** 最大局数 */
		public maxCount;
		/** 当前局数 */
		public currentCount;
		/** 当局第一个操作者 */
		public firstUid;
		/** 需要的房卡数量 */
		public needRoomCard;
		
	}
}