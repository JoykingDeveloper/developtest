module lj.cgcp.game.scmj_204 {
	export class MajiangGame {

		/** 游戏id */
		public id:string;
		/** 当前的准备信息 */
		public ready:any;
		/** 游戏是否开始 */
		public isStart:boolean;
		/** 当前操作者 */
		public currentUid:string;
		/** 最后一次出牌的人 */
		public lastUid:string;
		/** 当前庄 */
		public zhuang:string;
		/** 上一次坐庄的人 */
    	public lastZhuang;
		/** 最后一次打出的麻将 */
		public lastMj:number;
		/** 一共有多少张麻将  */
		public totalMj:number;
		/** 当前摸到第几张麻将了 */
		public currentMj:number;
		/** 杠牌之后 从后面摸牌的inex */
		public currentMj2:number;
		/** 暗杠信息*/
    	public angangList:any;
		/** 杠牌信息 */
		public gangList:any;
		/** 碰牌信息 */
		public pengList:any;
		/** 点杠碰信息(这里的碰牌不能杠) */
        public diangangpengList:any;
		public passHuList:any;
		public passPengList:any;

		/** 当前是否可以出牌 */
		public chupai:boolean;
		/** 出过的牌 */
		public chupaiList:any;
		/**
		 * 三张牌是否交换
		 * （四个人都选了才交换）
		 * */
		public ischange = false;
		/**
		 * 选过三张牌的玩家列表
		 * */
		// public changeList;
		/** 每个玩家剩余的手牌 */
    	public mjCount:any;
		/** 缺一门 */
		public lackTypes:any;
		/** 番数据 */
		public fanData;
		/** 番数详细 */
    	public fanInfos;
		/** 总番数 */
		public totalFan;
		/** 最大局数 */
		public maxCount:number;
		/** 当前局数 */
		public currentCount:number;
		/** 特殊记录玩家某些操作的次数，比方说胡过多少次*/
    	public countData;
		/** 是否可以胡牌 */
    	public canHu:boolean;
		/** 已经胡牌的人 */
		public alreadyHus:any;
		/** 最后一次操作的值 */
		public lOpVal:number;
		public lOpUid:string;

		/** 最后一次的新牌是什么 */
    	public newMj;

		/** 点炮的人 */
    	public pao:string;
		public isDuoPao:number = 1;
		public isQiangGangHu:boolean = false;

        /** 限制，条件变量 */

        /** 点杠花 (1：自摸；2：点炮) */
        public gangFlower:number;
        /** 门清，中张 */
        public menqingType:boolean;
        /** 番数限制 （-1：无限制） */
        public maxFan:number;
        /** 自摸 (1：加番；2：加底) */
        public zimoType:number;
        /** 呼叫转移 */
        public hujiaozhuanyi:boolean;
        /** 幺九，将对 */
        public jiangduiType:boolean;

	}
}