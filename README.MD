# Promodoro Study Timer
#### Video Demo: <https://www.link-goes-here.com>
#### Description: 
For my CS50x final project i built a promodoro study timer that saves the days you worked on a task into a sqlite database. For the front end i used HTML, CSS and JavaScript and for the backend I used python with the flask module.

For the layout and responsive design, I used the [bootstrap](https://getbootstrap.com/) framework and used [chart.js](https://www.chartjs.org/) to display the promodoro data in a chart.

The promodoro data is collected in a sqlite database using 2 tables:
- task - Contains all the tasks that the user has worked on
- work_sessions - Contains the amount of promodoro sessions for each task on a given

[!NOTE]
The _work_sessions_ table uses the _task_ table id as a foreign key.

The application has 3 states:
- Work/Focus
- Short break
- Long break

When the timer ends in the work/focus state, an alarm will ring and the promodoro counter increases and changes states to either short break or long break depending on the long break interval in the settings. The promodoro count is also sent to the server to either be inserted or updated in the database.

#### Settings:
The amount of time for working a breaks can be set in the settings modal. The long break interval is for how many short breaks you will have before the user encounters a long break.

The user is also able to delete data for a particular task or delete all data from the application.

#### Stats:
The user can view the promodoro data for the selected month and year. If no year is selected then the year will default to the current year, however a month must be selected. 

The user is able to view data for a selected task or the data for when no task was selected during work/focus sesions.

If there is no data for a task then user will be notified when they try to get the data for a particular task.





