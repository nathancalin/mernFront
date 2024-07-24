function CLevelButton(iXPos,iYPos, iNum, oParentContainer){
    
    var _bText;
    var _bActive;
    
    var _iWidth;
    var _iHeight;
    
    var _aParams = [];
    
    var _aCbCompleted;
    var _aCbOwner;
    var _oListenerDown;
    var _oListenerUp;
    var _oListenerOver;
    var _oListenerOut;
    
    var _oButton;
    var _oImage;
    var _oText;
    var _oNum;
    var _oTarget;
    var _oLock;
    var _oStar;
    var _oParent;
    
    this._init =function(iXPos,iYPos,iNum, oParentContainer){
        
        _bActive = true;
        _bText = false;
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        
        _oButton = new createjs.Container();
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
        
        var oSprite = s_oSpriteLibrary.getSprite('level_button');
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                        animations: {state_active:[0],state_disabled:[1]}
                   };
                   
         var oSpriteSheet = new createjs.SpriteSheet(oData);
	_oImage = createSprite(oSpriteSheet, "state_active",(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);                           
        _iWidth = oSprite.width;
        _iHeight = oSprite.height;
        _oButton.addChild(_oImage);
       
        _oNum = new CFormatText(0, 0, iNum, "#ffffff", _oButton, "#000000", 40, "center");
       
        var oSprite = s_oSpriteLibrary.getSprite('lock_level');
        _oLock = createBitmap(oSprite);
        _oLock.x = 25;
        _oLock.y = 15;
        _oButton.addChild(_oLock);
       
        ///SET STARS BASED ON LEVEL SCORE
        var oSprite = s_oSpriteLibrary.getSprite('stars');
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: 99, height: 54, regX: 99/2, regY: 54/2}, 
                        animations: {stars_0:[0], stars_1:[1], stars_2:[2], stars_3:[3]}
                   };                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oStar = createSprite(oSpriteSheet, 0,99/2,54/2,99,54);
        _oStar.y = -55;
        _oStar.gotoAndStop(0);
        _oButton.addChild(_oStar);
        
        var graphics = new createjs.Graphics().beginFill("rgba(158,158,158,0.01)").
                drawRect( -_iWidth/4, -_iHeight/2, _iWidth/2, _iHeight);
        _oTarget = new createjs.Shape(graphics);
        _oButton.addChild(_oTarget);
       
        oParentContainer.addChild(_oButton);
        
        
        this._initListener();
    };
    
    this.unload = function(){
        _oButton.off("mousedown", _oListenerDown);
        _oButton.off("pressup" , _oListenerUp);
        if(!s_bMobile){
            _oButton.off("mouseover",_oListenerOver);
            _oButton.off("mouseout", _oListenerOut);
        }
       
       createjs.Tween.removeTweens(_oButton);
       
       oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this._initListener = function(){
        _oListenerDown = _oButton.on("mousedown", this.buttonDown);
        _oListenerUp = _oButton.on("pressup" , this.buttonRelease);
            
        if(!s_bMobile){
            _oListenerOver = _oButton.on("mouseover", this.buttonOver);
            _oListenerOut = _oButton.on("mouseout", this.buttonOut);
        }     
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.addEventListenerWithParams = function(iEvent,cbCompleted, cbOwner,aParams){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner;
        _aParams = aParams;
    };
    
    this.addShadow = function(iX, iY, iGlow){
        _oButton.shadow = new createjs.Shadow("rgba(100,100,100,0.4)", iX, iY, iGlow);
    };
    
    this.buttonRelease = function(){
        
        if(_bActive){
            if(_aCbCompleted[ON_MOUSE_UP]){
                _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_aParams);
            }
        }
    };
    
    this.buttonOver = function(evt){

        if(_bActive){
            
            evt.target.cursor = "pointer";
            
            if(!s_bMobile){
                playSound("click", 1, false);
            }
            _oButton.scaleX = 1.1;
            _oButton.scaleY = 1.1;
        }

        if(_bText){
            _oText.setVisible(true);
        }
        
    };
    
    this.buttonOut = function(){
        if(_bActive){
            _oButton.scaleX = 1;
            _oButton.scaleY = 1;
        }   
        
        if(_bText){
            _oText.setVisible(false);
        }
        
    };
    
    this.buttonDown = function(){
       if(_bActive){
           if(_aCbCompleted[ON_MOUSE_DOWN]){
                _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN],_aParams);
            }
            
            if(s_bMobile){
                playSound("click", 1, false);
            }
       } 
       
    };
    
    this.addTextOn = function(szText, szType){
        _bText = true;
        if(szType === "left"){
            _oText = new CFormatText(-_iWidth/4, -_iHeight/2 - 10, szText, "#ffe400", _oButton, "#ac5124", 30, "left");
        } else if(szType === "center"){
            _oText = new CFormatText(0, -_iHeight/2 - 10, szText, "#ffe400", _oButton, "#ac5124", 30, "center");
        } else if(szType === "bottom"){
            _oText = new CFormatText(0, -_iHeight/2 + 100, szText, "#ffe400", _oButton, "#ac5124", 30, "center");
        }
        
        _oText.setVisible(false);
        
    };
    
    this.setStars = function(iScore){
        if(_bActive){
            if(iScore === 0){
                _oStar.gotoAndStop(0);
            } else if(iScore >= BEST_SCORE_LIMIT[iNum]){
                _oStar.gotoAndStop(3);
            } else if(iScore > BEST_SCORE_LIMIT[iNum]*0.7 && iScore < BEST_SCORE_LIMIT[iNum]){//////RANK 2
                _oStar.gotoAndStop(2);
            } else {
                _oStar.gotoAndStop(1);
            }
        } else {
            _oStar.visible = false;
        }
        
    };
    
    this.setActive = function(bVal){
        _bActive = bVal;
        _oLock.visible = !bVal;
        if(bVal){
            _oImage.gotoAndStop("state_active");
        } else {
            _oImage.gotoAndStop("state_disabled");
        }        
    };
    
    this.pulseAnimation = function () {
        createjs.Tween.get(_oButton, {loop: true}).to({scaleX: 1.1, scaleY: 1.1}, 850, createjs.Ease.quadOut).to({scaleX: 1, scaleY: 1}, 650, createjs.Ease.quadIn);
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setX = function(iXPos){
         _oButton.x = iXPos;
    };
    
    this.setY = function(iYPos){
         _oButton.y = iYPos;
    };
    
    this.getButtonImage = function(){
        return _oButton;
    };
    
    
    this.getX = function(){
        return _oButton.x;
    };
    
    this.getY = function(){
        return _oButton.y;
    };
    
    this.setForInfo = function(){
        _oStar.visible = false;
        _bActive = false;
        _oLock.visible = false;
        _oImage.gotoAndStop("state_active");
    };

    this._init(iXPos,iYPos,iNum, oParentContainer);
    
    _oParent = this;
    return this;
}