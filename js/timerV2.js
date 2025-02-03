// HTML elements
let timerContainer = undefined;
let startTimerButton = undefined;
let resetTimerButton = undefined;
let skipSessionButton = undefined;
let statsButton = undefined;
let settingsButton = undefined;
let promodoroTag = undefined;
let modalTitleTag = undefined;
let sessionTitle = undefined;


let minutes = 0;
let seconds = 0;
let pastTime = 0;
let running = false;
let isReset = true;
let skipped = false;


// Date objects
let currentTime = undefined;
let endTime = undefined;

// SetInterval object
let timer = undefined;

// timers start points
// let workTime = 1;
// let shortBreak = 5
// let longBreak = 15;

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

    sessionTitle.innerHTML = currentState.title;

    timerContainer.innerHTML = formatTime(currentState.time);

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
});

function formatTime(minutes,seconds = 0) {
    let minutesString = minutes < 10 ? "0" + String(minutes) : minutes;
    let secondsString = seconds < 10? "0" + String(seconds) : seconds;
    return `${minutesString}:${secondsString}`;
}

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

function getStopTime(startDT, minutes = 0, seconds = 0) {
    let end = startDT;
    end.setMinutes(end.getMinutes() + minutes);
    end.setSeconds(end.getSeconds() + seconds);
    return end;
}

function finishSession() {
    clearInterval(timer);
    isReset = true;
    running = false;
    startTimerButton.innerHTML = "Start";
    if (currentState == states.work && !skipped) {
        promodoro += 1;
    }
    skipped = false;
    promodoroTag.innerHTML = promodoro;

    if (currentState == states.work) {
        if (promodoro % 4 == 0) {
            currentState = states.longBreak;
        } else {
            currentState = states.shortBreak;
        }
    } else {
        currentState = states.work;
    }

    SetupSession();
}

function SetupSession() {
    timerContainer.innerHTML = formatTime(currentState.time);
    sessionTitle.innerHTML = currentState.title;
}

// button functions
function startTimer() {
    if (isReset) {
        currentTime = new Date();
        endTime = getStopTime(currentTime, currentState.time);
        isReset = false;
    } else {
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