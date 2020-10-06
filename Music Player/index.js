/**
Music Player
4/30/2019
**/
//sessionStorage.clear();
//Create list of uploaded audio files
var music = [];
var listContainer = document.getElementById('list-body');

var listItems;
function updateListItems() {
    listItems = document.getElementsByClassName('list-item');
    for(var i = 0; i < listItems.length; i++) {
        listItems[i].id = i + 1;
        listItems[i].onclick = handleSelection;
    }
    
}
//Create library of songs
window.onload = function() {
    //Push all music from sessionStorage to music array
    for(var i = 0; i < sessionStorage.length; i++)
        music[i] = sessionStorage.getItem("music" + (i+1));
    updateLibrary();
    updateListItems();
}
//Create audio object;
var audio = new Audio();
audio.src = "";
//audio.muted = true;
var currentSong = "";

function handleSelection(event) {
    var target = event.target;
    var index = target.id - 1;
    let lowerLimit = index - 0;
    let upperLimit = index + 1;
    let nextSong = music[index];
    
    //Don't allow any further action after first selection
    if(nextSong == currentSong) {
        event.preventDefault();
    } else {
        audio.src = nextSong;
        audio.play();
        //audio.currentTime = 118;
        document.getElementById('play-icon').style.opacity = "0";
        document.getElementById('pause-icon').style.opacity = "1";
    }
    currentSong = nextSong;
    
    //Handle which item is selected
        target.style.background = "#F48FB1";
        target.style.color = "white";
        if(index == 0) {
            for(var i = 1; i < listItems.length; i++) {
                listItems[i].style.background = "#FCE4EC";
                listItems[i].style.color = "black";
            }
        }
        if(index == listItems.length - 1) {
            for(var i = listItems.length - 2; i >= 0; i--) {
                listItems[i].style.background = "#FCE4EC";
                listItems[i].style.color = "black";
            }
        } 
        if(index > 0 && index < listItems.length - 1) {
            for(var i = 0; i < lowerLimit; i++) {
                listItems[i].style.background = "#FCE4EC";
                listItems[i].style.color = "black";
            }
            for(var i = upperLimit; i < listItems.length; i++) {
                listItems[i].style.background = "#FCE4EC";
                listItems[i].style.color = "black";
            }
        }
        let songTitle = document.getElementById('song-title-box').firstElementChild;
        songTitle.textContent = "Playing " + currentSong.replace(".mp3", "");
}
function updateLibrary() {
    var songName = "";
    
    for(var i = 0; i < music.length; i++) {
        let listItem = document.createElement("div");
        listItem.className = "list-item";

        //Filter the extension
        var endpoint = music[i].indexOf(".");
        songName = music[i].substring(0, endpoint);
        listItem.innerHTML = songName;
        listContainer.appendChild(listItem);
    }
}
function number() {
    if(sessionStorage.length >= 1)
        return sessionStorage.length + 1;
    else 
        return 1;
}

//Add songs to music array and sessionStorage
function addMusic() {
    let inputFile = document.getElementById('upload-music').files[0];
    if(inputFile == undefined) {
        return;
    } else {
    music.push(inputFile.name);
    sessionStorage.setItem("music" + number(), inputFile.value);
    
    //Append to listContainer
    addListItem();
    }
}

function addListItem() {
    let listItem = document.createElement("div");
    listItem.className = "list-item";
    //Filter the extension
    var endpoint = music[music.length-1].indexOf(".");
    var songName = music[music.length-1].substring(0, endpoint);
    listItem.innerHTML = songName;
    listContainer.appendChild(listItem);
    updateListItems();
}
function playAudio() {
    let playButton = document.getElementById('play-icon');
    let pauseButton = document.getElementById('pause-icon');
    if(audio.currentSrc == "") {
        return false;
    }
    if(pauseButton.style.opacity != "1") {
        pauseButton.style.opacity = "1";
        playButton.style.opacity = "0";
        audio.play();
    } else {
        playButton.style.opacity = "1";
        pauseButton.style.opacity = "0";
        audio.pause();
    }
}

var totalDuration;
var rawDuration;
audio.addEventListener("loadeddata", function() {
    totalDuration = audio.duration;
    rawDuration = totalDuration / 60;
    seekBar.disabled = false;
});

var currentMinute = 0;
//var currentSecond = 0;
function displayCurrentTime() {
    //Display song duration information
    let currentTime = Math.floor(audio.currentTime);
    let totalMinute = rawDuration.toString().split(".")[0];
    let remainder = Math.floor(totalDuration % 60);
    let remainderText = "";
    let currentDuration;
    
    if(remainder < 10) {
        remainderText = "0" + remainder;
    } else {
        remainderText = remainder;
    }
    let totalTime = totalMinute + ":" + remainderText;
    let currentSecond;
    if(audio.ended) {
        currentMinute = 0;
        currentSecond = 0;
        currentDuration = "0:00";
        timeText = currentDuration + " | " + totalTime;
    }
    currentMinute = Math.floor(currentTime / 60);
    if(currentTime < 60) {
        currentSecond = currentTime;
    }
    if(currentTime / (Math.floor(currentTime/60)) == 60) {
        currentSecond = 0;
    }
    //console.log(currentTime + ":" + currentTime / (currentTime/60).toFixed(2));
    if(currentTime > 60) {
        let factor = Math.floor(currentTime / 60);
        currentSecond = currentTime - (60 * (60 * factor / 60));
    }
    if(currentSecond < 10 || currentTime == currentTime / (currentTime/60)) {
        currentDuration = currentMinute + ":0" + currentSecond;
    } else {
        currentDuration = currentMinute + ":" + currentSecond;
    }
    let timeText = document.getElementById('duration');
    timeText.textContent = currentDuration + " | " + totalTime;
    
    let step = currentTime / Math.round(totalDuration) * 100;
    seekBar.value = step;
}
audio.addEventListener("timeupdate", displayCurrentTime);

var uploadButton = document.getElementById('upload-button');
var cancelButton = document.getElementById('cancel-button');

function manageUpload() {
    let inputFile = document.getElementById('upload-music').files[0];
    let filePath = document.getElementById('upload-music').value;
    let fileName = filePath.substring((filePath.lastIndexOf("\\")+1), filePath.length);
    if(filePath == "")
        return;
    if(music.length == 0) {
        uploadButton.innerHTML = "Upload " + fileName;
        uploadButton.style.margin = "15px auto 0 10px";
        cancelButton.style.width = "100px";
    } else {
        for(var i = 0; i < music.length; i++) {
            if(fileName == music[i]) {
                alert("Song already uploaded. \n" + fileName + "matches " + music[i]);
                return false;
            }
        }
        uploadButton.innerHTML = "Upload " + fileName;
        uploadButton.style.margin = "15px auto 0 10px";
        cancelButton.style.width = "100px";
    }
}
function uploadMusic(event) {
    let inputFile = document.getElementById('upload-music');
    
    var hasDuplicate = function() {
        for(var i = 0; i < music.length; i++) {
            if(inputFile.files[0].name == music[i]) {
                return true;
            } else {
                return false;
            }
        }
        if(music.length == 0)
            return false;
    }
    
    if(inputFile.value != "" && hasDuplicate() === false && uploadButton.innerHTML != "Upload") {
        event.preventDefault();
        addMusic();
        uploadButton.style.margin = "15px 0px 15px 60px";
        uploadButton.innerHTML = "Upload";
        cancelButton.style.width = "0px";
    }
    reset();
}
function cancelUpload() {
    uploadButton.style.margin = "15px 0px 15px 60px";
    uploadButton.innerHTML = "Upload";
    cancelButton.style.width = "0px";
    reset();
}
function reset() {
    let inputFile = document.getElementById('upload-music');
    inputFile.value = "";
}

//Manage seeking of song 
var seekBar = document.getElementById('seekbar');
function manageSeek() {
    let seekPoint = (seekBar.value / 100) * Math.round(audio.duration);
    audio.play();
    audio.currentTime = seekPoint;
    //console.log(seekPoint);
    
}