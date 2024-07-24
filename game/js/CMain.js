function CMain(oData){
    var _bUpdate;
    var _iCurResource = 0;
    var RESOURCE_TO_LOAD = 0;
    var _iState = STATE_LOADING;
    var _oData;
    
    var _oPreloader;
    var _oMenu;
    var _oModeMenu;
    var _oHelp;
    var _oGame;

    this.initContainer = function(){
        s_oCanvas = document.getElementById("canvas");
        s_oStage = new createjs.Stage(s_oCanvas);
        createjs.Touch.enable(s_oStage, true);
                
	s_bMobile = isMobile();

        if(s_bMobile === false){
            s_oStage.enableMouseOver(20);  
            $('body').on('contextmenu', '#canvas', function(e){ return false; });
        }
		
        s_iPrevTime = new Date().getTime();

	createjs.Ticker.addEventListener("tick", this._update);
        createjs.Ticker.framerate = FPS
        
        if(navigator.userAgent.match(/Windows Phone/i)){
                DISABLE_SOUND_MOBILE = true;
        }
        
        s_oSpriteLibrary  = new CSpriteLibrary();
        
        //ADD PRELOADER
        _oPreloader = new CPreloader();
        
        s_oLocalStorage = new CLocalStorage(GAME_NAME);
    };
    
    this.updateTotalScore = function(){
        var iScore = 0;
        for(var i=1; i<26; i++){
            iScore += s_aLevelScore[i];
        }
        s_iTotalScore = iScore;  
        
        s_oLocalStorage.saveData();
    };
    
    this.preloaderReady = function(){
        if(DISABLE_SOUND_MOBILE === false || s_bMobile === false){
            this._initSounds();
        }
        
        this._loadImages();
        _bUpdate = true;
    };
    
    this.soundLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);
        _oPreloader.refreshLoader(iPerc);

    };
    
    this._initSounds = function(){
        
        Howler.mute(!s_bAudioActive);
        
        s_aSoundsInfo = new Array();
        
        s_aSoundsInfo.push({path: './sounds/',filename:'soundtrack',loop:true,volume:1, ingamename: 'soundtrack'});
        s_aSoundsInfo.push({path: './sounds/',filename:'click',loop:false,volume:1, ingamename: 'click'});
        s_aSoundsInfo.push({path: './sounds/',filename:'game_over',loop:false,volume:1, ingamename: 'game_over'});

        s_aSoundsInfo.push({path: './sounds/',filename:'bomb_explosion',loop:false,volume:1, ingamename: 'bomb_explosion'});
        s_aSoundsInfo.push({path: './sounds/',filename:'hourglass_explosion',loop:false,volume:1, ingamename: 'hourglass_explosion'});
        s_aSoundsInfo.push({path: './sounds/',filename:'break',loop:false,volume:1, ingamename: 'break'});
        s_aSoundsInfo.push({path: './sounds/',filename:'stage_clear',loop:false,volume:1, ingamename: 'stage_clear'});
        s_aSoundsInfo.push({path: './sounds/',filename:'chef_exultation_1',loop:false,volume:1, ingamename: 'chef_exultation_1'});
        s_aSoundsInfo.push({path: './sounds/',filename:'chef_exultation_2',loop:false,volume:1, ingamename: 'chef_exultation_2'});
        s_aSoundsInfo.push({path: './sounds/',filename:'chef_exultation_3',loop:false,volume:1, ingamename: 'chef_exultation_3'});
        s_aSoundsInfo.push({path: './sounds/',filename:'chef_exultation_4',loop:false,volume:1, ingamename: 'chef_exultation_4'});
        s_aSoundsInfo.push({path: './sounds/',filename:'chef_failed',loop:false,volume:1, ingamename: 'chef_failed'});
        s_aSoundsInfo.push({path: './sounds/',filename:'chef_good_luck',loop:false,volume:1, ingamename: 'chef_good_luck'});
        s_aSoundsInfo.push({path: './sounds/',filename:'chef_well_done',loop:false,volume:1, ingamename: 'chef_well_done'});
        s_aSoundsInfo.push({path: './sounds/',filename:'gong',loop:false,volume:1, ingamename: 'gong'});
        s_aSoundsInfo.push({path: './sounds/',filename:'menu_piece',loop:false,volume:1, ingamename: 'menu_piece'});
        
        s_aSoundsInfo.push({path: './sounds/',filename:'star',loop:false,volume:1, ingamename: 'chime'});
        s_aSoundsInfo.push({path: './sounds/',filename:'swoosh',loop:false,volume:1, ingamename: 'swoosh'});
        s_aSoundsInfo.push({path: './sounds/',filename:'tictac',loop:false,volume:1, ingamename: 'tictac'});
        s_aSoundsInfo.push({path: './sounds/',filename:'wood',loop:false,volume:1, ingamename: 'wood'});

        RESOURCE_TO_LOAD += s_aSoundsInfo.length;

        s_aSounds = new Array();
        for(var i=0; i<s_aSoundsInfo.length; i++){
            this.tryToLoadSound(s_aSoundsInfo[i], false);
        }
    };
    
    this.tryToLoadSound = function(oSoundInfo, bDelay){
       setTimeout(function(){        
            s_aSounds[oSoundInfo.ingamename] = new Howl({ 
                                                            src: [oSoundInfo.path+oSoundInfo.filename+'.mp3'],
                                                            autoplay: false,
                                                            preload: true,
                                                            loop: oSoundInfo.loop, 
                                                            volume: oSoundInfo.volume,
                                                            onload: s_oMain.soundLoaded,
                                                            onloaderror: function(szId,szMsg){
                                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                         s_oMain.tryToLoadSound(s_aSoundsInfo[i], true);
                                                                                         break;
                                                                                     }
                                                                                }
                                                                        },
                                                            onplayerror: function(szId) {
                                                                for(var i=0; i < s_aSoundsInfo.length; i++){
                                                                                     if ( szId === s_aSounds[s_aSoundsInfo[i].ingamename]._sounds[0]._id){
                                                                                          s_aSounds[s_aSoundsInfo[i].ingamename].once('unlock', function() {
                                                                                            s_aSounds[s_aSoundsInfo[i].ingamename].play();
                                                                                            if(s_aSoundsInfo[i].ingamename === "soundtrack" && s_oGame !== null){
                                                                                                setVolume("soundtrack",SOUNDTRACK_VOLUME_IN_GAME);
                                                                                            }

                                                                                          });
                                                                                         break;
                                                                                     }
                                                                                 }
                                                                       
                                                            } 
                                                        });

            
        }, (bDelay ? 200 : 0) );
    };


    this._loadImages = function(){
        s_oSpriteLibrary.init( this._onImagesLoaded,this._onAllImagesLoaded, this);

        s_oSpriteLibrary.addSprite("bg_menu","./sprites/menu_anim/bg_menu.jpg");
        s_oSpriteLibrary.addSprite("chef_menu","./sprites/menu_anim/chef_menu.png");
        s_oSpriteLibrary.addSprite("curtain","./sprites/menu_anim/curtain.png");
        s_oSpriteLibrary.addSprite("logo","./sprites/menu_anim/logo.png");
        s_oSpriteLibrary.addSprite("object_red","./sprites/menu_anim/object_red.png");
        s_oSpriteLibrary.addSprite("table","./sprites/menu_anim/table.png");
        s_oSpriteLibrary.addSprite("sushi_menu","./sprites/menu_anim/sushi_menu.png");
        s_oSpriteLibrary.addSprite("but_continue_menu","./sprites/but_continue_menu.png");
        s_oSpriteLibrary.addSprite("but_check","./sprites/but_check.png");
        s_oSpriteLibrary.addSprite("but_exit_big","./sprites/but_exit_big.png");
        
        
        for(var i=0; i<4; i++){
            s_oSpriteLibrary.addSprite("rays_"+i,"./sprites/end_anim/rays_"+i+".jpg");
        }
        s_oSpriteLibrary.addSprite("but_home","./sprites/but_home.png");
        
        s_oSpriteLibrary.addSprite("but_info","./sprites/but_info.png");
        s_oSpriteLibrary.addSprite("logo_ctl","./sprites/logo_ctl.png");
        s_oSpriteLibrary.addSprite("but_play","./sprites/but_play.png");
        s_oSpriteLibrary.addSprite("but_fullscreen","./sprites/but_fullscreen.png");
        s_oSpriteLibrary.addSprite("msg_box","./sprites/msg_box.png");
        s_oSpriteLibrary.addSprite("game_over_panel","./sprites/game_over_panel.png");
        s_oSpriteLibrary.addSprite("airplane","./sprites/airplane.png");
        s_oSpriteLibrary.addSprite("stars","./sprites/stars.png");
        s_oSpriteLibrary.addSprite("star_filled","./sprites/star_filled.png");
        s_oSpriteLibrary.addSprite("star_empty","./sprites/star_empty.png");
        for(var i=0; i<32; i++){
            s_oSpriteLibrary.addSprite("jm_"+i,"./sprites/map/jm_"+i+".jpg");
        }
        
        s_oSpriteLibrary.addSprite("bg_game_0","./sprites/bg_game_0.jpg");
        s_oSpriteLibrary.addSprite("bg_game_1","./sprites/bg_game_1.jpg");
        s_oSpriteLibrary.addSprite("bg_game_2","./sprites/bg_game_2.jpg");
        s_oSpriteLibrary.addSprite("frame_level","./sprites/frame_level.png");
        s_oSpriteLibrary.addSprite("but_restart","./sprites/but_restart.png");
        s_oSpriteLibrary.addSprite("but_restart_big","./sprites/but_restart_big.png");
        s_oSpriteLibrary.addSprite("but_continue","./sprites/but_continue.png");
        s_oSpriteLibrary.addSprite("but_pause","./sprites/but_pause.png");

        s_oSpriteLibrary.addSprite("but_exit","./sprites/but_exit.png");
        s_oSpriteLibrary.addSprite("audio_icon","./sprites/audio_sprites.png");
        s_oSpriteLibrary.addSprite("level_button","./sprites/level_button.png");
        s_oSpriteLibrary.addSprite("lock_level","./sprites/lock_level.png");
        s_oSpriteLibrary.addSprite("time_bar","./sprites/time_bar.png");
        s_oSpriteLibrary.addSprite("time_bar_fill","./sprites/time_bar_fill.png");
        s_oSpriteLibrary.addSprite("score_panel","./sprites/score_panel.png");
        s_oSpriteLibrary.addSprite("bottom_panel","./sprites/bottom_panel.png");        
        
        s_oSpriteLibrary.addSprite("balloon_1","./sprites/balloon_1.png");
        s_oSpriteLibrary.addSprite("bg_help_3","./sprites/bg_help_3.png");
        s_oSpriteLibrary.addSprite("bg_help_17","./sprites/bg_help_17.png");
                
        s_oSpriteLibrary.addSprite("chef_talk","./sprites/chef_talk.png");
        s_oSpriteLibrary.addSprite("chef_smile","./sprites/chef_smile.png");
        s_oSpriteLibrary.addSprite("chef_exultation_1","./sprites/chef_exultation_1.png");
        s_oSpriteLibrary.addSprite("chef_exultation_2","./sprites/chef_exultation_2.png");
        s_oSpriteLibrary.addSprite("chef_level_failed","./sprites/chef_level_failed.png");
        s_oSpriteLibrary.addSprite("chef_help_side","./sprites/chef_help_side.png");
        s_oSpriteLibrary.addSprite("chef_help_bottom","./sprites/chef_help_bottom.png");
        
        s_oSpriteLibrary.addSprite("cell","./sprites/cell.png");
        s_oSpriteLibrary.addSprite("bg_symbol","./sprites/bg_symbol.png");
        s_oSpriteLibrary.addSprite("block","./sprites/block.png");
        s_oSpriteLibrary.addSprite("trap","./sprites/trap.png");
        s_oSpriteLibrary.addSprite("sushi","./sprites/sushi.png");
        
        for(var i=0; i<11; i++){
            if(i===6 || i===7 ||i===8 ){
                continue;
            }
            s_oSpriteLibrary.addSprite("explosion_"+i,"./sprites/explosion_"+i+".png");
        }
       s_oSpriteLibrary.addSprite("explosion_12","./sprites/explosion_12.png");
        s_oSpriteLibrary.addSprite("target","./sprites/target.png");
        
       
        
        
        RESOURCE_TO_LOAD += s_oSpriteLibrary.getNumSprites();
        s_oSpriteLibrary.loadSprites();
    };
    
    this._onImagesLoaded = function(){
        _iCurResource++;
        var iPerc = Math.floor(_iCurResource/RESOURCE_TO_LOAD *100);

        _oPreloader.refreshLoader(iPerc);

    };
    
    this._onRemovePreloader = function(){
        _oPreloader.unload();
        
        if(_oMenu){
            return;
        }
        
        playSound("soundtrack",1,true);

        s_oMain.gotoMenu();
    };

    this._onAllImagesLoaded = function(){
        
    };
    
    this.gotoMenu = function(){        
        _oMenu = new CMenu();
        _iState = STATE_MENU;
        
    };
    
    this.goToModeMenu = function(){
        _oModeMenu = new CModeMenu();
        _iState = STATE_MENU;
    };
    
    this.gotoGame = function(iLevel) {
        if (s_aLevelEnabled[iLevel]) {
            s_iCurLevel = iLevel;
            _oGame = new CGame(_oData, iLevel);
            _iState = STATE_GAME;
        } else {
            console.log('Level', iLevel, 'is not yet unlocked');
            // Optionally, handle what happens when a level is not unlocked (e.g., show message)
        }
    };
      
    
    this.gotoHelp = function(){
        _oHelp = new CHelp();
        _iState = STATE_HELP;
    };
	
    this.stopUpdate = function(){
        _bUpdate = false;
        createjs.Ticker.paused = true;
        $("#block_game").css("display","block");
        Howler.mute(true);
     };

    this.startUpdate = function(){
        s_iPrevTime = new Date().getTime();
        _bUpdate = true;
        createjs.Ticker.paused = false;
        $("#block_game").css("display","none");

        if(s_bAudioActive){
                Howler.mute(false);
        }
    };
    
    this._update = function(event){
		if(_bUpdate === false){
			return;
		}
        var iCurTime = new Date().getTime();
        s_iTimeElaps = iCurTime - s_iPrevTime;
        s_iCntTime += s_iTimeElaps;
        s_iCntFps++;
        s_iPrevTime = iCurTime;
        
        if ( s_iCntTime >= 1000 ){
            s_iCurFps = s_iCntFps;
            s_iCntTime-=1000;
            s_iCntFps = 0;
        }
         
        if(s_oModeMenu !== null){
            s_oModeMenu.update();
        }
        
        if(_iState === STATE_GAME){
            _oGame.update();
        }
        
        s_oStage.update(event);

    };
    
    s_oMain = this;
    
    _oData = oData;
    ENABLE_CHECK_ORIENTATION = oData.check_orientation;
    ENABLE_FULLSCREEN = oData.fullscreen;
    
    s_bAudioActive = oData.audio_enable_on_startup;
	
    this.initContainer();
}

var s_bMobile;
var s_bAudioActive;
var s_iCntTime = 0;
var s_iTimeElaps = 0;
var s_iPrevTime = 0;
var s_iCntFps = 0;
var s_iCurFps = 0;
var s_iCurLevel;
var s_bFullscreen = false;

var s_oDrawLayer;
var s_oStage;
var s_oMain;
var s_oSpriteLibrary;
var s_oCanvas;
var s_aSounds;
var s_aSoundsInfo;
var s_oLocalStorage;