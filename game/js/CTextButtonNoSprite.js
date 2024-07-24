function CTextButtonNoSprite(iX, iY, szText, szColor, oParentContainer, szGlow, iSize){
    
    var _szText;
    
    var _aCbCompleted;
    var _aCbOwner;
    var _oButton;
    var _oTarget;
    var _oText;
    var _oTextOutline;
    var _oTextBack;
    
    this._init =function(iX, iY, szText, szColor, oParentContainer, szGlow, iSize){
        
        _aCbCompleted=new Array();
        _aCbOwner =new Array();

        _szText = szText;
        
        var iDim = iSize;
        
        var szFontTag = iDim + "px";

        _oTextOutline = new createjs.Text();
        _oTextOutline.text = _szText;
        _oTextOutline.font = szFontTag+" " + PRIMARY_FONT;
        _oTextOutline.color = szGlow;
        _oTextOutline.textAlign = "center";
        _oTextOutline.textBaseline = "middle";
        _oTextOutline.lineWidth = 400;
        _oTextOutline.outline = 8;

        _oText = new createjs.Text();
        _oText.text = _szText;
        _oText.font = szFontTag+" " +PRIMARY_FONT;
        _oText.color = szColor;
        _oText.textAlign = "center";
        _oText.textBaseline = "middle";
        _oText.lineWidth = 400;

        var iOffsetY = 10;
        var graphics = new createjs.Graphics().beginFill("rgba(158,158,158,0.01)").
        drawRect( -_oTextOutline.getMeasuredWidth()/2, -_oTextOutline.getMeasuredHeight()/2 - iOffsetY, _oTextOutline.getMeasuredWidth(), _oTextOutline.getMeasuredHeight() +2*iOffsetY );
        _oTarget = new createjs.Shape(graphics);

        _oButton = new createjs.Container();
        _oButton.x = iX;
        _oButton.y = iY;
        _oButton.addChild(_oTextOutline, _oText, _oTarget);

        oParentContainer.addChild(_oButton);

        this._initListener();
    };
    
    this.unload = function(){
        if(s_bMobile){
            _oButton.off("mousedown", this.buttonDown);
            _oButton.off("pressup" , this.buttonRelease);
        } else {
            _oButton.off("mousedown", this.buttonDown);
            _oButton.off("mouseover", this.buttonOver);
            _oButton.off("mouseout", this.buttonOut);
            _oButton.off("pressup" , this.buttonRelease);
        }
       
       oParentContainer.removeChild(_oButton);
    };
    
    this.setVisible = function(bVisible){
        _oButton.visible = bVisible;
    };
    
    this._initListener = function(){

       if(s_bMobile){
            _oButton.on("mousedown", this.buttonDown);
            _oButton.on("pressup" , this.buttonRelease);
        } else {
            _oButton.on("mousedown", this.buttonDown);
            _oButton.on("mouseover", this.buttonOver);
            _oButton.on("mouseout", this.buttonOut);
            _oButton.on("pressup" , this.buttonRelease);
        }     
    };
    
    this.addEventListener = function( iEvent,cbCompleted, cbOwner ){
        _aCbCompleted[iEvent]=cbCompleted;
        _aCbOwner[iEvent] = cbOwner; 
    };
    
    this.buttonRelease = function(){

        if(_aCbCompleted[ON_MOUSE_UP]){
            _aCbCompleted[ON_MOUSE_UP].call(_aCbOwner[ON_MOUSE_UP]);
        }
    };
    
    this.buttonOver = function(evt){
        _oButton.scaleX = 1.1;
        _oButton.scaleY = 1.1;
        _oText.color = "#ffa800";
        
        if(!s_bMobile){
            
            evt.target.cursor = "pointer";
            /*
            if( (DISABLE_SOUND_MOBILE === false || s_bMobile === false) && s_bAudioActive === true){            
                s_aAudioSfx["click"] = createjs.Sound.play("click");
                s_aAudioSfx["click"].addEventListener("complete", function(){s_aAudioSfx["click"] = null;});
            }
            */
            playSound("click", 1, false);
        }
        
    };
    
    this.buttonOut = function(){
        _oButton.scaleX = 1;
        _oButton.scaleY = 1;
        _oText.color = szColor;
    };
    
    this.buttonDown = function(){
        if(s_bMobile){

            playSound("click", 1, false);
        }

       if(_aCbCompleted[ON_MOUSE_DOWN]){
           _aCbCompleted[ON_MOUSE_DOWN].call(_aCbOwner[ON_MOUSE_DOWN]);
       }
    };
    
    
    this.setTextPosition = function(iY){
        _oText.y= iY;
        _oTextBack.y = iY+2;
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oButton.x = iXPos;
         _oButton.y = iYPos;
    };
    
    this.setWidth = function(iVal){
        _oTextOutline.lineWidth = iVal;
        _oText.lineWidth = iVal;
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

    this._init(iX, iY, szText, szColor, oParentContainer, szGlow, iSize);
    
    return this;
    
}
