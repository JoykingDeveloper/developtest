module lj.cgcp.game.baohuang {
	export class ResultPanel extends BasePanel{
		public mainAsset:starlingswf.SwfSprite;
		public backBtn:starlingswf.SwfButton;
		public paradeBtn:starlingswf.SwfButton;
		public lunshuText:egret.BitmapText;

		public isEnd:boolean = false;
		public oldgame:BHGame;
		public newgame:BHGame;

		public constructor(oldgame:BHGame,newgame:BHGame) {
			super();
			this.oldgame = oldgame;
			this.newgame = newgame;
		}

		public addToStage(e:egret.Event){
			this.InitUI();
		}
		public InitUI(){

			//  if(game.money[RoleData.getRole().uid] > 0){
			// 	 SoundManager.playGameSound("win.mp3",1);
			//  }else{
			// 	 SoundManager.playGameSound("lose.mp3",1);
			//  }
			
			if(this.newgame == null) return;
			this.lunshuText = BmTextUtil.replaceTextfield(this.lunshuText,RES.getRes("baohuang_1"));
			this.lunshuText.text = (this.newgame.currentCount - 1)+"/"+this.newgame.maxCount;
			this.lunshuText.letterSpacing = -20;
			if(this.oldgame == null)return;
			var queues:any = this.newgame.endQueues;
			for(var uid in this.oldgame.ready){
				if(queues[uid]!=null){
					continue;
				}else{
					queues[uid] = PokerUtil.getCount(queues)+1;
				}
			}
			var uids = [];
			var ques = [];
			for(var uid in queues){
				uids.push(uid);
				ques.push(queues[uid]);
			}
			//sort
			for(var i=0;i<5;i++){
				for(var j=i;j>0;j--){
					if(ques[j]<ques[j-1]){
						var temp = ques[j];
						ques[j] = ques[j-1];
						ques[j-1] = temp;
						var temp1 = uids[j];
						uids[j] = uids[j-1];
						uids[j-1] = temp1;
					}else{
						break;
					}
				}
			}
			queues = {};
			for(var i = 0;i<5;i++){
				queues[uids[i]] = ques[i];
			}


			var startX:number = 36;
			var startY:number = 135;
			var padingY:number = 9;
			var index:number = 0;
			for(var uid in queues){
				var roleInfo:Role = BHRoleData.getRole(uid);
				var job = 3;
				if(uid == this.oldgame.emperorUid){
					job = 1;
				}else if(uid == this.oldgame.guardUid && this.oldgame.isQiangDu != 1){
					job = 2;
				}
				var item:starlingswf.SwfSprite = this.createItem(queues[uid],job,roleInfo.name,this.newgame.money[uid] - this.oldgame.money[uid]);
				item.x = startX;
				item.y = startY+item.height*index+padingY*index;
				this.mainAsset.addChild(item);
				index++;
			}
			
			
		}

		public createItem(rank:number,job:number,name:string,score:number):starlingswf.SwfSprite{
			var item:starlingswf.SwfSprite = BHAsset.mainSwf().createSprite("spr_resultitems");
			if(rank>0 && rank < 6){
				var rankimage:egret.Bitmap = BHAsset.mainSwf().createImage("img_BH_TB"+rank);
				rankimage.x = 30;
				item.addChild(rankimage);
			}
			if(job > 0 && job < 4){
				var jobimage:egret.Bitmap = BHAsset.mainSwf().createImage("img_BH_TB1"+job);
				jobimage.x = 80;
				jobimage.y = item.height/2-jobimage.height/2;
				item.addChild(jobimage);
			}
			var nametext:egret.TextField = item.getTextField("nameText");
			nametext.text = name;
			var scoretext:egret.TextField = item.getTextField("scoreText");
			scoretext.textColor = (score>0?0xF6C86C:0xAFB6F4);
			scoretext.text = score.toString();
			var win:egret.DisplayObject = item.getChildByName("win");
			win.visible = score>0;
			var lose:egret.DisplayObject = item.getChildByName("lose");
			lose.visible = score<0;
			var ping:egret.DisplayObject = item.getChildByName("ping");
			ping.visible = score==0;
			return item;
		}
		public on_backBtn(e:egret.Event){
			if(this.isEnd){
				lzm.Alert.alertLandscape(new EndPanel());
			}else{
				this.on_closeBtn(null);
			}
		}
		public mainAssetName(): string{
			return "spr_result";
		}

		public assetSwf(): starlingswf.Swf{
			return BHAsset.mainSwf();
		}
		public setEnd():ResultPanel{
			this.isEnd = true;
			return this;
		}
		public dispose(){
			super.dispose();
		}
	}
}