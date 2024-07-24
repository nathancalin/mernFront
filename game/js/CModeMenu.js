function CModeMenu(){
    
    var _bStartUpdate = false;
    var _bMapCorrectionActive = false;
    var _bPlaneScaled = false;
    
    var _iTimeElapse = 0;
    
    var _iVectLength = 0;
    var _iVectAngleX = 0;
    var _iVectAngleY = 0;
    
    var _aLevel;
    var _oTitle;
    
    var _oParent;
    var _oAudioToggle;
    var _oButExit;
    var _oHero;
    var _oAirPlane;
    var _oMapContainer;
    var _oButFullscreen;
    
    var _pStartPosAudio;
    var _pStartPosExit;
    var _pStartPosHero;
    var _pStartPosTitle;
    
    var _pMapMoveStartPoint;
    var _pNewMapPoint;
    var _pStartPosFullscreen;
    
    var _fRequestFullScreen = null;
    var _fCancelFullScreen = null;
    
    var _aMapPiece;
    var _rMainRect;
    var _aPieceRect;
    
    this._init = function(){
        
        _iTimeElapse = 0;
        
        _pMapMoveStartPoint = {x:0, y:0};
        _oMapContainer = new createjs.Container();
        s_oStage.addChild(_oMapContainer);
        
        _pStartPosHero = {x: 150, y: CANVAS_HEIGHT - 80};
        _oHero = new CHero(_pStartPosHero.x, _pStartPosHero.y, s_oStage);
        _oHero.smile();

        _pStartPosTitle = {x: CANVAS_WIDTH/2 + 200, y: 1750};
        _oTitle = new CFormatText(_pStartPosTitle.x, _pStartPosTitle.y, TEXT_SELECT_LEVEL, "#ffffff", s_oStage, "#000000", 90, "center");
        _oTitle.setOutline(10);
        
        _rMainRect = new createjs.Rectangle(0,0,CANVAS_WIDTH, CANVAS_HEIGHT);
        
        _aPieceRect = new Array();
        _aMapPiece = new Array();

        var pOffset = {x:1000,y:750};
        var iYOffset = 0;
        var iXOffset = 0;
        for(var i=0; i<32; i++){
            
            var oSprite = s_oSpriteLibrary.getSprite('jm_'+i);
            _aMapPiece[i] = createBitmap(oSprite);
            _aMapPiece[i].y = iYOffset;
            _aMapPiece[i].x = iXOffset;
            if(i%4 < 3){
                iXOffset += pOffset.x;
            } else{
                iXOffset = 0;
                iYOffset += pOffset.y;
            }

            _aPieceRect.push(new createjs.Rectangle(_aMapPiece[i].x, _aMapPiece[i].y, pOffset.x, pOffset.y));
            _oMapContainer.addChild(_aMapPiece[i]);
        }
       
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            
            var oSprite = s_oSpriteLibrary.getSprite('but_exit');
            _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 30, y: (oSprite.height/2) + 30};
            _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
            _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
            
            var oExitX = CANVAS_WIDTH - (oSprite.width/2) - 150;
            _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 30};
            
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');            
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
                     
        } else {
            
            var oSprite = s_oSpriteLibrary.getSprite('but_exit');
            _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 30, y: (oSprite.height/2) + 30};
            _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
            _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
            
        }
        
        
        var doc = window.document;
        var docEl = doc.documentElement;
        _fRequestFullScreen = docEl.requestFullscreen || docEl.mozRequestFullScreen || docEl.webkitRequestFullScreen || docEl.msRequestFullscreen;
        _fCancelFullScreen = doc.exitFullscreen || doc.mozCancelFullScreen || doc.webkitExitFullscreen || doc.msExitFullscreen;
        
        if(ENABLE_FULLSCREEN === false){
            _fRequestFullScreen = false;
        }
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            oSprite = s_oSpriteLibrary.getSprite("but_fullscreen");
            _pStartPosFullscreen = {x:(oSprite.height/2)+ 30,y:_pStartPosExit.y};
            _oButFullscreen = new CToggle(_pStartPosFullscreen.x,_pStartPosFullscreen.y,oSprite,s_bFullscreen, s_oStage);
            _oButFullscreen.addEventListener(ON_MOUSE_UP,this._onFullscreenRelease,this);
        }
        
        
        _oMapContainer.on("mousedown", this._mapMoveStartPoint);
        _oMapContainer.on("pressmove", this._mapMove);
        _oMapContainer.on("pressup", this._mapMoveStop);
        
        //Add levels        
        _aLevel = new Array();
        var iCurLevelActive = 0; 
        for(var i=0; i<LEVEL_MATRIX.length-1; i++){ 
           
            _aLevel[i+1] = new CLevelButton(0, 0, i+1, _oMapContainer);            
            _aLevel[i+1].addEventListenerWithParams(ON_MOUSE_UP, this._startLevel, this, i+1);

            var bEnable = s_aLevelEnabled[i+1];
            _aLevel[i+1].setActive(bEnable);
            
            if(bEnable){
                var iScore = s_aLevelScore[i+1];
                _aLevel[i+1].addTextOn(TEXT_SCORE +" "+iScore, "bottom");
                if(iScore > 0){
                    s_aHelpPanelEnabled[i+1] = false;
                }
                
                iCurLevelActive = i+1;
            }

            _aLevel[i+1].setStars(iScore);
            
        };
        
        var iScore = s_aLevelScore[iCurLevelActive];
        if(iScore===0){
            _aLevel[iCurLevelActive].pulseAnimation();
        }
        
        
        this._setLevelPosition();
        
        this._centerMapToLevel(iCurLevelActive);
        
        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
        this._activeMapPiece();
        
        var oSprite = s_oSpriteLibrary.getSprite('airplane');
        _oAirPlane = createBitmap(oSprite);
        _oMapContainer.addChild(_oAirPlane);        
        this._showAirplane();

    };
    
    this.unload = function(){
       
        _oMapContainer.off("mousedown", this._mapMoveStartPoint);
        _oMapContainer.off("pressmove", this._mapMove);
        _oMapContainer.off("pressup", this._mapMoveStop);
        
        if (_fRequestFullScreen && screenfull.isEnabled){
            _oButFullscreen.unload();
        }
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        
        for(var i=1; i<26; i++){
            _aLevel[i].unload();
        }
        s_oStage.removeAllChildren();

        s_oModeMenu = null;
    };
    
    this._setLevelPosition = function(){
        
        _aLevel[1].setPosition(838,5039);
        _aLevel[2].setPosition(742,4736);
        _aLevel[3].setPosition(795,4425);
        _aLevel[4].setPosition(1043,4271);
        _aLevel[5].setPosition(1284,4606);
        
        _aLevel[6].setPosition(1516,4448);
        _aLevel[7].setPosition(1378,4135);
        _aLevel[8].setPosition(1695,4013);
        _aLevel[9].setPosition(1867,4295);
        _aLevel[10].setPosition(1952,3927);
        
        _aLevel[11].setPosition(2100,3614);
        _aLevel[12].setPosition(2373,3517);
        _aLevel[13].setPosition(2679,3389);
        _aLevel[14].setPosition(2498,3057);
        _aLevel[15].setPosition(2624,2843);
        
        _aLevel[16].setPosition(2647,2616);        
        _aLevel[17].setPosition(2624,2388);
        _aLevel[18].setPosition(2500,2254);
        _aLevel[19].setPosition(2300,1785);
        _aLevel[20].setPosition(2539,1624);
        
        _aLevel[21].setPosition(2539,1404);
        _aLevel[22].setPosition(2624,1131);
        _aLevel[23].setPosition(2840,1217);
        _aLevel[24].setPosition(3068,1307);
        _aLevel[25].setPosition(2774,1610);
        
    };
    
    this._centerMapToLevel = function(iLevelIndex){
        if(iLevelIndex === 1){
            this._setMapPosition(CANVAS_WIDTH/2 - _aLevel[1].getX(), CANVAS_HEIGHT/2 -_aLevel[1].getY());
        } else{
            this._setMapPosition(CANVAS_WIDTH/2 - _aLevel[iLevelIndex-1].getX(), CANVAS_HEIGHT/2 -_aLevel[iLevelIndex-1].getY());
            this._autoShiftMap(iLevelIndex);
        }
        
    };
    
    this._activeMapPiece = function(){
        
        for(var i=0; i<32; i++){ 

            _aPieceRect[i].x = _aMapPiece[i].x + _oMapContainer.x;
            _aPieceRect[i].y = _aMapPiece[i].y + _oMapContainer.y;
            
            var rIntersect = calculateIntersection(_rMainRect, _aPieceRect[i]);
            if(rIntersect === null){
                _aMapPiece[i].visible = false;
            } else {
                _aMapPiece[i].visible = true;
            }
        }
        
    };
    
    this._mapMoveStartPoint = function(event){
        createjs.Tween.removeTweens(_oMapContainer);
        
        _pMapMoveStartPoint = {x:event.stageX, y:event.stageY};

    };
    
    this._mapMove = function(event){
       
       _bStartUpdate = true;
       _iTimeElapse = 0;
       
        var vStartVect = new CVector2(_pMapMoveStartPoint.x, _pMapMoveStartPoint.y);
        var vEndVect = new CVector2(event.stageX, event.stageY);
        
        vEndVect.subV(vStartVect);
        
        _iVectLength = vEndVect.length();
        _iVectAngleX = Math.acos(vEndVect.getX() / _iVectLength);
        _iVectAngleY = Math.asin(vEndVect.getY() / _iVectLength);
        
        _pNewMapPoint = {x:event.stageX - _pMapMoveStartPoint.x, y:event.stageY - _pMapMoveStartPoint.y};
        _pMapMoveStartPoint = {x:event.stageX,y:event.stageY};
        
        _oParent._setMapPosition(_pNewMapPoint.x, _pNewMapPoint.y);
        
  
    };
    
    this._mapMoveStop = function(){
        
        if(!_bStartUpdate){
            return;
        }
        
        
        _bMapCorrectionActive = true;
        
        var pProjection = {x: _oMapContainer.x + _iVectLength*MAP_SENSITIVITY*Math.cos(_iVectAngleX), y: _oMapContainer.y + _iVectLength*MAP_SENSITIVITY*Math.sin(_iVectAngleY)};
        
        
        if(isNaN(pProjection.x) || isNaN(pProjection.y)){
            _iVectLength = 0;
            _bMapCorrectionActive = false;
            return;
        }
        
        if(pProjection.y > 0){
            pProjection.y = 0;
        } else if(pProjection.y < CANVAS_HEIGHT - MAP_HEIGHT){
            pProjection.y = CANVAS_HEIGHT - MAP_HEIGHT;
        }
        
        if(pProjection.x > 0){
            pProjection.x = 0;
        } else if(pProjection.x < CANVAS_WIDTH - MAP_WIDTH){
            pProjection.x = CANVAS_WIDTH - MAP_WIDTH;
        }
        
        createjs.Tween.get(_oMapContainer, {override:  true}).to({x:pProjection.x, y:pProjection.y}, 500, createjs.Ease.cubicOut).call(function(){ _bMapCorrectionActive = false; _iVectLength = 0; _oParent._activeMapPiece();});
        
    };
    
    this._autoShiftMap = function(iIndex){
        _bMapCorrectionActive = true;
        createjs.Tween.get(_oMapContainer).to({x:CANVAS_WIDTH/2 - _aLevel[iIndex].getX(), y:CANVAS_HEIGHT/2 -_aLevel[iIndex].getY()}, 1000, createjs.Ease.cubicOut).call(function(){
            _bMapCorrectionActive = false;
        });
    };
    
    this._setMapPosition = function(iXPos, iYPos){
        
        _oMapContainer.x += iXPos;
        _oMapContainer.y += iYPos;
        
        if(_oMapContainer.y > 0){
            _oMapContainer.y = 0;
        } else if(_oMapContainer.y < CANVAS_HEIGHT - MAP_HEIGHT){
            _oMapContainer.y = CANVAS_HEIGHT - MAP_HEIGHT;
        }
        
        if(_oMapContainer.x > 0){
            _oMapContainer.x = 0;
        } else if(_oMapContainer.x < CANVAS_WIDTH - MAP_WIDTH){
            _oMapContainer.x = CANVAS_WIDTH - MAP_WIDTH;
        }    
        
        this._activeMapPiece();
        
    };
    
    this._showAirplane = function(){
        var oSprite = s_oSpriteLibrary.getSprite('airplane');
        var iRandomStartY = Math.random()*MAP_HEIGHT;
        var iRandomEndY = iRandomStartY;
        _oAirPlane.y = iRandomStartY;
        
        
        var iRandomDir = Math.random();
        if(iRandomDir<0.5){
            _oAirPlane.x = -oSprite.width;
            _oAirPlane.scaleX = -1;
            _bPlaneScaled = true;
            createjs.Tween.get(_oAirPlane).to({x:MAP_WIDTH + oSprite.width, y:iRandomEndY}, 20000).call(function(){_oParent._showAirplane();});
        }else {
            if(_bPlaneScaled){
                _oAirPlane.scaleX *= -1;
                _bPlaneScaled = false;
            }
            _oAirPlane.x = MAP_WIDTH;
            createjs.Tween.get(_oAirPlane).to({x:-oSprite.width, y:iRandomEndY}, 20000).call(function(){_oParent._showAirplane();});
        }
        
    }; 
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
        if (_fRequestFullScreen && screenfull.isEnabled){
                _oButFullscreen.setPosition(_pStartPosFullscreen.x + iNewX, _pStartPosFullscreen.y + iNewY);
        }
        
        _oHero.setPosition(iNewX + _pStartPosHero.x,_pStartPosHero.y - iNewY);
        _oTitle.setPosition(iNewX + _pStartPosTitle.x,_pStartPosTitle.y - iNewY);
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
    
    this._onButPlayRelease = function(){
        this.unload();
        
        s_oMain.gotoGame();
    };

    this._onExit = function(){

        stopSound("soundtrack");
        
        this.unload();
        s_oMain.gotoMenu();
        
        $(s_oMain).trigger("end_session");
        
    };

    this._startLevel = function(iIndex){
        this.unload();
        s_oMain.gotoGame(iIndex);
    };

    
    this.update = function(){
        if(_bStartUpdate){
            _iTimeElapse += s_iTimeElaps;
            if(_iTimeElapse>50){
                _bStartUpdate = false;
            }
        }
        
        if(_bMapCorrectionActive){
            this._activeMapPiece();
        }
        
    };

    s_oModeMenu = this;
    _oParent=this;
    this._init();
}

var s_oModeMenu = null;