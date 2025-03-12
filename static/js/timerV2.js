// HTML elements
let timerContainer = undefined;
let startTimerButton = undefined;
let resetTimerButton = undefined;
let skipSessionButton = undefined;
let statsButton = undefined;
let settingsButton = undefined;
let saveChangesButton = undefined;
let audioTag = undefined;
let mainTaskSelectTag = undefined;
let taskTitle = undefined;

const focusAudio = "SFX_alert4.wav";
const breakAudio = "SFX_increase1.wav";

let promodoroTag = undefined;
let modalTitleTag = undefined;
let sessionTitle = undefined;

let workInput = undefined;
let shortBreakInput = undefined;
let longBreakInput = undefined;
let breakIntervalInput = undefined;


let minutes = 0;
let seconds = 0;
let pastTime = 0;
let running = false;
let isReset = true;
let skipped = false;
let longBreakInterval = 4;

let currentTask = "None";

// Date objects
let currentTime = undefined;
let endTime = undefined;
let currentDate = undefined;

// SetInterval object
let timer = undefined;

// promodoro session count
let promodoro = 0

let currentState = undefined;
let states = {
    work: {
        time: 1,
        title: "Focus"
    },
    shortBreak: {
        time: 1,
        title: "Short Break"
    },
    longBreak: {
        time: 15,
        title: "Long Break"
    }
}


// Initialize Variables
document.addEventListener("DOMContentLoaded",() => {    
    currentState = states.work;
    timerContainer = document.querySelector(".timer");
    sessionTitle = document.querySelector(".session-title");
    promodoroTag = document.querySelector(".promodoro-count");
    promodoroTag.innerHTML = promodoro;

    startTimerButton = document.querySelector("#start-timer-button");
    resetTimerButton = document.querySelector("#reset-timer-button");
    skipSessionButton = document.querySelector("#skip-session");
    saveChangesButton = document.querySelector("#save-changes");

    mainTaskSelectTag = document.querySelector("#task-select-main");
    taskTitle = document.querySelector(".task-title");

    audioTag = document.querySelector("#audio");
    audioTag.volume = 0.2;

    currentDate = new Date();
    
    workInput = document.querySelector("#work-input");
    shortBreakInput = document.querySelector("#short-break-input");
    longBreakInput = document.querySelector("#long-break-input");
    breakIntervalInput = document.querySelector("#break-interval-input");
    
    sessionTitle.innerHTML = currentState.title;
    
    timerContainer.innerHTML = formatTime(currentState.time);

    mainTaskSelectTag.addEventListener("change", changeTask);
    
    startTimerButton.addEventListener("click", () => {
        running = !running;
        if (running) {
            startTimer();
            resetTimerButton.disabled = true;
            startTimerButton.innerHTML = "Stop";
        } else {
            clearInterval(timer);
            resetTimerButton.disabled = false;
            startTimerButton.innerHTML = "Start";
        }
    });

    resetTimerButton.addEventListener("click", resetTimer);
    skipSessionButton.addEventListener("click", skipSession);
    saveChangesButton.addEventListener("click", saveChanges);


    fetch("http://localhost:5000/current-task/" + mainTaskSelectTag.value).then(response => {
        if (!response.ok) {
            throw new Error("Network response was not okay fetching todays data");
        }
        return response.json();
    }).then(result => {
        promodoro = result["promodoro"];
        promodoroTag.innerHTML = promodoro;
        // return result;
    }).catch(err => {
        console.error("Error: ", err);
    });

    // getPromodoroData();
});

// Format time to look more presentable
function formatTime(minutes,seconds = 0) {
    let minutesString = minutes < 10 ? "0" + String(minutes) : minutes;
    let secondsString = seconds < 10? "0" + String(seconds) : seconds;
    return `${minutesString}:${secondsString}`;
}

// Update the timer as time goes by
function updateTimer() {
    currentTime = new Date();
    const timeLeft = Math.abs(endTime - currentTime);
    pastTime = timeLeft;
    const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
    timerContainer.innerHTML = formatTime(minutes,seconds);
    if (timeLeft < 1000) { 
        // timeLeft is less than 1 second
        finishSession();
    }
}

// Return the time then the timer should end
function getStopTime(startDT, minutes = 0, seconds = 0) {
    let end = startDT;
    end.setMinutes(end.getMinutes() + minutes);
    end.setSeconds(end.getSeconds() + seconds);
    return end;
}

// Cakked when the timer is fishined
function finishSession() {
    clearInterval(timer);
    isReset = true;
    running = false;
    startTimerButton.innerHTML = "Start";

    // If the current state is a work/focus session
    // then send data to the server to be processed
    if (currentState == states.work && !skipped) {
        // play focus audio
        audioTag.src = "/static/audio/" + focusAudio;
        audioTag.load();
        audioTag.play();
        promodoro += 1;

        const today = new Date();
        if (currentDate.getDate() != today.getDate()) {
            // set promodoro to 1 for new day
            promodoro = 1;
            currentDate = today;
        }
        fetch("http://localhost:5000/process",{
            method: "POST",
            body: JSON.stringify(
                { 
                    promodoroCount: promodoro,
                    year: today.getFullYear(),
                    month: today.getMonth() + 1,
                    date: today.getDate(),
                    task:  mainTaskSelectTag.value
                }),
            headers : {
                "Content-type": "application/json; charset=utf-8"
            }
        });
    }

    // Play break audio
    if ((currentState == states.shortBreak || currentState == states.longBreak) && !skipped) {
        audioTag.src = "/static/audio/" + breakAudio;
        audioTag.load();
        audioTag.play();
    }
    
    // Set skipped back to false if session was skipped 
    // and update promodoro count
    skipped = false;
    promodoroTag.innerHTML = promodoro;

    // Set the next state
    if (currentState == states.work) {
        if (promodoro % longBreakInterval == 0 && promodoro > 0) {
            currentState = states.longBreak;
        } else {
            currentState = states.shortBreak;
        }
    } else {
        currentState = states.work;
    }
    SetupSession();
}

// Sets up the display for the new session
function SetupSession() {
    timerContainer.innerHTML = formatTime(currentState.time);
    sessionTitle.innerHTML = currentState.title;
}

// ------------------------------------------------------
// SELECT FUNCTIONS
// ------------------------------------------------------

function changeTask() {
    // console.log(mainTaskSelectTag.selectedIndex);
    const task = mainTaskSelectTag.value;
    console.log(task);
    fetch("http://localhost:5000/current-task/" + task).then(response => {
        return response.json();
    }).then(result => {
        console.log(result);
        promodoro = result["promodoro"];
        promodoroTag.innerHTML = promodoro;
    }).catch(err => {
        console.error("Error:", err);
        promodoro = 0;
        promodoroTag.innerHTML = promodoro;
    });

    if (mainTaskSelectTag.value == "none") {
        taskTitle.innerHTML = "";
    } else {
        taskTitle.innerHTML = "Current Task: " + mainTaskSelectTag.value;
    }
}

// ------------------------------------------------------
// BUTTON FUNCTIONS
// ------------------------------------------------------

function saveChanges() {
    states.work.time = workInput.value ? Number(workInput.value) : 25;
    states.shortBreak.time = shortBreakInput.value ? Number(shortBreakInput.value) : 5;
    states.longBreak.time = longBreakInput.value ? Number(longBreakInput.value) : 15;
    longBreakInput = breakIntervalInput.value ? Number(breakIntervalInput.value) : 4;
    running = false;
    startTimerButton.innerHTML = "Start";
    clearInterval(timer);
    resetTimer();
    SetupSession();
}

function startTimer() {
    if (isReset) {
        // from beginning of timer
        currentTime = new Date();
        endTime = getStopTime(currentTime, currentState.time);
        isReset = false;
    } else {
        // continuing timer
        currentTime = new Date();
        const minutes = Math.floor((pastTime % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((pastTime % (1000 * 60)) / 1000);
        endTime = getStopTime(currentTime, minutes,seconds);
    }
    timer = setInterval(updateTimer, 100);
}

function resetTimer() {
    isReset = true;
    timerContainer.innerHTML = formatTime(currentState.time);
}

function skipSession() {
    skipped = true;
    finishSession();
}