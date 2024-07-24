function CInterface(iCurLevel){
    var _aGoals;
    
    var _oAudioToggle;
    var _oButExit;
    var _oScoreText;
    var _oButRestart;
    var _oButPause;
    var _oTimeNum;
    var _oHelpPanel=null;
    var _oPanelContainer;
    var _oLevel;

    var _oMask;
   
    
    var _pStartPosExit;
    var _pStartPosAudio;
    var _pStartPosPause;
    var _pStartPosRestart;
    
    this._init = function(iCurLevel){  
        
        var oScorePanel = createBitmap(s_oSpriteLibrary.getSprite('score_panel'));
        oScorePanel.x = 60;
        oScorePanel.y = 340;
        s_oStage.addChild(oScorePanel);
        
        _oScoreText = new CFormatText(80, 341, "000000000", "#ffffff", s_oStage, "#000000", 50, "left");

        _oLevel = new CLevelButton(520, 380, s_iCurLevel, s_oStage);
        _oLevel.setForInfo();
        
        var oSprite = s_oSpriteLibrary.getSprite('bottom_panel');
        var oBottomPanel = createBitmap(oSprite);
        oBottomPanel.regX = oSprite.width/2;
        oBottomPanel.x = CANVAS_WIDTH/2;
        oBottomPanel.y = 1380;
        s_oStage.addChild(oBottomPanel);
        
        this._setGoals();
        
        _oPanelContainer = new createjs.Container();
        s_oStage.addChild(_oPanelContainer);
        
        oSprite = s_oSpriteLibrary.getSprite('time_bar_fill');
        var oTimePos = {x: CANVAS_WIDTH/2 - oSprite.width/2, y: 1340};
        var oEnergyBarFill = createBitmap(oSprite);
        oEnergyBarFill.x=oTimePos.x+10;
        oEnergyBarFill.y=oTimePos.y+10;
        s_oStage.addChild(oEnergyBarFill);
        
        oSprite = s_oSpriteLibrary.getSprite('time_bar');
        var oEnergyBarBg = createBitmap(oSprite);
        oEnergyBarBg.x=oTimePos.x;
        oEnergyBarBg.y=oTimePos.y;
        s_oStage.addChild(oEnergyBarBg);
        
        oSprite = s_oSpriteLibrary.getSprite('time_bar_fill');
        _oMask = new createjs.Shape();
        _oMask.graphics.beginFill("rgba(255,0,0,0.01)").drawRect(0, 0, oSprite.width,oSprite.height);
        _oMask.x= oTimePos.x+10;
        _oMask.y= oTimePos.y+10;

        s_oStage.addChild(_oMask);
        oEnergyBarFill.mask = _oMask;
        
        _oTimeNum = new CFormatText(490, oTimePos.y +20, "0:00", "#ffffff", s_oStage, "#000000", 40, "left");
        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            var oSprite = s_oSpriteLibrary.getSprite('but_exit');
            _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 30, y: (oSprite.height/2) + 30};
            _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
            _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
            
            var oExitX = CANVAS_WIDTH - (oSprite.width/2) - 150;
 
            var oSprite = s_oSpriteLibrary.getSprite('audio_icon');
            _pStartPosAudio = {x: oExitX, y: (oSprite.height/2) + 30};        
            _oAudioToggle = new CToggle(_pStartPosAudio.x,_pStartPosAudio.y,oSprite,s_bAudioActive, s_oStage);
            _oAudioToggle.addEventListener(ON_MOUSE_UP, this._onAudioToggle, this);
            
            oExitX = CANVAS_WIDTH - (oSprite.width/2) - 215;
            
            var oSprite = s_oSpriteLibrary.getSprite('but_pause');
            _pStartPosPause = {x: oExitX, y: (oSprite.height/2) + 30};        
            _oButPause = new CGfxButton(_pStartPosPause.x, _pStartPosPause.y, oSprite, s_oStage);
            _oButPause.addEventListener(ON_MOUSE_UP, this._onButPauseRelease);
            
            oExitX = CANVAS_WIDTH - (oSprite.width/2) - 380;
            
            var oSprite = s_oSpriteLibrary.getSprite('but_restart');
            _pStartPosRestart = {x: oExitX, y: (oSprite.height/2) + 30}; 
            _oButRestart = new CGfxButton(_pStartPosRestart.x, _pStartPosRestart.y, oSprite, s_oStage);
            _oButRestart.addEventListener(ON_MOUSE_UP, this._onButRestartRelease);
        } else {
            
            var oSprite = s_oSpriteLibrary.getSprite('but_exit');
            _pStartPosExit = {x: CANVAS_WIDTH - (oSprite.height/2)- 30, y: (oSprite.height/2) + 30};
            _oButExit = new CGfxButton(_pStartPosExit.x, _pStartPosExit.y, oSprite, s_oStage);
            _oButExit.addEventListener(ON_MOUSE_UP, this._onExit, this);
            
            var oExitX = CANVAS_WIDTH - (oSprite.width/2) - 150;
            
            var oSprite = s_oSpriteLibrary.getSprite('but_pause');
            _pStartPosPause = {x: oExitX, y: (oSprite.height/2) + 30};        
            _oButPause = new CGfxButton(_pStartPosPause.x, _pStartPosPause.y, oSprite, s_oStage);
            _oButPause.addEventListener(ON_MOUSE_UP, this._onButPauseRelease);
            
            oExitX = CANVAS_WIDTH - (oSprite.width/2) - 270;
            
            var oSprite = s_oSpriteLibrary.getSprite('but_restart');
            _pStartPosRestart = {x: oExitX, y: (oSprite.height/2) + 30}; 
            _oButRestart = new CGfxButton(_pStartPosRestart.x, _pStartPosRestart.y, oSprite, s_oStage);
            _oButRestart.addEventListener(ON_MOUSE_UP, this._onButRestartRelease);
            
        }

        this.refreshButtonPos(s_iOffsetX,s_iOffsetY);
        
    };
    
    this.unload = function(){   

        _oScoreText.unload();
        _oScoreText = null;

        _oButRestart.unload();
        _oButRestart = null;
        _oButPause.unload();
        _oButPause = null;
        
        _oTimeNum.unload();
        _oTimeNum = null;
        
        _oLevel.unload();
        _oLevel = null;
        
        for(var i=0; i<_aGoals.length; i++){
            s_oStage.removeChild(_aGoals[i].image);
        }
        
        _oButExit.unload();
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.unload();
            _oAudioToggle = null;
        }
        
        s_oInterface = null;
        
    };
    
    this.refreshButtonPos = function(iNewX,iNewY){
        _oButExit.setPosition(_pStartPosExit.x - iNewX,iNewY + _pStartPosExit.y);
        _oButPause.setPosition(_pStartPosPause.x - iNewX,iNewY + _pStartPosPause.y);
        _oButRestart.setPosition(_pStartPosRestart.x - iNewX,iNewY + _pStartPosRestart.y);        
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            _oAudioToggle.setPosition(_pStartPosAudio.x - iNewX,iNewY + _pStartPosAudio.y);
        }
    };
    
    this.getPanelContainer = function(){
        return _oPanelContainer;
    };

    this.refreshScore = function(iValue){

        var iNumber = pad(iValue, 9);
        
        function pad(n, width, z) {
            z = z || '0';
            n = n + '';
            return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
        }
        
        _oScoreText.setText(iNumber);
        
    };

    this.refreshTime = function(iTime, iBarLength){        
        var iNum = formatTime(iTime);
        _oTimeNum.setText(iNum);
        
        _oMask.scaleX = iBarLength;
    };

    this.setTimerColor = function(szColor){
        _oTimeNum.setColor(szColor,"#000000");
    };

    this._setGoals = function(){
        _aGoals = new Array();
        
        if(GOALS[iCurLevel].type0 > 0){
            _aGoals.push({type: 0, num:GOALS[iCurLevel].type0, image:null, text:null});
        }
        
        if(GOALS[iCurLevel].type1 > 0){
            _aGoals.push({type: 1, num:GOALS[iCurLevel].type1, image:null, text:null});
        }
        
        if(GOALS[iCurLevel].type2 > 0){
            _aGoals.push({type: 2, num:GOALS[iCurLevel].type2, image:null, text:null});
        }
        
        if(GOALS[iCurLevel].type3 > 0){
            _aGoals.push({type: 3, num:GOALS[iCurLevel].type3, image:null, text:null});
        }
        
        if(GOALS[iCurLevel].type4 > 0){
            _aGoals.push({type: 4, num:GOALS[iCurLevel].type4, image:null, text:null});
        }
        
        if(GOALS[iCurLevel].type5 > 0){
            _aGoals.push({type: 5, num:GOALS[iCurLevel].type5, image:null, text:null});
        }
        
        if(GOALS[iCurLevel].type6 > 0){
            _aGoals.push({type: 6, num:GOALS[iCurLevel].type6, image:null, text:null});
        }
        
        if(GOALS[iCurLevel].type7 > 0){
            _aGoals.push({type: 7, num:GOALS[iCurLevel].type7, image:null, text:null});
        }
        
        if(GOALS[iCurLevel].star > 0){
            _aGoals.push({type: TYPE_STAR, num:GOALS[iCurLevel].star, image:null, text:null});
        }
        
        if(GOALS[iCurLevel].block > 0){
            _aGoals.push({type: TYPE_BLOCK, num:GOALS[iCurLevel].block, image:null, text:null});
        }
        var oSprite = s_oSpriteLibrary.getSprite('sushi');
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: CELL_SIZE, height: CELL_SIZE, regX: CELL_SIZE/2, regY: CELL_SIZE/2}, 
                        animations: {type_0:[0], type_1:[1], type_2:[2], type_3:[3], type_4:[4], type_5:[5], type_6:[6], type_7:[7], star:[8]}
                   };
        
        var pPos = {x: 170, y: 1500};
        
        var iOffset = CELL_SIZE + 200;
        
        var oSpriteSheet = new createjs.SpriteSheet(oData);        
        for(var i=0; i<_aGoals.length; i++){
            if(_aGoals[i].type === TYPE_BLOCK){
                var oSprite = s_oSpriteLibrary.getSprite('block');
                _aGoals[i].image = createBitmap(oSprite);
                _aGoals[i].image.x = pPos.x+i*iOffset;
                _aGoals[i].image.y = pPos.y;
                _aGoals[i].image.regX = oSprite.width/2;
                _aGoals[i].image.regY = oSprite.height/2;
                _aGoals[i].image.scaleX = 0.75;
                _aGoals[i].image.scaleY = 0.75;
                s_oStage.addChild(_aGoals[i].image);
            } else {
                _aGoals[i].image = createSprite(oSpriteSheet, _aGoals[i].type,CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
                _aGoals[i].image.gotoAndStop(_aGoals[i].type);
                _aGoals[i].image.x = pPos.x+i*iOffset;
                _aGoals[i].image.y = pPos.y;
                _aGoals[i].image.scaleX = 0.75;
                _aGoals[i].image.scaleY = 0.75;
                s_oStage.addChild(_aGoals[i].image);
            }
            
            _aGoals[i].text = new CFormatText(pPos.x + CELL_SIZE +i*iOffset, pPos.y, "0 / "+_aGoals[i].num, "#ffffff", s_oStage, "#000000", 35);
            _aGoals[i].text.setOutline(3);
        }
    };

    this.refreshGoals = function(iType, iNum){
        for(var i=0; i<_aGoals.length; i++){
            if(_aGoals[i].type === iType){                
                _aGoals[i].text.setText(iNum + " / " + _aGoals[i].num);
                if(iNum >= _aGoals[i].num){
                    _aGoals[i].text.setColor("#afe015", "#000000");
                }
            }            
        }               
    };

    this._onButHelpRelease = function(){
        _oHelpPanel = new CHelpPanel();
    };
    
    this._onButRestartRelease = function(){
        //s_oGame.restartGame();
        s_oGame.pauseGame();
        new CAreYouSurePanel(s_oGame.restartGame, s_oGame.resumeGame);
    };
    
    this._onButPauseRelease = function(){
        new CPausePanel();
        s_oGame.pauseGame();
    };
    
    this._onButLevelMenuRelease = function(){
        s_oGame.unload();
        
        s_oMain.goToModeMenu();
    }    
    
    this.onExitFromHelp = function(){
        _oHelpPanel.unload();
    };
    
    this._onAudioToggle = function(){
        Howler.mute(s_bAudioActive);
        s_bAudioActive = !s_bAudioActive;
    };
    
    this._onExit = function(){

        s_oGame.pauseGame();
        new CAreYouSurePanel(s_oGame.onExit, s_oGame.resumeGame);
        
    };
    
    s_oInterface = this;
    
    this._init(iCurLevel);
    
    return this;
}

var s_oInterface = null;