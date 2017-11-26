class TestingPanel extends egret.Sprite{
	public mjListData:number[] = [];
	public mjObjArray:MaJiang[] = [];
	public ziMj:string[] = ["中","发","白","东","南","西","北"];
	public huaArr:string[] = ["万","条","筒"];
	public resultTextTips:egret.TextField;
	public wnMj:number = -1;
	public wnSetBtn:MaJiang = null;
	public setting:boolean = false;
	public refreshMjBtns(){
		
		var startX:number = 35;
		var startY:number = 45;
		var row:number = 0;
		var col:number = 0;
		for(var i=1;i<=34;i++){
			var mjStr:string = "";
			if(i<=27){
				mjStr = (row+1)+this.huaArr[col];
			}else{
				mjStr = this.ziMj[i - 28];
			}
			var mdisplay:MaJiang = this.createMj(i,mjStr,0x000000);
			mdisplay.x = startX + row*60;
			mdisplay.y = startY + col * 80;
			this.addChild(mdisplay);
			mdisplay.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onMjSelectCallBack,this);
			row++;
			if(row==9){
				row = 0;
				col++;
			}
		}
		// this.touchEnabled = true;
		//测试按钮
		var testBtn:MaJiang = this.createMj(0,"测试",0x0000ff);
		testBtn.x = startX;
		testBtn.y = startY + 5 * 80;
		this.addChild(testBtn);
		testBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onTesting,this);
		this.wnSetBtn = this.createMj(0,"无混",0xff0000);
		this.wnSetBtn.x = startX;
		this.wnSetBtn.y = startY + 6 * 80;
		this.addChild(this.wnSetBtn);
		this.wnSetBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onWnMjSetting,this);
		this.resultTextTips = new egret.TextField();
        this.resultTextTips.textColor = 0xff0000;
        this.resultTextTips.width = 90;
        this.resultTextTips.textAlign = "center";
        this.resultTextTips.text = "";
        this.resultTextTips.size = 30;
		this.resultTextTips.x = testBtn.x + 100;
		this.resultTextTips.y = testBtn.y + 20;
        this.addChild(this.resultTextTips);
	}
	public onMjSelectCallBack(e:egret.TouchEvent){
		var mjobj:MaJiang = <MaJiang>e.currentTarget;
		mjobj.showTween();
		if(this.setting){
			this.wnMj = mjobj.mjVal;
			this.setting = false;
			this.wnSetBtn.updateName(mjobj.mjName);
			return;
		}
		if(ArrayUitl.getElementCount(this.mjListData,mjobj.mjVal) >= 4){
			return;
		}
		if(this.mjListData.length>=14){
			return;
		}
		egret.log("onclick:"+mjobj.mjVal);
		this.mjListData.push(mjobj.mjVal);
		//新增选中麻将
		var startX:number = 35;
		var startY:number = 45;
		var row:number = this.mjListData.length - 1;
		var col:number = 4;
		var mdisplay:MaJiang = this.createMj(mjobj.mjVal,mjobj.mjName,0x00ff00);
		mdisplay.x = startX + row*60;
		mdisplay.y = startY + col * 80;
		this.addChild(mdisplay);
		this.mjObjArray.push(mdisplay);
		mdisplay.addEventListener(egret.TouchEvent.TOUCH_TAP,this.onMjCannelCallBack,this);
	}
	public onMjCannelCallBack(e:egret.TouchEvent){
		var mjobj:MaJiang = <MaJiang>e.currentTarget;
		var index1:number = this.mjListData.indexOf(mjobj.mjVal);
		var index2:number = this.mjObjArray.indexOf(mjobj);
		this.mjListData.splice(index1,1);
		this.mjObjArray.splice(index2,1);
		mjobj.removeEventListener(egret.TouchEvent.TOUCH_TAP,this.onMjCannelCallBack,this);
		mjobj.parent.removeChild(mjobj);
		this.refreshSelectMjPos();
	}
	public onWnMjSetting(e:egret.TouchEvent){
		this.wnMj = -1;
		this.setting = !this.setting;
		this.wnSetBtn.updateName(this.setting?"选混":"无混");
		this.wnSetBtn.showTween();
	}
	public refreshSelectMjPos(startIndex:number = 0){
		//刷新位置就好了
		for(var k =0;k< this.mjObjArray.length;k++){
			this.mjObjArray[k].x = 35 + k * 60;
			this.mjObjArray[k].y = 45 + 4 * 80;
		}
	}

	public createMj(mjVal:number,mjName:string,color:number):MaJiang{
		var mjStr:string = "";
		var mdisplay:MaJiang = new MaJiang();
		mdisplay.init(mjVal,mjName,color);
		mdisplay.width = 50;
		mdisplay.height = 70;
		return mdisplay;
	}
	
	public onTesting(e:egret.TouchEvent){
		var mjobj:MaJiang = <MaJiang>e.currentTarget;
		mjobj.showTween();
		if(this.mjListData.length < 1){
			return;
		}
		var hu:lj.cgcp.game.qdmj_705.TuiDaoHuEx = new lj.cgcp.game.qdmj_705.TuiDaoHuEx();
		// hu.wnMj = this.wnMj;
		var timestarm = new Date().getTime();
		var result:boolean = hu.hu(this.mjListData);
		timestarm = new Date().getTime() - timestarm;
		egret.log("result:"+result);
		egret.log("usetime:"+timestarm+"ms");
		this.resultTextTips.text = result?"胡牌":"不胡";
	}
}