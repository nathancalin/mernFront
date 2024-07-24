function CCell(iX, iY, iRow, iCol, oParentContainer, iType, bBlock, bTrap){
    
    var _bToDelete;
    var _bBlock;
    var _bTrap;
    
    var _iType;
    
    var _oCellContainer;
    var _oBgChanging;
    var _oFace;
    var _oGlowFace = null;
    var _oBlock;
    var _oTrap;
    var _oTarget;
    
    this._init = function(iX, iY, iRow, iCol, oParentContainer, iType, bBlock, bTrap){
        _bToDelete = false;
        _bBlock = bBlock;
        _bTrap = bTrap;
        
        _iType = iType;
        
        _oCellContainer = new createjs.Container();
        _oCellContainer.x = iX;
        _oCellContainer.y = iY;
        if(_iType >= 0){
            oParentContainer.addChild(_oCellContainer);
        }

        var oSprite = s_oSpriteLibrary.getSprite('cell');
        var oCell = createBitmap(oSprite);
        oCell.regX = oSprite.width/2;
        oCell.regY = oSprite.height/2;
        _oCellContainer.addChild(oCell);
        
        var oSprite = s_oSpriteLibrary.getSprite('bg_symbol');
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: CELL_SIZE, height: CELL_SIZE, regX: CELL_SIZE/2, regY: CELL_SIZE/2}, 
                        animations: {type_0:[0]}
                   };                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        _oBgChanging = createSprite(oSpriteSheet, 0,CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
        _oBgChanging.gotoAndPlay(0);
        _oBgChanging.visible = false;
        _oCellContainer.addChild(_oBgChanging); 
        
        if(_bBlock){
            var oSprite = s_oSpriteLibrary.getSprite('block');            
            _oBlock = createBitmap(oSprite);
            _oBlock.regX = oSprite.width/2;
            _oBlock.regY = oSprite.height/2;
            _oCellContainer.addChild(_oBlock);
        }
        
        var iNumChangingFace = CONFIG[s_iCurLevel].numfaces -1;
        var oSprite = s_oSpriteLibrary.getSprite('sushi');
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: CELL_SIZE, height: CELL_SIZE, regX: CELL_SIZE/2, regY: CELL_SIZE/2}, 
                        animations: {type_0:[0], type_1:[1], type_2:[2], type_3:[3], type_4:[4], type_5:[5], type_6:[6], type_7:[7], star:[8], bomb:[9], clock:[10], changing:[0,iNumChangingFace,"changing",0.150]}
                   };
                   
         var oSpriteSheet = new createjs.SpriteSheet(oData);
         _oGlowFace = createSprite(oSpriteSheet, "type_7",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
         _oGlowFace.gotoAndStop("type_7");
      
         if(_iType === TYPE_CHANGING){
             _oBgChanging.visible = true;
            _oFace = createSprite(oSpriteSheet, "changing",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
            _oFace.gotoAndPlay("changing");
            _oCellContainer.addChild(_oFace);
         } else if(_iType === TYPE_STAR){            
            _oFace = createSprite(oSpriteSheet, _iType,CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
            _oFace.gotoAndStop(_iType);            
            this._glowFace(_oGlowFace);
            _oCellContainer.addChild(_oFace,_oGlowFace);
         } else {
            _oFace = createSprite(oSpriteSheet, _iType,CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
            _oFace.gotoAndStop(_iType);
            _oCellContainer.addChild(_oFace);
         }
	
        
        if(!bTrap){
            var graphics = new createjs.Graphics().beginFill("rgba(158,158,158,0.01)").drawRect(-CELL_SIZE/2, -CELL_SIZE/2, CELL_SIZE, CELL_SIZE);
            _oTarget = new createjs.Shape(graphics);
            _oTarget.on("mousedown", this._onCellClick);
            _oCellContainer.addChild(_oTarget);
        } else {
            var oSprite = s_oSpriteLibrary.getSprite('trap');            
            _oTrap = createBitmap(oSprite);
            _oTrap.regX = oSprite.width/2;
            _oTrap.regY = oSprite.height/2;

            var pPos = oParentContainer.localToGlobal(iX, iY);
            _oTrap.x = pPos.x;
            _oTrap.y = pPos.y;
            s_oStage.addChild(_oTrap);
        }
        
        
    };
    
    this.unload = function(){
        if(_iType >= 0){
            oParentContainer.removeChild(_oCellContainer);
            if(!bTrap){
                _oTarget.off("mousedown", this._onCellClick);
            }            
        }
        if(bTrap){
            s_oStage.removeChild(_oTrap);
        }        
    };
    
    this.getType = function(){
        return _iType;
    };
    
    this.setType = function(iType){
        _oBgChanging.visible = false;
        if(_iType === TYPE_STAR){
            _oCellContainer.removeChild(_oGlowFace);
        }
        
        var iPrevType = _iType;
        _iType = iType;
        
        switch(_iType){
            
            case CELL_STATE_MATCHED:{
                    if(iPrevType === TYPE_CHANGING){
                        var iChangingType = _oFace.currentFrame;

                        s_oGame.createParticle(iX, iY, iChangingType);
                    } else {

                        s_oGame.createParticle(iX, iY, iPrevType);
                    }


                    if(_bBlock){

                        playSound("wood", 1, false);

                        s_oGame.createParticle(iX, iY, TYPE_BLOCK);
                        _oBlock.visible = false;
                        _bBlock = false;
                        s_oGame.updateGoalsForBlock();
                    }

                    _oFace.gotoAndStop(_iType);
                    break;
            }
            case CELL_STATE_INVISIBLE:{
                    _oFace.gotoAndStop(_iType);
                    break;
            }
            case TYPE_CHANGING:{
                    _oBgChanging.visible = true;
                    _oFace.gotoAndPlay("changing");
                    break;
            }
            case TYPE_STAR:{
                    _oFace.gotoAndStop(_iType);
                    _oCellContainer.addChildAt(_oGlowFace,3);
                    
                    this._glowFace();
                    break;
            }
            default:{                    
                    _oFace.gotoAndStop(_iType);
                    break;
            }
        }
    };
    
    this.animHint = function(){
        var oParent = this;
        var iHintSpeed = 55;
        var iRot = 18;
        createjs.Tween.get(_oFace).to({rotation:-iRot},iHintSpeed).to({rotation:0},iHintSpeed).to({rotation:iRot},iHintSpeed).to({rotation:0},iHintSpeed).
                to({rotation:-iRot},iHintSpeed).to({rotation:0},iHintSpeed).to({rotation:iRot},iHintSpeed).to({rotation:0},iHintSpeed).wait(800).call(function(){oParent.animHint();});
    };
    
    this.stopAnimHint = function(){
        _oFace.rotation = 0;
        createjs.Tween.removeTweens(_oFace);
    };
    
    this.getToDelete = function(){
        return _bToDelete;
    };
    
    this.setToDelete = function(bVal){
        _bToDelete = bVal;
    };
    
    this.getTrap = function(){
        return _bTrap;
    };
    
    this.getPos = function(){
        return {x: iX, y: iY};
    }; 
    
    this._glowFace = function(){
        var oParent = this;
        createjs.Tween.get(_oGlowFace).to({alpha:0},1000).to({alpha:1},1000).call(function(){oParent._glowFace(_oGlowFace);});
    };
    
    this._onCellClick = function(){
        if(_iType === TYPE_CHANGING){
            var iChangedType = _oFace.currentFrame;
            s_oGame.checkCellClicked(iRow, iCol, iChangedType);
        } else {
            s_oGame.checkCellClicked(iRow, iCol, _iType);
        }
    };
    
    this._init(iX, iY, iRow, iCol, oParentContainer, iType, bBlock, bTrap);

}



