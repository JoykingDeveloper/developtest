module lj.cgcp.game.jinhua {
	export class VsPanel extends egret.DisplayObjectContainer {

		public yingX:number = 125;
		public yingy1:number = 510;
		public yingy2:number = 750;

		public constructor(role1:Role,role2:Role,winUid:string,data:any,updateOverCallBack:Function) {
			super();
			SoundManager.playGameSound( "bipaiying.mp3");
			var background:egret.Shape = new egret.Shape();
			background.graphics.beginFill(0x000000);
        	background.graphics.drawRect(0,0, JinHuaAsset.gameWidth, JinHuaAsset.gameHeight);
        	background.graphics.endFill();
			background.alpha = 0.7;
			this.addChild(background);

			var eff:starlingswf.SwfSprite = JinHuaAsset.vsEffSwf().createSprite("spr_vs");
			this.addChild(eff);

			var head:RoleHeadImage = new RoleHeadImage(role1);
			head.x = 87;
			head.y = 433;
			eff.addChild(head);
			eff.getTextField("senderName1").text = role1.name;
			
			head = new RoleHeadImage(role2);
			head.x = 87;
			head.y = 677;
			eff.addChild(head);
			eff.getTextField("targetName1").text = role2.name;
			
			eff.getChildByName("yingImg").visible = false;
			eff.addChild(eff.getChildByName("yingImg"));

			this.createCards(eff,role1.uid,role2.uid,data);

			var thisObj:VsPanel = this;
			egret.setTimeout(function(){
				thisObj.moveWinIcon(eff.getChildByName("yingImg"),role1.uid,role2.uid,winUid,function(){
					egret.setTimeout(function(){
						thisObj.parent.removeChild(thisObj);
						updateOverCallBack();
					},thisObj,1000);
				});
			},thisObj,1000);
		}

		/**
		 * 移动赢图标
		 */
		public moveWinIcon(icon:egret.DisplayObject,uid1:string,uid2:string,winUid:string,callBack:Function){
			icon.visible = true;
			var targetY:number = (winUid == uid1) ? this.yingy1 : this.yingy2;
			icon.x = this.yingX;
			icon.y = targetY + 30;
			icon.scaleX = icon.scaleY = 1.2;
			egret.Tween.get(icon).to({scaleX:1,scaleY:1}, 300, egret.Ease.sineInOut).call(callBack,this,[]);
		}

		/**
		 * 创建卡牌
		 */
		public createCards(eff:starlingswf.SwfSprite,uid1:string,uid2:string,data:any){
			var selfUid:string = RoleData.getRole().uid;
			if(selfUid == uid1 && JinHuaGameData.getCards() != null){
				this.createCards2(eff,0,JinHuaGameData.getCards());
			}else if(data.senderCards){
				this.createCards2(eff,0,data.senderCards);
			}

			if(selfUid == uid2 && JinHuaGameData.getCards() != null){
				this.createCards2(eff,1,JinHuaGameData.getCards());
			}else if(data.senderCards){
				this.createCards2(eff,1,data.targetCards);
			}
		}

		public createCards2(eff:starlingswf.SwfSprite,index:number,cards:any){
			var names1:string[] = ["senderCard1","senderCard2","senderCard3"];
			var names2:string[] = ["targetCard1","targetCard2","targetCard3"];
			var names:string[] = index == 0 ? names1 : names2;
			for(var k in cards){
				var arr:any = cards[k];
				var bit:egret.Bitmap = JinHuaAsset.paiSwf().createImage("img_pk_" + arr[0] + "_" + arr[1]);
				bit.x = eff.getChildByName(names[parseInt(k)]).x;
				bit.y = eff.getChildByName(names[parseInt(k)]).y;
				eff.addChild(bit);
			}
		}
	}
}