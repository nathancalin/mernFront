function CWarningPanel(){
    
    var _oBg;

    var _oButExit;
    var _oMsgText;
    var _oMsgText2;
    var _oMsgText3;
    var _oButContinue;
    
    var _pStartPosExit;
    
    this._init = function(){
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        s_oStage.addChild(_oBg);
        _oBg.on("mousedown", function(){});
       
        var oSprite = s_oSpriteLibrary.getSprite('but_exit_big');
        _pStartPosExit = {x: CANVAS_WIDTH/2 - 150, y: 1200};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);
        _oButExit.pulseAnimation();
       
        _oMsgText = new CFormatText(CANVAS_WIDTH/2, 580, TEXT_GAMERESTART, "#ffffff", s_oStage, "#000000", 50, "center");
        _oMsgText.setOutline(8);
        
        _oMsgText2 = new CFormatText(CANVAS_WIDTH/2, 750, TEXT_WARNING, "#ffffff", s_oStage, "#000000", 40, "center", PRIMARY_FONT, 200, 700);
        
        _oMsgText3 = new CFormatText(CANVAS_WIDTH/2, 1000, TEXT_SURE, "#ffe468", s_oStage, "#000000", 40, "center");
        
        var oSprite = s_oSpriteLibrary.getSprite('but_check');
        _oButContinue = new CGfxButton(CANVAS_WIDTH/2 + 150, 1200, oSprite, s_oStage);
        _oButContinue.addEventListener(ON_MOUSE_UP, this._onButConfirmRelease, this);
        
    };
    
    this.unload = function(){
        _oBg.off("mousedown", function(){});
        
        _oButExit.unload(); 
        _oButExit = null;
        
        _oButContinue.unload();
        _oButContinue = null;
        
        _oMsgText.unload();
        _oMsgText2.unload();
		_oMsgText3.unload();


        s_oStage.removeChild(_oBg);
        
        
    };
    
    this._onButConfirmRelease = function(){
        this.unload();
        s_oMenu.unload();

        s_oLocalStorage.resetData();
        s_oLocalStorage.saveData();
        
        s_oMain.goToModeMenu();
    };
    
    this._init();
    
    
};


