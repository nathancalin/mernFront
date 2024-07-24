function CGame(oData, iLevel){
    var _bTouchActive;
    var _bBlock;
    var _bInitGame;
    var _bTimeSpawn;
    var _bChangingFaceSpawn;
    var _bClockSoundPlayed;
    var _bHeroStep2;
    var _bTremble = false;
    var _bAlternateTremble = false;
    var _bStartHintTimer = false;
    var _iHintTimer;
    var _bStopParticle = false;
    var _bEndGame = false;
    
    var _aGoals;
    var _aCheckGoals;
    var _aGrid;
    var _aFacesToDestroy;
    var _aStarPosition;
    var _aColToReplace;
    var _aFacesToFall;
    var _aHorizontalMatch;
    var _aVerticalMatch;
    var _aParticle;
    var _aGridSwapInfo;
    var _aHintArray;
    
    var _iNumFaces;
    var _iCountBomb;
    var _iCountStar;
    var _iCountStarOnStage;
    var _iCountBomb;
    var _iScore;
    var _iTimeBonusScore;
    var _iSwappedCount;
    var _iMaxCol;
    var _iMaxRow;
    var _iTypeToSwap1;
    var _iTypeToSwap2;
    var _iFallCount;
    var _iTimeElaps;
    var _iTimeTimer;
    var _iChangingFaceTimer;
    var _iGridOffset;
    var _iHeroSpawnCounter;
    var _iTimeResetHeroCounter;
    var _iIdInterval;
    var _iCurTrembleIndex = 0;

    var _oGridContainer;
    var _oParticleContainer;
    var _oPanelContainer;
    var _oCellSelected;
    var _oCellToSwap;
    var _oTarget;
    var _oHero;
    var _oPickRandomHint = null;
    
    var _oInterface;
    var _oEndPanel = null;
    var _oParent;
    var _oHammer;
    var _aTweensGroupToPause;
    
    this._init = function(){
        
        _bTouchActive=false;
        _bInitGame=false;
        _bTimeSpawn=false;
        _bChangingFaceSpawn=false;
        _bClockSoundPlayed = false;
        _bHeroStep2 = false;
        _bStopParticle = false;
        _bEndGame = false;
        
        _iScore=0;
        _iSwappedCount = 0;
        _iFallCount = 0;
        _iNumFaces = CONFIG[iLevel].numfaces;
        _iCountStar = 0;
        _iCountBomb = 0;
        _iCountStarOnStage = 0;
        _iCountBomb = 0;
        _iTimeElaps = CONFIG[iLevel].time + 1000;
        _iTimeTimer = TIMER_CLOCK_SPAWN[iLevel];
        _iChangingFaceTimer = TIMER_CHANGING;
        _iHeroSpawnCounter = 0;
        _iTimeResetHeroCounter = 0;
        _iHintTimer = 0;

        setVolume("soundtrack", SOUNDTRACK_VOLUME_IN_GAME);

        _aParticle = new Array();

        _aStarPosition = new Array();
        _aCheckGoals = new Array();
        for(var i=0; i<13; i++){
            _aCheckGoals[i] = false;
        }
        //SET TRUE VOID GOALS FOR FUTURE IMPLEMENTATION
        _aCheckGoals[9] = true;
        _aCheckGoals[10] = true;
        _aCheckGoals[11] = true;
        //////////////////////////////////////////        
        if(GOALS[iLevel].block === 0){
            _aCheckGoals[TYPE_BLOCK] = true;
        }
        
        _oCellSelected = null;
        
        var _oBg = createBitmap(s_oSpriteLibrary.getSprite('bg_game_'+BACKGROUND[iLevel]));
        s_oStage.addChild(_oBg);//Draws on canvas      
        
        _iGridOffset = 40;
        
        _oGridContainer = new createjs.Container();
        _oGridContainer.x = CANVAS_WIDTH/2;
        _oGridContainer.y = CANVAS_HEIGHT/2 - _iGridOffset;
        s_oStage.addChild(_oGridContainer);
        
        _oParticleContainer = new createjs.Container();
        _oParticleContainer.x = CANVAS_WIDTH/2;
        _oParticleContainer.y = CANVAS_HEIGHT/2 - _iGridOffset;
        s_oStage.addChild(_oParticleContainer);
        
        _iMaxCol = LEVEL_MATRIX[iLevel][0].length;
        _iMaxRow = LEVEL_MATRIX[iLevel].length;
    
        this._buildLevel();
        
        var oSprite = s_oSpriteLibrary.getSprite('target');
        _oTarget = createBitmap(oSprite);
        _oTarget.regX = oSprite.width/2;
        _oTarget.regY = oSprite.height/2;
        _oTarget.visible = false;
        _oGridContainer.addChild(_oTarget);
    
        this.initialMatch();

        _bBlock = false;
        
        _aGoals = new Array();
        var iNumGoals = 13;
        for(var i=0; i<iNumGoals; i++){
            _aGoals[i] = 0;
        }
        
        _oHero = new CHero(0,0,s_oStage);
  
        _oInterface = new CInterface(iLevel);
        _oPanelContainer = _oInterface.getPanelContainer();
        _oInterface.refreshTime(_iTimeElaps -1000, 1);
        new CHelpPanel();
        
        if(s_bMobile){
            this._initHammer();
        }
        _aTweensGroupToPause = new Array();
    };
    
    this._initHammer = function(){
       _oHammer = new Hammer(s_oCanvas);
       _oHammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
       _oHammer.get('swipe').set({ velocity: 0.005});
       _oHammer.get('swipe').set({ threshold: 0.1 });

       
       _oHammer.on("swipeleft",function(){_oParent._swipeControl("left");});
       _oHammer.on("swiperight",function(){_oParent._swipeControl("right");});
       _oHammer.on("swipeup",function(){_oParent._swipeControl("up");});
       _oHammer.on("swipedown",function(){_oParent._swipeControl("down");});
    };
    
    this._swipeControl = function(szType){
        
        if(_oCellSelected === null || _bBlock){
            return;
        }
        _bBlock = true;
        switch(szType) {
            case "left":{   
                    if(_oCellSelected.col === 0 || _aGrid[_oCellSelected.row][_oCellSelected.col-1].getType() === CELL_STATE_DISABLE || 
                            _aGrid[_oCellSelected.row][_oCellSelected.col-1].getType() === TYPE_BOMB || _aGrid[_oCellSelected.row][_oCellSelected.col-1].getType() === TYPE_CHANGING ||
                                _aGrid[_oCellSelected.row][_oCellSelected.col-1].getTrap()){
                       _bBlock = false;
                       return;
                    }
                   _oCellToSwap = {row: _oCellSelected.row, col: _oCellSelected.col-1, cell: null};
                   
                
                break;
            }
            case "right":{                    
                    if(_oCellSelected.col === _iMaxCol-1 || _aGrid[_oCellSelected.row][_oCellSelected.col+1].getType() === CELL_STATE_DISABLE ||
                            _aGrid[_oCellSelected.row][_oCellSelected.col+1].getType() === TYPE_BOMB || _aGrid[_oCellSelected.row][_oCellSelected.col+1].getType() === TYPE_CHANGING ||
                                _aGrid[_oCellSelected.row][_oCellSelected.col+1].getTrap()){
                       _bBlock = false;
                       return;
                    }
                    _oCellToSwap = {row: _oCellSelected.row, col: _oCellSelected.col +1, cell: null};
                
                break;
            }
            case "up":{
                    if(_oCellSelected.row === 0 || _aGrid[_oCellSelected.row-1][_oCellSelected.col].getType() === CELL_STATE_DISABLE ||
                            _aGrid[_oCellSelected.row-1][_oCellSelected.col].getType() === TYPE_BOMB || _aGrid[_oCellSelected.row-1][_oCellSelected.col].getType() === TYPE_CHANGING ||
                                _aGrid[_oCellSelected.row-1][_oCellSelected.col].getTrap()){
                       _bBlock = false;
                       return;
                    }
                    _oCellToSwap = {row: _oCellSelected.row -1, col: _oCellSelected.col, cell: null};
                
                break;
            }
            case "down":{
                    if(_oCellSelected.row === _iMaxRow -1 || _aGrid[_oCellSelected.row+1][_oCellSelected.col].getType() === CELL_STATE_DISABLE ||
                            _aGrid[_oCellSelected.row+1][_oCellSelected.col].getType() === TYPE_BOMB || _aGrid[_oCellSelected.row+1][_oCellSelected.col].getType() === TYPE_CHANGING ||
                                _aGrid[_oCellSelected.row+1][_oCellSelected.col].getTrap()){
                       _bBlock = false;
                       return;
                    }
                    _oCellToSwap = {row: _oCellSelected.row +1, col: _oCellSelected.col, cell: null};
                
                break;
            }
        }    
        
        this._swapFaces();
        
    };  
    
    this._createRandomFace = function(){
        
        var iType = Math.floor(Math.random()*_iNumFaces);
        if(_iCountStarOnStage === 0 && _iCountStar < GOALS[iLevel].star && CONFIG[iLevel].starallowed){
            //Spawn Star
            if (Math.round(Math.random() * 10) < 2){
                    _iCountStar++;
                    _iCountStarOnStage++;
                    iType = TYPE_STAR;
                }
        }
        
        if (CONFIG[iLevel].bomballowed){
            
            if (_iCountBomb > 20){
                _iCountBomb = 0;
                iType = TYPE_BOMB;
            }
        }
        
        if (CONFIG[iLevel].clockallowed && _bTimeSpawn){
            
            var iTimeRemaining = _iTimeElaps/1000;
            var iProb = Math.random();

            if (iTimeRemaining < 15){
                //This means 3,33% of timer face prob
                iProb = iProb * 33;
            } else if (iTimeRemaining < 30){
                //This means 1,25% of timer face prob
                iProb = iProb * 80;
            } else if (iTimeRemaining < 60){
                //This means 0,5% of timer face prob
                iProb = iProb * 200;
            } else{
                //This means 0,33% of timer face prob
                iProb = iProb * 300;
            }

            if (iProb < 1){
                iType = TYPE_CLOCK;
                _bTimeSpawn = false;
            }
            
        }
        
        if (CONFIG[iLevel].changingallowed && Math.random() * 100 < 1.5 && _bChangingFaceSpawn){
            iType = TYPE_CHANGING;
            _bChangingFaceSpawn = false;
        }
        
        return iType;
    };
    
    this._shuffleLevel = function(){
        var iType; 
        for(var i=0;i<_iMaxRow;i++){
            for(var j=0;j<_iMaxCol;j++){
                if(LEVEL_MATRIX[iLevel][i][j] > 0){
                    if(LEVEL_MATRIX[iLevel][i][j] === CELL_FILL_STAR){
                         iType = TYPE_STAR;
                    }else{
                        iType = Math.floor(Math.random()*_iNumFaces);
                    }   
                    _aGrid[i][j].setType(iType);
                }
            }
        }        
        this.initialMatch();
        this._hintCheckMovesAvailable();
    };
    
    this._buildLevel = function(){
        
        var oSprite = s_oSpriteLibrary.getSprite('frame_level');
        var oFrame = createBitmap(oSprite);
        oFrame.regX = oSprite.width/2;
        oFrame.regY = oSprite.height/2 - _iGridOffset;
        _oGridContainer.addChild(oFrame);
        
        var iGridWidth =  LEVEL_MATRIX[iLevel][0].length*CELL_SIZE;
        var iGridHeight = LEVEL_MATRIX[iLevel].length*CELL_SIZE;
        var pStartGridPoint = {x: -(iGridWidth/2) +CELL_SIZE/2, y: -(iGridHeight)/2 +CELL_SIZE/2};
        
        _aGrid = new Array();
        for(var i=0; i<_iMaxRow; i++){
            _aGrid[i] = new Array();
            for(var j=0; j<_iMaxCol; j++){
                var iType = Math.floor(Math.random()*_iNumFaces);
                if(LEVEL_MATRIX[iLevel][i][j] === CELL_FILL_FACE){
                    //Random Faces
                    
                    _aGrid[i][j] = new CCell(pStartGridPoint.x + j*CELL_SIZE, pStartGridPoint.y + i*CELL_SIZE, i, j, _oGridContainer, iType,false, false);
                } else if(LEVEL_MATRIX[iLevel][i][j] === CELL_FILL_NULL) {
                    //Empty cell
                    _aGrid[i][j] = new CCell(pStartGridPoint.x + j*CELL_SIZE, pStartGridPoint.y + i*CELL_SIZE, i, j, _oGridContainer, CELL_STATE_DISABLE, false, false);
                } else if(LEVEL_MATRIX[iLevel][i][j] === CELL_FILL_BOMB){
                    //Bomb
                    _aGrid[i][j] = new CCell(pStartGridPoint.x + j*CELL_SIZE, pStartGridPoint.y + i*CELL_SIZE, i, j, _oGridContainer, TYPE_BOMB, false, false);
                } else if(LEVEL_MATRIX[iLevel][i][j] === CELL_FILL_STAR){
                    //Star
                    _aGrid[i][j] = new CCell(pStartGridPoint.x + j*CELL_SIZE, pStartGridPoint.y + i*CELL_SIZE, i, j, _oGridContainer, TYPE_STAR, false, false);
                    _iCountStar++;
                    _iCountStarOnStage++;
                    _aStarPosition.push({row:i, col:j});
                } else if(LEVEL_MATRIX[iLevel][i][j] === CELL_FILL_BLOCK){
                    //Block
                    _aGrid[i][j] = new CCell(pStartGridPoint.x + j*CELL_SIZE, pStartGridPoint.y + i*CELL_SIZE, i, j, _oGridContainer, iType, true, false);
                } else if(LEVEL_MATRIX[iLevel][i][j] === CELL_FILL_CLOCK){
                    
                    _aGrid[i][j] = new CCell(pStartGridPoint.x + j*CELL_SIZE, pStartGridPoint.y + i*CELL_SIZE, i, j, _oGridContainer, TYPE_CLOCK, false, false);
                } else if(LEVEL_MATRIX[iLevel][i][j] === CELL_FILL_CHANGE){
                   
                    _aGrid[i][j] = new CCell(pStartGridPoint.x + j*CELL_SIZE, pStartGridPoint.y + i*CELL_SIZE, i, j, _oGridContainer, TYPE_CHANGING, false, false);
                } else if(LEVEL_MATRIX[iLevel][i][j] === CELL_FILL_STARANDBLOCK){
            
                    _aGrid[i][j] = new CCell(pStartGridPoint.x + j*CELL_SIZE, pStartGridPoint.y + i*CELL_SIZE, i, j, _oGridContainer, TYPE_STAR, true, false);
                } else if(LEVEL_MATRIX[iLevel][i][j] === CELL_FILL_TRAP){
           
                    _aGrid[i][j] = new CCell(pStartGridPoint.x + j*CELL_SIZE, pStartGridPoint.y + i*CELL_SIZE, i, j, _oGridContainer, iType, false, true);
                } 
                
            }
        }
    };
    
    this.initialMatch = function(){
        do{
                
            _aFacesToDestroy = new Array();
            this._matchHorizontal();
            this._matchVertical();

            var iType;
            for(var i=0; i<_aFacesToDestroy.length; i++){

                iType = Math.floor(Math.random()*_iNumFaces);
                _aGrid[_aFacesToDestroy[i].row][_aFacesToDestroy[i].col].setType(iType);
                _aGrid[_aFacesToDestroy[i].row][_aFacesToDestroy[i].col].setToDelete(false);
            }

        } while (_aFacesToDestroy.length > 0)        
        
        this._refreshMatrix();
        
    };
   
    this._matchHorizontal = function(){
        var iSameColor;
        var iCurColor;
        _aStarPosition = new Array();
        _aHorizontalMatch = new Array();
        for(var i=0; i<_iMaxRow; i++){
            iCurColor = _aGrid[i][0].getType();
            iSameColor = 0;
            for(var j=0; j<_iMaxCol; j++){
                if(_aGrid[i][j].getType() === TYPE_STAR){
                    _aStarPosition.push({row:i, col:j});
                }
                
                if(_aGrid[i][j].getType() === iCurColor && j === _iMaxCol - 1 && _aGrid[i][j].getType()>= 0 && _aGrid[i][j].getType() <  TYPE_STAR){
                    iSameColor++;
                    if(iSameColor >= 3){
                        for(var k=0; k<iSameColor; k++){
                            _aGrid[i][j-k].setToDelete(true);
                            _aFacesToDestroy.push({row:i, col:j-k});
                        }
                        
                        _aHorizontalMatch.push(iSameColor);
                    }
                } else if(_aGrid[i][j].getType() === iCurColor && j !== _iMaxCol - 1 && _aGrid[i][j].getType()>= 0 && _aGrid[i][j].getType() <  TYPE_STAR){
                    iSameColor++;
                    
                } else {
                    if(iSameColor >= 3){
                        for(var k=0; k<iSameColor; k++){
                            _aGrid[i][j-1-k].setToDelete(true);
                            _aFacesToDestroy.push({row:i, col:j-1-k});
                        }      
                        
                        _aHorizontalMatch.push(iSameColor);
                    }
                    
                    iSameColor = 1;
                    iCurColor = _aGrid[i][j].getType();
                    
                }     
            } 
        }
    };
   
    this._matchVertical = function(){
        var iSameColor;
        var iCurColor;
        _aVerticalMatch = new Array();
        
        for(var j=0; j<_iMaxCol; j++){
            iCurColor = _aGrid[0][j].getType();
            iSameColor = 0;
            for(var i=0; i<_iMaxRow; i++){
                if(_aGrid[i][j].getType() === iCurColor && i === _iMaxRow - 1 && _aGrid[i][j].getType()>= 0 && _aGrid[i][j].getType() <  TYPE_STAR){
                    iSameColor++;
                    if(iSameColor >= 3){
                        for(var k=0; k<iSameColor; k++){
                            if(!_aGrid[i-k][j].getToDelete()){
                                _aGrid[i-k][j].setToDelete(true);
                                _aFacesToDestroy.push({row:i-k, col:j});
                            }
                            
                        }
                        _aVerticalMatch.push(iSameColor);
                    }
                } else if(_aGrid[i][j].getType() === iCurColor && i !== _iMaxRow - 1 && _aGrid[i][j].getType()>= 0 && _aGrid[i][j].getType() <  TYPE_STAR){
                    iSameColor++;
                    
                } else {
                    if(iSameColor >= 3){
                        for(var k=0; k<iSameColor; k++){
                            if(!_aGrid[i-1-k][j].getToDelete()){
                                _aGrid[i-1-k][j].setToDelete(true);
                                _aFacesToDestroy.push({row:i-1-k, col:j});
                            }
                            
                        }
                        _aVerticalMatch.push(iSameColor);
                    }
                    
                    iSameColor = 1;
                    iCurColor = _aGrid[i][j].getType();
                    
                }     
            }            
        }
    };
    
    this.callTremble = function(){
        if(!_bTremble){
            _bTremble = true;
            _iIdInterval = setInterval(function(){_oParent.tremble();},10);
        }        
    };
    
    this.tremble = function(){
        _bAlternateTremble = !_bAlternateTremble;
        var _iStrenght = 10;
        
        if(_bAlternateTremble){
            var iSignX = Math.random();
            var iNumberX = _iStrenght;
            var iDirX;
            if(iSignX < 0.5){
                iDirX = - iNumberX;             
            } else {
                iDirX = iNumberX;
            }
            var iSignY = Math.random();
            var iNumberY = _iStrenght;
           
            var iDirY;
            if(iSignY < 0.5){
                iDirY = - iNumberY;             
            } else {
                iDirY = iNumberY;
            }
            
            s_oStage.x = iDirX;
            s_oStage.y = iDirY;

        } else {
            s_oStage.x = 0;
            s_oStage.y = 0;

        }
        
        
        _iCurTrembleIndex++;
        if(_iCurTrembleIndex === 50){
            _iCurTrembleIndex = 0;
            _bTremble = false;
            clearInterval(_iIdInterval);            
        }
    };
    
    this._refreshMatrix = function(){
        for(var i=0; i<_aFacesToDestroy.length; i++){
            _aGrid[_aFacesToDestroy[i].row][_aFacesToDestroy[i].col].setToDelete(false);
        }
    };
    
    this._swapFaces = function(){        
        if(_oPickRandomHint !== null){
            _aGrid[_oPickRandomHint.element0row][_oPickRandomHint.element0col].stopAnimHint();
            _aGrid[_oPickRandomHint.element1row][_oPickRandomHint.element1col].stopAnimHint();
            _bStartHintTimer = true;
            _iHintTimer = TIMER_HINT-2000;
        }

        playSound("swoosh", 1, false);
       
        var oFace1 = {x: _aGrid[_oCellSelected.row][_oCellSelected.col].getPos().x, y: _aGrid[_oCellSelected.row][_oCellSelected.col].getPos().y};
        var oFace2 = {x: _aGrid[_oCellToSwap.row][_oCellToSwap.col].getPos().x, y: _aGrid[_oCellToSwap.row][_oCellToSwap.col].getPos().y};
        _iTypeToSwap1 = _aGrid[_oCellSelected.row][_oCellSelected.col].getType();
        _iTypeToSwap2 = _aGrid[_oCellToSwap.row][_oCellToSwap.col].getType();
        
        _oCellSelected.cell = new CMovingCell(oFace1.x, oFace1.y, _iTypeToSwap1, _oGridContainer );
        _oCellToSwap.cell = new CMovingCell(oFace2.x, oFace2.y, _iTypeToSwap2, _oGridContainer );
        
        _oCellSelected.cell.move(oFace2.x, oFace2.y);
        _oCellToSwap.cell.move(oFace1.x, oFace1.y);
        
        _aGrid[_oCellSelected.row][_oCellSelected.col].setType(CELL_STATE_INVISIBLE);
        _aGrid[_oCellToSwap.row][_oCellToSwap.col].setType(CELL_STATE_INVISIBLE);
    };
    
    this._checkStar = function(){
        
        for(var i=0; i<_aStarPosition.length; i++){
            if(_aStarPosition[i].row === _iMaxRow-1){

                playSound("chime", 1, false);
                
                _aFacesToDestroy.push({row:_iMaxRow-1, col:_aStarPosition[i].col});
                var oStar = new CMovingCell(_aGrid[_iMaxRow-1][_aStarPosition[i].col].getPos().x, _aGrid[_iMaxRow-1][_aStarPosition[i].col].getPos().y, TYPE_STAR, _oGridContainer);
                oStar.fallStar(_aGrid[_iMaxRow-1][_aStarPosition[i].col].getPos().x, 1100);
                _iCountStarOnStage--;
                this._updateScore(SCORES_FOR_STAR); 
            } else {
                
                var bFall = false;
                for(var j=_aStarPosition[i].row+1; j<_iMaxRow; j++){
                    if(_aGrid[j][_aStarPosition[i].col].getType() === CELL_STATE_DISABLE){
                        
                        bFall = true;
                    } else {
                        bFall = false;
                        break;
                    }
                }
                
                if(bFall){
                   
                    playSound("chime", 1, false);
                   
                    _aFacesToDestroy.push({row:_aStarPosition[i].row, col:_aStarPosition[i].col});
                    var oStar = new CMovingCell(_aGrid[_aStarPosition[i].row][_aStarPosition[i].col].getPos().x, _aGrid[_aStarPosition[i].row][_aStarPosition[i].col].getPos().y, TYPE_STAR, _oGridContainer);
                    oStar.fallStar(_aGrid[_aStarPosition[i].row][_aStarPosition[i].col].getPos().x, 1100);
                    _iCountStarOnStage--;
                    this._updateScore(SCORES_FOR_STAR);
                }
                
            }   
            
        }
        _aStarPosition = new Array();
        
    };
    
    this._checkBombArea = function(iRow, iCol){
        _bBlock = true;
        _aGrid[iRow][iCol].setToDelete(true);
        _aFacesToDestroy = new Array();
        _iCountBomb++;
        for(var i=iRow-1; i<iRow+2; i++){
            for(var j=iCol-1; j<iCol+2; j++){
                if( (i >= 0 && i<_iMaxRow) && (j >= 0 && j<_iMaxCol) && _aGrid[i][j].getType() !== CELL_STATE_DISABLE ){
                    if(_aGrid[i][j].getType() === TYPE_BOMB && !_aGrid[i][j].getToDelete()){
                        _oParent._checkBombArea(i,j);
                    }
                    
                    if( (_aGrid[i][j].getType() !== TYPE_STAR) && (_aGrid[i][j].getType() !== TYPE_BOMB) && (_aGrid[i][j].getType() !== TYPE_CHANGING) ){
                        _aGrid[i][j].setToDelete(true);
                    }                    
                }                    
            }
        }       
    };
    
    this._detonateBomb = function(iRow, iCol){

        playSound("bomb_explosion", 1, false);
       
        this.callTremble();
        
        this._checkBombArea(iRow, iCol); //Recursive find near bomb
            for(var i=0; i<_iMaxRow; i++){
                for(var j=0; j<_iMaxCol; j++){
                    if(_aGrid[i][j].getToDelete()){
                        _aFacesToDestroy.push({row:i, col:j});
                    }
                }
            }
        var iPartialScore = (_aFacesToDestroy.length-_iCountBomb)*SCORES_FOR_SINGLE + _iCountBomb*SCORES_FOR_BOMB;
        this._updateScore(iPartialScore);
        _iCountBomb = 0;
        this._explosion();
    };
    
    this._checkSameFaces= function(iType){
        for(var i=0; i<_iMaxRow; i++){
            for(var j=0; j<_iMaxCol; j++){
                if(_aGrid[i][j].getType() === iType){
                    _aFacesToDestroy.push({row:i, col:j});
                }
            }
        }
    };
    
    this.checkCellClicked = function(iRow, iCol, iType){
        if(_bBlock){
            return;
        }

        if(iType === TYPE_BOMB){
            //Bomb clicked
            if(_oPickRandomHint !== null){
                _aGrid[_oPickRandomHint.element0row][_oPickRandomHint.element0col].stopAnimHint();
                _aGrid[_oPickRandomHint.element1row][_oPickRandomHint.element1col].stopAnimHint();
            }
            this._detonateBomb(iRow, iCol);
            _oTarget.visible = false;
            return;
        }
        
        if(iType === TYPE_CLOCK){
           
            playSound("hourglass_explosion", 1, false);
           
            if(_oPickRandomHint !== null){
                _aGrid[_oPickRandomHint.element0row][_oPickRandomHint.element0col].stopAnimHint();
                _aGrid[_oPickRandomHint.element1row][_oPickRandomHint.element1col].stopAnimHint();
            }
            
            _bBlock = true;
            _iTimeElaps += TIME_TO_ADD;
            if(_iTimeElaps > 16000) {
                _bClockSoundPlayed = false;
                _oInterface.setTimerColor("#ffffff");
            }
            if(_iTimeElaps > CONFIG[iLevel].time){
                CONFIG[iLevel].time = _iTimeElaps;
            }
            _aFacesToDestroy.push({row:iRow, col:iCol});
            _oTarget.visible = false;
            this._explosion();
            return;
            
        }
        
        if(_aGrid[iRow][iCol].getType() === TYPE_CHANGING){
            
            if(_oPickRandomHint !== null){
                _aGrid[_oPickRandomHint.element0row][_oPickRandomHint.element0col].stopAnimHint();
                _aGrid[_oPickRandomHint.element1row][_oPickRandomHint.element1col].stopAnimHint();
            }
            
            _bBlock = true;
            _aFacesToDestroy.push({row:iRow, col:iCol});
            _oTarget.visible = false;
            this._checkSameFaces(iType);
            this._updateScore(_aFacesToDestroy.length*SCORES_FOR_SINGLE);
            this._explosion();
            return;
        }
        
        if(_oCellSelected === null){
            _oCellSelected = {row: iRow, col: iCol, cell: null};
            _oTarget.visible = true;
            _oTarget.x = _aGrid[iRow][iCol].getPos().x;
            _oTarget.y = _aGrid[iRow][iCol].getPos().y;
        } else if(_oCellSelected.row === iRow && _oCellSelected.col === iCol){
            return;
            
        }else if ( ((Math.abs(iRow - _oCellSelected.row) < 2) &&  ((iCol - _oCellSelected.col) === 0)) ||
                        (((iRow - _oCellSelected.row) === 0) &&  (Math.abs(iCol - _oCellSelected.col) < 2))  ){

            _oCellToSwap = {row: iRow, col: iCol, cell: null};
            _bBlock = true;
            this._swapFaces();
            
        } else {
            _oCellSelected = {row: iRow, col: iCol, cell: null};
            _oTarget.x = _aGrid[iRow][iCol].getPos().x;
            _oTarget.y = _aGrid[iRow][iCol].getPos().y;
        }
    };
    
    this.checkMatch = function(){
        _iSwappedCount++;
        if(_iSwappedCount === 2){            
            _aFacesToDestroy = new Array();            
            _aGrid[_oCellSelected.row][_oCellSelected.col].setType(_iTypeToSwap2);
            _aGrid[_oCellToSwap.row][_oCellToSwap.col].setType(_iTypeToSwap1);
            
            this._matchHorizontal();
            this._matchVertical();            
            
            if(_aFacesToDestroy.length > 0){
                //SWAP VALID
                this._checkStar();
                _iCountBomb = _iCountBomb + _aFacesToDestroy.length;
                this._explosion();
            } else {
               
                playSound("swoosh", 1, false);
               
                var oFace1 = {x: _aGrid[_oCellSelected.row][_oCellSelected.col].getPos().x, y: _aGrid[_oCellSelected.row][_oCellSelected.col].getPos().y};
                var oFace2 = {x: _aGrid[_oCellToSwap.row][_oCellToSwap.col].getPos().x, y: _aGrid[_oCellToSwap.row][_oCellToSwap.col].getPos().y};
                
                _aGrid[_oCellSelected.row][_oCellSelected.col].setType(_iTypeToSwap1);
                _aGrid[_oCellToSwap.row][_oCellToSwap.col].setType(_iTypeToSwap2);
                
                _oCellSelected.cell.moveBack(oFace1.x, oFace1.y);
                _oCellToSwap.cell.moveBack(oFace2.x, oFace2.y);
                
                _aGrid[_oCellSelected.row][_oCellSelected.col].setType(CELL_STATE_INVISIBLE);
                _aGrid[_oCellToSwap.row][_oCellToSwap.col].setType(CELL_STATE_INVISIBLE);
                            
                            
            }
            
            _iSwappedCount = 0;
        }
    };
    
    this._explosion = function(){
        _iHintTimer = 0;

        playSound("break", 1, false);
       
        var iRow;
        var iCol;
        _aColToReplace = new Array();
        for(var i=0; i<_iMaxCol; i++){
            _aColToReplace[i] = 0;
        }
        
        this._updateGoals();
        
        for(var i=0; i<_aFacesToDestroy.length; i++){
            iRow = _aFacesToDestroy[i].row;
            iCol = _aFacesToDestroy[i].col;
            
            _aColToReplace[iCol]++;            
            
            
            
            _aGrid[iRow][iCol].setType(CELL_STATE_MATCHED);
        }
        
        _iTimeResetHeroCounter = 0;
        _iHeroSpawnCounter += _aFacesToDestroy.length;
        if(_iHeroSpawnCounter > NUM_TO_MAKE_COMBO_FOR_HERO && !_bHeroStep2){
            _iHeroSpawnCounter = 0;
            _bHeroStep2 = true;
            _oHero.randomExultation(CHEF_AUDIO_STEP_0);

        } else if(_iHeroSpawnCounter > NUM_TO_MAKE_COMBO_FOR_HERO && _bHeroStep2){
            _iHeroSpawnCounter = 0;
            _oHero.randomExultation(CHEF_AUDIO_STEP_1);

        }
        
        _oTarget.visible = false;
        
        this._updateMatchScore();
        
        var oTween = createjs.Tween.get().wait(500).call(s_oGame._fallFaces);
        _aTweensGroupToPause.push(oTween);
    };
    
    this._fallFaces = function(){
        
        ////////BUILD ALL FACES TO BEING FALL
        _aFacesToFall = new Array();
        for(var i=0; i<_iMaxCol; i++){
            if(_aColToReplace[i] > 0){                
                
                var iType;
                var bFlag = false;
                for(var k=_iMaxRow-1; k>=0; k--){
                    if(_aGrid[k][i].getType() === CELL_STATE_MATCHED){
                        bFlag = true;
                    }

                    if(_aGrid[k][i].getType() >= 0 && bFlag){
                        _aFacesToFall.push({
                                        jump:0,
                                        startrow: k,
                                        endrow: null,
                                        col: i, 
                                        cell: new CMovingCell(_aGrid[k][i].getPos().x, _aGrid[k][i].getPos().y, _aGrid[k][i].getType(), _oGridContainer )});

                    }                    
                }
                for(var j=0; j<_aColToReplace[i]; j++){
                    iType = _oParent._createRandomFace();
                    _aFacesToFall.push({
                                        jump:0,
                                        startrow: -(j+1),
                                        endrow: null,
                                        col: i, 
                                        cell: new CMovingCell(_aGrid[0][i].getPos().x, _aGrid[0][i].getPos().y -CELL_SIZE*(j+1), iType, _oGridContainer )});                    
                }
            }
        }
        
        ////////DETECT POSITION OF THE FALL
        var iIndex = 0;
        for(var i=0; i<_iMaxCol; i++){
            
            if(_aColToReplace[i] > 0){
             
                var aColImage = new Array();
                for(var j=0; j<_iMaxRow; j++){
                    aColImage[j] = _aGrid[j][i].getType();
                }
                
                var bFlag = false;
                for(var k=_iMaxRow-1; k>=0; k--){
                    if(_aGrid[k][i].getType() === CELL_STATE_MATCHED){
                        bFlag = true;
                    }                    
                    if(_aGrid[k][i].getType() >= 0 && bFlag){                      
                        _aGrid[k][i].setType(CELL_STATE_INVISIBLE);
                    }                    
                }
                
                for(var j=_iMaxRow-1; j>=0; j--){
                    if(aColImage[j] === CELL_STATE_MATCHED){
                        _aFacesToFall[iIndex].endrow = j;
                        _aFacesToFall[iIndex].jump = j - _aFacesToFall[iIndex].startrow;
                        var bFlag = false;
                        for(var k=_iMaxRow-1; k>=0; k--){
                            if(aColImage[k] === CELL_STATE_MATCHED){
                                bFlag = true;
                            }
                            if(aColImage[k] >= 0 && bFlag){
                                aColImage[k] = CELL_STATE_MATCHED;
                                break;
                            }                            
                        }
                        
                        iIndex++;                        
                    }
                }    
            }            
        }
            
        
        //////FALL FACES
        for(var i=0; i<_aFacesToFall.length; i++){
            var iX = _aGrid[_aFacesToFall[i].endrow][_aFacesToFall[i].col].getPos().x;
            var iY = _aGrid[_aFacesToFall[i].endrow][_aFacesToFall[i].col].getPos().y;
            var iJump = _aFacesToFall[i].jump;
            
            _aFacesToFall[i].cell.fall(iX, iY, iJump);
        }        
    };
    
    this.onFinishFall = function(){
        _iFallCount++;
        if(_iFallCount === _aFacesToFall.length){
            _iFallCount = 0;
            /////SET GRID WITH FACES TYPE
            for(var i=0; i<_aFacesToFall.length; i++){
                
                _aFacesToFall[i].cell.unload();
                
                var iRow = _aFacesToFall[i].endrow;
                var iCol = _aFacesToFall[i].col;
                var iType = _aFacesToFall[i].cell.getType();
                _aGrid[iRow][iCol].setType(iType);
            }
            
            if(_bEndGame){
                return;
            }
            
            //// CHECK FURTHER EXPLOSION
            this._refreshMatrix();   

            _aFacesToDestroy = new Array();
            
            this._matchHorizontal();
            this._matchVertical();
            this._checkStar();
            
            if(_aFacesToDestroy.length > 0){
                //SWAP VALID
                this._explosion();
            } else {
                if(_oCellSelected !== null){
                    if(_oCellSelected.cell !== null){
                        _oCellSelected.cell.unload();
                        _oCellToSwap.cell.unload();
                    }                    
                }
                
                _oCellToSwap = null;
                _oCellSelected = null; 
                _bBlock = false;                    

                this._hintCheckMovesAvailable();
                
            }
            this._checkWin();
            
        }               
    };
    
    
    this._hintCheckMovesAvailable = function(){
      
        _aHintArray = new Array();
        _oPickRandomHint = null;
        var bSpecialElement = false; 
        //INIT TEMP GRID
        _aGridSwapInfo = new Array();      
        for(var i=0;i<_iMaxRow;i++){
            _aGridSwapInfo[i] = new Array();            
            for(var j=0;j<_iMaxCol;j++){
                _aGridSwapInfo[i][j] = {type : _aGrid[i][j].getType(), check_up: false, check_down: false, check_left: false, check_right: false};
                if(_aGridSwapInfo[i][j].type === 9 || _aGridSwapInfo[i][j].type === 10 || _aGridSwapInfo[i][j].type === 11){
                    bSpecialElement = true; 
                }
            }
        }
        
        //START CHECK MOVES
        for(var i=0;i<_iMaxRow;i++){
            for(var j=0;j<_iMaxCol;j++){
                if(!_aGrid[i][j].getTrap() && _aGrid[i][j].getType()>= 0 && _aGrid[i][j].getType() <  TYPE_STAR){
                    //trace("row:"+i + " col:"+j);
                    this._hintMoveAndCheck(i, j);  
                }  
            }
        }

        if(_aHintArray.length > 0){
            _bStartHintTimer = true;
            _oPickRandomHint = _aHintArray[Math.floor(Math.random()*_aHintArray.length)];
        } else {
            _bStartHintTimer = false;
            _oPickRandomHint = null;
            if(!bSpecialElement){

               var oShuffleText = new CFormatText(-300, CANVAS_HEIGHT/2, TEXT_SHUFFLE, "#ffffff", s_oStage, "#000000", 50);
                oShuffleText.setOutline(10);

                createjs.Tween.get(oShuffleText.getText()).to({x: CANVAS_WIDTH/2}, 500, createjs.Ease.quintOut).wait(1000).call(function(){
                    _oParent._shuffleLevel();
                    _oParent.callTremble();
                    createjs.Tween.get(oShuffleText.getText()).to({x: CANVAS_WIDTH + 300}, 500, createjs.Ease.backIn).call(function(){s_oStage.removeChild(oShuffleText);});
                });
            }
        }
    };
    
    this._hintMoveAndCheck = function(iRow, iCol){
        
        //CHECK UP        
        if(iRow > 0 && !_aGridSwapInfo[iRow][iCol].check_up && _aGridSwapInfo[iRow-1][iCol].type>= 0 && _aGridSwapInfo[iRow-1][iCol].type <  TYPE_STAR && !_aGrid[iRow-1][iCol].getTrap() && !_aGrid[iRow][iCol].getTrap()){
            _aGridSwapInfo[iRow][iCol].type = _aGrid[iRow-1][iCol].getType();
            _aGridSwapInfo[iRow-1][iCol].type = _aGrid[iRow][iCol].getType();
            
            var bCol = this._hintCheckColumn(_aGridSwapInfo, iCol);
            var bRow = this._hintCheckRow(_aGridSwapInfo, iRow);
            var bRow1 = this._hintCheckRow(_aGridSwapInfo, iRow-1);
            
            _aGridSwapInfo[iRow][iCol].type = _aGrid[iRow][iCol].getType();
            _aGridSwapInfo[iRow-1][iCol].type = _aGrid[iRow-1][iCol].getType();
            _aGridSwapInfo[iRow][iCol].check_up = true;
            _aGridSwapInfo[iRow-1][iCol].check_down =  true;
            
            if(bCol || bRow || bRow1){
                _aHintArray.push({element0row:iRow, element0col:iCol, element1row:iRow-1, element1col:iCol});
                //trace("UP")
            }
        }
        
        //CHECK DOWN
        if(iRow < _iMaxRow-1 && !_aGridSwapInfo[iRow][iCol].check_down && _aGridSwapInfo[iRow+1][iCol].type>= 0 && _aGridSwapInfo[iRow+1][iCol].type <  TYPE_STAR && !_aGrid[iRow+1][iCol].getTrap() && !_aGrid[iRow][iCol].getTrap()){
            _aGridSwapInfo[iRow][iCol].type = _aGrid[iRow+1][iCol].getType();
            _aGridSwapInfo[iRow+1][iCol].type = _aGrid[iRow][iCol].getType();
            
            var bCol = this._hintCheckColumn(_aGridSwapInfo, iCol);
            var bRow = this._hintCheckRow(_aGridSwapInfo, iRow);
            var bRow1 = this._hintCheckRow(_aGridSwapInfo, iRow+1);
            
            _aGridSwapInfo[iRow][iCol].type = _aGrid[iRow][iCol].getType();
            _aGridSwapInfo[iRow+1][iCol].type = _aGrid[iRow+1][iCol].getType();
            _aGridSwapInfo[iRow][iCol].check_down = true;
            _aGridSwapInfo[iRow+1][iCol].check_up =  true;
            
            if(bCol || bRow || bRow1){
                _aHintArray.push({element0row:iRow, element0col:iCol, element1row:iRow+1, element1col:iCol});
            }
        }

        //CHECK LEFT        
        if(iCol > 0 && !_aGridSwapInfo[iRow][iCol].check_left && _aGridSwapInfo[iRow][iCol-1].type>= 0 && _aGridSwapInfo[iRow][iCol-1].type && !_aGrid[iRow][iCol-1].getTrap() && !_aGrid[iRow][iCol].getTrap()){
            _aGridSwapInfo[iRow][iCol].type = _aGrid[iRow][iCol-1].getType();
            _aGridSwapInfo[iRow][iCol-1].type = _aGrid[iRow][iCol].getType();
            
            var bRow = this._hintCheckRow(_aGridSwapInfo, iRow);
            var bCol = this._hintCheckColumn(_aGridSwapInfo, iCol);
            var bCol1 = this._hintCheckColumn(_aGridSwapInfo, iCol-1);
            
            
            _aGridSwapInfo[iRow][iCol].type = _aGrid[iRow][iCol].getType();
            _aGridSwapInfo[iRow][iCol-1].type = _aGrid[iRow][iCol-1].getType();
            _aGridSwapInfo[iRow][iCol].check_left = true;
            _aGridSwapInfo[iRow][iCol-1].check_right =  true;
            
            if(bRow || bCol || bCol1){
                _aHintArray.push({element0row:iRow, element0col:iCol, element1row:iRow, element1col:iCol-1});
            }
        }

        //CHECK RIGHT
        if(iCol < _iMaxCol-1 && !_aGridSwapInfo[iRow][iCol].check_right && _aGridSwapInfo[iRow][iCol+1].type>= 0 && _aGridSwapInfo[iRow][iCol+1].type && !_aGrid[iRow][iCol+1].getTrap() && !_aGrid[iRow][iCol].getTrap()){
            _aGridSwapInfo[iRow][iCol].type = _aGrid[iRow][iCol+1].getType();
            _aGridSwapInfo[iRow][iCol+1].type = _aGrid[iRow][iCol].getType();
            
            var bRow = this._hintCheckRow(_aGridSwapInfo, iRow);
            var bCol = this._hintCheckColumn(_aGridSwapInfo, iCol);
            var bCol1 = this._hintCheckColumn(_aGridSwapInfo, iCol+1);
            
            _aGridSwapInfo[iRow][iCol].type = _aGrid[iRow][iCol].getType();
            _aGridSwapInfo[iRow][iCol+1].type = _aGrid[iRow][iCol+1].getType();
            _aGridSwapInfo[iRow][iCol].check_right = true;
            _aGridSwapInfo[iRow][iCol+1].check_left =  true;
            
            if(bRow || bCol || bCol1){
                _aHintArray.push({element0row:iRow, element0col:iCol, element1row:iRow, element1col:iCol+1});
            }
        }
    };
    
    this._hintCheckColumn = function(aGrid, iCol){
        var iCurColor = aGrid[0][iCol];
        var iSameColor = 0;
        for(var i=0; i<_iMaxRow; i++){
            if(aGrid[i][iCol].type === iCurColor && aGrid[i][iCol].type>= 0 && aGrid[i][iCol].type <  TYPE_STAR){
                
                iSameColor++;               

            } else {
                
                iSameColor = 1;
                iCurColor = aGrid[i][iCol].type;
            }
            
            if(iSameColor >= 3){
                return true;
            }            
        }
        
        return false;        
    };
    
    this._hintCheckRow = function(aGrid, iRow){
        var iCurColor = aGrid[iRow][0];
        var iSameColor = 0;
        for(var i=0; i<_iMaxCol; i++){
            if(aGrid[iRow][i].type === iCurColor && aGrid[iRow][i].type>= 0 && aGrid[iRow][i].type <  TYPE_STAR){
                
                iSameColor++;               

            } else {
                
                iSameColor = 1;
                iCurColor = aGrid[iRow][i].type;
            }
            
            if(iSameColor >= 3){
                return true;
            }            
        }
        
        return false;        
    };
    
    this._revealHint = function(){
         
        _aGrid[_oPickRandomHint.element0row][_oPickRandomHint.element0col].animHint();
        _aGrid[_oPickRandomHint.element1row][_oPickRandomHint.element1col].animHint();
     
    };
    
    this.printMatrix = function(aGrid){        
        var res = "";

        for (var i = 0; i < _iMaxRow; i++) {
            for (var j = 0; j < _iMaxCol; j++) {
                res += aGrid[i][j].type +"|";
            }
            res += "\n";

        }
        trace(res);        
    };
    
    this.returnInPosition = function(){
        _iSwappedCount++;
        if(_iSwappedCount === 2){
            _aGrid[_oCellSelected.row][_oCellSelected.col].setType(_iTypeToSwap1);
            _aGrid[_oCellToSwap.row][_oCellToSwap.col].setType(_iTypeToSwap2);
            
            _oCellSelected.cell.unload();
            _oCellToSwap.cell.unload();
            
            _oCellToSwap = null;
            _oCellSelected = null;
            _oTarget.visible = false;
            _iSwappedCount = 0;
            _bBlock = false;
        }        
    };  
    
    this.updateGoalsForBlock = function(){
        _aGoals[TYPE_BLOCK]++;
        if(GOALS[iLevel].block > 0){
            _oInterface.refreshGoals(TYPE_BLOCK, _aGoals[TYPE_BLOCK]);
            if(_aGoals[TYPE_BLOCK] >= GOALS[iLevel].block){
                _aCheckGoals[TYPE_BLOCK] = true;
            }
        } else {
            _aCheckGoals[TYPE_BLOCK] = true;
        }
    };
        
    this._updateGoals = function(){
        var iType;
        for(var i=0; i<_aFacesToDestroy.length; i++){
            
            iType = _aGrid[_aFacesToDestroy[i].row][_aFacesToDestroy[i].col].getType();
            if(iType <= TYPE_STAR){
                _aGoals[iType]++;
            }            
        }

        if(GOALS[iLevel].type0 > 0){
            _oInterface.refreshGoals(0, _aGoals[0]);
            if(_aGoals[0] >= GOALS[iLevel].type0){
                _aCheckGoals[0] = true;
            }
        } else {
            _aCheckGoals[0] = true;
        }
        
        if(GOALS[iLevel].type1 > 0){
            _oInterface.refreshGoals(1, _aGoals[1]);
            if(_aGoals[1] >= GOALS[iLevel].type1){
                _aCheckGoals[1] = true;
            }
        } else {
            _aCheckGoals[1] = true;
        }
        
        if(GOALS[iLevel].type2 > 0){
            _oInterface.refreshGoals(2, _aGoals[2]);
            if(_aGoals[2] >= GOALS[iLevel].type2){ 
                _aCheckGoals[2] = true;
            }
        } else {
            _aCheckGoals[2] = true;
        }
        
        if(GOALS[iLevel].type3 > 0){
            _oInterface.refreshGoals(3, _aGoals[3]);
            if(_aGoals[3] >= GOALS[iLevel].type3){
                _aCheckGoals[3] = true;
            }
        } else {
            _aCheckGoals[3] = true;
        }
        
        if(GOALS[iLevel].type4 > 0){
            _oInterface.refreshGoals(4, _aGoals[4]);
            if(_aGoals[4] >= GOALS[iLevel].type4){
                _aCheckGoals[4] = true;
            }
        } else {
            _aCheckGoals[4] = true;
        }
        
        if(GOALS[iLevel].type5 > 0){
            _oInterface.refreshGoals(5, _aGoals[5]);
            if(_aGoals[5] >= GOALS[iLevel].type5){
                _aCheckGoals[5] = true;
            }
        } else {
            _aCheckGoals[5] = true;
        }
        
        if(GOALS[iLevel].type6 > 0){
            _oInterface.refreshGoals(6, _aGoals[6]);
            if(_aGoals[6] >= GOALS[iLevel].type6){
                _aCheckGoals[6] = true;
            }
        } else {
            _aCheckGoals[6] = true;
        }
        
        if(GOALS[iLevel].type7 > 0){
            _oInterface.refreshGoals(7, _aGoals[7]);
            if(_aGoals[7] >= GOALS[iLevel].type7){
                _aCheckGoals[7] = true;
            }
        } else {
            _aCheckGoals[7] = true;
        }
        
        if(GOALS[iLevel].star > 0){
            _oInterface.refreshGoals(TYPE_STAR, _aGoals[TYPE_STAR]);
            if(_aGoals[TYPE_STAR] >= GOALS[iLevel].star){
                _aCheckGoals[TYPE_STAR] = true;
            } 
        } else {
            _aCheckGoals[TYPE_STAR] = true;
        }
        
    };  
    
    this._updateMatchScore = function(){
        var  iPartialScore = 0;
        for(var i=0; i<_aHorizontalMatch.length; i++){
            for(var j=0; j<_aHorizontalMatch[i]; j++){
                if(j > 2){
                    iPartialScore = Math.round(iPartialScore * EXTRA_FACE_MULTIPLIER);
                } else {
                    iPartialScore += SCORES_FOR_SINGLE;
                }      
            }            
        }
        
        for(var i=0; i<_aVerticalMatch.length; i++){
            for(var j=0; j<_aVerticalMatch[i]; j++){
                if(j > 2){
                    iPartialScore = Math.round(iPartialScore * EXTRA_FACE_MULTIPLIER);
                } else {
                    iPartialScore += SCORES_FOR_SINGLE;
                }      
            }            
        }
        
        this._updateScore(iPartialScore);        
    };
    
    this._updateScore = function(iPartialScore){
        _iScore += iPartialScore;
        _oInterface.refreshScore(_iScore);
    };
    
    this._checkWin = function(){
        if(!_bInitGame){
            return;
        }
        for(var i=0; i<_aCheckGoals.length; i++){
            if(_aCheckGoals[i] === false){
                return;
            }
        }
        _bInitGame = false;
        _iTimeBonusScore = Math.round( (_iTimeElaps/1000) * 50 );
        this.gameOver(true);
    };
    
    this.createParticle = function(iX, iY, iType){
        if(iType === TYPE_BLOCK){
            _aParticle.push(new CParticle(iX, iY, iType, _oGridContainer));
        }else {
            _aParticle.push(new CParticle(iX, iY, iType, _oParticleContainer));
        }
        
    };
    
    this.unload = function(){
        _bInitGame = false;
        
        _oInterface.unload();
        if(_oEndPanel !== null){
            _oEndPanel.unload();
            _oEndPanel = null;
        }
        
        _oCellSelected = null;
        for(var i=0; i<_aGrid.length; i++){
            for(var j=0; j<_aGrid[i].length; j++){
                
                _aGrid[i][j].unload();
                
            }
        }
        
        if(s_bMobile){
            _oHammer.off("swipeleft",function(){_oParent._swipeControl("left");});
            _oHammer.off("swiperight",function(){_oParent._swipeControl("right");});
            _oHammer.off("swipeup",function(){_oParent._swipeControl("up");});
            _oHammer.off("swipedown",function(){_oParent._swipeControl("down");});
        }
        createjs.Tween.removeAllTweens();
        s_oStage.removeAllChildren();
    };
    
    this.setBlock = function(bVal){
        _bBlock = bVal;
    };
    
    this.restartGame = function () {
        
        $(s_oMain).trigger("restart_level", iLevel);

        stopSound("soundtrack");
        playSound("soundtrack",1,true);

        s_oGame.unload();
        s_oGame._init();
     
    };
    
    this.getTweensGroup = function(){
        return _aTweensGroupToPause;
    };
    
    
    this.pauseGame = function(){
        _bInitGame = false;
        _bStopParticle = true;

        for(var i=0; i<_aTweensGroupToPause.length; i++){
            _aTweensGroupToPause[i].paused = true;
        }

        if(s_bMobile){
            _oHammer.off("swipeleft",function(){_oParent._swipeControl("left");});
            _oHammer.off("swiperight",function(){_oParent._swipeControl("right");});
            _oHammer.off("swipeup",function(){_oParent._swipeControl("up");});
            _oHammer.off("swipedown",function(){_oParent._swipeControl("down");});
        }

    };
    
    this.resumeGame = function(){
        _bInitGame = true;
        _bStopParticle = false;
        
        for(var i=0; i<_aTweensGroupToPause.length; i++){
            _aTweensGroupToPause[i].paused = false;
        }
        
        if(s_bMobile){
            this._initHammer();
        }
    };
    
    this.onNextLevel = function(){

        this.unload();
        s_iCurLevel++;

        if(s_iCurLevel === 26){
            new CEndPanel(_iScore, _iTimeBonusScore);
        }else {
            
            s_oMain.gotoGame(s_iCurLevel);
        }
        
    };
 
    this.onExit = function(){

        stopSound("soundtrack");
        
        s_oGame.unload();
        s_oMain.gotoMenu();
        
        $(s_oMain).trigger("end_session");

    };
    
    this.onExitHelp = function () {
        $(s_oMain).trigger("start_level", iLevel);
        
        var oStageText = new CFormatText(-300, CANVAS_HEIGHT/2, TEXT_STAGE + " " +s_iCurLevel, "#ffffff", s_oStage, "#000000", 90, "center");
        oStageText.setOutline(12);

        if(!soundPlaying("chef_good_luck")){
            playSound("chef_good_luck", 1, false);
        }

        createjs.Tween.get(oStageText.getText()).to({x: CANVAS_WIDTH/2}, 500, createjs.Ease.quintOut).wait(500).to({x: CANVAS_WIDTH + 300}, 500, createjs.Ease.backIn).call(function(){
            s_oStage.removeChild(oStageText);
        });
        
        this._hintCheckMovesAvailable();
        
        _bInitGame = true;
        
        
    };
    
    this.onExit = function(){

        stopSound("soundtrack");
        
        s_oGame.unload();
        s_oMain.gotoMenu();
        
        $(s_oMain).trigger("end_session");

    };
    
    this.onExitHelp = function () {
        $(s_oMain).trigger("start_level", iLevel);
        
        var oStageText = new CFormatText(-300, CANVAS_HEIGHT/2, TEXT_STAGE + " " +s_iCurLevel, "#ffffff", s_oStage, "#000000", 90, "center");
        oStageText.setOutline(12);

        if(!soundPlaying("chef_good_luck")){
            playSound("chef_good_luck", 1, false);
        }

        createjs.Tween.get(oStageText.getText()).to({x: CANVAS_WIDTH/2}, 500, createjs.Ease.quintOut).wait(500).to({x: CANVAS_WIDTH + 300}, 500, createjs.Ease.backIn).call(function(){
            s_oStage.removeChild(oStageText);
        });
        
        this._hintCheckMovesAvailable();
        
        _bInitGame = true;
        
        
    };
    
    this.gameOver = function(bWin) {
        _bInitGame = false;
        _bEndGame = true;
    
        $(s_oMain).trigger("end_level", iLevel);
    
        const levelNumber = s_iCurLevel;
        const score = _iScore;
        const totalScore = score + _iTimeBonusScore;
    
        // Save the total score in memory
        s_aLevelScore[s_iCurLevel] = totalScore;
        s_iTotalScore += totalScore;
    
        // Enable the next level if the current level is completed
        if (s_iCurLevel < 25) {
            s_aLevelEnabled[s_iCurLevel + 1] = true;
        }
    
        // Make API call to update game score
        updateGameScoreInBackend(levelNumber, totalScore);
    
        // Navigate to next level panel or end panel
        if (s_iCurLevel !== 25) {
            _oEndPanel = new CNextLevelPanel(bWin, _iScore, _iTimeBonusScore);
        } else {
            _oEndPanel = new CNextLevelPanel(bWin, _iScore, _iTimeBonusScore);
        }
    };
    
    function updateGameScoreInBackend(levelNumber, score) {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('No token found');
            return;
        }
    
        const payload = JSON.parse(atob(token.split('.')[1]));
        const userId = payload.userId;
        if (!userId) {
            console.error('User ID not found in token');
            return;
        }
    
        const url = `https://makimobackend.onrender.com/api/profiles/updateGameScore/${userId}`;
    
        const data = {
            levelNumber: levelNumber,
            score: score
        };
    
        fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token
            },
            body: JSON.stringify(data)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to update game score in backend');
            }
            return response.json();
        })
        .then(data => {
            console.log('Score successfully updated in backend:', data);
        })
        .catch((error) => {
            console.error('Error updating game score in backend:', error);
        });
    }
    
    this._timeTimer = function(){
        _iTimeTimer -= s_iTimeElaps;
        if(_iTimeTimer < 0){
            _iTimeTimer = TIMER_CLOCK_SPAWN[iLevel];
            _bTimeSpawn = true;
        }
    };
    
    this._changingFaceTimer = function(){
        _iChangingFaceTimer -= s_iTimeElaps;
        if(_iChangingFaceTimer < 0){
            _iChangingFaceTimer = TIMER_CHANGING;
            _bChangingFaceSpawn = true;
        }
    };
    
    this.update = function(){
        
        if(_bInitGame){
        
            if(!_bTimeSpawn && CONFIG[iLevel].clockallowed){
                this._timeTimer();
            }

            if(!_bChangingFaceSpawn && CONFIG[iLevel].changingallowed){
                this._changingFaceTimer();
            }
        
            _iTimeElaps -= s_iTimeElaps;
            
            if(_bStartHintTimer){
                _iHintTimer += s_iTimeElaps;
                if(_iHintTimer > TIMER_HINT){
                    _bStartHintTimer = false;
                    _iHintTimer = 0;
                    this._revealHint();
                }
            };
            
            if(_iTimeElaps < 16000 && !_bClockSoundPlayed){
                _bClockSoundPlayed = true;

                playSound("tictac", 1, false);
               
                _oInterface.setTimerColor("#ff0000");
            }
            
            ////CHECK TIME TO SPAWN HERO
            _iTimeResetHeroCounter += s_iTimeElaps;
            if(_iTimeResetHeroCounter > TIME_TO_MAKE_COMBO_FOR_HERO){
                _bHeroStep2 = false;
                _iHeroSpawnCounter = 0;
            }
            ////////////////////////////
            
            
             
            if(_iTimeElaps < 0 && _oEndPanel === null){
                _iTimeElaps = 0;
                this.gameOver(false);
                return;
            }
            _oInterface.refreshTime(_iTimeElaps, _iTimeElaps / (CONFIG[iLevel].time + 1000) );   
            
            
            
            
            
            for(var i=_aTweensGroupToPause.length-1; i>=0; i--){
                if(_aTweensGroupToPause[i].position/_aTweensGroupToPause[i].duration === 1){
                    _aTweensGroupToPause.splice(i,1);
                }
            } 
            
        }
        
        if(!_bStopParticle){
            if(_aParticle.length > 0){
                for(var i=0; i<_aParticle.length; i++){
                    _aParticle[i].update();
                } 

                for(var i=_aParticle.length-1; i>=0; i--){
                    if(_aParticle[i].isGone()){
                        _aParticle.splice(i,1);
                    }
                }                
            }
        }
        
        
    };

    s_oGame=this;
    
    SCORES_FOR_SINGLE = oData.scores_for_single;
    SCORES_FOR_BOMB = oData.scores_for_bomb;
    SCORES_FOR_STAR = oData.scores_for_star;
    EXTRA_FACE_MULTIPLIER = oData.extra_sushi_multiplier;
    
    _oParent=this;
    this._init();
}

var s_oGame;
