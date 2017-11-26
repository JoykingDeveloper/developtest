module lj.cgcp.game.qdmj_705 {
	export class RoleHead {

		public mainAsset:starlingswf.SwfSprite;
		public uid:string;
		
		public roomOwnerUid:string;
		public selfUid:string;

		public headImage:RoleHeadImage;

		public effkuang:egret.DisplayObject;
		public scoreText:egret.TextField;
		public readyTag:egret.DisplayObject;
		public offLineText:egret.DisplayObject;
		public clockTb:egret.DisplayObject;

		public zwk:egret.DisplayObject;
		public ztb:egret.DisplayObject;

		public kickBtn:starlingswf.SwfButton;

		public ttb:egret.DisplayObject;
		public tingText:egret.TextField;
		public tingTexts:string[] = ["","","将一色","风一色","十三不靠","十三幺",""];

		public constructor(mainAsset:starlingswf.SwfSprite) {
			this.mainAsset = mainAsset;
			InterfaceVariablesUtil.initVariables(this,this.mainAsset);
			
			this.effkuang.visible = false;
			this.readyTag.visible = false;
			this.offLineText.visible = false;
			this.kickBtn.visible = false;

			this.roomOwnerUid = RoomData.getCurrentRoom().owner;
			this.selfUid = RoleData.getRole().uid;
		}

		public init(uid:string):void{
			this.uid = uid;
			var role:Role = RoomData.getRole(this.uid);

			if(this.headImage == null){
				this.headImage = new RoleHeadImage(role,true);
				this.mainAsset.addChildAt(this.headImage,2);
			}else{
				this.headImage.reloadByRole(role);
			}
			this.headImage.x = 20;
			this.headImage.y = 31.5;
			this.headImage.width = 70;
			this.headImage.height = 70;
			this.showReady();

			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var totalFan:any = game.totalFan;
			if(totalFan != null && totalFan[this.uid]){
				this.scoreText.text = totalFan[this.uid];
			}else{
				this.scoreText.text = "0";
			}

			this.offLineText.visible = false;
			if(ExtGameHelper.isOffLine(uid)){
				this.offLineText.visible = true;
			}

			if(game.zhuang != uid){
				this.zwk.visible = false;
				this.ztb.visible = false;
			}else{
				this.zwk.visible = true;
				this.ztb.visible = true;
			}

			if(MajiangGameData.isOp(uid) || game.chupai || !game.isStart){
				this.clockTb.visible = false;
			}else{
				this.clockTb.visible = true;
			}

			if(!ExtGameHelper.gameIsStart() && this.uid != this.selfUid && this.selfUid == this.roomOwnerUid){
				this.kickBtn.visible = true;
			}else{
				this.kickBtn.visible = false;
			}

			this.updateTing();
		}

		public updateTing():void{
			this.tingText.visible = false;
			this.ttb.visible = false;
		}

		public showReady():void{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			if(!game.isStart && game.ready != null && game.ready[this.uid] != null){
				this.readyTag.visible = true;
			}else{
				this.readyTag.visible = false;
			}
		}

		public on_kickBtn(e:egret.Event):void{
			ExtGameHelper.kick(this.uid);
		}

		public show():void{
			this.mainAsset.visible = true;
		}

		public hide():void{
			this.mainAsset.visible = false;
		}

		public dispose():void{
			InterfaceVariablesUtil.disposeVariables(this);
		}
	}
}