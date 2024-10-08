var CANVAS_WIDTH = 1080;
var CANVAS_HEIGHT = 1920;

var EDGEBOARD_X = 30;
var EDGEBOARD_Y = 310;

var FPS = 30;
var FPS_TIME      = 1000/FPS;
var DISABLE_SOUND_MOBILE = false;
var GAME_NAME = "sushi_matching";

var PRIMARY_FONT = "Walibi";
var SECONDARY_FONT = "Comic";

var SOUNDTRACK_VOLUME_IN_GAME = 0.5;

var STATE_LOADING = 0;
var STATE_MENU    = 1;
var STATE_HELP    = 1;
var STATE_GAME    = 3;

var ON_MOUSE_DOWN  = 0;
var ON_MOUSE_UP    = 1;
var ON_MOUSE_OVER  = 2;
var ON_MOUSE_OUT   = 3;
var ON_DRAG_START  = 4;
var ON_DRAG_END    = 5;

var MAP_WIDTH = 4000;
var MAP_HEIGHT = 6000;
var MAP_SENSITIVITY = 20;

var TYPE_STAR = 8;
var TYPE_BOMB = 9;
var TYPE_CLOCK = 10;
var TYPE_CHANGING = 11;

var TYPE_BLOCK = 12;

var PARTICLE_OFFSET = new Array();
PARTICLE_OFFSET[0] = {x: 0, y: 81};
PARTICLE_OFFSET[1] = {x: 0, y: 80};
PARTICLE_OFFSET[2] = {x: -1, y: 81};
PARTICLE_OFFSET[3] = {x: 0, y: 80};
PARTICLE_OFFSET[4] = {x: 0, y: 82};
PARTICLE_OFFSET[5] = {x: 0, y: 81};
PARTICLE_OFFSET[6] = {x: 0, y: 81};
PARTICLE_OFFSET[7] = {x: 0, y: 80};
PARTICLE_OFFSET[8] = {x: -5, y: 81};
PARTICLE_OFFSET[9] = {x: 0, y: 0};
PARTICLE_OFFSET[10] = {x: -2, y: 66};
PARTICLE_OFFSET[12] = {x: -8, y: 30};

var CELL_FILL_NULL = 0;
var CELL_FILL_FACE = 1;
var CELL_FILL_BOMB = 2;
var CELL_FILL_STAR = 3;
var CELL_FILL_BLOCK = 4;
var CELL_FILL_CLOCK = 5;
var CELL_FILL_CHANGE = 6;
var CELL_FILL_STARANDBLOCK = 7;
var CELL_FILL_TRAP = 8;

var CELL_STATE_MATCHED = -1;
var CELL_STATE_DISABLE = -2;
var CELL_STATE_INVISIBLE = -3;

var CHEF_AUDIO_STEP_0 = 0;
var CHEF_AUDIO_STEP_1 = 1;

var CELL_SIZE = 100;
var TIME_FALL = 100;
var TIME_TO_ADD = 15000;
var TIMER_CHANGING = 20000;
var TIMER_HINT = 4000;
var TIME_TO_MAKE_COMBO_FOR_HERO = 2400;
var NUM_TO_MAKE_COMBO_FOR_HERO = 20;

var MAX_SUSHI_ROT_SPEED = 2;

var SCORES_FOR_SINGLE;
var SCORES_FOR_BOMB;
var SCORES_FOR_STAR;
var EXTRA_FACE_MULTIPLIER;
var ENABLE_CHECK_ORIENTATION;
var ENABLE_FULLSCREEN;