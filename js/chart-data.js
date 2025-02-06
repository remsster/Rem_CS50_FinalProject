let ctx = undefined;

let getDataButton = undefined;

let myChart = undefined;

let selectedData = undefined;
let taskSelectTag = undefined;
let chartTitleTag = undefined;

document.addEventListener("DOMContentLoaded", () => {
    ctx = document.getElementById("chart");
    getDataButton = document.querySelector("#show-chart-data");
    taskSelectTag = document.querySelector("#task-select");
    chartTitleTag = document.querySelector(".chart-title");

    let d1 = [
        {
            task: "python programming",
            data: [
                {
                    date: new Date("2025-02-21"),
                    sessions: 10
                },
                {
                    date: new Date("2025-02-22"),
                    sessions: 6
                },
                {
                    date: new Date("2025-02-23"),
                    sessions: 2
                },
            ]
        },
        {
            task: "chinese",
            data: [
                {
                    date: new Date("2025-02-21"),
                    sessions: 4
                },
                {
                    date: new Date("2025-02-22"),
                    sessions: 8
                },
                {
                    date: new Date("2025-02-23"),
                    sessions: 12
                },
                {
                    date: new Date("2025-02-24"),
                    sessions: 6
                },
                {
                    date: new Date("2025-02-25"),
                    sessions: 5
                },
                {
                    date: new Date("2025-02-26"),
                    sessions: 3
                },
                {
                    date: new Date("2025-02-27"),
                    sessions: 4
                },
                {
                    date: new Date("2025-02-28"),
                    sessions: 10
                },
                {
                    date: new Date("2025-03-01"),
                    sessions: 3
                },
            ]
        },


    ];

    let d2 = [
        {
            date: new Date("2025-02-21"),
            sessions: 4
        },
        {
            date: new Date("2025-02-22"),
            sessions: 8
        },
        {
            date: new Date("2025-02-23"),
            sessions: 12
        },
        {
            date: new Date("2025-02-24"),
            sessions: 2
        },
        {
            date: new Date("2025-02-25"),
            sessions: 6
        },
        {
            date: new Date("2025-02-26"),
            sessions: 9
        },
        {
            date: new Date("2025-02-27"),
            sessions: 4
        },
    ];

    selectedData = d1[0].task;
    console.log(selectedData);

    let dates = [];
    let sessions = [];

    // console.log(
    //     d1.filter((x) => x.task == selectedData)[0].data.map((y) => y.sessions)
    // );

    console.log()

    taskSelectTag.addEventListener("change", () => {
        // console.log("changed: " + taskSelectTag.value);
        selectedData = taskSelectTag.value;
        dates = d1.filter((x) => x.task == selectedData)[0].data.map((y) => {
            
            y.date.getDate() + "/" + (y.date.getMonth() + 1)
        });
        sessions = d1.filter((x) => x.task == selectedData)[0].data.map((y) => y.sessions);
    })

    // let dates = d2.map((x) => { 
    //     return dateString = x.date.getDate() + "/" + (x.date.getMonth() + 1);
    // });
    // let sessions = d2.map((x) => x.sessions);

    console.log(dates);
    // console.log(sessions);

    // crateChart(dates,sessions);

    getDataButton.addEventListener("click", () => { 
        chartTitleTag.innerHTML = selectedData;
        crateChart(dates,sessions);
    });

    
});

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