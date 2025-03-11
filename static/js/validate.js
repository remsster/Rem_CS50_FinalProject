let taskInput = undefined;
let submitTaskButton = undefined;
let taskInputForm = undefined;
let alertBar = undefined;

document.addEventListener("DOMContentLoaded",() => {
    taskInput = document.querySelector("#task-input");
    submitTaskButton = document.querySelector("#submit-task-button");
    taskInputForm = document.querySelector("#task-input-form");
    alertBar = document.querySelector("#warning");
    alertBar.style.display = "none"
    

    taskInputForm.addEventListener("submit",(e) => {
        e.preventDefault();
        if (validateInput(taskInput.value))
        {
            taskInputForm.submit();
        }
    });
});

function validateInput(text) {
    const beginningPattern = /^[a-zA-Z]+/;
    const endPattern =/[a-zA-Z]$/;
    const specialPattern = /^[^!@#$%^&*() -=+]+$/i;
    if (!beginningPattern.test(text)) {
        showAlertBarWithMessage("Does not start with a letter");
        return false;
    }

    if (!endPattern.test(text)) {
        
        showAlertBarWithMessage("Does not end with a letter");
        return false;
    }

    if (!specialPattern.test(text)) {
        showAlertBarWithMessage("Contains special characters, replace spaces with underscores _");
        return false;
    }

    for (let i = 0; i < mainTaskSelectTag.length; i ++) {
        if (text === mainTaskSelectTag[i].value) {
            showAlertBarWithMessage("Task already exists");
            return false;
        }
    }

    return true;
}

function showAlertBarWithMessage(message) {
    alertBar.style.display = "block";
    alertBar.innerHTML = message;
}