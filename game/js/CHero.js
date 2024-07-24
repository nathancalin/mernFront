function CHero(iX, iY, oParentContainer){
    var _bVisible;
    
    var _iWidth;
    var _iHeight;
    
    var _iTimeSpawn;
    
    var _oParent;
    var _oHero;
    var _oTalkAnim;
    var _oTalkTimeout = null;
    var _oSmile;
    var _oWin1;
    var _oWin2;
    var _oFail;
    var _oHelpPointSide;
    var _oHelpPointBottom;
    
    
    this._init = function(iX, iY, oParentContainer){
        
        _oHero = new createjs.Container();
        _oHero.x = iX;
        _oHero.y = iY;
        oParentContainer.addChild(_oHero);
        
        _iWidth = 229;
        _iHeight = 336;
        
        _iTimeSpawn = 350;
        
        var oSprite = s_oSpriteLibrary.getSprite('chef_talk');
        var oData = {   
                        images: [oSprite],
                        framerate: 5,
                        // width, height & registration point of each sprite
                        frames: {width: _iWidth, height: _iHeight, regX: _iWidth/2, regY: _iHeight/2}, 
                        animations: {anim0:[0,0,"anim1"], anim1:[1,1,"anim2"], anim2:[2,2,"anim3"], anim3:[3,3,"anim4"], anim4:[0,0,"anim5"], anim5:[1,1,"anim6"], anim6:[2,2,"anim7"], anim7:[3,3,"anim8"], anim8:[4,4,"anim8"]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData); 
        _oTalkAnim = createSprite(oSpriteSheet, "anim0",_iWidth/2,_iHeight/2,_iWidth,_iHeight); 
        
        var oSprite = s_oSpriteLibrary.getSprite('chef_smile');
        _oSmile = createBitmap(oSprite);
        _oSmile.regX = oSprite.width/2;
        _oSmile.regY = oSprite.height/2;

        var oSprite = s_oSpriteLibrary.getSprite('chef_exultation_1');
        _oWin1 = createBitmap(oSprite);
        _oWin1.regX = oSprite.width/2;
        _oWin1.regY = oSprite.height/2;
        _oWin1.scaleX = _oWin1.scaleY = 0.75;
        
        var oSprite = s_oSpriteLibrary.getSprite('chef_exultation_2');
        _oWin2 = createBitmap(oSprite);
        _oWin2.regX = oSprite.width/2;
        _oWin2.regY = oSprite.height/2;
        _oWin2.scaleX = _oWin2.scaleY = 0.75;
        
        var oSprite = s_oSpriteLibrary.getSprite('chef_level_failed');
        _oFail = createBitmap(oSprite);
        _oFail.regX = oSprite.width/2;
        _oFail.regY = oSprite.height/2;
        
        var oSprite = s_oSpriteLibrary.getSprite('chef_help_side');
        var iWidth = oSprite.width/2;
        var iHeight = oSprite.height;
        var oData = {   
                        images: [oSprite],
                        framerate: 3,
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight/2}, 
                        animations: {anim0:[0,0,"anim1"], anim1:[1,1,"anim0"]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData); 
        _oHelpPointSide = createSprite(oSpriteSheet, "anim0",iWidth/2,iHeight/2,iWidth,iHeight);

        
        var oSprite = s_oSpriteLibrary.getSprite('chef_help_bottom');
        var iWidth = oSprite.width/2;
        var iHeight = oSprite.height;
        var oData = {   
                        images: [oSprite],
                        framerate: 3,
                        // width, height & registration point of each sprite
                        frames: {width: iWidth, height: iHeight, regX: iWidth/2, regY: iHeight/2}, 
                        animations: {anim0:[0,0,"anim1"], anim1:[1,1,"anim0"]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData); 
        _oHelpPointBottom = createSprite(oSpriteSheet, "anim0",iWidth/2,iHeight/2,iWidth,iHeight);
        
    };
    
    this.unload = function(){
        createjs.Tween.removeTweens(_oHero);
        oParentContainer.removeChild(_oHero);
    };
    
    this.setVisible = function(bVal){
        _oHero.visible = bVal;
        _bVisible = bVal;
    };
    
    this.isVisible = function(){
        return _bVisible;
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oHero.x = iXPos;
         _oHero.y = iYPos;
    };
    
    this._resetAnim = function(){
        
        _oHero.removeAllChildren();
        if(_oTalkTimeout !== null){
            clearTimeout(_oTalkTimeout);
            _oTalkTimeout = null;
        }
        this.setVisible(true);
        _oHero.rotation = 0;
    };
    
    this.talk = function(){
        
        this._resetAnim();
  
        _bVisible = true;
        _oHero.addChild(_oTalkAnim);
        this._playTalk();
        
    };
    
    this._playTalk = function(){
        
        _oTalkAnim.gotoAndPlay("anim0");
        
        var iPauseDuration = 500 + Math.random()*4000;
        _oTalkTimeout = setTimeout(function(){_oParent._playTalk();}, iPauseDuration);
        
    };
    
    this.smile = function(){ 
        this._resetAnim();
        
        _bVisible = true;
        _oHero.addChild(_oSmile);
    };

    this.pause = function(){
        this._resetAnim();
        
        _bVisible = true;
        _oHero.addChild(_oTalkAnim);
        _oTalkAnim.gotoAndStop("anim1");
    };

    this.randomExultation = function(iType){

        if(iType === CHEF_AUDIO_STEP_0){
            var iRandomSound = 1 + Math.floor(Math.random()*3);
            playSound("chef_exultation_"+iRandomSound, 1, false);
        }else {
            playSound("chef_exultation_4", 1, false);
        }
        
       
        //FRAME TYPE
        var iRandFrame = Math.random();
        if(iRandFrame < 0.5){
            this._attachWin1();
        } else {
            this._attachWin2();
        }
        
        //MOVE TYPE
        var iRandMove = Math.random();
        if(iRandMove < 0.33){ 
            this._playExultation1();
        } else if(iRandMove >= 0.33 && iRandMove < 0.66){
            
            this._playExultation2();
            
        } else {
            this._playExultation3();
        }
    };

    this._attachWin1 = function(){ 
        this._resetAnim();
  
        _bVisible = true;
        _oHero.addChild(_oWin1);
    };
    
    this._attachWin2 = function(){ 
        this._resetAnim();
  
        _bVisible = true;
        _oHero.addChild(_oWin2);
    };
    
    this._playExultation1 = function(){
        var iOffsetMaxWidth = 300;        
        var iRandomStartX = -iOffsetMaxWidth/2 + Math.random()*iOffsetMaxWidth;
        var iRandomEndX;
        
        var iRandomPositionX = Math.random();
        if(iRandomPositionX < 0.5){
            _oHero.x = CANVAS_WIDTH + iRandomStartX;
            iRandomEndX = -iOffsetMaxWidth/2 + Math.random()*iOffsetMaxWidth;
        } else {
            _oHero.x = iRandomStartX;
            iRandomEndX = CANVAS_WIDTH -iOffsetMaxWidth/2 + Math.random()*iOffsetMaxWidth;
        }   
        _oHero.y = CANVAS_HEIGHT;
        
        createjs.Tween.get(_oHero).to({x:iRandomEndX},1500, createjs.Ease.linear);
        createjs.Tween.get(_oHero).to({y: CANVAS_HEIGHT/2 + 200},750, createjs.Ease.cubicOut).to({y: CANVAS_HEIGHT},750, createjs.Ease.cubicIn).call(function(){_oParent.setVisible(false);});        
    };
    
    
    this._playExultation2 = function(){
        var iOffsetMaxWidth = 200;        
        var iRandomStartX = -iOffsetMaxWidth/2 + Math.random()*iOffsetMaxWidth;
        var iRandomEndX = -iOffsetMaxWidth/2 + Math.random()*iOffsetMaxWidth;
        
        _oHero.x = CANVAS_WIDTH/2 + iRandomStartX;    
        _oHero.y = CANVAS_HEIGHT;
        
        createjs.Tween.get(_oHero).to({x: CANVAS_WIDTH/2 + iRandomEndX},1500, createjs.Ease.linear);//.to({x: CANVAS_WIDTH/2 + iRandomEndX},750, createjs.Ease.linear);
        createjs.Tween.get(_oHero).to({y: CANVAS_HEIGHT/2 + 200},750, createjs.Ease.cubicOut).to({y: CANVAS_HEIGHT},750, createjs.Ease.cubicIn).call(function(){_oParent.setVisible(false);});
        
    };
    
    this._playExultation3 = function(){
        
        var iRandomPositionX = Math.random();
        var iStartX;
        var iEndX;
        if(iRandomPositionX < 0.5){
            iStartX = CANVAS_WIDTH + 300;
            iEndX = CANVAS_WIDTH - 200;
        } else {
            iStartX = -300;
            iEndX = 200;
        }
        _oHero.x = iStartX;
        
        var iStartY = CANVAS_HEIGHT - (600 + Math.random()*(CANVAS_HEIGHT/4));
        _oHero.y = iStartY;
        
        var iMaxWidthY = 350;
        var iEndY = _oHero.y - Math.random()*iMaxWidthY;
        
        var iLength = Math.sqrt( Math.pow(iEndX - iStartX,2) + Math.pow(iEndY - iStartY,2) );
        var iAngle = (Math.acos((iEndX - iStartX)/iLength) * 180)/Math.PI;
        
        _oHero.rotation = -iAngle + 90;

        createjs.Tween.get(_oHero).to({x: iEndX, y: iEndY},500, createjs.Ease.cubicIn).wait(750).to({x: iStartX, y: iStartY},500, createjs.Ease.cubicOut).call(function(){_oParent.setVisible(false);});
    };
    
    this.levelFail = function(){ 
        this._resetAnim();

        playSound("chef_failed", 1, false);
  
        _bVisible = true;
        _oHero.addChild(_oFail);
        
        this._playExultation2();
    };
    
    this.levelWin = function(){ 
        this._resetAnim();

        playSound("chef_well_done", 1, false);
  
        _bVisible = true;
        _oHero.addChild(_oWin2);
        _oHero.x = -400;
        
        createjs.Tween.get(_oHero).to({x: iX},_iTimeSpawn, createjs.Ease.cubicIn);
    };
    
    this.helpPointSide = function(){
      
        this._resetAnim();
  
        _bVisible = true;
        _oHero.addChild(_oHelpPointSide);
        _oHero.rotation = 45;

        _oHero.x = -500;
        createjs.Tween.get(_oHero).to({x:iX},300, createjs.Ease.cubicIn);
        
        _oHelpPointBottom.gotoAndPlay(0);
    };
    
    this.helpPointBottom = function(){
      
        this._resetAnim();
  
        _bVisible = true;
        _oHero.addChild(_oHelpPointBottom);
        _oHero.rotation = -45;

        _oHero.y = CANVAS_HEIGHT +500;
        createjs.Tween.get(_oHero).to({y:iY},_iTimeSpawn, createjs.Ease.cubicIn);
        _oHelpPointBottom.gotoAndPlay(0);
    };
    
    this.helpPointStand = function(){
      
        this._resetAnim();
  
        _bVisible = true;
        _oHero.addChild(_oHelpPointBottom);


        _oHero.y = CANVAS_HEIGHT +500;
        createjs.Tween.get(_oHero).to({y:iY},_iTimeSpawn, createjs.Ease.cubicIn);
        _oHelpPointBottom.gotoAndPlay(0);
    };
    
    this.helpPointRight = function(){
      
        this._resetAnim();
  
        _bVisible = true;
        _oHero.addChild(_oHelpPointBottom);
        _oHero.rotation = -90;

        _oHero.x = CANVAS_WIDTH +500;
        createjs.Tween.get(_oHero).to({x:iX},_iTimeSpawn, createjs.Ease.cubicIn);
        _oHelpPointBottom.gotoAndPlay(0);
    };
    
    this.endPanelAnim = function(){
      
        this._resetAnim();
  
        _bVisible = true;
        _oHero.addChild(_oWin2);
        
        _oHero.x = -200;
        
        
        this._shiftRight();
        this._jump();
        
    };
    
    this._shiftRight = function(){
        
        var iRandSound = Math.floor(1 + Math.random()*5);
        
        playSound("chef_exultation_"+iRandSound, 1, false);
        
        createjs.Tween.get(_oHero).to({x:CANVAS_WIDTH-100},8000).call(function(){                                                                                                
            _oParent._shiftLeft();
        });
    };
    
    this._shiftLeft = function(){
        
        var iRandSound = Math.floor(1 + Math.random()*5);

        playSound("chef_exultation_"+iRandSound, 1, false);
       
       
        createjs.Tween.get(_oHero).to({x:100},8000).call(function(){                                                                                                
            _oParent._shiftRight();
        });
    };

    this._jump = function(){
        var iJump = iY + Math.random()*50 + 100;
        createjs.Tween.get(_oHero).to({y:iJump},350, createjs.Ease.quadIn).to({y:iY},350, createjs.Ease.quadOut).call(function(){_oParent._jump();});
    };

    _oParent = this;
    this._init(iX, iY, oParentContainer);
}