function CPausePanel(){
    
    var _oBg;
    var _oPauseText;
    var _oButContinue;
    var _oHero;
    var _oParent;
    
    this._init = function(){
        
        var oSprite = s_oSpriteLibrary.getSprite('msg_box');
        _oBg = createBitmap(oSprite);
        _oBg.on("mousedown", function(){});
        s_oStage.addChild(_oBg);
        
        _oPauseText = new CFormatText(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 -340, TEXT_ISPAUSED, "#ffffff", s_oStage, "#000000", 50, "center");
        
        _oButContinue = new CGfxButton(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 250, s_oSpriteLibrary.getSprite('but_continue'), s_oStage);
        _oButContinue.addEventListener(ON_MOUSE_UP, this._onButContinueRelease, this);
        
        _oHero = new CHero(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 100, s_oStage);
        _oHero.pause();
    };
    
    this.unload = function(){
        _oPauseText.unload();
        _oPauseText = null;
        _oButContinue.unload();
        _oButContinue = null;
        
        _oHero.unload();
        
        _oBg.off("mousedown", function(){});
        
        s_oStage.removeChild(_oBg);
    };
    
    this._onButContinueRelease = function(){
        _oParent.unload();
        s_oGame.resumeGame();
    };

    _oParent = this;
    this._init();

}