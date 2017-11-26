module lj.cgcp.game.qdmj_705 {
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
		/** 当前麻将混牌 */
		public hunMj:number;
		/** 上一次坐庄的人 */
    	public lastZhuang;
		/** 最后一次打出的麻将 */
		public lastMj:number;
		/** 最后一次杠的麻将 */
		public lastGangMj:number;
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
		/** 吃牌信息 */
		public chiList:any;
		/** 扭牌信息 */
		public niuList:any;
		/** 当前是否可以出牌 */
		public chupai:boolean;
		/** 出过的牌 */
		public chupaiList:any;
		/** 每个玩家剩余的手牌 */
    	public mjCount:any;
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
		/** 听牌状态 */
    	public ting:any;

		/** 最后一次操作的值 */
		public lOpVal:number;
		public lOpUid:string;

		/** 最后一次的新牌是什么 */
    	public newMj;

		/** 点炮的人 */
    	public pao:string;
		/** 是否带风 - 默认不带风 */
		public feng:number;
		/** 过胡 */
		public guohu:any;
		/**胡牌类型 */
		public huListStr:string;
	}
}