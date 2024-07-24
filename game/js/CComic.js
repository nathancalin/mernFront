function CComic(iX, iY, oParentContainer, szText){
    
    var _oBalloon;
    var _oText;
    
    this._init = function(iX, iY, oParentContainer, szText){
        
        var oSprite = s_oSpriteLibrary.getSprite('balloon_1');
        _oBalloon = createBitmap(oSprite);
        _oBalloon.regX = oSprite.width/2;
        _oBalloon.regY = oSprite.height/2;
        _oBalloon.x = iX;
        _oBalloon.y = iY;
        oParentContainer.addChild(_oBalloon);
        
        _oText = new CFormatText(iX-145, iY-135, szText, "#000000", oParentContainer, "#ff0000", 26, "left", SECONDARY_FONT, 240);
        _oText.disableOutline();
        _oText.playText();
        
    };
    
    this.unload = function(){
      
        oParentContainer.removeChild(_oBalloon);
        
        _oText.unload();
        
    };
    
    this.flip = function(){
        _oBalloon.scaleX = _oBalloon.scaleY = -1;

        _oText.setPosition(iX-180,iY-80);
    };
    
    this._init(iX, iY, oParentContainer, szText);
}