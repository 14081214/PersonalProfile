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
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        _super.call(this);
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    p.createGameScene = function () {
        this.stageW = this.stage.stageWidth;
        this.stageH = this.stage.stageHeight;
        this.scrollRect = new egret.Rectangle(0, 0, this.stageW, this.stageH * 2);
        //this.cacheAsBitmap = true;   //缓存
        this.touchEnabled = true;
        this.starttouchPosY = 0;
        this.currentpagePosY = 0;
        this.movedistance = 0;
        this.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.startScroll, this);
        this.addEventListener(egret.TouchEvent.TOUCH_END, this.stopScroll, this);
        var page01 = new egret.DisplayObjectContainer; //第一页
        this.addChild(page01);
        page01.width = this.stageW;
        page01.height = this.stageH;
        page01.touchEnabled = true;
        var sky = this.createBitmapByName("bg_021_jpg");
        page01.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0xFFFFFF, 0.8);
        topMask.graphics.drawRect(0, 0, this.stageW, 900);
        topMask.graphics.endFill();
        topMask.y = 125;
        page01.addChild(topMask);
        egret.Tween.get(topMask).to({ alpha: 0 }, 1, egret.Ease.circIn).to({ alpha: 0.8 }, 3000, egret.Ease.sineIn);
        var icon = this.createBitmapByName("mark_06_png");
        page01.addChild(icon);
        icon.x = 10;
        icon.y = 43;
        //icon.touchEnabled = true;//触动图标
        //icon.addEventListener(egret.TouchEvent.TOUCH_MOVE,()=>{
        egret.Tween.get(icon, { loop: true }).to({ y: 1033 }, 8000, egret.Ease.sineIn).to({ y: 43 }, 8000, egret.Ease.sineIn);
        //},this);                 //变自动了
        var icon02 = this.createBitmapByName("mark_07_png");
        page01.addChild(icon02);
        icon02.x = 550;
        icon02.y = 1033;
        //icon02.touchEnabled = true;//触动图标
        //icon.addEventListener(egret.TouchEvent.TOUCH_MOVE,()=>{
        egret.Tween.get(icon02, { loop: true }).to({ y: 43 }, 8000, egret.Ease.sineIn).to({ y: 1033 }, 8000, egret.Ease.sineIn);
        //},this);
        var slide = this.createBitmapByName("mark_02_png");
        page01.addChild(slide);
        slide.x = 290;
        slide.y = 1040;
        slide.touchEnabled = true;
        slide.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function () {
        }, this);
        var line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 60);
        line.graphics.endFill();
        line.x = 36;
        line.y = 40;
        page01.addChild(line);
        var line2 = new egret.Shape();
        line2.graphics.lineStyle(2, 0xffffff);
        line2.graphics.moveTo(0, 0);
        line2.graphics.lineTo(0, 60);
        line2.graphics.endFill();
        line2.x = 620;
        line2.y = 40;
        page01.addChild(line2);
        var colorLabel0l = new egret.TextField();
        colorLabel0l.textColor = 0xffffff;
        colorLabel0l.width = this.stageW - 172;
        colorLabel0l.textAlign = "center";
        colorLabel0l.text = "Welcome";
        colorLabel0l.size = 60;
        colorLabel0l.x = 100;
        colorLabel0l.y = 50;
        page01.addChild(colorLabel0l);
        var colorLabel02 = new egret.TextField();
        colorLabel02.textColor = 0x000000;
        colorLabel02.alpha = 0;
        colorLabel02.width = this.stageW;
        colorLabel02.textAlign = "center";
        colorLabel02.text = "THIS IS";
        colorLabel02.size = 80;
        colorLabel02.y = 300;
        page01.addChild(colorLabel02);
        egret.Tween.get(colorLabel02).to({ alpha: 1 }, 3000, egret.Ease.sineIn);
        var colorLabel03 = new egret.TextField();
        colorLabel03.textColor = 0x000000;
        colorLabel03.alpha = 0;
        colorLabel03.width = this.stageW;
        colorLabel03.textAlign = "center";
        colorLabel03.text = "MY \n\n INTRODUCTION";
        colorLabel03.size = 80;
        colorLabel03.y = 450;
        page01.addChild(colorLabel03);
        egret.Tween.get(colorLabel03).to({ alpha: 1 }, 6000, egret.Ease.sineIn);
        var colorLabel04 = new egret.TextField();
        colorLabel04.textColor = 0x000000;
        colorLabel04.alpha = 0;
        colorLabel04.width = this.stageW;
        colorLabel04.textAlign = "center";
        colorLabel04.text = "MY \n\n INTRODUCTION";
        colorLabel04.size = 80;
        colorLabel04.y = 450;
        page01.addChild(colorLabel04);
        //egret.Tween.get(colorLabel04).to({alpha:1},8000,egret.Ease.sineIn);
        var colorLabel05 = new egret.TextField();
        colorLabel05.textColor = 0x000000;
        colorLabel05.alpha = 0;
        colorLabel05.width = this.stageW;
        colorLabel05.textAlign = "center";
        colorLabel05.text = "Please \n sliding up";
        colorLabel05.size = 50;
        colorLabel05.y = 900;
        page01.addChild(colorLabel05);
        egret.Tween.get(colorLabel05).to({ alpha: 1 }, 10000, egret.Ease.sineIn);
        colorLabel0l.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) {
            egret.Tween.get(colorLabel04).to({ x: 100 }, 3000, egret.Ease.sineIn);
        }, this);
        var textfield = new egret.TextField();
        //page01.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = this.stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 100;
        textfield.y = 135;
        this.textfield = textfield;
        var page02 = new egret.DisplayObjectContainer; //第二页
        page02.y = this.stageH;
        this.addChild(page02);
        //page02.y = stageH;
        page02.width = this.stageW;
        page02.height = this.stageH;
        page02.touchEnabled = true;
        var sky02 = this.createBitmapByName("bg_05_jpg");
        page02.addChild(sky02);
        var stageW02 = this.stage.stageWidth;
        var stageH02 = this.stage.stageHeight;
        sky02.width = stageW02;
        sky02.height = stageH02;
        var slide02 = this.createBitmapByName("mark_03_png");
        page02.addChild(slide02);
        slide02.x = 290;
        slide02.y = 0;
        var picture = this.createBitmapByName("mark_07_png");
        page02.addChild(picture);
        picture.x = 290;
        picture.y = 1035;
        var topMask02 = new egret.Shape();
        topMask02.graphics.beginFill(0x000000, 0.5);
        topMask02.graphics.drawRect(0, 0, this.stageW, 892);
        topMask02.graphics.endFill();
        topMask02.y = 130;
        page02.addChild(topMask02);
        topMask02.addEventListener(egret.TouchEvent.TOUCH_MOVE, function () {
            egret.Tween.get(topMask02).to({ alpha: 0 }, 1, egret.Ease.circIn).to({ alpha: 0.1 }, 2000, egret.Ease.circIn);
        }, this);
        var Text01 = new egret.TextField();
        Text01.textColor = 0x000000;
        Text01.width = this.stageW - 172;
        Text01.textAlign = "center";
        Text01.text = "Introduction";
        Text01.size = 60;
        Text01.x = 100;
        Text01.y = 55;
        page02.addChild(Text01);
        Text01.touchEnabled = true;
        Text01.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            Text01.textColor = 0xC0C0C0;
        }, this);
        var Text02 = new egret.TextField();
        Text02.textColor = 0xFFFFFF;
        Text02.width = this.stageW - 172;
        Text02.textAlign = "left";
        Text02.text = "Name:李雨虹\n\nID:14081214\n\nMajor:数字媒体技术\n\nUniversity:北京工业大学";
        Text02.size = 30;
        Text02.x = -200;
        Text02.y = 200;
        page02.addChild(Text02);
        //Text01.addEventListener(egret.TouchEvent.TOUCH_BEGIN,function(e:egret.TouchEvent):void{
        egret.Tween.get(Text02).to({ x: 100 }, 3000, egret.Ease.sineIn);
        //},this)
        Text02.touchEnabled = true;
        Text02.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            Text02.textColor = 0x800000;
        }, this);
        var Text03 = new egret.TextField();
        Text03.textColor = 0xFFFFFF;
        Text03.width = this.stageW - 172;
        Text03.textAlign = "center";
        Text03.text = "Byebye~";
        Text03.size = 50;
        Text03.x = 100;
        Text03.y = 920;
        page02.addChild(Text03);
        var Text04 = new egret.TextField();
        Text04.textColor = 0xFFFFFF;
        Text04.width = this.stageW - 172;
        Text04.textAlign = "left";
        Text04.text = "简述：\n\n本人性格内向，待人真诚。\n\n爱好广泛(其实都是三分钟热度。。。)，热爱学习。。。嗯！\n\n其实并没有经常玩游戏，但会努力发展这方面的兴趣.\n\n对于编程。。。我有想学好的热切愿望！\n\n真心希望能学好这门课程啦:)。";
        Text04.size = 30;
        Text04.x = -200;
        Text04.y = 450;
        page02.addChild(Text04);
        egret.Tween.get(Text04).to({ x: 100 }, 3000, egret.Ease.sineIn);
        Text04.touchEnabled = true;
        Text04.addEventListener(egret.TouchEvent.TOUCH_TAP, function (evt) {
            Text04.textColor = 0x800000;
        }, this);
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this);
    };
    p.startScroll = function (e) {
        if ((this.scrollRect.y % this.stageH) != 0) {
            this.scrollRect.y = this.currentpagePosY;
        }
        this.starttouchPosY = e.stageY;
        this.currentpagePosY = this.scrollRect.y;
        this.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.onScroll, this);
    };
    p.onScroll = function (e) {
        var rect = this.scrollRect;
        this.movedistance = this.starttouchPosY - e.stageY;
        rect.y = this.currentpagePosY + this.movedistance;
        this.scrollRect = rect;
    };
    p.stopScroll = function (e) {
        var rect = this.scrollRect;
        if ((this.movedistance >= (this.stage.stageHeight / 4)) && this.currentpagePosY != this.stageH) {
            rect.y = this.currentpagePosY + this.stageH;
            this.scrollRect = rect;
            //this.scrollRect.y = this.currentpagePosY + this.stageH;  
            this.movedistance = 0;
        }
        else if ((this.movedistance <= (-(this.stage.stageHeight / 4))) && this.currentpagePosY != 0) {
            rect.y = this.currentpagePosY - this.stageH;
            this.scrollRect = rect;
            this.movedistance = 0;
        }
        else {
            this.movedistance = 0;
            rect.y = this.currentpagePosY;
            this.scrollRect = rect;
        }
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    p.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    p.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map