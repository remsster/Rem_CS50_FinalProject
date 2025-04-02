
let showTaskViewButton = undefined;
let hideTaskViewButton = undefined;
let taskView = undefined;
let taskViewIsHidden = true;

const darkFocusAnimation = "trigger-dark-focus-view 1s forwards";
const lightFocusAnimation = "trigger-light-focus-view 1s forwards";
const endFocusAnimation = "end-focus-view 1s forwards";

document.addEventListener("DOMContentLoaded", () => {
    showTaskViewButton = document.querySelector("#show-task-view-button");
    hideTaskViewButton = document.querySelector("#hide-task-view-button");
    taskView = document.querySelector(".add-task-div");

    taskView.style.display = "none";

    startTimerButton.addEventListener("click", toggleFocusView);
    hideTaskViewButton.addEventListener("click",(e) => {
        e.preventDefault();
        toggleTaskView();
    });
    showTaskViewButton.addEventListener("click", (e) => {
        e.preventDefault();
        toggleTaskView();
    });
});

function toggleTaskView () {
    if (taskViewIsHidden) {
        taskView.style.display = "flex";
        showTaskViewButton.style.display = "none";
    } else {
        taskView.style.display = "none";
        showTaskViewButton.style.display = "block";
    }
    taskViewIsHidden = !taskViewIsHidden;
}

function toggleFocusView() {
    if (running) {
        taskView.style.display = "none";
        showTaskViewButton.style.display = "block";
        showTaskViewButton.disabled = true;
        taskViewIsHidden = true;
        document.querySelector("body").style.animation = darkFocusAnimation;
        document.querySelector(".animatable-label").style.animation = darkFocusAnimation;
        document.querySelector(".animatable-select").style.animation = darkFocusAnimation;
        document.querySelector(".animatable-input").style.animation = darkFocusAnimation;
        
        document.querySelectorAll(".animatable-button").forEach(element => {
            element.style.animation = darkFocusAnimation;
        });
        
    } else {
        showTaskViewButton.disabled = false;
        document.querySelector("body").style.animation = endFocusAnimation;
        document.querySelector(".animatable-label").style.animation = endFocusAnimation;
        document.querySelector(".animatable-select").style.animation = endFocusAnimation;
        document.querySelector(".animatable-input").style.animation = endFocusAnimation;
        document.querySelectorAll(".animatable-button").forEach(element => {
            element.style.animation = endFocusAnimation;
        });
    }
}
