function CCreditsPanel(){
    
    var _oContainer;
    var _oBg;
    var _oButLogo;
    var _oButExit;
    var _oMsgText3;
    
    var _oLink;
    
    var _pStartPosExit;
    
    this._init = function(){
        _oContainer = new createjs.Container();
        s_oStage.addChild(_oContainer);
        
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('msg_box'));
        s_oStage.addChild(_oBg);
        _oBg.on("mousedown", function(){});
       
        var oSprite = s_oSpriteLibrary.getSprite('but_exit');
        _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 130, y: 550};
        _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
        _oButExit.addEventListener(ON_MOUSE_UP, this.unload, this);

       
        var oSprite = s_oSpriteLibrary.getSprite('logo_ctl');
        _oButLogo = new CGfxButton(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 - 175, oSprite, s_oStage);
        _oButLogo.addEventListener(ON_MOUSE_UP, this._onLogoButRelease, this);
       
        _oLink = new CFormatText(CANVAS_WIDTH/2, CANVAS_HEIGHT/2+10, "Thank you for playing!", "#ffffff", s_oStage, "#000000", 40, "center");
       
        _oMsgText3 = new CTextButtonNoSprite(CANVAS_WIDTH/2, 1200, "> Check out Makimoto's menu here! <", "#ffffff", s_oStage, "#000000", 42);
        _oMsgText3.addEventListener(ON_MOUSE_UP, this._onMoreGamesReleased, this);
        _oMsgText3.setWidth(600);
        
        
    };
    
    this.unload = function(){
        _oBg.off("mousedown", function(){});
        
        _oButExit.unload(); 
        _oButExit = null;
        
        _oButLogo.unload();
        

        _oMsgText3.unload();

        _oLink.unload();

        s_oStage.removeChild(_oBg);
    };
    
    this._onLogoButRelease = function(){
        window.open("");
    };
    
    this._onMoreGamesReleased = function(){
        window.open("https://www.facebook.com/MakimotoSushiBarRestaurant");
    };
    
    this._init();
    
    
};


