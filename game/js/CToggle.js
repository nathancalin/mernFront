function CToggle(iXPos,iYPos,oSprite,bActive, oParentContainer){
    var _bActive;
    var _bScale;
    
    var _aCbCompleted;
    var _aCbOwner;
    var _oListenerDown;
    var _oListenerUp;
    var _oListenerOver;
    var _oListenerOut;
    
    var _oButton;
    
    this._init = function(iXPos,iYPos,oSprite,bActive, oParentContainer){
        _aCbCompleted=new Array();
        _aCbOwner =new Array();
        _bScale = true;
        
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: oSprite.width/2, height: oSprite.height, regX: (oSprite.width/2)/2, regY: oSprite.height/2}, 
                        animations: {state_true:[0],state_false:[1]}
                   };
                   
         var oSpriteSheet = new createjs.SpriteSheet(oData);
         
        _bActive = bActive;
	_oButton = createSprite(oSpriteSheet, "state_"+_bActive,(oSprite.width/2)/2,oSprite.height/2,oSprite.width/2,oSprite.height);
         
        _oButton.x = iXPos;
        _oButton.y = iYPos; 
        _oButton.stop();
        
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
	   
       oParentContainer.removeChild(_oButton);
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
    
    this.setActive = function(bActive){
        _bActive = bActive;
        _oButton.gotoAndStop("state_"+_bActive);
    };
    
    this.buttonRelease = function(){
        

        _oButton.scaleX = 1;
        _oButton.scaleY = 1;

        
        _bActive = !_bActive;
         if(!s_bMobile){
             _oButton.gotoAndStop("state_"+_bActive);
         }else{
             _oButton.gotoAndStop("state_"+_bActive);
         }
        

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP],_bActive);
        }
    };
    
    this.buttonOver = function(evt){
        
        
        
        if(!s_bMobile){
            
            evt.target.cursor = "pointer";
            /*
            if( (DISABLE_SOUND_MOBILE === false || s_bMobile === false) && s_bAudioActive === true){            
                s_aAudioSfx["click"] = createjs.Sound.play("click");
                s_aAudioSfx["click"].addEventListener("complete", function(){s_aAudioSfx["click"] = null;});
            }
            */
            playSound("click", 1, false);
            
            if(_bScale){
                _oButton.scaleX = 0.9;
                _oButton.scaleY = 0.9;
            }
            
            _oButton.gotoAndStop("state_"+_bActive);    
        }else{
            _oButton.gotoAndStop("state_"+_bActive);
        }
        
    };
    
    this.buttonOut = function(){
        
        if(_bScale){
            _oButton.scaleX = 1;
            _oButton.scaleY = 1;
        }

       _oButton.gotoAndStop("state_"+_bActive);    
    };
    
    this.buttonDown = function(){
        

        _oButton.scaleX = 0.9;
        _oButton.scaleY = 0.9;

        
        if(s_bMobile){

            playSound("click", 1, false);
        }
       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setScaleOn = function(bVal){
        _bScale = bVal;
    };
    
    this._init(iXPos,iYPos,oSprite,bActive, oParentContainer);
}