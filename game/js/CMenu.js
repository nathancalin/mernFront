function CMenu(){
    
    var _iHeroCounter = 0;
    var _iFirstScore;
    
    var _aPiece;
    
    var _oBg;
    var _oButPlay;
    var _oCurtain;
    var _oTitle;
    var _oHero;
    var _oTable;
    var _oObjectL;
    var _oObjectR;
    var _oAudioToggle;
    var _oParent;    
    var _oCreditsBut;
    var _oButContinue;
    var _oButFullscreen;
    
    var _pStartPosAudio;
    var _pStartPosCredits;
    var _pStartPosFullscreen;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    
    this._init = function(){

        //stopSound("soundtrack");
        

        _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_menu'));
        s_oStage.addChild(_oBg);
       
        var oSprite = s_oSpriteLibrary.getSprite('chef_menu');
        _oHero = createBitmap(oSprite);
        _oHero.regX = oSprite.width/2;
        _oHero.x = CANVAS_WIDTH/2;
        _oHero.y = 1300;
        s_oStage.addChild(_oHero);
       
        var oSprite = s_oSpriteLibrary.getSprite('table');
        _oTable = createBitmap(oSprite);
        _oTable.regY = oSprite.height;
        _oTable.y = CANVAS_HEIGHT;
        s_oStage.addChild(_oTable);
        
        var oSprite = s_oSpriteLibrary.getSprite('curtain');
        _oCurtain = createBitmap(oSprite);
        _oCurtain.y = 245;
        s_oStage.addChild(_oCurtain);
        
        var oSprite = s_oSpriteLibrary.getSprite('logo');
        _oTitle = createBitmap(oSprite);
        _oTitle.regX = oSprite.width/2;
        _oTitle.x = CANVAS_WIDTH/2;
        _oTitle.y = 300;
        _oTitle.alpha = 0;
        s_oStage.addChild(_oTitle);
        
        var oSprite = s_oSpriteLibrary.getSprite('object_red');
        _oObjectL = createBitmap(oSprite);
        _oObjectL.regX = 48;
        _oObjectL.x = 90;
        _oObjectL.y = 800;
        s_oStage.addChild(_oObjectL);
        this._idleObjL(1000 + Math.random()*500, 1 + Math.random());
        
        _oObjectR = createBitmap(oSprite);
        _oObjectR.regX = 48;
        _oObjectR.x = 990;
        _oObjectR.y = 810;
        s_oStage.addChild(_oObjectR);        
        this._idleObjR(1000 + Math.random()*500, 1 + Math.random());
       
        var oSprite = s_oSpriteLibrary.getSprite('sushi_menu');
        var iSize = oSprite.width/4;
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: iSize, height: iSize, regX: iSize/2, regY: iSize/2}, 
                        animations: {type_0:[0], type_1:[1], type_2:[2], type_3:[3], type_4:[4], type_5:[5], type_6:[6]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _aPiece = new Array();       
        for(var i=0; i<7; i++){
            _aPiece[i] = createSprite(oSpriteSheet, i,iSize/2,iSize/2,iSize,iSize);
            _aPiece[i].gotoAndStop(i);
        }

        _aPiece[0].x = 350;
        _aPiece[0].y = -iSize;
        
        _aPiece[1].x = 470;
        _aPiece[1].y = -iSize;
        
        _aPiece[3].x = 710;
        _aPiece[3].y = -iSize;
        
        _aPiece[2].x = 590;
        _aPiece[2].y = -iSize;
        
        _aPiece[4].x = 670;
        _aPiece[4].y = -iSize;
        
        _aPiece[5].x = 520;
        _aPiece[5].y = -iSize;        
        
        _aPiece[6].x = 380;
        _aPiece[6].y = -iSize;
        
        s_oStage.addChild(_aPiece[0]);
        s_oStage.addChild(_aPiece[1]);
        s_oStage.addChild(_aPiece[3]);
        s_oStage.addChild(_aPiece[2]);       
        s_oStage.addChild(_aPiece[4]);
        s_oStage.addChild(_aPiece[6]);        
        s_oStage.addChild(_aPiece[5]);

        this._fallPieces();

        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: CANVAS_WIDTH - (oSprite.height/2)- 30, y: (oSprite.height/2) + 30};            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);            
        }
        
        var oSprite = s_oSpriteLibrary.getSprite('but_info');
        _pStartPosCredits = {x: (oSprite.height/2)+ 30, y: (oSprite.height/2) + 30};            
        _oCreditsBut = new CGfxButton(_pStartPosCredits.x,_pStartPosCredits.y,oSprite, s_oStage);
        _oCreditsBut.addEventListener(ON_MOUSE_UP, this._onButCreditsRelease, this);
        
        var oSprite = s_oSpriteLibrary.getSprite('but_play');

        _iFirstScore = s_aLevelScore[1];
        if(_iFirstScore === 0){
            _oButPlay = new CGfxButton(CANVAS_WIDTH/2, 1500, oSprite, s_oStage);
            _oButPlay.addEventListener(ON_MOUSE_UP, this._onButContinueRelease, this);
        } else {
            _oButPlay = new CGfxButton(CANVAS_WIDTH/2 - 300, 1500, oSprite, s_oStage);
            _oButPlay.addEventListener(ON_MOUSE_UP, this._onButPlayRelease, this);
        }
        
        _oButPlay.setVisible(false);

        var oSprite = s_oSpriteLibrary.getSprite('but_continue_menu');
        _oButContinue = new CGfxButton(CANVAS_WIDTH/2 + 300, 1500, oSprite, s_oStage);
        _oButContinue.addEventListener(ON_MOUSE_UP, this._onButContinueRelease, this);   
        _oButContinue.setVisible(false);


        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
            _pStartPosFullscreen = {x:_pStartPosCredits.x + oSprite.width/2 + 10,y:_pStartPosCredits.y};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }

        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
        if(!s_oLocalStorage.isUsed()){
            var oMsgBoxPanel = new CAreYouSurePanel();
            oMsgBoxPanel.changeMessage(TEXT_IOS_PRIVATE, 40, -400);
            oMsgBoxPanel.setOneButton();
        }
        
    };
    
    this.unload = function(){
        _oButContinue.unload(); 
        _oButContinue = null;
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        _oButPlay.unload(); 
        _oButPlay = null;
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        s_oStage.removeChild(_oBg);
        s_oStage.removeChild(_oTable);
        s_oStage.removeChild(_oCurtain);
        s_oStage.removeChild(_oHero);
        s_oStage.removeChild(_oObjectL);
        s_oStage.removeChild(_oObjectR);
        s_oStage.removeChild(_oTitle);
        for(var i=0; i<7; i++){
            s_oStage.removeChild(_aPiece[i]);
        }
        
        _oBg = null;
        s_oMenu = null;
    };
    
    this._idleObjL = function(iTime, iRot){
        createjs.Tween.get(_oObjectL).to({rotation:iRot}, iTime, createjs.Ease.quadOut).to({rotation:0}, iTime, createjs.Ease.quadIn).
                to({rotation:-iRot}, iTime, createjs.Ease.quadOut).to({rotation:0}, iTime, createjs.Ease.quadIn).call(function(){_oParent._idleObjL(iTime, iRot);});
    };
    
    this._idleObjR = function(iTime, iRot){
        createjs.Tween.get(_oObjectR).to({rotation:iRot}, iTime, createjs.Ease.quadOut).to({rotation:0}, iTime, createjs.Ease.quadIn).
                to({rotation:-iRot}, iTime, createjs.Ease.quadOut).to({rotation:0}, iTime, createjs.Ease.quadIn).call(function(){_oParent._idleObjR(iTime, iRot);});
    };

    this._fallPieces = function(){
        
        var iTime = 225;
        
        var aPosY = new Array();
        
        aPosY[0] = 1270;
        aPosY[1] = 1270;
        aPosY[2] = 1270;
        aPosY[3] = 1270;
        aPosY[4] = 1380;
        aPosY[5] = 1380;
        aPosY[6] = 1380;
          
        for(var i=0; i<7; i++){
            createjs.Tween.get(_aPiece[i]).wait(iTime*i).to({y:aPosY[i]+20}, iTime, createjs.Ease.cubicIn).to({y:aPosY[i]}, 50).call(function(){
                _oParent._spawnChefAndTitle();

               playSound("menu_piece", 1, false);
            
            });
        }
        
    };
    
    this._spawnChefAndTitle = function(){
        _iHeroCounter++;
        if(_iHeroCounter === 7){
           
            playSound("gong", 1, false);
           
            if(_iFirstScore !== 0){
                _oButContinue.setVisible(true);
                _oButContinue.pulseAnimation();
            }
            _oButPlay.setVisible(true);
            
            createjs.Tween.get(_oHero).to({y:840}, 400, createjs.Ease.quadraticIn).call(function(){
                createjs.Tween.get(_oTitle).to({alpha:1, y:360}, 500);
                
                //stopSound("soundtrack");
                //playSound("soundtrack",1,true);

            });

        }
        
    };
   
    this.refreshButtonPos = function(iNewX,iNewY){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        _oCreditsBut.setPosition(_pStartPosCredits.x + iNewX, iNewY + _pStartPosCredits.y);
        if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
        }
    };
   
    this.resetFullscreenBut = function(){
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.setActive(s_bFullscreen);
        }
    };
        
    this._onFullscreenRelease = function(){
	if(s_bFullscreen) { 
		_fCancelFullScreen.call(window.document);
	}else{
		_fRequestFullScreen.call(window.document.documentElement);
	}
	
	sizeHandler();
    };
   
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onButContinueRelease = function(){
        this.unload();        
        s_oMain.goToModeMenu();
        
        $(s_oMain).trigger("start_session");
    };
    
    this._onButPlayRelease = function(){
        new CWarningPanel();
    };
	
    this._onButCreditsRelease = function(){    
        new CCreditsPanel();
    };    
 
    
    s_oMenu = this;
    
    _oParent = this;
    this._init();
}

var s_oMenu = null;