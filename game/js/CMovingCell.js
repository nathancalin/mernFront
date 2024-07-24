function CMovingCell(iX, iY, iType, oParentContainer){
    
    var _iType;
    
    var _oFace;
    
    this._init = function(iX, iY, iType, oParentContainer){
        
        _iType = iType;
        var iNumChangingFace = CONFIG[s_iCurLevel].numfaces -1;
        var oSprite = s_oSpriteLibrary.getSprite('sushi');
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: CELL_SIZE, height: CELL_SIZE, regX: CELL_SIZE/2, regY: CELL_SIZE/2}, 
                        animations: {type_0:[0], type_1:[1], type_2:[2], type_3:[3], type_4:[4], type_5:[5], type_6:[6], type_7:[7], star:[8], bomb:[9], clock:[10], changing:[0,iNumChangingFace,"changing",0.150]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        if(_iType === TYPE_CHANGING){
             _oFace = createSprite(oSpriteSheet, "changing",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
             _oFace.gotoAndPlay("changing");
         } else {
             _oFace = createSprite(oSpriteSheet, _iType,CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
             _oFace.gotoAndStop(_iType);
         }
        _oFace.x = iX;
        _oFace.y = iY;
        oParentContainer.addChild(_oFace);
        
    };
    
    this.unload = function(){
        oParentContainer.removeChild(_oFace);
    };
    
    this.move = function(iX, iY){
        var oTween = createjs.Tween.get(_oFace).to({x:iX, y:iY}, 250, createjs.Ease.cubicIn).call(function(){ _oFace.visible = false; s_oGame.checkMatch();});
        s_oGame.getTweensGroup().push(oTween);
        
    };
    
    this.moveBack = function(){
        _oFace.visible = true;
        var oTween = createjs.Tween.get(_oFace).to({x:iX, y:iY}, 250, createjs.Ease.cubicIn).call(function(){s_oGame.returnInPosition();});
        s_oGame.getTweensGroup().push(oTween);
    };
    
    this.fall = function(iX, iY, iTimeMulti){
        var oTween = createjs.Tween.get(_oFace).to({x:iX, y:iY}, TIME_FALL*iTimeMulti, createjs.Ease.linear).call(function(){s_oGame.onFinishFall();});
        s_oGame.getTweensGroup().push(oTween);
    };
    
    this.fallStar = function(iX, iY){
        var oTween = createjs.Tween.get(_oFace).to({x:iX, y:iY}, 1200, createjs.Ease.cubicIn);
        s_oGame.getTweensGroup().push(oTween);
    };
    
    this.setVisible = function(bVal){
        _oFace.visible = bVal;        
    };
    
    this.getType = function(){
        return _iType;
    };
    
    this._init(iX, iY, iType, oParentContainer);
    
};


