module lj.cgcp.game.scmj_204 {
	export class MjListPanel extends egret.DisplayObjectContainer {
		/**
		 * 还没有出手牌的容器
		 */
		public mjListContainer:egret.DisplayObjectContainer;
		/**
		 * 吃碰杠的容器
		 */
		public gpcListContainer:egret.DisplayObjectContainer;
		/**
		 * 已经打出去的容器
		 */
		public chupaiListContainer:egret.DisplayObjectContainer;
		/**
		 * 三张牌容器
		*/
		public threeListContainer:egret.DisplayObjectContainer;
		/**
		 * 当前这个人的uid
		 */
		public uid:string;

		/**
		 * 操作按钮的数据
		 */
		public opEventList:any;
		/**
		 * 操作按钮的编号
		 */
		public opEventNo:number;

		/**
		 * 别人的操作 显示位置
		 */
		public opValMcX:number;
		public opValMcY:number;
		/**
		 * 最新的麻将
		 */
		public currentMjDisplay:egret.DisplayObject;
		/**
		 * 当前出牌的大的显示对象
		 */
		public currentBigMjDisplay:starlingswf.SwfSprite;
		public currentBigMjShowTime:number;
		/**
		 * 当前麻将的标记
		 */
		public static currentMjTag:egret.DisplayObject;
		
		

		public constructor() {
			super();
			this.mjListContainer = new egret.DisplayObjectContainer();
			this.gpcListContainer = new egret.DisplayObjectContainer();
			this.chupaiListContainer = new egret.DisplayObjectContainer();
			this.threeListContainer = new egret.DisplayObjectContainer();
			this.addChild(this.chupaiListContainer);
			this.addChild(this.mjListContainer);
			this.addChild(this.gpcListContainer);
			this.addChild(this.threeListContainer);

			this.currentBigMjDisplay = MjGameAsset.mjSwf.createSprite("spr_mj_1_copy");
			this.currentBigMjShowTime = 0;

			this.initContainerPos();

			if(MjListPanel.currentMjTag == null){
				MjListPanel.currentMjTag = MjGameAsset.mainSwf.createMovie("mc_current_mj");
			}

			this.opEventList = {};
			this.opEventNo = 1;
		}

		public initContainerPos(){
			this.mjListContainer.x = 1029.95;
			this.mjListContainer.y = 520;
			this.gpcListContainer.x = 65.65;
			this.gpcListContainer.y = 573;
			this.chupaiListContainer.x = 333;
			this.chupaiListContainer.y = 454;
			this.threeListContainer.x = 1136/2;
			this.threeListContainer.y = 450;
			this.opValMcX = 577.95;
			this.opValMcY = 442.95;

			this.currentBigMjDisplay.scaleX = this.currentBigMjDisplay.scaleY = 1.2;
			this.currentBigMjDisplay.x = 566.45;
			this.currentBigMjDisplay.y = 436.45;
			
		}

		public setUid(uid:string):void{
			this.uid = uid;
		}

		/**
		 * 刷新所有内容
		 */
		public refreshAll(showMjTween:boolean):void{
			this.clear();
			this.refreshMjList(showMjTween);
			this.refreshChupaiList();
			this.refreshGpc();
		}

		/**
		 * 清除所有显示对象
		 */
		public clear():void{
			this.disposeMjClickEvent();
			this.mjListContainer.removeChildren();
			this.gpcListContainer.removeChildren();
			this.chupaiListContainer.removeChildren();
		}
		public showThreeMj(){
			this.threeListContainer.x = 1136/2;
			this.threeListContainer.y = 450;
			this.threeListContainer.rotation = 0;
			var spr:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_three_1");
			spr.rotation = 0;
			this.threeListContainer.addChild(spr);
		}
		public moveThreeMj(type:number){
			var tips = ['顺时针','对家','逆时针'];
			ApiState.showText(tips[type - 1]);
			var point:egret.Point = new egret.Point();
			var rotate:number = 0;
			switch(type){
				case 1:point = new egret.Point(316,640/2);rotate = 90;break;
				case 2:point = new egret.Point(1136/2,190);break;
				case 3:point = new egret.Point(820,640/2);rotate = -90;break;
			}
			egret.Tween.get(this.threeListContainer).to({x:point.x,y:point.y},850);
			if(rotate){
				egret.Tween.get(this.threeListContainer).to({rotation:rotate},850);
			}
		}
		public clearThreeMj(){
			this.threeListContainer.removeChildren();
		}
		/**
         * 标记麻将
        */
        public maskMj(mjVal:number,ismask:boolean):void{
            var game:MajiangGame = MajiangGameData.getCurrentGame();
            var chupailist:number[] = game.chupaiList[this.uid];
            if(chupailist && chupailist.indexOf(mjVal) != -1){
                for(var i=0;i<chupailist.length;i++){
                    var mj:egret.DisplayObject = this.chupaiListContainer.getChildAt(i);
                    if(parseInt(mj.name) == mjVal){
                        ismask?this.setGreen(mj):this.clearGreen(mj);
                    }
                }
            }
            var pengList:number[] = game.pengList[this.uid];
            if(pengList && pengList.indexOf(mjVal) != -1){
                var mj:egret.DisplayObject = this.gpcListContainer.getChildByName(mjVal.toString());
                ismask?this.setGreen(mj):this.clearGreen(mj);
            }
            if(this.uid == RoleData.getRole().uid){
                var mjlist:number[] = MajiangGameData.getMjs();
                MajiangConstant.sortMjList(mjlist,0,game.lackTypes[this.uid]);
                if(mjlist.indexOf(mjVal) != -1){
                    for(var i=0;i<mjlist.length;i++){
                        var mj:egret.DisplayObject = this.mjListContainer.getChildAt(i);
						if(this.currentChooseMj == mj){
							continue;
						}
                        if(parseInt(mj.name) == mjVal){
                            ismask?this.setGreen(mj):this.clearGreen(mj);
                        }
                    }
                }
            }
        }
        public setGreen(display:egret.DisplayObject):void{
                var colorMatrix = [
                    0.65, 0, 0, 0, 0,
                    0, 0.9, 0, 0.3, 0,
                    0, 0, 0.55, 0, 0,
                    0, 0.3, 0, 1, 0
                ];
                var colorFlilter = new egret.ColorMatrixFilter(colorMatrix);
                display.filters = [colorFlilter];
        }
        public clearGreen(display:egret.DisplayObject):void{
            display.filters = null;
        }

		/**
		 * 刷新手牌列表
		 */
		public refreshMjList(showTween:boolean,newMjVal:number = -1,threeMj:number[] = []):void{
			var mjList:number[] = MajiangGameData.getMjs();
			this.disposeMjClickEvent();
			this.mjListContainer.removeChildren();

			this.currentChooseMjs = [];
			
			var mjDisplay:egret.DisplayObject;
			var index:number = 1;
			var w:number = 77;
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var gameNewMj:number;
            if(game.alreadyHus[this.uid]){
                gameNewMj = game.alreadyHus[this.uid];
            }else{
                gameNewMj = game.newMj;
            }

			MajiangConstant.sortMjList(mjList,0,game.lackTypes[RoleData.getRole().uid])
			var len:number = mjList.length;

			for(var i:number = len - 1; i >= 0 ; i--){
				if(newMjVal == mjList[i]) {
					newMjVal = -1;
					continue;
				}
				mjDisplay = this.createMj(mjList[i]);
				if(threeMj.length>0){
					var index1 = threeMj.indexOf(mjList[i]);
					if(index1 != -1){
						//将刚换来的三张弹出显示1000毫秒
						mjDisplay.y -= 24;
						this.currentChooseMjs.push(mjDisplay);
						threeMj.splice(index1,1);
					}
				} 
				mjDisplay.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickMj,this);
				// mjDisplay.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onClickMj_Begin,this)
                // mjDisplay.addEventListener(egret.TouchEvent.TOUCH_END,this.onClickMj_End,this)
				mjDisplay.name = mjList[i].toString();
				mjDisplay.touchEnabled = true;
				if(mjList[i] != gameNewMj){
					if(index == 14){
						mjDisplay.x = 24;
					}else{
						mjDisplay.x = -(w * index);
					}
					index++;
				}else{
					gameNewMj = -1;
					mjDisplay.x = 24;
				}
				this.mjListContainer.addChild(mjDisplay);
				// if(baiDaCount > 0 && mjList[i] != game.da2){
				// 	mjDisplay.touchEnabled = false;
				// 	mjDisplay.alpha = 0.5;
				// }
			}
			if(this.currentChooseMjs.length>0){
				egret.setTimeout(function():void{
					for(var k in this.currentChooseMjs){
						egret.Tween.get(this.currentChooseMjs[k]).to({y:this.currentChooseMjs[k].y+24},200);
					}
					this.currentChooseMjs = [];
				},this,1800);
			}
			if(showTween) {
				this.showMoveMjs(0);
				SoundManager.playGameSound("fapai.mp3");
			}
		}

		public showMoveMjs(startType:number):void{
			var len:number = this.mjListContainer.$children.length;
			var start:number = len == 14 ? len - 2 : len - 1;
			var end:number = 0;
			var index = 0;
			var mj:egret.DisplayObject;
			var startPoint:egret.Point = this.parent.localToGlobal(1136/2,640/2);
			startPoint = this.mjListContainer.globalToLocal(startPoint.x,startPoint.y);
			if(startType == 0){
				for(var i:number = start; i >= end ;i--){
					mj = this.mjListContainer.getChildAt(i);
					this.moveToTargetPos(mj,startPoint,50 * index);
					index++;
				}
			}else{
				for(var i:number = end; i <= start ;i++){
					mj = this.mjListContainer.getChildAt(i);
					this.moveToTargetPos(mj,startPoint,50 * index);
					index++;
				}
			}
			if(len == 14){
				mj = this.mjListContainer.getChildAt(len - 1);
				this.moveToTargetPos2(mj,startPoint,50 * index);
			}
		}

		public moveToTargetPos(mj:egret.DisplayObject,startPoint:egret.Point,delayTime:number):void{
			var targetXY:number[] = [mj.x,mj.y];
			var targetScaleXY:number[] = [mj.scaleX,mj.scaleY];
			mj.x = startPoint.x;
			mj.y = startPoint.y;
			mj.scaleX = mj.scaleY = 0;
			egret.setTimeout(function():void{
				egret.Tween.get(mj).to({x:targetXY[0],y:targetXY[1],scaleX:targetScaleXY[0],scaleY:targetScaleXY[1]},400);
			},this,delayTime);
		}
		public moveToTargetPos2(mj:egret.DisplayObject,startPoint:egret.Point,delayTime:number):void{
			if(startPoint == null){
				startPoint = this.parent.localToGlobal(759,320);
				startPoint = this.mjListContainer.globalToLocal(startPoint.x,startPoint.y);
			}
			var targetXY:number[] = [mj.x,mj.y];
			var targetScaleXY:number[] = [mj.scaleX,mj.scaleY];
			mj.x = startPoint.x;
			mj.y = startPoint.y;
			mj.scaleX = mj.scaleY = 1.5;
			mj.visible = false;
			egret.setTimeout(function():void{
				mj.visible = true;
				egret.Tween.get(mj).to({x:targetXY[0],y:targetXY[1],scaleX:targetScaleXY[0],scaleY:targetScaleXY[1]},400,egret.Ease.backInOut);
			},this,delayTime);
		}

		/**
		 * 添加新麻将
		 */
		public addNewMj(mjVal:number):void{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			// var baiDaCount:number = game.das1[this.uid];//首搭数量
			var mjDisplay:egret.DisplayObject = this.createMj(mjVal);
			mjDisplay.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickMj,this);
			// mjDisplay.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onClickMj_Begin,this)
			// mjDisplay.addEventListener(egret.TouchEvent.TOUCH_END,this.onClickMj_End,this)
			mjDisplay.name = mjVal.toString();
			mjDisplay.touchEnabled = true;
			mjDisplay.x = 23;
			// if(baiDaCount > 0 && mjVal != game.da2){
			// 	mjDisplay.touchEnabled = false;
			// 	mjDisplay.alpha = 0.5;
			// }
			this.mjListContainer.addChild(mjDisplay);
			this.moveToTargetPos2(mjDisplay,null,0);
		}

		/**
		 * 创建手牌麻将
		 */
		public createMj(val:number):egret.DisplayObject{
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mj_1");
			var bit:egret.Bitmap = container.getChildAt(1) as egret.Bitmap;
			bit.texture = RES.getRes("img_MJ_PX_" + val);
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var lacktype = -1;
			if(game.lackTypes[RoleData.getRole().uid] != null) {
				lacktype = game.lackTypes[RoleData.getRole().uid];
			}
			if(lacktype != -1){
				var mj= [[1,9],[10,18],[19,27]];
				if(val>=mj[lacktype-1][0] && val <= mj[lacktype - 1][1]){
					container.alpha = 0.58;
					// var len:number = container.numChildren;
					// for(var i=0;i<len;i++){
					// 	ColorUtil.setGray(container.getChildAt(i));
					// }
				}
			}
			return container;
		}

		/**
		 * 刷新出过的牌的列表
		 */
		public refreshChupaiList():void{
			var chuList:number[] = MajiangGameData.getCurrentGame().chupaiList[this.uid];
			if(chuList == null) return;

			this.chupaiListContainer.removeChildren();

			var len:number = chuList.length;
			var startX:number = 0;
			var startY:number = 0;
			var w:number = 38;
			var h:number = 44;
			var row:number;
			var mj:egret.DisplayObject;
			var index:number = 0;
			for(var i:number = 0; i < len ; i++){
				startX = index * w;
				mj = this.createChupaiMj(chuList[i]);
				mj.name = chuList[i].toString();
				mj.x = startX;
				mj.y = startY;
				index++;
				if(index == 10){
					startX = 0;
					startY -= h;
					index = 0;
				}
				this.currentMjDisplay = mj;
				this.chupaiListContainer.addChildAt(mj,0);
			}
		}

		/**
		 * 添加一张牌到出牌列表
		 */
		public addChupaiList(mjVal:number){
			var chuList:number[] = MajiangGameData.getCurrentGame().chupaiList[this.uid];
			var len:number = chuList.length -1;
			var mj:egret.DisplayObject = this.createChupaiMj(mjVal);
			mj.name = mjVal.toString();
			mj.x = (len % 10) * 38;
			mj.y -= parseInt((len / 10) + "") * 44;
			this.currentMjDisplay = mj;
			this.chupaiListContainer.addChildAt(mj,0);
			this.showCurrentMjTag();
		}

		public showCurrentMjTag(){
			if(this.currentMjDisplay == null) return;

			MjListPanel.currentMjTag.x = this.chupaiListContainer.x + this.currentMjDisplay.x + (this.currentMjDisplay.width / 2);
			MjListPanel.currentMjTag.y = this.chupaiListContainer.y + this.currentMjDisplay.y;
			this.addChild(MjListPanel.currentMjTag);
		}

		/**
		 * 出牌之后显示一下大牌
		 */
		public showBigMj(mjVal:number):void{
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			// this.currentBigMjDisplay.getChildByName("daTag").visible = mjVal == game.da2;
			
			var bit:egret.Bitmap = this.currentBigMjDisplay.getChildAt(1) as egret.Bitmap;
			bit.texture = RES.getRes("img_MJ_PX_" + mjVal);

			this.currentBigMjShowTime += 3;
			this.currentBigMjDisplay.scaleX = this.currentBigMjDisplay.scaleY = 1.5;
			this.currentBigMjDisplay.alpha = 0.5;
			this.addChild(this.currentBigMjDisplay);
			egret.Tween.get(this.currentBigMjDisplay).to({scaleX:1.2,scaleY:1.2,alpha:1}, 290, egret.Ease.backInOut);

			var thisObj:MjListPanel = this;
			egret.setTimeout(function():void{
				thisObj.currentBigMjShowTime -= 3;
				if(thisObj.currentBigMjShowTime <= 0 && thisObj.currentBigMjDisplay.parent){
					thisObj.currentBigMjDisplay.parent.removeChild(thisObj.currentBigMjDisplay);
				}
			},thisObj,2000);
		}

		public hideCurrentMjTag():void{
			if(MjListPanel.currentMjTag.parent){
				MjListPanel.currentMjTag.parent.removeChild(MjListPanel.currentMjTag);
			}
		}

		/**
		 * 创建出过的麻将
		 */
		public createChupaiMj(val:number):egret.DisplayObject{
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mj_3");
			var bit:egret.Bitmap = container.getChildAt(1) as egret.Bitmap;
			var textrue:egret.Texture = RES.getRes("img_MJ_PX_" + val);
			bit.texture = textrue;
			// container.getChildByName("daTag").visible = val == game.da2;
			return container;
		}

		/**
		 * 刷新杠碰吃的牌
		 */
		public refreshGpc():void{
			this.gpcListContainer.removeChildren();
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			
			// var chiList:number[][] = game.chiList[this.uid];
			var len:number;
			var startX:number = 0;
			var startY:number = 0;
			var w:number = 124;
			var h:number = 0;
			var mjDisplay:egret.DisplayObject;
			// if(chiList != null){
			// 	len = chiList.length;
			// 	for(var i:number = 0; i < len ;i++){
			// 		mjDisplay = this.createChiMj(chiList[i]);
			// 		mjDisplay.x = startX;
			// 		startX += w;
			// 		this.gpcListContainer.addChild(mjDisplay);
			// 	}
			// }
			var pengList:number[] = game.pengList[this.uid];
			if(pengList != null){
				len = pengList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createPengMj(pengList[i]);
                    mjDisplay.name = pengList[i].toString();
					mjDisplay.x = startX;
					startX += w;
					this.gpcListContainer.addChild(mjDisplay);
				}
			}
			var gangList:number[] = game.gangList[this.uid];
			if(gangList != null){
				len = gangList.length;
				for(var i:number = 0; i < len ;i++){
					mjDisplay = this.createGangMj(gangList[i]);
					mjDisplay.x = startX;
					startX += w;
					this.gpcListContainer.addChild(mjDisplay);
				}
			}
			var angangList:number[] = game.angangList[this.uid];
			if(angangList != null){
				len = angangList.length;
				for(var i:number = 0; i < len ;i++){
					// mjDisplay = this.createAnGangMj(angangList[i]);
					mjDisplay = this.createAnGangMj(angangList[i]);
					mjDisplay.x = startX;
					startX += w;
					this.gpcListContainer.addChild(mjDisplay);
				}
			}
		}

		/**
		 * 创建吃牌麻将
		 */
		public createChiMj(mjs:number[]){
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_peng_1");
			var len:number = mjs.length;
			for(var i:number = 0; i < len ;i++){
				container.getImage("_" + (i+1)).texture = RES.getRes("img_MJ_PX_" + mjs[i]);
			}
			return container;
		}

		/**
		 * 创建碰牌麻将
		 */
		public createPengMj(mjVal:number){
			// var vi:boolean = mjVal == MajiangGameData.getCurrentGame().da2;
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_peng_1");
			for(var i:number = 0; i < 3 ;i++){
				container.getImage("_" + (i+1)).texture = RES.getRes("img_MJ_PX_" + mjVal);
				// container.getChildByName("daTag" + (i + 1)).visible = vi;
			}
			return container;
		}

		/**
		 * 创建杠牌麻将
		 */
		public createGangMj(mjVal:number){
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_mgang_1");
			var texture:egret.Texture = RES.getRes("img_MJ_PX_" + mjVal);
			container.getImage("_1").texture = texture;
			container.getImage("_2").texture = texture;
			container.getImage("_3").texture = texture;
			// container.getChildByName("daTag").visible = mjVal == MajiangGameData.getCurrentGame().da2;
			return container;
		}
		/**
		 * 创建暗杠牌麻将
		 */
		public createAnGangMj(mjVal:number){
			var container:starlingswf.SwfSprite = MjGameAsset.mjSwf.createSprite("spr_gang_1");
			container.getImage("_1").texture = RES.getRes("img_MJ_PX_" + mjVal);
			// container.getChildByName("daTag").visible = mjVal == MajiangGameData.getCurrentGame().da2;
			return container;
		}
		/**
		 * 创建暗杠麻将
		 */
		// public createAnGangMj(mjVal:number){
		// 	return this.createGangMj(mjVal);
		// }

		/**
		 * 显示别人的操作
		 */
		public showOptVal(opVal:number):void{
			var mc:starlingswf.SwfMovieClip;
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			if(opVal == 5){
				if(game.lOpUid == this.uid && game.lOpVal == 3){
				mc = MjGameAsset.effSwf.createMovie("mc_gangshanghua_eff");
				}else if(MajiangGameData.getMjCount() < 1){
					mc = MjGameAsset.effSwf.createMovie("mc_haidilao_eff");
				}else{
					mc = MjGameAsset.effSwf.createMovie("mc_eff_" + opVal);
				}
			}else{
                if(game.pao == this.uid && game.lOpVal == 3 && opVal == 100 && !game.isQiangGangHu){
					//杠上炮
                    mc = MjGameAsset.effSwf.createMovie("mc_gangshangpao_eff");
				}else{                   
					if(game.isDuoPao > 1 && game.pao == this.uid){
                        mc = MjGameAsset.effSwf.createMovie("mc_yipaoduoxiang_eff");
					}else{
						if(opVal == 4 && MajiangGameData.getMjCount() < 1){
                            mc = MjGameAsset.effSwf.createMovie("mc_haidilao_eff");
                        }else{
                            mc = MjGameAsset.effSwf.createMovie("mc_eff_" + opVal);
                        }

					}
				}
			}
			mc.x = this.opValMcX;
			mc.y = this.opValMcY;
			mc.loop = false;
			this.addChild(mc);
			var thisObj:MjListPanel = this;
			egret.setTimeout(function():void{
				thisObj.removeChild(mc);
			},this,2000);
		}

		/**
		 * 显示别人出来之后 自己的选项
		 */
		public showOption(mjVal:number,zimo:boolean = false){
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			
			var mjList:number[] = MajiangGameData.getMjs();
			//血战胡牌后不予操作	
			if(game.alreadyHus[this.uid] != null){
				return;
			}
			var hu:boolean = false;
			hu = MajiangConstant.findHu(mjVal,mjList);
			if(game.isQiangGangHu){
				if(hu){
					this.showQiangGangHu();
				}else{
					MjGameApi.qiangganghu(0);
				}
				return;
			}
			if(game.currentUid == this.uid){
				MjGameApi.operating(0);
				return;
			}
			

			// var chiList:number[][] = [];//MajiangConstant.findChi(mjVal,mjList);
			var pengIndex:number = MajiangConstant.findPeng(mjVal,mjList);
			var gangIndex:number = MajiangConstant.findGang(mjVal,mjList);
			// var len:number = chiList.length;
			if(!hu && pengIndex == -1 && gangIndex == -1){
				MjGameApi.operating(0);
				return;
			}
			
			if(MajiangGameData.getMjCount()<4){
                //自动胡
                if(hu){
                    this.showHu();
                }else{
					this.showGuo();
                    //最后四张没有胡才选择是否碰杠
                    if(pengIndex != -1){
                        this.showPeng(pengIndex);
                    }
                    if(gangIndex != -1){
                        this.showGang(gangIndex);
                    }
                }
            }else{
                this.showGuo();
                if(hu){
                    this.showHu();
                }
                if(pengIndex != -1){
                    this.showPeng(pengIndex);
                }
                if(gangIndex != -1){
                    this.showGang(gangIndex);
                }
            }

		}

		/**
		 * 显示过牌按钮
		 */
		public showGuo():void{
			var btn:starlingswf.SwfButton = this.createOpBtn(0,0);
			this.opEventList[this.opEventNo] = [btn,0];
			this.opEventNo++;
		}
		/**
		 * 显示吃牌按钮
		 */
		public showChi(chiList:number[][]):void{
			var btn:starlingswf.SwfButton = this.createOpBtn(1,0);
			this.opEventList[this.opEventNo] = [btn,1,chiList];
			this.opEventNo++;
		}
		/**
		 * 显示碰牌按钮
		 */
		public showPeng(index:number):void{
			var btn:starlingswf.SwfButton = this.createOpBtn(2,index);
			this.opEventList[this.opEventNo] = [btn,2];
			this.opEventNo++;
		}
		/**
		 * 显示杠牌按钮
		 */
		public showGang(index:number):void{
			var btn:starlingswf.SwfButton = this.createOpBtn(3,index);
			this.opEventList[this.opEventNo] = [btn,3];
			this.opEventNo++;
		}

		/**
		 * 显示胡牌按钮
		 */
		public showHu():void{
			var btn:starlingswf.SwfButton = this.createOpBtn(4,0);
			this.opEventList[this.opEventNo] = [btn,4];
			this.opEventNo++;
		}

		/**
		 * 显示胡牌按钮
		 */
		public showZiMo():void{
			var btn:starlingswf.SwfButton = this.createOpBtn(5,0);
			this.opEventList[this.opEventNo] = [btn,5];
			this.opEventNo++;
		}
		/**
		 * 显示抢杠胡操作按钮
		 * 
		*/
		public showQiangGangHu():void{
				var guo:starlingswf.SwfButton = MjGameAsset.mainSwf.createButton("btn_guo");
				guo.name = "0";
				guo.x = -85.1;
				guo.y = -112.55;
				this.mjListContainer.addChild(guo);
				guo.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onQiangGangHuClick,this);
				var hu:starlingswf.SwfButton = MjGameAsset.mainSwf.createButton("btn_hu");
				hu.name = "1";
				hu.x = -265.1;
				hu.y = -111.55;
				this.mjListContainer.addChild(hu);
				hu.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onQiangGangHuClick,this);
		}
		public onQiangGangHuClick(e:egret.Event){
			var type:number = parseInt(e.currentTarget.name);
			if(type == 1 || type == 0){
				MjGameApi.qiangganghu(type);
			}
			this.disposeQiangGangHuBtns();
		}
		public disposeQiangGangHuBtns(){
			var obj:egret.DisplayObject = this.mjListContainer.getChildByName("0");
			if(obj){
				obj.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onQiangGangHuClick,this)
				obj.parent.removeChild(obj);
			}
			obj = this.mjListContainer.getChildByName("1");
			if(obj){
				obj.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onQiangGangHuClick,this)
				obj.parent.removeChild(obj);
			}
		}
		/**
		 * 显示杠自己牌的
		 */
		public showGangSelf():boolean{
			//最后一张牌不能杠
            if(MajiangGameData.getMjCount() == 0){
                return false;
            }

			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var pengList:number[] = game.pengList[this.uid];
            // var diangangpengList:number[] = game.diangangpengList[this.uid];
			var data:number[] = [];
			var lack:number = game.lackTypes[this.uid];
			var mjList:number[] = MajiangGameData.getMjs();
			var countVals:any = MajiangConstant.array_values_count(mjList);
			var len:number = mjList.length;
			var mjVal:number;
			for(var i:number = 0; i < len ; i++){
				mjVal = mjList[i];
				if(data.indexOf(mjVal) != -1) continue;
				//判断缺一门
				if(MajiangConstant.isLackMj(mjVal,lack))continue;
				if(countVals[mjVal] == 4 ){
					data.push(mjVal);
				}
                //碰牌自己扛,必须是新牌(点杠碰情况处理待定)可以杠，但是服务端不计分(diangangpengList == null || diangangpengList.indexOf(mjVal) == -1 ) &&
                else if(  pengList != null && pengList.indexOf(mjVal) != -1){
					data.push(mjVal);
				}
			}

			if(data.length > 0){
				this.opEventList[this.opEventNo] = [this.createOpBtn(-3,0),-3,data];
				this.opEventNo++;
				return true;
			}
			return false;
		}

		/**
		 * 显示听牌按钮
		 */
		public showTing():void{
			var mjList:number[] = MajiangGameData.getMjs();
			// var tings:any[] = MajiangConstant.findTing(mjList);
			// if(tings.length > 0){
			// 	this.opEventList[this.opEventNo] = [this.createOpBtn(6,0),6,tings];
			// 	this.opEventNo++;
			// }
		}

		/**
		 * 创建选项按钮
		 */
		public createOpBtn(opVal:number,index:number):starlingswf.SwfButton{
			var len:number = MajiangGameData.getMjs().length - 1;
			index = len - index;

			var btn:starlingswf.SwfButton;
			if(opVal == 0){
				btn = MjGameAsset.mainSwf.createButton("btn_guo");
				btn.x = -85.1;
				btn.y = -112.55;
			}else if(opVal == 1){
				btn = MjGameAsset.mainSwf.createButton("btn_chi");
				btn.x = -582.05;
				btn.y = -111.55;
			}else if(opVal == 2){
				btn = MjGameAsset.mainSwf.createButton("btn_peng");
				btn.x = -426.1;
				btn.y = -111.55;
				this.mjListContainer.getChildAt(index - 1).y = -24;
				this.mjListContainer.getChildAt(index).y = -24;
				var game:MajiangGame = MajiangGameData.getCurrentGame();
				var passPengList:number[] = game.passPengList[this.uid];
				if(passPengList != null && passPengList.indexOf(game.lastMj) != -1){
                    ColorUtil.setGray(btn);
                }else{
					ColorUtil.clearColor(btn);
				}
			}else if(opVal == 3 || opVal == -3){
				btn = MjGameAsset.mainSwf.createButton("btn_gang");
				btn.x = -745.05;
				btn.y = -111.55;
				if(opVal == 3){
					// if(MajiangGameData.getCurrentGame().da1 != MajiangGameData.getCurrentGame().lastMj){
					// 	this.mjListContainer.getChildAt(index - 1).y = -24;
					// }
					// this.mjListContainer.getChildAt(index).y = -24;
					// this.mjListContainer.getChildAt(index + 1).y = -24;
					
				}
			}else if(opVal == 4){
				btn = MjGameAsset.mainSwf.createButton("btn_hu");
				btn.x = -265.1;
				btn.y = -111.55;
				//放弃胡牌后，摸牌或者多番，可以胡牌
				var game:MajiangGame = MajiangGameData.getCurrentGame();
				var mjList:number[] = MajiangGameData.getMjs();
				var fan:number = MajiangConstant.getBaseFan(game.lastMj,mjList);
                if(game.passHuList[this.uid] != null && fan <= game.passHuList[this.uid]){
                    ColorUtil.setGray(btn);
                }else{
                    ColorUtil.clearColor(btn);
                }
			}else if(opVal == 5){
				btn = MjGameAsset.mainSwf.createButton("btn_zimo"); 
				btn.x = -307.1;
				btn.y = -114.55;
			}else if(opVal == 6){
				btn = MjGameAsset.mainSwf.createButton("btn_ting");
				btn.x = -901.8;
				btn.y = -114.55;
			}
			btn.name = this.opEventNo.toString();
			btn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickOpBtn,this);
			this.mjListContainer.addChild(btn);

			return btn;
		}








		//-----------------以下为出牌的逻辑---------------------//

		public currentChooseMj:egret.DisplayObject;
		public currentChooseMjs:egret.DisplayObject[];
		public onClickMj_Begin(e:egret.Event):void{
            var mj:egret.DisplayObject = e.currentTarget;
            var game:MajiangGame = MajiangGameData.getCurrentGame();
            if(game.lackTypes == null || MajiangConstant.getAnyCount(game.lackTypes) < 4){
                return;
            }
            if(MajiangConstant.isLackMj(parseInt(mj.name),game.lackTypes[RoleData.getRole().uid])){
                return;
            }
            var data:any = {"name":mj.name,"ismask":true};
            this.dispatchEventWith("ON_MJCLICK_MASK",true,data);
        }
        public onClickMj_End(e:egret.Event):void{
            var mj:egret.DisplayObject = e.currentTarget;
            var game:MajiangGame = MajiangGameData.getCurrentGame();
            if(game.lackTypes == null || MajiangConstant.getAnyCount(game.lackTypes) < 4){
                return;
            }
            if(MajiangConstant.isLackMj(parseInt(mj.name),game.lackTypes[RoleData.getRole().uid])){
                return;
            }
            var data:any = {"name":mj.name,"ismask":false};
            this.dispatchEventWith("ON_MJCLICK_MASK",true,data);
        }

		/**
		 * 点击麻将
		 */
		public onClickMj(e:egret.Event):void{
			var mj:egret.DisplayObject = e.currentTarget;
			var game:MajiangGame = MajiangGameData.getCurrentGame();
			var mjList:number[] = MajiangGameData.getMjs();
			if(game.ischange){

				if(this.currentChooseMj == mj){
					if(!MajiangConstant.isLackMj(parseInt(mj.name),game.lackTypes[RoleData.getRole().uid])){
                        var data:any = {"name":mj.name,"ismask":false};
                        this.dispatchEventWith("ON_MJCLICK_MASK",true,data);
                    }
					if(!MajiangConstant.isLackMj(parseInt(mj.name),game.lackTypes[RoleData.getRole().uid]) 
					&& MajiangConstant.hasLackMj(mjList,game.lackTypes[RoleData.getRole().uid])){
						//先打缺牌
						this.currentChooseMj = null;
						mj.y += 24;
						return;
					}
					if(!game.chupai || game.currentUid != RoleData.getRole().uid){
						this.currentChooseMj = null;
						mj.y += 24;
						return;
					}
					if(MajiangGameData.getMjCount()<4){
						var canHu:boolean = MajiangConstant.findHu(-1,mjList);
						if(canHu){
							return;
						}
					}
					MjGameApi.chupai(mj.name);
				}else{
					mj.y = -24;
					if(this.currentChooseMj != null){
						this.currentChooseMj.y = 0;
						if(!MajiangConstant.isLackMj(parseInt(this.currentChooseMj.name),game.lackTypes[RoleData.getRole().uid])){
							var data:any = {"name":this.currentChooseMj.name,"ismask":false};
							this.dispatchEventWith("ON_MJCLICK_MASK",true,data);
						}
					}
					this.currentChooseMj = mj;
					if(!MajiangConstant.isLackMj(parseInt(mj.name),game.lackTypes[RoleData.getRole().uid])){
						var data:any = {"name":mj.name,"ismask":true};
						this.dispatchEventWith("ON_MJCLICK_MASK",true,data);
					}
				}
			}else{//选三牌

				var selectMj:number[] = MajiangGameData.getSelectMj();
				if(this.currentChooseMjs==null){
					this.currentChooseMjs = [];
				}
				var index:number = this.currentChooseMjs.indexOf(mj);
				if(index == -1){
					this.currentChooseMjs.push(mj);
					mj.y -= 24;
					MajiangGameData.addSelectMj(mj.name);
					//判断超出三个
					if(this.currentChooseMjs.length>3){
						var oldmj:egret.DisplayObject[] = this.currentChooseMjs.splice(0,1);
						if(oldmj != null && oldmj.length > 0){
							oldmj[0].y += 24;
						}
					}
				}else{
					this.currentChooseMjs.splice(index,1);
					mj.y += 24;
					MajiangGameData.removeSelectMj(index);
				}
			}

			if(starlingswf.SwfButton.defSound != null){
				starlingswf.SwfButton.defSound.play(0,1);
			}
		}

		/**
		 * 点击操作按钮
		 */
		public onClickOpBtn(e:egret.Event):void{
			var opNo:number = parseInt(e.currentTarget.name);
			var opData:any[] = this.opEventList[opNo];
			var opVal:number = opData[1];
			if(opVal == 1){
				var chiList:number[][] = opData[2];
				if(chiList.length > 1){
					lzm.Alert.alertLandscape(new ChiTips(this,chiList));
					return;
				}else{
					var mjList:number[] = MajiangGameData.getMjs();
					var chiIndex:number[] = opData[2][0];
					MjGameApi.operating(opVal,[mjList[chiIndex[0]],mjList[chiIndex[1]]]);
				}
			}else if(opVal == 5){
				MjGameApi.zimo();
			}else if(opVal == -3){
				var data:number[] = opData[2];
				if(data.length > 1){
					lzm.Alert.alertLandscape(new GangTips(this,opData[2]));
					return;
				}else{
					MjGameApi.callGangApi(data[0]);
				}
			}else if(opVal == 6){
				var tings:any[] = opData[2];
				if(tings.length > 1){
					lzm.Alert.alertLandscape(new TingTips(this,tings));
					return;
				}else{
					var tingObj:any[] = tings[0];
					tingObj[0] = MajiangConstant.findTingShowVals(MajiangGameData.getMjs(),tingObj);
					MjGameApi.chupai(tingObj[2],tingObj);
				}
			}else if(opVal == 0){
                MjGameApi.operating(0);
            }else if(opVal == 4){
                var game:MajiangGame = MajiangGameData.getCurrentGame();
				var mjList:number[] = MajiangGameData.getMjs();
				var fan:number = MajiangConstant.getBaseFan(game.lastMj,mjList);
                if(game.passHuList[this.uid] != null && fan <= game.passHuList[this.uid]){
                    return;
                }else{
                    MjGameApi.operating(4);
                }

			}else if(opVal == 2){
				var game:MajiangGame = MajiangGameData.getCurrentGame();
				var passPengList:number[] = game.passPengList[this.uid];
				if(passPengList != null && passPengList.indexOf(game.lastMj) != -1){
					return;
				}else{
					MjGameApi.operating(2);
				}
			}else{
				MjGameApi.operating(opVal);
			}
			this.disposeOperatingBtn();
		}

		/**
		 * 释放操作按钮
		 */
		public disposeOperatingBtn():void{
			var opData:any[];
			var btn:starlingswf.SwfButton;
			for(var k in this.opEventList){
				opData = this.opEventList[k];
				btn = opData[0];
				btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickOpBtn,this);
				if(btn.parent != null){
					btn.parent.removeChild(btn);
				}
			}
			this.opEventList = {};
			this.opEventNo = 1;
			
			var len:number = this.mjListContainer.$children.length;
			for(var i:number = 0; i < len ;i++){
				this.mjListContainer.getChildAt(i).y = 0;
			}
		}

		/**
		 * 释放麻将的点击事件
		 */
		public disposeMjClickEvent():void{
			this.currentChooseMj = null;
			var len:number = this.mjListContainer.$children.length;
			for(var i:number = 0; i < len ; i++){
				this.mjListContainer.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickMj,this);
            //     this.mjListContainer.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.onClickMj_Begin,this);
            //     this.mjListContainer.removeEventListener(egret.TouchEvent.TOUCH_END,this.onClickMj_End,this);
			}
		}

		public dispose():void{
			this.disposeMjClickEvent();
			if(this.opEventList != null){
				var btn:starlingswf.SwfButton;
				var opData:any[]
				for(var k in this.opEventList){
					opData = this.opEventList[k];
					btn = opData[0];
					btn.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onClickOpBtn,this);
				}
			}
			MjListPanel.currentMjTag = null;
		}



	}
}