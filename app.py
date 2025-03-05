from flask import Flask
from flask import render_template, request, redirect, jsonify
from datetime import datetime
import sqlite3

connect = sqlite3.connect("test.db",check_same_thread=False)
# connect.row_factory = lambda cursor, row : row[0]
cursor = connect.cursor()

app = Flask(__name__)

@app.route("/")
def index():
    # get all taskl
    tasks = cursor.execute("SELECT name FROM tasks WHERE name != ?",("none",)).fetchall()
    tasks = map(lambda row: row[0], tasks)
    return render_template("index.html",items=tasks)

@app.route("/current-task")
def current_task():
    # Getting data for todays task when application starts
    # application always starts with none as current task
    current_task_data = cursor.execute("SELECT * FROM tasks WHERE name = ?",("none",)).fetchall()[0]
    today = datetime.now()

    row_exists = cursor.execute("SELECT EXISTS(SELECT * FROM work_session WHERE task_id = ? AND work_year = ? AND work_month = ? AND work_day = ?)",
    (current_task_data[0], today.year, today.month, today.day)).fetchall()

    if row_exists[0][0] == 1:
        todays_session = cursor.execute("SELECT * FROM work_session WHERE task_id = ? AND work_year = ? AND work_month = ? AND work_day = ?",
            (current_task_data[0], today.year, today.month, today.day)).fetchall()[0]
        data = {
            "promodoro": todays_session[2]
        }
        return data
    
    return "todays data not found", 400


@app.route("/process", methods = ["POST"])
def process():
    if request.method == "POST":
        data = request.json
        promodoro = data["promodoroCount"]
        year = data["year"]
        month = data["month"]
        date = data["date"]
        task = data["task"]

        if not promodoro:
            return "no promodoro count infomation"
        try:
            promodoro = int(promodoro)
        except valueError:
            return "promodoro needs to be a number"

        if not year:
            return "no year data"
        
        if not month:
            return "no month data"
        
        if not date:
            return "not date for today"
        
        if not task:
            return "no task data"
        
        task_exists = cursor.execute("SELECT EXISTS(SELECT * FROM tasks WHERE name = ?)", (task,)).fetchall()
        task_exists = list(map(lambda row: row[0], task_exists))[0]

        if task_exists == 0:
            cursor.execute("INSERT INTO tasks (name) VALUES (?)", (task,))

        row_exists = cursor.execute("SELECT EXISTS(SELECT * FROM work_session WHERE work_year = ? AND work_month = ? AND work_day = ?)",(year,month,date)).fetchall()
        task_id = cursor.execute("SELECT id FROM tasks WHERE name = ?", (task,)).fetchall()[0][0]

        if row_exists[0][0] == 1:
            # update table
            cursor.execute("UPDATE work_session SET promodoro = ? WHERE work_year = ? AND work_month = ? AND work_day = ?",(promodoro,year,month,date))
        else:
            # create new row
            cursor.execute("INSERT INTO work_session (task_id,promodoro,work_year,work_month,work_day) VALUES (?,?,?,?,?)", (task_id,promodoro,year,month,date))
        
        connect.commit()
        
    return "process route"

@app.route("/create-task", methods = ["POST"])
def create_task():
    if request.method == "POST":
        task = request.form.get("task")
        if not task:
            return "no task to add"
        task = task.lower()

        task_exists = cursor.execute("SELECT EXISTS(SELECT * FROM tasks WHERE name = ?)", (task,)).fetchall()

        if task_exists == 1:
            return "Task already exists"
        
        cursor.execute("INSERT INTO tasks(name) VALUES(?)", (task,))
        # Save changes to database
        connect.commit()
        return redirect("/", code=302)

@app.route("/delete-task", methods = ["POST"])
def delete_task():
    if request.method == "POST":
        task = request.form.get("task")
        if not task:
            print("no task to delete")
        else:
            task = task.lower()
            row_exists = cursor.execute("SELECT EXISTS(SELECT id FROM tasks WHERE name = ?)",(task,)).fetchall()
            if row_exists[0][0] == 1:
                task_id = cursor.execute("SELECT id FROM tasks WHERE name = ?",(task,)).fetchall()[0][0]
                cursor.execute("DELETE FROM work_session WHERE task_id = ?", (task_id,))
                cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
            connect.commit()
        return redirect("/", code=302)

@app.route("/delete-all-tasks", methods = ["POST"])
def delete_all_tasks():
    if request.method == "POST":
        cursor.execute("DELETE FROM work_session")
        cursor.execute("DELETE FROM tasks")
        connect.commit()
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)