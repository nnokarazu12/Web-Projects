function nextPhase() {
    var transitionButton = document.getElementById('transition-button');
    var startButton = document.getElementById('start-button');
    titleContainer = document.getElementById('title-container');
    difficultyContainer = document.getElementById('difficulty-container');
    titleContainer.style.opacity = "0";
    titleContainer.style.zIndex = "0";

    difficultyContainer.style.opacity = "1";
    difficultyContainer.style.zIndex = "1";

    transitionButton.style.display = "none";
    startButton.style.display = "block";
    getDifficulty();

    //Get username
    username = document.getElementById('name-field').value;
    //Clear name field
    namefield.value = "";
}
function checkUserName() {
    var transitionButton = document.getElementById('transition-button');
    namefield = document.getElementById('name-field');
    var namefieldAlert = document.getElementById('namefield-alert');
    //Check name input
    namefield.addEventListener("input", function() {
        if (namefield.value.length == 0) {
            transitionButton.style.display = "none";
            namefieldAlert.style.display = "none";
        } else if (namefield.value.includes(" ") || namefield.value.match(/\W/) != null) {
            namefieldAlert.style.display = "block";
            transitionButton.style.display = "none";
        } else if (!isNaN(namefield.value.charAt(0))) {
            namefieldAlert.style.display = "block";
            transitionButton.style.display = "none";
        } else {
            transitionButton.style.display = "block";
            namefieldAlert.style.display = "none";
        }
    });
}

//Return the difficulty level
function getDifficulty() {
    levelSlider = document.getElementById('difficulty-slider');
    var levelText = document.getElementById('difficulty-level');
    var difficultyLevel = levelSlider.value;
    
    if (difficultyLevel == 1) {
        levelText.innerHTML = "Fairly simple";
    }
    if (difficultyLevel == 2) {
        levelText.innerHTML = "Somewhat difficult";
    }
    if (difficultyLevel == 3) {
        levelText.innerHTML = "Very difficult";
    }
    return difficultyLevel;
}

//Randomly arrange characters in a string array
function randomSort(array) {
    var randSet = [];
    var randChar;

    function toArray(string) {
        var array = [];
        for (var i = 0; i < string.length; i++) {
            array[i] = string[i];
        }
        return array;
    }
    
    var i = 0;
    while (i < array.length) {
        var newString = "";
        var charArray = toArray(array[i]);
        var count = charArray.length;
        var randIndex = Math.floor(Math.random() * count);
        for (var j = 0; j < array[i].length; j++) {
            var randIndex = Math.floor(Math.random() * count);
            randChar = charArray[randIndex];
            newString += randChar;
            charArray.splice(randIndex, 1);
            count = charArray.length;
        }
        //If randomized word is the same as current word re-randomize
        if (newString == array[i]) {
            //console.log(newString);
            i = i;
        } else {
            randSet.push(newString);
            i++;
        } 
    }
    
    //Return scramble set
    return randSet;
}

//Initialize word sets
var firstLevelSet = [
    "water",
    "winter",
    "king",
    "body",
    "light",
    "wild",
    "leaf"
];
var secondLevelSet = [
    "opera",
    "queen",
    "laughter",
    "hanger",
    "declare",
    "autumn",
    "absolute"
];
var thirdLevelSet = [
    "posture",
    "charismatic",
    "hypothesis",
    "disparity",
    "business",
    "desperate",
    "confidence"
];

//Create set that will appear on screen
var testSet = [];

//Copy of original set based on difficulty
var referenceSet = [];

//Populate test set based on difficulty
function initializeTestSet(level) {
    if (level == 1) {
        referenceSet = firstLevelSet;
        testSet = randomSort(referenceSet);
    }
    if (level == 2) {
        referenceSet = secondLevelSet;
        testSet = randomSort(referenceSet);
    }
    if (level == 3) {
        referenceSet = thirdLevelSet;
        testSet = randomSort(thirdLevelSet);
    }
}
//Start the game
function startGame() {
    //Global variables
    centerContainer = document.getElementById('center-container');
    gameScreen = document.getElementById('gamescreen-container');
    showScoreboardButton = document.getElementById('to-scoreboard-button');
    
    var difficulty = getDifficulty();
    var startButton = document.getElementById('start-button');
    var questionText = document.getElementById('question-text');
    var wordDisplay = document.getElementById('word-display');
    var wordInputField = document.getElementById('word-input-field');
    var feedbackBox = document.getElementById('feedback-container');
    var feedbackText = document.getElementById('feedback-text');
    var loadingContainer = document.getElementById('loading-container');
    var loadingIcon = document.getElementById('loading-icon');
    var gameHintContainer = document.getElementById("game-hint-container");
    var gameHintText = document.getElementById('game-hint-text');
    
    //Loading icon
    loadingContainer.style.display = "block";
    loadingIcon.style.animation = "rotate .5s ease 2";
    
    //Initialize test set
    initializeTestSet(difficulty);
    
    //Wait to load game
    var timer = setTimeout(function () {
        loadingContainer.style.display = "none";
        //Display game screen
        gameScreen.style.display = "block";
        gameScreen.style.animation = "popIn .15s ease 1 forwards";
        updateScreen();
        loadingIcon.style.animation = "none";
    }, 1000);
    
    //Clear the screen
    centerContainer.style.display = "none";
    startButton.style.display = "none";
    
    //Total seconds remaining
    var totalSeconds = 20;
    var currentSecond = totalSeconds;
    
    //Initialize game data
    currentQuestion = 1;
    totalPoints = 0;
    setIndex = null;
    var questionLength = testSet.length;
    var numCorrect = 0;
    var gainedPoints = 0;
    
    function updateTimer() {
        timerText = document.getElementById('timer-value');
        timeout = setTimeout(updateTimer, 1000);
        timerText.innerHTML = currentSecond;
        
        //Give hint
        if (currentSecond == 10) {
            gameHintContainer.style.display = "block";
            gameHintContainer.style.animation = "popIn .3s ease 1 forwards";
            gameHintText.innerHTML = "Word begins with a(n) " + referenceSet[currentQuestion-1].charAt(0);
        }
        
        if (currentSecond == 0) {
            clearTimeout(timeout);
            transition("Time's Up!");
        } else {
            currentSecond--;
        }
        
    }
    
    //Reset the timer
    function resetTimer() {
        currentSecond = totalSeconds;
        updateTimer();
    }
    
    //Update the game screen
    function updateScreen() {
        if (currentQuestion > questionLength) {
            clearTimeout(timeout);
            reportScore();
            storeData(username, totalPoints);
            clearData();
            gameHintContainer.style.display = "none"
        } else {
            resetTimer();
            wordInputField.style.display = "block";
            wordInputField.disabled = false;
            wordInputField.focus();
            feedbackBox.style.display = "none";
            feedbackBox.style.animation = "none";
            gameHintContainer.style.display = "none";

            setIndex = currentQuestion - 1;
            questionText.innerHTML = "Problem " + currentQuestion + " of " + questionLength;
            wordDisplay.innerHTML = testSet[setIndex].toUpperCase();
        }
    }
    
    //Track what the user is typing to see if they guess the correct word
    checkAnswer = function () {
        if (wordInputField.value.toLowerCase() == referenceSet[setIndex]) {
            clearTimeout(timeout);
            gainedPoints = (testSet[setIndex].length * 10) + (currentSecond);
            totalPoints += gainedPoints;
            transition("Correct!", gainedPoints);
        }
    }
    
    //Display feeback and move to next problem
    function transition(message, pointsGained) {
        if (message == "Correct!") {
            feedbackBox.style.background = "#00cc99";
            feedbackText.innerHTML = message + " +" + pointsGained + " pts";
        }
        if (message == "Time's Up!") {
            feedbackBox.style.background = "#ff6666";
            feedbackText.innerHTML = message + " +0 pts";
        }
        feedbackBox.style.display = "block";
        feedbackBox.style.animation = "popIn .5s ease 1";
        wordInputField.disabled = true;
        var timer = setTimeout(function () {
            wordInputField.value = "";
            updateScreen();
        }, 2500);
        currentQuestion++;
    }
    //Display score
    function reportScore() {
        questionText.innerHTML = "Completed";
        timerText.innerHTML = "";
        wordInputField.style.display = "none";
        wordDisplay.innerHTML = username + ", you earned " + totalPoints + " pts!";
        feedbackBox.style.display = "none";
        showScoreboardButton.style.display = "block";
        showScoreboardButton.style.animation = "popIn .5s ease 1";
        //var firstEntry = document.getElementById('tab1');
        //firstEntry.innerHTML = "1 " + username + " " + totalPoints + " points";
    }
    
    //Clear data
    function clearData() {
        currentQuestion = 1;
        totalPoints = 0;
        testSet = [];
        username = "";
        levelSlider.value = 1;
        getDifficulty();
        wordInputField.value = "";
    }
}
//Show scoreboard
function showScoreboard() {
    updateScoreboard();
    scoreBoard = document.getElementById('scoreboard-container');
    resetButton = document.getElementById('reset-button');
    gameScreen.style.display = "none";
    scoreBoard.style.display = "block";
    scoreBoard.style.animation = "popIn .5s ease 1";
    resetButton.style.display = "block";
    showScoreboardButton.style.display = "none";
}
//Reset the game
function resetGame() {
    centerContainer.style.display = "block";
    centerContainer.style.animation = "popIn .5s ease 1";
    titleContainer.style.zIndex = "2";
    titleContainer.style.opacity = "1";
    difficultyContainer.style.zIndex = "1";
    difficultyContainer.style.opacity = "0";
    scoreBoard.style.display = "none";
    resetButton.style.display = "none";
    showScoreboardButton.style.display = "none";
    resetScoreboard();
}
function getNext(varName) {
    var x;
    if (sessionStorage.length == 0) {
        x = varName + 1;
        return x;
    } else {
        if (varName == "name") {
            x = varName + ((sessionStorage.length + 3) / 3);
            return x;
        }
        if (varName == "score") {
            x = varName + ((sessionStorage.length + 2) / 3);
            return x;
        }
        if (varName == "date") {
            x = varName + ((sessionStorage.length + 1) / 3);
            return x;
        }
    }
}
//sessionStorage.clear();
function getStorageData(key) {
    return sessionStorage.getItem(key);
}

//Top players data; includes username and score
var topPlayers = [[], [], [], [], [], [], [], [], [], []];
var scores = [];
var names = [];
var dates = [];
function loadUserData() {
    var storageLength = sessionStorage.length;
    for (var i = 0 ; i < storageLength / 3; i++) {
        names[i] = getStorageData("name" + (i + 1));
        scores[i] = getStorageData("score" + (i + 1));
        dates[i] = getStorageData("date" + (i + 1));
    }
}

//Maximum number of storage entries (name, score) = two entries
const MAXIMUM_ENTRIES = 30;

//Store user data using session storage
function storeData(name, points) {
    var storageLength = sessionStorage.length;
    //var lastScore = getStorageData("score" + (storageLength / 2));
    loadUserData();
    if (storageLength < MAXIMUM_ENTRIES && !names.includes(name)) {
        sessionStorage.setItem(getNext("name"), name);
        sessionStorage.setItem(getNext("score"), points);
        sessionStorage.setItem(getNext("date"), new Date().getTime() / 1000);
    } else {
        if (names.includes(name)) {
            if (points > scores[names.indexOf(name)]) {
                sessionStorage.setItem("score" + (names.indexOf(name) + 1), points);
            }
        } else {
            scores.sort(function(a,b) {return b - a;});
            for (var i = 0; i < scores.length; i++) {
                if (points > scores[i]) {
                    //Get smallest score value
                    var min = scores[scores.length-1];
                    //Reset scores array
                    loadUserData();
                    var minMatch = getIndexMatch(scores, min);
                    var recentDate = dates[minMatch[0]];
                    for (var i = 0; i < minMatch.length-1; i++) {
                        if(recentDate > dates[minMatch[i+1]])
                            recentDate = dates[minMatch[i]];
                        else 
                            recentDate = dates[minMatch[i+1]];
                    }
                    sessionStorage.setItem("name" + (dates.indexOf(recentDate) + 1), name);
                    sessionStorage.setItem("score" + (dates.indexOf(recentDate) + 1), points);
                    sessionStorage.setItem("date" + (dates.indexOf(recentDate) + 1), new Date().getTime() / 1000);
                    break;
                }
            }
        }
    }
}
function getIndexMatch(intArray, value) {
    var indices = [];
    for (var i = 0; i < intArray.length; i++) {
        if (value == intArray[i]) {
            indices.push(i);
        }
    }
    return indices;
}

function setTopPlayers() {
    loadUserData();
    for (var i = 0; i < sessionStorage.length / 3; i++) {
        for (var j = 0; j < 2; j++) {
            if (j == 0) {
                topPlayers[i][j] = scores[i];
            }
            if (j == 1) {
                topPlayers[i][j] = names[i];
            }
        }
    }
    topPlayers.sort(function(a,b) {return b[0] - a[0];});
}
function updateScoreboard() {
    var scoreboardBody = document.getElementById('scoreboard-body');
    
    setTopPlayers();
    var length = topPlayers.length;
    
    for (var i = 0; i < length; i++) {
        var scoreTab = document.createElement('div');
        scoreTab.className = "tab";
        if (topPlayers[i].length == 0) {
            return false;
        } else {
            if (i == 0) {
                scoreTab.innerHTML = (i + 1) + " &#9818; " + topPlayers[i][1] + " " + topPlayers[i][0] + " pts";
            }
            if (i == 1) {
                scoreTab.innerHTML = (i + 1) + " &#9819; " + topPlayers[i][1] + " " + topPlayers[i][0] + " pts";
            }
            if (i > 1) {
                scoreTab.innerHTML = (i + 1) + " &diams; " + topPlayers[i][1] + " " + topPlayers[i][0] + " pts";
            }
            scoreboardBody.appendChild(scoreTab);
        }
    }    
}
function resetScoreboard() {
    var scoreboardBody = document.getElementById('scoreboard-body');
    if (scoreboardBody.childElementCount == 0) {
        return false;
    } else {
        /*var scoreTabs = scoreboardBody.childNodes;
        for (var i = 0; i < scoreTabs.length; i++) {
            scoreboardBody.removeChild(scoreTabs[0]);
        }*/
        scoreboardBody.innerHTML = "";
    }
}