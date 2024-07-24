function CAreYouSurePanel(oConfirmFunction, oNegateFunction) {

    var _oTitleStroke;
    var _oTitle;
    var _oButYes;
    var _oButNo;
    var _oFade;
    var _oPanelContainer;
    var _oParent;
    
    var _pStartPanelPos;

    this._init = function (oConfirmFunction, oNegateFunction) {
        
        _oPanelContainer = new createjs.Container();        
        s_oStage.addChild(_oPanelContainer);
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        var oPanel = createBitmap(oSprite);        
        oPanel.regX = oSprite.width/2;
        oPanel.regY = oSprite.height/2;
        _oPanelContainer.on("mousedown",function(){});
        _oPanelContainer.addChild(oPanel);
        
        _oPanelContainer.x = CANVAS_WIDTH/2;
        _oPanelContainer.y = CANVAS_HEIGHT/2;  

        
        _oTitleStroke = new createjs.Text(TEXT_SURE," 60px "+PRIMARY_FONT, "#000000");
        _oTitleStroke.y = -200;
        _oTitleStroke.textAlign = "center";
        _oTitleStroke.textBaseline = "middle";
        _oTitleStroke.lineWidth = 600;
        _oTitleStroke.outline = 5;
        _oPanelContainer.addChild(_oTitleStroke);

        _oTitle = new createjs.Text(TEXT_SURE," 60px "+PRIMARY_FONT, "#ffffff");
        _oTitle.y = _oTitleStroke.y;
        _oTitle.textAlign = "center";
        _oTitle.textBaseline = "middle";
        _oTitle.lineWidth = 600;
        _oPanelContainer.addChild(_oTitle);

        _oButYes = new CGfxButton(150, 80, s_oSpriteLibrary.getSprite('but_check'), _oPanelContainer);
        _oButYes.addEventListener(ON_MOUSE_UP, this._onButYes, this);

        _oButNo = new CGfxButton(-150, 80, s_oSpriteLibrary.getSprite('but_exit_big'), _oPanelContainer);
        _oButNo.addEventListener(ON_MOUSE_UP, this._onButNo, this);
        _oButNo.pulseAnimation();
    };

    this._onButYes = function () {

        _oParent.unload();
        if(oConfirmFunction){
            oConfirmFunction();
        }

    };

    this._onButNo = function () {
        
        _oParent.unload();
        if(oNegateFunction){
            oNegateFunction();
        }
        
    };

    this.changeMessage = function(szText, iFontSize, iY){
        _oTitleStroke.text = szText;
        _oTitle.text = szText;
        
        _oTitleStroke.y = iY;
        _oTitle.y = iY;
        
        if(iFontSize){
            _oTitleStroke.font = " "+iFontSize +"px "+PRIMARY_FONT;
            _oTitle.font = " "+iFontSize +"px "+PRIMARY_FONT;
        }
    };

    this.setOneButton = function(){
        _oButNo.setVisible(false);
        _oButYes.setPosition(0, 250);
    };

    this.unload = function () {
        _oButNo.unload();
        _oButYes.unload();

        s_oStage.removeChild(_oPanelContainer);

        _oPanelContainer.off("mousedown",function(){});
    };

    _oParent = this;
    this._init(oConfirmFunction, oNegateFunction);
}

