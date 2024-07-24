var LOCALSTORAGE_SCORE = "score";
var LOCALSTORAGE_ENABLED = "enabled";
var LOCALSTORAGE_TOTALSCORE = "totalscore";

var s_aLevelScore = new Array();
var s_aLevelEnabled = new Array();
var s_iTotalScore;
var s_aHelpPanelEnabled = new Array();

function CLocalStorage(szName) {
    var _bLocalStorage = true;

    this._init = async function (szName) {
        var existingData = JSON.parse(window.localStorage.getItem(szName));
        if (existingData) {
            // Load existing data without resetting if data already exists
            this.loadData();
        } else {
            // Otherwise, load from backend or initialize as needed
            await this.loadScoresFromBackend();
            // Save initial data after loading from backend
            this.saveData();
        }
    };

    this.isDirty = function () {
        return s_iTotalScore > 0;
    };

    this.isUsed = function () {
        try {
            window.localStorage.setItem("ls_available", "ok");
        } catch (evt) {
            _bLocalStorage = false;
        }
        return _bLocalStorage;
    };

    this.saveData = function () {
        var oJSONData = {
            [LOCALSTORAGE_SCORE]: s_aLevelScore,
            [LOCALSTORAGE_ENABLED]: s_aLevelEnabled,
            [LOCALSTORAGE_TOTALSCORE]: s_iTotalScore
        };

        window.localStorage.setItem(szName, JSON.stringify(oJSONData));
    };

    this.loadData = function () {
        var szData = JSON.parse(window.localStorage.getItem(szName));
        if (!szData) {
            console.error('No game data found in localStorage');
            return;
        }

        var aLoadedScore = szData[LOCALSTORAGE_SCORE];
        s_aLevelScore = new Array();
        for (var i = 1; i < 26; i++) {
            s_aLevelScore[i] = parseInt(aLoadedScore[i] || 0);
            s_aHelpPanelEnabled[i] = s_aLevelScore[i] <= 0;
        }

        var iTotalScore = szData[LOCALSTORAGE_TOTALSCORE];
        s_iTotalScore = parseInt(iTotalScore || 0);

        var aEnabledLevel = szData[LOCALSTORAGE_ENABLED];
        s_aLevelEnabled = new Array();
        for (var i = 1; i < 26; i++) {
            s_aLevelEnabled[i] = aEnabledLevel[i] || false;
        }
    };

    this.resetData = function () {
        s_iTotalScore = 0;
        for (var i = 1; i < 26; i++) {
            s_aLevelScore[i] = 0;
            s_aLevelEnabled[i] = false;
            s_aHelpPanelEnabled[i] = true;
        }
        s_aLevelEnabled[1] = true;
    };

    this.loadScoresFromBackend = async function () {
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

        const url = `https://makimobackend.onrender.com/api/profiles/get/${userId}`;

        try {
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch game scores from backend');
            }

            const result = await response.json();
            const profile = result.profile;

            s_iTotalScore = profile.totalPoints;
            s_aLevelScore = new Array();
            s_aLevelEnabled = new Array();
            for (let i = 1; i <= 25; i++) {
                const level = profile.gameScores.find(gs => gs.levelNumber === i);
                if (level) {
                    s_aLevelScore[i] = level.score;
                    s_aLevelEnabled[i] = true;
                    s_aHelpPanelEnabled[i] = level.score > 0 ? false : true;
                } else {
                    s_aLevelScore[i] = 0;
                    s_aLevelEnabled[i] = false;
                    s_aHelpPanelEnabled[i] = true;
                }
            }
            s_aLevelEnabled[1] = true;
        } catch (error) {
            console.error('Error loading game scores from backend:', error.message);
        }
    };

    this._init(szName);
}

function extractScores() {
    var szName = "gameData"; // Adjust according to your naming convention
    var data = JSON.parse(window.localStorage.getItem(szName));
    
    if (!data) {
        console.error('No data loaded');
        return null;
    }

    // Ensure data.score exists and is a number
    if (typeof data.score !== 'number' || isNaN(data.score)) {
        console.error('Invalid or missing score data');
        return null; // Handle gracefully, do not modify data in this case
    }

    return data.score;
}
function sendScoreDataToBackend(url, userId, token) {
    const score = extractScores();
    if (score === null || typeof score !== 'number') {
        console.error('Invalid score data');
        return;
    }

    var formattedScore = {
        levelNumber: 1, // Assuming level number is 1 for simplicity
        score: score
    };

    fetch(`${url}/${userId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` // Attach the token
        },
        body: JSON.stringify(formattedScore)
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        console.log('Score successfully sent to server:', data);
    })
    .catch((error) => {
        console.error('Error sending score to server:', error);
    });
}
function onLevelComplete() {
    var backendUrl = 'https://makimobackend.onrender.com/api/profiles/updateGameScore'; // Replace with your actual backend URL
    var userId = getUserIdFromToken(); // Function to get userId from token
    var token = getToken(); // Function to get the current JWT token

    sendScoreDataToBackend(backendUrl, userId, token);
}

function getToken() {
    return localStorage.getItem('token'); // Adjust based on your storage mechanism
}

function getUserIdFromToken() {
    var token = getToken();
    if (!token) return null;

    var payload = JSON.parse(atob(token.split('.')[1]));
    return payload.userId; // Adjust based on your token's payload structure
}

onLevelComplete();