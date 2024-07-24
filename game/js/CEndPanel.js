function CEndPanel(iScore, iBonusTime){
    
    var _aStars;
    
    var _oText1;
    var _oText3;
    var _oText4;
    
    var _oBg;
    var _oButMenu;
    var _oPanel;
    var _oTextScores;

    
    var _oHero;
    
    this._init = function(iScore, iBonusTime){

        stopSound("soundtrack");
        playSound("soundtrack", 1, true);
     
        _oBg = createBitmap(s_oSpriteLibrary.getSprite('rays_0'));
        s_oStage.addChild(_oBg);
        this._animBackGround(0);
        
        var oSprite = s_oSpriteLibrary.getSprite('frame_level');
        _oPanel = createBitmap(oSprite);
        _oPanel.regX = oSprite.width/2;
        _oPanel.regY = oSprite.height/2;
        _oPanel.x = CANVAS_WIDTH/2;
        _oPanel.y = CANVAS_HEIGHT/2;
        s_oStage.addChild(_oPanel);


        _oTextScores = new CFormatText(CANVAS_WIDTH/2, 900, TEXT_TOTALSCORE + " " + s_iTotalScore, "#fcf30b", s_oStage, "#8d5227", 50, "center", PRIMARY_FONT, 60, 900);
        _oTextScores.setOutline(8);
       
        _oText1 = new CFormatText(CANVAS_WIDTH/2, 350, TEXT_CONGRATULATIONS, "#fcf30b", s_oStage, "#8d5227", 86, "center", PRIMARY_FONT, 200, 1000);
        _oText1.setOutline(10);
        
        _oText3 = new CFormatText(CANVAS_WIDTH/2, 594, TEXT_END_2, "#ffe468", s_oStage, "#8d5227", 50, "center", PRIMARY_FONT, 120, 900, true);
        _oText3.setOutline(7);        
        
        _oText4 = new CFormatText(CANVAS_WIDTH/2, 780, TEXT_END_4, "#ffe468", s_oStage, "#8d5227", 36, "center", PRIMARY_FONT, 100, 800, true);
        _oText4.setOutline(7);
       
        _oButMenu = new CGfxButton(CANVAS_WIDTH/2, CANVAS_HEIGHT/2 + 150, s_oSpriteLibrary.getSprite('but_home'), s_oStage);
        _oButMenu.addEventListener(ON_MOUSE_UP, this._onButMenuRelease, this);
        _oButMenu.reverseSprite();
        
        _oHero = new CHero(150, 1500, s_oStage);
        _oHero.endPanelAnim();
        
        $(s_oMain).trigger("save_score",s_iTotalScore);
        $(s_oMain).trigger("share_event",s_iTotalScore);
        
    };
    
    this.unload = function(){
        
        _oText1.unload();
        _oText3.unload();
        _oText4.unload();
        
        _oHero.unload();
        
        _oButMenu.unload();

        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
               
        stopSound("soundtrack");
        
    };
    
    this._animBackGround = function(iIndex){
        var oParent = this;        
        _oBg.image = s_oSpriteLibrary.getSprite('rays_'+ iIndex);
        
        setTimeout(function(){
            if(iIndex === 3){
                iIndex = -1;
            }
            oParent._animBackGround(iIndex+1);

        }, 50);        
    };
    
    this._onButMenuRelease = function(){
        this.unload();

        
        playSound("chef_well_done", 1, false);
        playSound("click", 1, false);
        
        $(s_oMain).trigger("show_interlevel_ad");
        
        s_oMain.gotoMenu();
        
        $(s_oMain).trigger("end_session");
    }; 
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._init(iScore, iBonusTime);
}