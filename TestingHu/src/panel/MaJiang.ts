class MaJiang extends egret.Sprite{
	public mjVal:number = -1;
	public mjName:string = "";
	private colorLabel:egret.TextField;
	public init(mjVal:number,mjStr:string,color:number = 0x000000){
		this.mjVal = mjVal;
		this.mjName = mjStr;
		let topMask = new egret.Shape();
        topMask.graphics.beginFill(color, 0.8);
        topMask.graphics.drawRect(0, 0, 50, 70);
        topMask.graphics.endFill();
        this.addChild(topMask);
		this.colorLabel = new egret.TextField();
        this.colorLabel.textColor = 0xffffff;
		this.colorLabel.width = 90;
		this.colorLabel.textAlign = "center";
		this.colorLabel.text = mjStr;
		this.colorLabel.size = 24;
		this.colorLabel.x = (this.width - this.colorLabel.width)/2;
		this.colorLabel.y = (this.height - this.colorLabel.height)/2;
        this.addChild(this.colorLabel);
		this.touchEnabled = true;
		this.anchorOffsetX = 25;
		this.anchorOffsetY = 35;
	}
	public updateName(name:string){
		this.colorLabel.text = name;
	}
	public showTween(){
		egret.Tween.get(this).to({"scaleX":0.8,"scaleY":0.8},100,egret.Ease.backOut).call(function(obj:egret.DisplayObject){
			egret.Tween.get(obj).to({"scaleX":1,"scaleY":1},200,egret.Ease.backOut)
		},this,[this]);
	}
}