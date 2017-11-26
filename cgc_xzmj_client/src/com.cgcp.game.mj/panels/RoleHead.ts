module lj.cgcp.game.scmj_204 {
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

		public lackType:egret.Bitmap;
		public isHu:egret.DisplayObject;

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
			var score:number = 0;
			if(totalFan != null && totalFan[this.uid]){
                score = totalFan[this.uid];
            }
            if(game.fanData && game.fanData[this.uid]){
                score+=game.fanData[this.uid]
            }
            this.scoreText.text = score.toString();

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

			// if(MajiangGameData.isOp(uid) || game.chupai || !game.isStart){
			// 	this.clockTb.visible = false;
			// }else{
			// 	this.clockTb.visible = true;
			// }

			if(game.isStart && (game.lackTypes[this.uid] == null || !MajiangGameData.isSelectThree(this.uid))){
                this.clockTb.visible = true;
            }else{
                this.clockTb.visible = false;
            }

			if(!ExtGameHelper.gameIsStart() && this.uid != this.selfUid && this.selfUid == this.roomOwnerUid){
				this.kickBtn.visible = true;
			}else{
				this.kickBtn.visible = false;
			}

			this.updateTing();
			this.updateHu();
			this.updateLack();
		}
        public moveScore:egret.BitmapText = null;
		public showMoveScore(score:number):void{
            if(score == 0){
                return;
            }
            if(!this.moveScore){
                this.moveScore= new egret.BitmapText();
                this.moveScore.font = RES.getRes("mj_jiafen");
                this.moveScore.textAlign = egret.HorizontalAlign.CENTER;
                this.moveScore.width = 150;
                this.moveScore.height = 50;
                this.moveScore.x = this.scoreText.x + (this.scoreText.width/2-this.moveScore.width/2);
                this.moveScore.y = this.scoreText.y;
                this.mainAsset.addChild(this.moveScore);
            }
            if(this.moveScore){
                if(score>0){
                    this.moveScore.text = "+"+score;
                    this.moveScore.font = RES.getRes("mj_jiafen");
                    ColorUtil.clearColor(this.moveScore);
                }else{
                    this.moveScore.text = score.toString();
                    this.moveScore.font = RES.getRes("mj_jianfen");
                    ColorUtil.setGray(this.moveScore);
                }
                this.moveScore.visible = true;
                this.moveScore.scaleX = 0.2;
                this.moveScore.scaleY = 0.2;
                egret.Tween.get(this.moveScore).to({"scaleX":1,"scaleY":1},500,egret.Ease.backOut).call(function(display:egret.DisplayObject,thisobj:RoleHead):void{
                    egret.Tween.get(display).to({"y":display.y - 80},1600).call(function(display:egret.DisplayObject,thisobj:RoleHead):void{
                        display.visible = false;
                        display.x = thisobj.scoreText.x + (thisobj.scoreText.width/2-display.width/2);
                        display.y = thisobj.scoreText.y;
                        var game:MajiangGame = MajiangGameData.getCurrentGame();
						var totalFan:any = game.totalFan;
						var score:number = 0;
						if(totalFan != null && totalFan[this.uid]){
							score = totalFan[this.uid];
						}
						if(MajiangConstant.getAnyCount(game.ready) > 0 && game.fanData && game.fanData[this.uid]){
							score+=game.fanData[this.uid]
						}
						thisobj.scoreText.text = score.toString();
                    },thisobj,[display,thisobj]);
                },this,[this.moveScore,this]);;
            }else{
                Log.log("飘分文本初始化失败");
            }

        }

		public updateHu():void{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			this.isHu.visible = game.alreadyHus[this.uid] != null;
		}
		public updateLack():void{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var visible = game.lackTypes[this.uid] != null;
			if(MajiangConstant.getAnyCount(game.lackTypes) == 4){
				this.lackType.visible = visible;
			}else if(this.uid == this.selfUid){
				this.lackType.visible = visible;
			}else{
				this.lackType.visible = false;
			}
			if(visible){
				switch(game.lackTypes[this.uid]){
					case 1:this.lackType.texture = MjGameAsset.mainSwf.createImage("img_MJ_TP_WZ3").texture;
					break;
					case 2:this.lackType.texture = MjGameAsset.mainSwf.createImage("img_MJ_TP_WZ2").texture;
					break;
					case 3:this.lackType.texture = MjGameAsset.mainSwf.createImage("img_MJ_TP_WZ4").texture;
					break;
				}
			}
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