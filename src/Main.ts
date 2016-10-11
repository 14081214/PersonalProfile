//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     * Process interface loading
     */
    private loadingView:LoadingUI;

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    private onAddToStage(event:egret.Event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);

        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    }

    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    private onConfigComplete(event:RES.ResourceEvent):void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    }

    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    private onResourceLoadComplete(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onItemLoadError(event:RES.ResourceEvent):void {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    }

    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    private onResourceLoadError(event:RES.ResourceEvent):void {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    }

    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    private onResourceProgress(event:RES.ResourceEvent):void {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    }

    private textfield:egret.TextField;

    /**
     * 创建游戏场景
     * Create a game scene
     */
    
    private page01;
    private page02;
    private stageH:number;
    private stageW:number;
    //private scrollRect;
    private starttouchPosY;
    private currentPosY;
    private moviedistace;

    private createGameScene():void{
        this.stageH = this.stage.stageHeight;
        this.stageW = this.stage.stageWidth;
        this.scrollRect = new egret.Rectangle(0,0,this.stageW,this.stageH*2);
        var starttouchPosY = 0;
        var currentPosY = 0;
        var movedistance = 0;

        //this.cacheAsBitmap = true;   //缓存
        this.touchEnabled = true;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN,startScroll,this);
        this.addEventListener(egret.TouchEvent.TOUCH_END,stopScroll,this);

        function startScroll(e:egret.TouchEvent):void{
            if((this.scrollRect.y%this.stageH)!=0){       //防止偏移
                this.scrollRect.y = currentPosY;
            }
            starttouchPosY = e.stageY;
            currentPosY = this.scrollRect.y;
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE,onScroll,this);
        }

        function onScroll(e:egret.TouchEvent):void{
            var rect:egret.Rectangle = this.scrollRect;
            movedistance = starttouchPosY - e.stageY;
            rect.y = currentPosY + movedistance;
            this.scrollRect = rect;
            
        }

        function stopScroll(e:egret.TouchEvent):void{
            var rect:egret.Rectangle = this.scrollRect;
            if((movedistance>=(this.stage.stageHight/3))&&currentPosY!=this.stageH){
                rect.y = currentPosY + this.stageH;
                this.scrollRect = rect;
                movedistance = 0;
            }
            else if((movedistance<=(-(this.stage.stageHeight/3)))&&currentPosY!=0){
                rect.y = currentPosY - this.stageH;
                this.scrollRect = rect;
                movedistance = 0;
            }
            else{
                movedistance = 0;
                rect.y = currentPosY;
                this.scrollRect = rect;
            }
        }

        var page01 = new egret.DisplayObjectContainer;
        this.addChild(page01);
        page01.width = this.stageW;
        page01.height = this.stageH;

        var sky:egret.Bitmap = this.createBitmapByName("bg_021_jpg");
        page01.addChild(sky);
        var stageW01:number = this.stage.stageWidth;
        var stageH02:number = this.stage.stageHeight;
        sky.width = this.stageW;
        sky.height = this.stageH;

        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0xFFFFFF, 0.8);
        topMask.graphics.drawRect(0, 0, this.stageW, 892);
        topMask.graphics.endFill();
        topMask.y = 125;
        page01.addChild(topMask);

        egret.Tween.get(topMask).to({alpha:0},1,egret.Ease.circIn).to({alpha:0.5},2000,egret.Ease.circIn);

        var icon:egret.Bitmap = this.createBitmapByName("mark_01_png");
        page01.addChild(icon);
        icon.x = 36;
        icon.y = 43;

        icon.touchEnabled = true;//触动图标
        //icon.addEventListener(egret.TouchEvent.TOUCH_MOVE,()=>{
            egret.Tween.get(icon,{loop:true}).to({y:1033},6000,egret.Ease.sineIn).to({x:550},4000,egret.Ease.sineIn).to({y:43},6000,egret.Ease.sineIn).to({y:1033},6000,egret.Ease.sineIn).to({x:36},4000,egret.Ease.sineIn).to({y:43},6000,egret.Ease.sineIn);
        //},this);

        var slide:egret.Bitmap = this.createBitmapByName("mark_02_png");
        page01.addChild(slide);
        slide.x = 290;
        slide.y = 1035;
        slide.touchEnabled = true;
        slide.addEventListener(egret.TouchEvent.TOUCH_BEGIN,()=>{

        },this);

        var line = new egret.Shape();
        line.graphics.lineStyle(2,0xffffff);
        line.graphics.moveTo(0,0);
        line.graphics.lineTo(0,60);
        line.graphics.endFill();
        line.x = 36;
        line.y = 40;
        page01.addChild(line);

        var line2 = new egret.Shape();
        line2.graphics.lineStyle(2,0xffffff);
        line2.graphics.moveTo(0,0);
        line2.graphics.lineTo(0,60);
        line2.graphics.endFill();
        line2.x = 620;
        line2.y = 40;
        page01.addChild(line2);


        var colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = this.stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "Introduce";
        colorLabel.size = 60;
        colorLabel.x = 100;
        colorLabel.y = 50;
        page01.addChild(colorLabel);

        var textfield = new egret.TextField();
        page01.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = this.stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 100;
        textfield.y = 135;
        this.textfield = textfield;

        var page02 = new egret.DisplayObjectContainer;
        page02.y = this.stageH;
        this.addChild(page02);
        //page02.y = stageH;
        page02.width = this.stageW;
        page02.height = this.stageH;

        var sky02:egret.Bitmap = this.createBitmapByName("bg_03_jpeg");
        page02.addChild(sky02);
        var stageW02:number = this.stage.stageWidth;
        var stageH02:number = this.stage.stageHeight;
        sky02.width = stageW02;
        sky02.height = stageH02;

        var slide02:egret.Bitmap = this.createBitmapByName("mark_02_png");
        page02.addChild(slide02);
        slide02.x = 290;
        slide02.y = 1035;
        

        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this)
    }

    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    private createBitmapByName(name:string):egret.Bitmap {
        var result = new egret.Bitmap();
        var texture:egret.Texture = RES.getRes(name);
        result.texture = texture;
        return result;
    }

    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    private startAnimation(result:Array<any>):void {
        var self:any = this;

        var parser = new egret.HtmlTextParser();
        var textflowArr:Array<Array<egret.ITextElement>> = [];
        for (var i:number = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }

        var textfield = self.textfield;
        var count = -1;
        var change:Function = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];

            self.changeDescription(textfield, lineArr);

            var tw = egret.Tween.get(textfield);
            tw.to({"alpha": 1}, 200);
            tw.wait(2000);
            tw.to({"alpha": 0}, 200);
            tw.call(change, self);
        };

        change();
    }

    /**
     * 切换描述内容
     * Switch to described content
     */
    private changeDescription(textfield:egret.TextField, textFlow:Array<egret.ITextElement>):void {
        textfield.textFlow = textFlow;
    }

}


