let ctx = undefined;

let getDataButton = undefined;

let myChart = undefined;

let selectedData = undefined;
let taskSelectTag = undefined;
let chartTitleTag = undefined;
let monthSelectTag = undefined;

let data = undefined;
let promodoroData = undefined;

document.addEventListener("DOMContentLoaded", () => {
    ctx = document.getElementById("chart");
    getDataButton = document.querySelector("#show-chart-data");
    taskSelectTag = document.querySelector("#task-select-stats");
    chartTitleTag = document.querySelector(".chart-title");
    monthSelectTag = document.querySelector("#month-select-stats");

    let dates = [];
    let sessions = [];

    getDataButton.addEventListener("click", async () => { 
        await getPromodoroData();
        console.log(taskSelectTag.value);
        if (taskSelectTag.value == "none") {
            chartTitleTag.innerHTML = "Data for no task";
        } else {
            chartTitleTag.innerHTML = "Task: " + taskSelectTag.value;
        }
        let dates = [];
        let sessions = [];
        selectedData = data[taskSelectTag.value];
        try{
            selectedData.forEach((curr) => {
                if (curr["month"] == monthSelectTag.value) {
                    sessions.push(curr["promodoro"]);
                    dates.push(`${curr["date"]}/${curr["month"]}`)

                }
            });
        } catch(err) {
            chartTitleTag.innerHTML = "No data for " + taskSelectTag.value;
        }
        crateChart(dates,sessions);
    });
    getPromodoroData();
});

async function getPromodoroData() {
    fetch("http://localhost:5000/process").then(response => {
        return response.json();
    }).then(result => {
        data = result;
        console.log("data", data);
    }).catch(err => {
        console.error("Error:", err);
    });
}


function crateChart(dates, sessions) {
    
    if (myChart) { myChart.destroy(); }
    myChart = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: dates,
          datasets: [{
            label: '# of Sessions',
            data: sessions,
            borderWidth: 1
          }]
        },
        options: {
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
}