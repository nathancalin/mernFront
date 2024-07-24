function CParticle(iX, iY, iType, oParentContainer){
    
    var _bSliced;
    var _bGone;
    
    var _iSpeed;
    var _iRunFactor;
    var _iRunTime = 0;
    var _iRunTimeSlice1 = 0;
    var _iRunTimeSlice2 = 0;
    var _iShiftLeftX;
    var _iShiftRightX;
    var _iShiftx;
    var _iRotFactorSlice1;
    var _iRotFactorSlice2;
    var _iRotFactor;
    
    var _oParticle = null;
    var _oParent;
    var _oSlice1;
    var _oSlice2;
    
    this._init= function(iX, iY, iType, oParentContainer){
        
        _bSliced = false;
        _bGone = false;
        
        _iSpeed = 9;
        _iRunFactor = _iSpeed/9;
        
        if(iX > (CANVAS_WIDTH/2) ){
            _iShiftx = randomFloatBetween(-25,-10,2);
        }else{
            _iShiftx = randomFloatBetween(10,25,2);
        }
        
        _iRotFactor = randomFloatBetween(-MAX_SUSHI_ROT_SPEED,MAX_SUSHI_ROT_SPEED,2);

        
        if(iType === 5 || iType === TYPE_BOMB || iType === TYPE_CLOCK ){
            var oSprite = s_oSpriteLibrary.getSprite('explosion_'+iType);
            var oData = {   
                            framerate: 25,
                            images: [oSprite], 
                            // width, height & registration point of each sprite
                            frames: {width: 300, height: 300, regX: 150, regY: 150}, 
                            animations: {idle: [0,9,"stop"], stop:[10]}
                       };

            var oSpriteSheet = new createjs.SpriteSheet(oData);
            _oParticle = createSprite(oSpriteSheet, "idle",150,150,300,300);
            _oParticle.on("animationend", this._onParticleEnd);
            if(iType === 5){
                _oParticle.regY = 14;
            }
            _oParticle.gotoAndPlay("idle");
            var pGlobPoints = oParentContainer.localToGlobal(iX, iY);
            _oParticle.x = pGlobPoints.x + PARTICLE_OFFSET[iType].x;
            _oParticle.y = pGlobPoints.y + PARTICLE_OFFSET[iType].y;
        
            s_oStage.addChild(_oParticle);
            
        } else if(iType === TYPE_BLOCK){

            var oSprite = s_oSpriteLibrary.getSprite('explosion_'+iType);
            var oData = {   
                            framerate: 20,
                            images: [oSprite], 
                            // width, height & registration point of each sprite
                            frames: {width: 408, height: 474, regX: 204, regY: 150}, 
                            animations: {idle: [0,9,"stop"], stop:[10]}
                       };

            var oSpriteSheet = new createjs.SpriteSheet(oData);
            _oParticle = createSprite(oSpriteSheet, "idle",204,237,408,474);
            _oParticle.on("animationend", this._onParticleEnd);
            _oParticle.gotoAndPlay("idle");

            _oParticle.x = iX + PARTICLE_OFFSET[iType].x;
            _oParticle.y = iY + PARTICLE_OFFSET[iType].y;
          
            oParentContainer.addChild(_oParticle);
            
        } else {
            
            if(iType === TYPE_STAR){
                _bGone = true;
                return;
            }
            
            var oSprite = s_oSpriteLibrary.getSprite('explosion_'+iType);
            var oData = {   
                            framerate: 25,
                            images: [oSprite], 
                            // width, height & registration point of each sprite
                            frames: {width: CELL_SIZE, height: CELL_SIZE, regX: CELL_SIZE/2, regY: CELL_SIZE/2}, 
                            animations: {flawless: [0], slice_0:[1], slice_1:[2]}
                       };

            var oSpriteSheet = new createjs.SpriteSheet(oData);
            
            
            _oSlice1 = createSprite(oSpriteSheet, "slice_0",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
            _oSlice1.x = iX;
            _oSlice1.y = iY;
            oParentContainer.addChild(_oSlice1);

            _oSlice2 = createSprite(oSpriteSheet, "slice_1",CELL_SIZE/2,CELL_SIZE/2,CELL_SIZE,CELL_SIZE);
            _oSlice2.x = iX;
            _oSlice2.y = iY;
            oParentContainer.addChild(_oSlice2);
            
            this.sliceVertical();
        }
         

    };
    
    this.unload = function(){
        
        
        if(_oParticle !== null){            
            _oParticle.visible = false;
            _oParticle.off("animationend", this._onParticleEnd);
            s_oStage.removeChild(_oParticle);
        } else {
            oParentContainer.removeChild(_oSlice1);
            oParentContainer.removeChild(_oSlice2);
        }       
        _bGone = true;
    };
    
    this.sliceVertical = function(){
        _bSliced = true;
       
        _iRunTimeSlice1 = _iRunTime - (_iRunFactor*2);
        _iRunTimeSlice2 = _iRunTime - (_iRunFactor*2);
        _iShiftLeftX = _iShiftx;
        _iShiftRightX = -_iShiftx;
        _iRotFactorSlice1 = _iRotFactor * 1.5;
        _iRotFactorSlice2 = -_iRotFactor * 1.5;
       
        
    };
    
    this.update = function(){
        if(_bSliced){
            _iRunTime += _iRunFactor;
        
            _iRunTimeSlice1 += _iRunFactor;
            _oSlice1.y = _oSlice1.y - _iSpeed + _iRunTimeSlice1*2;
            _oSlice1.x += _iShiftLeftX/(_iRunTime);
            _oSlice1.rotation += _iRotFactorSlice1;

            _iRunTimeSlice2 += _iRunFactor;
            _oSlice2.y = _oSlice2.y - _iSpeed + _iRunTimeSlice2*2;
            _oSlice2.x += _iShiftRightX/(_iRunTime);
            _oSlice2.rotation += _iRotFactorSlice2;
            
            
            var iRemove = 0;
            if(_oSlice1.y > CANVAS_HEIGHT){
                iRemove++;
            }

            if(_oSlice2.y > CANVAS_HEIGHT){
                iRemove++;
            }

            if(iRemove === 2){
                _oParent.unload();
            } 
        }
    };
    
    this.isGone = function(){
        return _bGone;
    };
    
    this._onParticleEnd = function(){
        if(_oParticle.currentAnimation === "idle"){
            _oParent.unload();
        }
    };
    
    _oParent = this;
    this._init(iX, iY, iType, oParentContainer);
    
};