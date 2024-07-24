function CHelpPanel(){
    
    var _iTimeAlphaBG;

    var _oImage = null;
    var _oFace = null;
    var _oHero = null;
    var _oComic = null;

    var _oHelpBg;
    var _oParent;

    this._init = function(){
        
        _iTimeAlphaBG = 300;
        
        if(!s_aHelpPanelEnabled[s_iCurLevel]){
            s_oGame.onExitHelp();
            return;
        }
       
        var graphics = new createjs.Graphics().beginFill("rgba(0,0,0,0.7)").drawRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
        _oHelpBg = new createjs.Shape(graphics);
        _oHelpBg.alpha = 0;
        _oHelpBg.on("click", function(){_oParent._onExitHelp();});
        s_oStage.addChild(_oHelpBg);

        var iNumChangingFace = CONFIG[s_iCurLevel].numfaces -1;
        var oSprite = s_oSpriteLibrary.getSprite('sushi');
        var oData = {   
                        images: [oSprite], 
                        // width, height & registration point of each sprite
                        frames: {width: CELL_SIZE, height: CELL_SIZE, regX: CELL_SIZE/2, regY: CELL_SIZE/2}, 
                        animations: {type_0:[0], type_1:[1], type_2:[2], type_3:[3], type_4:[4], type_5:[5], type_6:[6], type_7:[7], star:[8], bomb:[9], clock:[10], changing:[0,iNumChangingFace,"changing",0.150]}
                   };
                   
        var oSpriteSheet = new createjs.SpriteSheet(oData);
        
  
        switch(s_iCurLevel){
            
            case 1: {
                    
                    _oFace = createSprite(oSpriteSheet, "type_1",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
                    _oFace.x = 170;
                    _oFace.y = 1500;
                    _oFace.scaleX = _oFace.scaleY = 0.75;
                    
                    createjs.Tween.get(_oHelpBg).to({alpha:1}, _iTimeAlphaBG).call(function(){
                        _oHero = new CHero(150, 1150, s_oStage);
                        _oHero.helpPointSide();
                    }).wait(500).call(function(){_oComic = new CComic(600, 1200, s_oStage, TEXT_HELP1); s_oStage.addChild(_oFace);});
                    
                    
                    break;
            }
            case 3: {

                    var oSprite = s_oSpriteLibrary.getSprite('bg_help_3');
                    _oHelpBg = createBitmap(oSprite);
                    _oHelpBg.on("click", function(){_oParent._onExitHelp();});
                    s_oStage.addChild(_oHelpBg);
                    
                    _oHero = new CHero(300, 820, s_oStage);
                    _oHero.talk();
                    
                    _oComic = new CComic(600, 820, s_oStage, TEXT_HELP3);
                    
                    break;
            }
            case 5: {
                    
                    _oFace = createSprite(oSpriteSheet, "type_3",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
                    _oFace.x = 170;
                    _oFace.y = 1500;
                    _oFace.scaleX = _oFace.scaleY = 0.75;
                    
                    createjs.Tween.get(_oHelpBg).to({alpha:1}, _iTimeAlphaBG).call(function(){
                        _oHero = new CHero(150, 1150, s_oStage);
                        _oHero.helpPointSide();
                    }).wait(500).call(function(){_oComic = new CComic(600, 1200, s_oStage, TEXT_HELP5); s_oStage.addChild(_oFace);});
                    
                    break;
            }
            case 8: {
                    
                    var oSprite = s_oSpriteLibrary.getSprite('block');
                    _oFace = createBitmap(oSprite);
                    _oFace.regX = oSprite.width/2 ;
                    _oFace.regY = oSprite.height/2;
                    _oFace.x = 370+CELL_SIZE;
                    _oFace.y = 1500;
                    _oFace.scaleX = _oFace.scaleY = 0.75;
                    
                    createjs.Tween.get(_oHelpBg).to({alpha:1}, _iTimeAlphaBG).call(function(){
                        _oHero = new CHero(900, 1600, s_oStage);
                        _oHero.helpPointBottom();
                    }).wait(500).call(function(){_oComic = new CComic(500, 1300, s_oStage, TEXT_HELP8); _oComic.flip(); s_oStage.addChild(_oFace);});
                    
                    break;
            }
            case 11: {
                    
                    _oFace = createSprite(oSpriteSheet, "clock",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
                    _oFace.x = CANVAS_WIDTH/2;
                    _oFace.y = CANVAS_HEIGHT/2 - 40;
                    
                    createjs.Tween.get(_oHelpBg).to({alpha:1}, _iTimeAlphaBG).call(function(){
                        _oHero = new CHero(750, 1300, s_oStage);
                        _oHero.helpPointStand();
                    }).wait(500).call(function(){_oComic = new CComic(300, 1200, s_oStage, TEXT_HELP11); _oComic.flip(); s_oStage.addChild(_oFace);});
                    
                    break;
            }
            case 13: {
                    
                    _oFace = createSprite(oSpriteSheet, "type_4",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
                    _oFace.x = 170;
                    _oFace.y = 1500;
                    _oFace.scaleX = _oFace.scaleY = 0.75;
                    
                    createjs.Tween.get(_oHelpBg).to({alpha:1}, _iTimeAlphaBG).call(function(){
                        _oHero = new CHero(150, 1150, s_oStage);
                        _oHero.helpPointSide();
                    }).wait(500).call(function(){_oComic = new CComic(600, 1100, s_oStage, TEXT_HELP13); s_oStage.addChild(_oFace);});
                    
                    break;
            }
            case 15: {
                    
                    _oFace = createSprite(oSpriteSheet, "changing",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
                    _oFace.x = CANVAS_WIDTH/2 +CELL_SIZE*3/2;
                    _oFace.y = CANVAS_HEIGHT/2 - CELL_SIZE*5/2 - 40;
                    s_oStage.addChild(_oFace);
                    
                    createjs.Tween.get(_oHelpBg).to({alpha:1}, _iTimeAlphaBG).call(function(){
                        _oHero = new CHero(1050, 500, s_oStage);
                        _oHero.helpPointRight();
                    }).wait(500).call(function(){_oComic = new CComic(650, 450, s_oStage, TEXT_HELP15); _oComic.flip();});
                    
                    break;
            }
            case 17: {
                    var oSprite = s_oSpriteLibrary.getSprite('bg_help_17');
                    _oHelpBg = createBitmap(oSprite);
                    _oHelpBg.on("click", function(){_oParent._onExitHelp();});
                    s_oStage.addChild(_oHelpBg);
                    
                    _oHero = new CHero(300, 820, s_oStage);
                    _oHero.talk();
                    
                    _oComic = new CComic(600, 820, s_oStage, TEXT_HELP17);
                    
                    break;
            }
            case 19: {
                    
                    var oSprite = s_oSpriteLibrary.getSprite('trap');
                    _oFace = createBitmap(oSprite);
                    _oFace.regX = oSprite.width/2 ;
                    _oFace.regY = oSprite.height/2;
                    _oFace.x = CANVAS_WIDTH/2 +CELL_SIZE*3/2;
                    _oFace.y = CANVAS_HEIGHT/2 - 40;
                    
                    createjs.Tween.get(_oHelpBg).to({alpha:1}, _iTimeAlphaBG).call(function(){
                        _oHero = new CHero(900, 1300, s_oStage); 
                        _oHero.helpPointStand();
                    }).wait(500).call(function(){_oComic = new CComic(450, 1200, s_oStage, TEXT_HELP19); _oComic.flip(); s_oStage.addChild(_oFace);});
                    
                    break;
            }
            case 22: {
                    
                    _oFace = createSprite(oSpriteSheet, "type_5",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
                    _oFace.x = 170;
                    _oFace.y = 1500;
                    _oFace.scaleX = _oFace.scaleY = 0.75;
                    
                    createjs.Tween.get(_oHelpBg).to({alpha:1}, _iTimeAlphaBG).call(function(){
                        _oHero = new CHero(150, 1150, s_oStage);
                        _oHero.helpPointSide();
                    }).wait(500).call(function(){_oComic = new CComic(600, 1100, s_oStage, TEXT_HELP22); s_oStage.addChild(_oFace);});
                    
                    break;
            }
            
            default: {
                    
                    s_oGame.onExitHelp();
                    s_oStage.removeChild(_oHelpBg);
                    return;
            }
            
        }

    };

    this.unload = function(){
        createjs.Tween.removeAllTweens();
        
        if(_oHero !== null){
            _oHero.unload();
            _oHero = null;
        }
        
        if(_oComic !== null){
            _oComic.unload();
            _oComic = null;
        }
        
        if(_oFace !== null){
            s_oStage.removeChild(_oFace);
            _oFace = null;
        }
        
        if(_oImage !== null){
            s_oStage.removeChild(_oImage);
            _oImage = null;
        }
        
        _oHelpBg.off("click", function(){_oParent._onExitHelp();});
        s_oStage.removeChild(_oHelpBg);
        
    };

    this._onExitHelp = function(){
        _oParent.unload();
        s_oGame.onExitHelp();
    };

    this._onButContinueRelease = function(){
        this.unload();
        s_oGame.onExitHelp();
    };

    _oParent=this;
    this._init();

}
