function CFormatText (iX, iY, szText, szColor, oParentContainer, szGlow, iSize, szAlign = "left", szFont = PRIMARY_FONT, iHeight = null, iWidth = null, bMultiLine = false){
    
    var _szText;
    
    var _oTextOutline;
    var _oText;
    var _oTextContainer;
    
    var _oSlideText;
    
    var _oParent;
    
    this._init = function(iX, iY, szText, szColor, oParentContainer, szGlow, iSize, szAlign, szFont, iHeight, iWidth, bMultiLine){    
        
        _szText = szText;
        
        _oTextContainer = new createjs.Container();
        _oTextContainer.x = iX;
        _oTextContainer.y = iY;
        oParentContainer.addChild(_oTextContainer);
        
        iWidth  = 700;
        iHeight = iHeight ? iHeight : iSize*1.5;
        var iXOffset = 0;
        var iYOffset = 0;
        
        switch(szAlign){
            case "center":{
                iXOffset =  -iWidth/2;
                iYOffset =  -iHeight/2;
            }break;
            case "right":{
                iXOffset =  -iWidth;
                iYOffset =  -iHeight;
            }break;       
        }
        
        _oTextOutline = new CTLText(_oTextContainer, 
                                            iXOffset, iYOffset, iWidth, iHeight, 
                                            iSize, szAlign, szGlow, szFont, 1.1,
                                            0, 0,
                                            szText,
                                            true, true, bMultiLine,
                                            false );
        _oTextOutline.setOutline(4);  
        
        _oText = new CTLText(_oTextContainer, 
                                    iXOffset, iYOffset, iWidth, iHeight, 
                                    iSize, szAlign, szColor, szFont, 1.1,
                                    0, 0,
                                    szText,
                                    true, true, bMultiLine,
                                    false );
       
    };
 
    this.unload = function(){
        oParentContainer.removeChild(_oTextContainer);
    };

    this.disableOutline = function(){
        _oTextContainer.removeChild(_oTextOutline.getText());
    };
    
    this.setVisible = function(bVal){
        _oTextContainer.visible = bVal;
    };
    
    this.isVisible = function(){
        return _oTextContainer.visible;
    };

    this.setOutline = function(iVal){
        _oTextOutline.setOutline(iVal);
    };

    this.setShadow = function(bVal){
        if(bVal) {
            _oTextOutline.setShadow("#333333", 2, 2, 6);
        }
    };

    this.setWidth = function(iWidth){
        return;
        _oTextOutline.lineWidth = iWidth;
        _oText.lineWidth = iWidth;
    };

    this.setText = function(szText){
        _oText.refreshText(szText);
        _oTextOutline.refreshText(szText);
    };

    this.setColor= function(szColor, szColorOutline){
        _oText.setColor(szColor);
        _oTextOutline.setColor (szColorOutline);
    };

    this.getText = function(){
        return _oTextContainer;
    };
    
    this.setPos = function(iY){
        _oTextContainer.y = iY;
    };
    
    this.getPos = function(){
        return {x: _oTextContainer.x,  y: _oTextContainer.y};
    };
    
    this.playText = function(){      
        
        _oSlideText = "";
        
        this.setText("");
        this._slideText(0);
        
    };
    
    this._slideText = function(iIndex){
        
        _oSlideText += szText[iIndex];
        
        this.setText(_oSlideText);
        if(iIndex < szText.length-1){
            setTimeout(function(){_oParent._slideText(iIndex+1);}, 40);
        }  
    };
    
    this.setPosition = function(iXPos,iYPos){
         _oTextContainer.x = iXPos;
         _oTextContainer.y = iYPos;
    };
    
    _oParent = this;
    
    this._init(iX, iY, szText, szColor, oParentContainer, szGlow, iSize, szAlign, szFont, iHeight, iWidth, bMultiLine);
    
}