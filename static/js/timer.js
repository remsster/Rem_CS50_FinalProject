
// HTML tags
let timerContainer = undefined;
let startTimerButton = undefined;
let resetTimerButton = undefined;
let skipSessionButton = undefined;
let statsButton = undefined;
let settingsButton = undefined;
let promodoroTag = undefined;
let modalTitleTag = undefined;

let minutes = 0;
let seconds = 0;
let currentTime = "";
let running = false;
let sessionTitle = "";
let timer = undefined;

let workTime = 25;
let shortBreak = 5
let longBreak = 15;
let promodoro = 0

let closedTime = undefined;
let openTime = undefined;
let secondsPassed = 0;

const states = {
    Work: "Work",
    ShortBreak: "ShortBreak",
    LongBreak: "LongBreak"
};

let currentState = states.Work;

document.addEventListener("DOMContentLoaded",() => {
    timerContainer = document.querySelector(".timer");
    startTimerButton = document.querySelector("#start-timer-button");
    resetTimerButton = document.querySelector("#reset-timer-button");
    skipSessionButton = document.querySelector("#skip-session");
    statsButton = document.querySelector("#stats-button");
    settingsButton = document.querySelector("#settings-button");

    sessionTitle = document.querySelector(".session-title");
    promodoroTag = document.querySelector(".promodoro-count");
    modalTitleTag = document.querySelector(".modal-title");

    window.addEventListener('blur', () => {
        console.log("closed");
        closedTime = new Date();
    });

    window.addEventListener('focus', () => {
        openTime = new Date();
        console.log()
    });

    sessionTitle.innerHTML = "Work";
    promodoroTag.innerHTML = promodoro;

    minutes = workTime;
    seconds = 0;
    if (seconds < 10) { seconds = "0"+seconds; }
    currentTime = minutes + ":" + seconds;
    timerContainer.innerHTML = currentTime;

    statsButton.addEventListener("click", () => { 
        modalTitleTag.innerHTML = "Statistics";
    });

    settingsButton.addEventListener("click", () => {
        modalTitleTag.innerHTML = "Settings";
    });

    startTimerButton.addEventListener("click", () => {
        running = !running;
        if (running) {
            startTimerButton.innerHTML = "Stop";
            resetTimerButton.disabled = true;
            skipSessionButton.disabled = true;
            startTimer();
        } else {
            startTimerButton.innerHTML = "Start";
            resetTimerButton.disabled = false;
            skipSessionButton.disabled = false;
            stopTimer();
        }
    });

    resetTimerButton.addEventListener("click", resetTimer);
    skipSessionButton.addEventListener("click", skipSession);
});

function skipSession() {
    minutes = 0;
    seconds = 0;
    seconds = "0"+seconds;
    finishSession(true);
}

function finishSession(wasSkipped = false) {
    running = false;
    skipSessionButton.disabled = false;
    if (currentState == states.Work) {
        if (!wasSkipped) {
            promodoro += 1;
        }
        setupForBreak();
    } else {
        setupForWork();
    }

    startTimerButton.innerHTML = "Start";
    promodoroTag.innerHTML = promodoro;
    clearInterval(timer);
    setupTimer();
}

function setupForBreak() {
    if (promodoro % 4 == 0 && promodoro != 0) {
        currentState = states.LongBreak;
    } else {
        currentState = states.ShortBreak;
    }
    sessionTitle.innerHTML = "Break";
}

function setupForWork() {
    currentState = states.Work;
    sessionTitle.innerHTML = "Work";
}

function setupTimer() {
    if (currentState == states.LongBreak) {
        minutes = longBreak;
    } else if (currentState == states.ShortBreak) {
        minutes = shortBreak;
    } else {
        minutes = workTime;
    }

    currentTime = minutes + ":" + seconds;
    timerContainer.innerHTML = currentTime;
}

function updateTimer()
{
    if (minutes == 0 && seconds == 0) {
        finishSession();
        return;
    }
    if (seconds == 0) {
        minutes -= 1;
        seconds = 59;
    } else {
        seconds -= 1;
    }
    if (Number(seconds) < 10) { seconds = "0" + String(seconds); }
    let currentTime = minutes + ":" + seconds;
    timerContainer.innerHTML = currentTime;
}

function startTimer() {
    timer = setInterval(updateTimer, 10);
}

function stopTimer() {
    clearInterval(timer);
    if (minutes == 0 && seconds == 0) {
        resetTimer();
    }
}

function resetTimer() {
    if (running) { return; }
    setupForWork();
    minutes = workTime;
    seconds = 0;
    promodoro = 0;
    if (seconds < 10) { seconds = "0"+seconds; }
    currentTime = minutes + ":" + seconds;
    timerContainer.innerHTML = currentTime;
    promodoroTag.innerHTML = promodoro;
}