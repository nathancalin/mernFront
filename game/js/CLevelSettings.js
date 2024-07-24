////////////////USEFULL NOTES:
///CELL_FILL_NULL = 0;
///CELL_FILL_FACE = 1;
///CELL_FILL_BOMB = 2;
///CELL_FILL_STAR = 3;
///CELL_FILL_BLOCK = 4;
///CELL_FILL_CLOCK = 5;
///CELL_FILL_CHANGE = 6;
///CELL_FILL_STARANDBLOCK = 7;
///CELL_FILL_TRAP = 8;

var LEVEL_MATRIX = new Array();
var GOALS = new Array();
var CONFIG = new Array();
var BACKGROUND = new Array();
var TIMER_CLOCK_SPAWN = new Array();
var BEST_SCORE_LIMIT = new Array();

LEVEL_MATRIX[1] = [
    [0,1,1,1,0],
    [1,1,1,1,1],
    [1,1,1,1,1],
    [1,1,1,1,1],
    [0,1,1,1,0]
];
GOALS[1] = {type0:0, type1:20, type2:0, type3:0, type4:0, type5:0, type6:0, type7:0, star:0, block:0};
CONFIG[1] = {time: 60000, numfaces: 3, starallowed: false, bomballowed:false, clockallowed:false, changingallowed: false};
BACKGROUND[1] = 2; 
TIMER_CLOCK_SPAWN[1] = 0;
BEST_SCORE_LIMIT[1] = 4500;

LEVEL_MATRIX[2] = [
    [1,1,1,1,1],
    [1,1,1,1,1],
    [1,1,1,1,1],
    [1,1,1,1,1],
    [1,1,1,1,1]
];
GOALS[2] = {type0:25, type1:25, type2:0, type3:0, type4:0, type5:0, type6:0, type7:0, star:0, block:0};
CONFIG[2] = {time: 70000, numfaces: 3, starallowed: false, bomballowed:false, clockallowed:false, changingallowed: false};
BACKGROUND[2] = 2;
TIMER_CLOCK_SPAWN[2] = 0;
BEST_SCORE_LIMIT[2] = 5000;

//INTRODUCING BOMB
LEVEL_MATRIX[3] = [
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [0,1,1,1,1,0],
    [0,1,1,1,1,0],
    [1,1,2,1,1,1],
    [1,1,1,1,1,1]
];
GOALS[3] = {type0:0, type1:0, type2:40, type3:0, type4:0, type5:0, type6:0, type7:0, star:0, block:0};
CONFIG[3] = {time: 60000, numfaces: 3, starallowed: false, bomballowed:true, clockallowed:false, changingallowed: false};
BACKGROUND[3] = 2;
TIMER_CLOCK_SPAWN[3] = 0;
BEST_SCORE_LIMIT[3] = 6500;

LEVEL_MATRIX[4] = [
    [0,1,0,0,1,0],
    [1,1,1,1,1,1],
    [0,1,1,1,1,0],
    [1,1,0,0,1,1],
    [0,1,1,1,1,0],
    [1,1,1,1,1,1]
];
GOALS[4] = {type0:30, type1:0, type2:30, type3:0, type4:0, type5:0, type6:0, type7:0, star:0, block:0};
CONFIG[4] = {time: 80000, numfaces: 3, starallowed: false, bomballowed:false, clockallowed:false, changingallowed: false};
BACKGROUND[4] = 0;
TIMER_CLOCK_SPAWN[4] = 0;
BEST_SCORE_LIMIT[4] = 5200;

//NEW SUSHI PIECE
LEVEL_MATRIX[5] = [
    [0,0,1,1,0,0],
    [0,1,1,1,1,0],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1]
];
GOALS[5] = {type0:0, type1:0, type2:0, type3:30, type4:0, type5:0, type6:0, type7:0, star:0, block:0};
CONFIG[5] = {time: 100000, numfaces: 4, starallowed: false, bomballowed:false, clockallowed:false, changingallowed: false};
BACKGROUND[5] = 0;
TIMER_CLOCK_SPAWN[5] = 0;
BEST_SCORE_LIMIT[5] = 6500;

LEVEL_MATRIX[6] = [
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,1],
    [1,1,0,0,0,0,1,1],
    [1,1,1,1,2,1,1,1],
    [1,1,1,1,1,1,1,1]
];
GOALS[6] = {type0:0, type1:25, type2:0, type3:25, type4:0, type5:0, type6:0, type7:0, star:0, block:0};
CONFIG[6] = {time: 100000, numfaces: 4, starallowed: false, bomballowed:true, clockallowed:false, changingallowed: false};
BACKGROUND[6] = 0;
TIMER_CLOCK_SPAWN[6] = 0;
BEST_SCORE_LIMIT[6] = 7400;

LEVEL_MATRIX[7] = [
    [1,1,1,1,1,1,1,1],
    [1,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,1],
    [1,0,1,0,0,1,0,1],
    [1,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,1],
    [1,0,1,0,0,1,0,1],
    [1,1,1,1,1,1,1,1]
];
GOALS[7] = {type0:0, type1:25, type2:25, type3:25, type4:0, type5:0, type6:0, type7:0, star:0, block:0};
CONFIG[7] = {time: 110000, numfaces: 4, starallowed: false, bomballowed:true, clockallowed:false, changingallowed: false};
BACKGROUND[7] = 0;
TIMER_CLOCK_SPAWN[7] = 0;
BEST_SCORE_LIMIT[7] = 6600;

//NEW OBJECTIVE
LEVEL_MATRIX[8] = [
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0],
    [4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4],
    [4,4,4,4,4,4,4,4],
    [0,0,0,0,0,0,0,0],
    [0,0,0,0,0,0,0,0]
];
GOALS[8] = {type0:0, type1:0, type2:32, type3:0, type4:0, type5:0, type6:0, type7:0, star:0, block:32};
CONFIG[8] = {time: 110000, numfaces: 4, starallowed: false, bomballowed:false, clockallowed:false, changingallowed: false};
BACKGROUND[8] = 1;
TIMER_CLOCK_SPAWN[8] = 0;
BEST_SCORE_LIMIT[8] = 6500;

LEVEL_MATRIX[9] = [
    [0,4,4,0,0,4,4,0],
    [0,4,4,0,0,4,4,0],
    [0,1,1,1,1,1,1,0],
    [4,1,1,1,1,1,1,4],
    [4,1,1,1,1,1,1,4],
    [0,1,1,1,1,1,1,0],
    [0,4,4,0,0,4,4,0],
    [0,4,4,0,0,4,4,0]
];
GOALS[9] = {type0:40, type1:0, type2:0, type3:0, type4:0, type5:0, type6:0, type7:0, star:0, block:20};
CONFIG[9] = {time: 140000, numfaces: 4, starallowed: false, bomballowed:true, clockallowed:false, changingallowed: false};
BACKGROUND[9] = 0;
TIMER_CLOCK_SPAWN[9] = 0;
BEST_SCORE_LIMIT[9] = 10000;

LEVEL_MATRIX[10] = [
    
    [0,0,0,1,1,1,1,1],
    [0,0,1,1,1,1,1,4],
    [0,1,1,1,1,1,4,4],
    [1,1,1,1,1,4,4,0],
    [1,1,1,1,4,4,0,0],
    [1,1,1,4,4,0,0,0],
    [1,1,4,4,0,0,0,0],
    [1,4,4,0,0,0,0,0]
];
GOALS[10] = {type0:30, type1:0, type2:0, type3:30, type4:0, type5:0, type6:0, type7:0, star:0, block:13};
CONFIG[10] = {time: 90000, numfaces: 4, starallowed: false, bomballowed:false, clockallowed:false, changingallowed: false};
BACKGROUND[10] = 1;
TIMER_CLOCK_SPAWN[10] = 0;
BEST_SCORE_LIMIT[10] = 6000;

//NEW UTILITY
LEVEL_MATRIX[11] = [
    
    [0,0,4,4,4,0,0],
    [0,4,4,1,4,4,0],
    [0,4,1,1,1,4,0],
    [0,4,1,5,1,4,0],
    [0,4,1,1,1,4,0],
    [0,4,4,1,4,4,0],
    [0,0,4,4,4,0,0]
];
GOALS[11] = {type0:0, type1:20, type2:20, type3:0, type4:0, type5:0, type6:0, type7:0, star:0, block:20};
CONFIG[11] = {time: 50000, numfaces: 4, starallowed: false, bomballowed:false, clockallowed:true, changingallowed: false};
BACKGROUND[11] = 2;
TIMER_CLOCK_SPAWN[11] = 20000;
BEST_SCORE_LIMIT[11] = 4500;

LEVEL_MATRIX[12] = [
    
    [0,0,0,5,0,0,0],
    [0,0,1,1,1,0,0],
    [0,1,1,1,1,1,0],
    [1,1,1,1,1,1,1],
    [0,1,1,1,1,1,0],
    [0,0,1,1,1,0,0],
    [0,0,0,1,0,0,0]
];
GOALS[12] = {type0:0, type1:50, type2:50, type3:50, type4:0, type5:0, type6:0, type7:0, star:0, block:0};
CONFIG[12] = {time: 50000, numfaces: 4, starallowed: false, bomballowed:false, clockallowed:true, changingallowed: false};
BACKGROUND[12] = 2;
TIMER_CLOCK_SPAWN[12] = 1000;
BEST_SCORE_LIMIT[12] = 9300;

/// NEW SUSHI PIECE
LEVEL_MATRIX[13] = [
    
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1],
    [1,1,1,1,1,1]
];
GOALS[13] = {type0:0, type1:0, type2:0, type3:0, type4:40, type5:0, type6:0, type7:0, star:0, block:0};
CONFIG[13] = {time: 120000, numfaces: 5, starallowed: false, bomballowed:false, clockallowed:false, changingallowed: false};
BACKGROUND[13] = 2;
TIMER_CLOCK_SPAWN[13] = 0;
BEST_SCORE_LIMIT[13] = 7000;


LEVEL_MATRIX[14] = [
    
    [0,4,0,4,0,4,0],
    [4,1,1,1,1,1,4],
    [0,1,1,1,1,1,0],
    [4,1,1,1,1,1,4],
    [0,1,1,1,1,1,0],
    [4,1,1,1,1,1,4],
    [0,4,0,4,0,4,0]
];
GOALS[14] = {type0:30, type1:0, type2:0, type3:0, type4:30, type5:0, type6:0, type7:0, star:0, block:12};
CONFIG[14] = {time: 130000, numfaces: 5, starallowed: false, bomballowed:true, clockallowed:true, changingallowed: false};
BACKGROUND[14] = 1;
TIMER_CLOCK_SPAWN[14] = 20000;
BEST_SCORE_LIMIT[14] = 8700;

//NEW UTILITY CHANGING
LEVEL_MATRIX[15] = [
    
    [4,1,1,1,1,1,1,1],
    [0,1,0,1,0,6,0,1],
    [4,1,1,1,1,1,1,1],
    [0,1,1,1,1,1,1,1],
    [4,1,1,1,1,1,1,1],
    [0,1,0,1,0,1,0,1],
    [4,1,1,1,1,1,1,1],
    [0,4,0,4,0,4,0,4]
];
GOALS[15] = {type0:40, type1:0, type2:0, type3:0, type4:0, type5:0, type6:0, type7:0, star:0, block:8};
CONFIG[15] = {time: 130000, numfaces: 5, starallowed: false, bomballowed:true, clockallowed:true, changingallowed: true};
BACKGROUND[15] = 1;
TIMER_CLOCK_SPAWN[15] = 20000;
BEST_SCORE_LIMIT[15] = 7300;

LEVEL_MATRIX[16] = [
    
    [1,1,1,1,1,1,1,1],
    [1,2,1,1,1,1,1,1],
    [1,1,1,1,6,1,1,1],
    [1,1,1,0,0,1,1,1],
    [1,1,1,0,0,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,5,1],
    [1,1,1,1,1,1,1,1]
];
GOALS[16] = {type0:70, type1:0, type2:70, type3:0, type4:70, type5:0, type6:0, type7:0, star:0, block:0};
CONFIG[16] = {time: 120000, numfaces: 5, starallowed: false, bomballowed:true, clockallowed:true, changingallowed: true};
BACKGROUND[16] = 0;
TIMER_CLOCK_SPAWN[16] = 20000;
BEST_SCORE_LIMIT[16] = 15000;

//NEW OBJECTIVE
LEVEL_MATRIX[17] = [
    
    [0,0,1,1,3,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0]
];
GOALS[17] = {type0:0, type1:0, type2:0, type3:0, type4:0, type5:0, type6:0, type7:0, star:1, block:0};
CONFIG[17] = {time: 70000, numfaces: 5, starallowed: false, bomballowed:false, clockallowed:false, changingallowed: false};
BACKGROUND[17] = 0;
TIMER_CLOCK_SPAWN[17] = 0;
BEST_SCORE_LIMIT[17] = 4000;

LEVEL_MATRIX[18] = [
    
    [0,0,4,4,4,4,0,0],
    [0,1,1,1,3,1,1,0],
    [4,1,1,1,1,1,1,4],
    [4,1,1,1,1,1,1,4],
    [4,1,1,1,1,1,1,4],
    [4,1,1,1,1,1,1,4],
    [0,1,1,1,1,1,1,0],
    [0,0,4,4,4,4,0,0]
];
GOALS[18] = {type0:0, type1:0, type2:0, type3:0, type4:0, type5:0, type6:0, type7:0, star:2, block:16};
CONFIG[18] = {time: 180000, numfaces: 5, starallowed: true, bomballowed:true, clockallowed:true, changingallowed: false};
BACKGROUND[18] = 0;
TIMER_CLOCK_SPAWN[18] = 20000;
BEST_SCORE_LIMIT[18] = 15000;

//NEW DIFFICULTY
LEVEL_MATRIX[19] = [
    
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0],
    [1,1,1,1,1,1,1,1],
    [1,8,8,1,1,8,8,1],
    [1,1,1,1,1,1,1,1],
    [0,0,1,1,1,1,0,0],
    [0,0,1,1,1,1,0,0]
];
GOALS[19] = {type0:0, type1:0, type2:0, type3:50, type4:0, type5:0, type6:0, type7:0, star:0, block:0};
CONFIG[19] = {time: 180000, numfaces: 5, starallowed: false, bomballowed:false, clockallowed:false, changingallowed: false};
BACKGROUND[19] = 0;
TIMER_CLOCK_SPAWN[19] = 0;
BEST_SCORE_LIMIT[19] = 11000;

LEVEL_MATRIX[20] = [
    
    [4,4,4,4,4,4,4,4],
    [0,0,0,0,0,0,0,0],
    [4,4,4,4,4,4,4,4],
    [0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1]
];
GOALS[20] = {type0:0, type1:0, type2:0, type3:0, type4:0, type5:0, type6:0, type7:0, star:0, block:16};
CONFIG[20] = {time: 180000, numfaces: 5, starallowed: false, bomballowed:true, clockallowed:false, changingallowed: true};
BACKGROUND[20] = 0;
TIMER_CLOCK_SPAWN[20] = 0;
BEST_SCORE_LIMIT[20] = 9500;

LEVEL_MATRIX[21] = [
    
    [0,0,3,0,0,3,0,0],
    [0,0,0,0,0,0,0,0],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,8,1,1,8,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1]
];
GOALS[21] = {type0:0, type1:0, type2:0, type3:0, type4:0, type5:0, type6:0, type7:0, star:4, block:0};
CONFIG[21] = {time: 210000, numfaces: 5, starallowed: true, bomballowed:false, clockallowed:false, changingallowed: false};
BACKGROUND[21] = 0;
TIMER_CLOCK_SPAWN[21] = 0;
BEST_SCORE_LIMIT[21] = 13000;

//NEW SUSHI PIECE
LEVEL_MATRIX[22] = [
    
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1]
];
GOALS[22] = {type0:0, type1:0, type2:0, type3:0, type4:0, type5:40, type6:0, type7:0, star:0, block:0};
CONFIG[22] = {time: 190000, numfaces: 6, starallowed: false, bomballowed:false, clockallowed:false, changingallowed: false};
BACKGROUND[22] = 0;
TIMER_CLOCK_SPAWN[22] = 0;
BEST_SCORE_LIMIT[22] = 9500;

LEVEL_MATRIX[23] = [
    
    [4,0,0,0,0,0,0,4],
    [1,1,1,1,1,1,1,1],
    [1,1,4,4,4,4,1,1],
    [1,1,4,1,1,4,1,1],
    [1,1,4,1,1,4,1,1],
    [1,1,4,4,4,4,1,1],
    [1,1,1,1,1,1,1,1],
    [4,0,0,0,0,0,0,4]
];
GOALS[23] = {type0:0, type1:20, type2:0, type3:0, type4:0, type5:20, type6:0, type7:0, star:0, block:16};
CONFIG[23] = {time: 200000, numfaces: 6, starallowed: false, bomballowed:false, clockallowed:false, changingallowed: true};
BACKGROUND[23] = 0;
TIMER_CLOCK_SPAWN[23] = 0;
BEST_SCORE_LIMIT[23] = 9500;

LEVEL_MATRIX[24] = [
    
    [0,1,1,1,3,1,1,0],
    [4,1,1,1,1,1,1,4],
    [0,1,1,1,1,1,1,0],
    [4,1,1,1,1,1,1,4],
    [0,1,1,1,1,1,1,0],
    [4,1,1,1,1,1,1,4],
    [0,1,1,1,1,1,1,0],
    [4,1,1,1,1,1,1,4]
];
GOALS[24] = {type0:0, type1:0, type2:0, type3:0, type4:0, type5:0, type6:0, type7:0, star:1, block:8};
CONFIG[24] = {time: 190000, numfaces: 6, starallowed: true, bomballowed:false, clockallowed:false, changingallowed: true};
BACKGROUND[24] = 0;
TIMER_CLOCK_SPAWN[24] = 0;
BEST_SCORE_LIMIT[24] = 8300;

LEVEL_MATRIX[25] = [
    
    [1,1,1,1,6,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1]
];
GOALS[25] = {type0:0, type1:0, type2:99, type3:99, type4:0, type5:99, type6:0, type7:0, star:0, block:0};
CONFIG[25] = {time: 240000, numfaces: 6, starallowed: false, bomballowed:true, clockallowed:true, changingallowed: true};
BACKGROUND[25] = 0;
TIMER_CLOCK_SPAWN[25] = 2000;
BEST_SCORE_LIMIT[25] = 22000;
