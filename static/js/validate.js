let taskInput = undefined;
let submitTaskButton = undefined;
let taskInputForm = undefined;

document.addEventListener("DOMContentLoaded",() => {
    taskInput = document.querySelector("#task-input");
    submitTaskButton = document.querySelector("#submit-task-button");
    taskInputForm = document.querySelector("#task-input-form");
    

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
        console.error("Does not start with a letter");
        return false;
    }

    if (!endPattern.test(text)) {
        console.error("Does not end with a letter");
        return false;
    }

    if (!specialPattern.test(text)) {
        console.error("Contains special characters");
        return false;
    }

    for (let i = 0; i < mainTaskSelectTag.length; i ++) {
        if (text === mainTaskSelectTag[i].value) {
            console.error("Task already exists");
            return false;
        }
    }

    return true;
}