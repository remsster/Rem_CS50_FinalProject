from flask import Flask
from flask import render_template, request, redirect, jsonify
from datetime import datetime
import sqlite3

connect = sqlite3.connect("test.db",check_same_thread=False)

app = Flask(__name__)

success = False
message = ""
@app.route("/")
def index():
    # get all task

    cursor = connect.cursor()
    tasks = cursor.execute("SELECT name FROM tasks WHERE name != ?",("none",)).fetchall()
    # print("task names ", tasks)
    tasks = map(lambda row: row[0], tasks)
    cursor.close()
    data = {
        "success": success,
        "message": message,
        "tasks": list(tasks)
    }
    return render_template("index.html", **data)

@app.route("/current-task/<string:current_task>")
def current_task(current_task):
    # Getting data for todays task when application starts
    # application always starts with none as current task

    # current_task parameter is for getting the task when select changes
    task = current_task

    cursor = connect.cursor()
    current_task_data = cursor.execute("SELECT * FROM tasks WHERE name = ?",(str(task),)).fetchall()[0]
    today = datetime.now()
    
    row_exists = cursor.execute("SELECT EXISTS(SELECT * FROM work_session WHERE task_id = ? AND work_year = ? AND work_month = ? AND work_day = ?)",
        (current_task_data[0], today.year, today.month, today.day)).fetchall()

    if row_exists[0][0] == 1:
        todays_session = cursor.execute("SELECT * FROM work_session WHERE task_id = ? AND work_year = ? AND work_month = ? AND work_day = ?",
            (current_task_data[0], today.year, today.month, today.day)).fetchall()[0]
        print("today sesssion: ", todays_session)
        data = {
            "promodoro": todays_session[2]
        }
        cursor.close()
        return data
    cursor.close()
    return "todays data not found", 400


@app.route("/process", methods = ["GET","POST"])
def process():
    if request.method == "GET":
        
        cursor = connect.cursor()
        data = cursor.execute(
                "SELECT t.name, w.promodoro, w.work_year, w.work_month, w.work_day FROM tasks t INNER JOIN work_session w ON w.task_id = t.id").fetchall()
        cursor.close()

        # Organize chart data
        names = []

        for row in data:
            names.append(row[0])
        names = set(names)

        data_dict = {}
        for name in names:
            if name not in data_dict:
                data_dict[name] = []
        
        for x in data:
            row_data = {
                "promodoro": x[1],
                "year": x[2],
                "month": x[3],
                "date": x[4],
            }
            data_dict[x[0]].append(row_data)
        # Organize chart data END
        return data_dict

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
        
        print("processing data")
        cursor = connect.cursor()
        task_exists = cursor.execute("SELECT EXISTS(SELECT * FROM tasks WHERE name = ?)", (task,)).fetchall()
        task_exists = list(map(lambda row: row[0], task_exists))[0]

        if task_exists == 0:
            cursor.execute("INSERT INTO tasks (name) VALUES (?)", (task,))

        task_id = cursor.execute("SELECT id FROM tasks WHERE name = ?", (task,)).fetchall()[0][0]
        row_exists = cursor.execute("""
            SELECT EXISTS(
                SELECT * FROM work_session
                 WHERE work_year = ? AND work_month = ? AND work_day = ? AND task_id = ?)""",(year,month,date,task_id)).fetchall()

        print("task_id", task_id)
        print("row exists", row_exists[0][0])

        if row_exists[0][0] == 1:
            # update table
            print("updating existing work_session row")
            cursor.execute("UPDATE work_session SET promodoro = ? WHERE work_year = ? AND work_month = ? AND work_day = ? AND task_id = ?",(promodoro,year,month,date,task_id))
        else:
            # create new row
            print("creating new row in work_session")
            cursor.execute("INSERT INTO work_session (task_id,promodoro,work_year,work_month,work_day) VALUES (?,?,?,?,?)", (task_id,promodoro,year,month,date))
        
        connect.commit()
        cursor.close()

@app.route("/create-task", methods = ["POST"])
def create_task():
    success = False
    if request.method == "POST":
        task = request.form.get("task")
        if not task:
            return "no task to add"
        task = task.lower()

        cursor = connect.cursor()
        task_exists = cursor.execute("SELECT EXISTS(SELECT * FROM tasks WHERE name = ?)", (task,)).fetchall()

        if task_exists == 1:
            return "Task already exists"
        
        cursor.execute("INSERT INTO tasks(name) VALUES(?)", (task,))
        # Save changes to database
        connect.commit()
        cursor.close()
        success = True
        message = "Added new task"
        data = {
            "success":success,
            "message":message
        }
        return redirect("/", code=302)

@app.route("/delete-task", methods = ["POST"])
def delete_task():
    if request.method == "POST":
        task = request.form.get("task")
        if not task:
            print("no task to delete")
        else:
            task = task.lower()
            cursor = connect.cursor()
            row_exists = cursor.execute("SELECT EXISTS(SELECT id FROM tasks WHERE name = ?)",(task,)).fetchall()
            if row_exists[0][0] == 1:
                task_id = cursor.execute("SELECT id FROM tasks WHERE name = ?",(task,)).fetchall()[0][0]
                cursor.execute("DELETE FROM work_session WHERE task_id = ?", (task_id,))
                cursor.execute("DELETE FROM tasks WHERE id = ?", (task_id,))
            connect.commit()
            cursor.close()
        
        return redirect("/", code=302)

@app.route("/delete-all-tasks", methods = ["POST"])
def delete_all_tasks():
    if request.method == "POST":

        cursor = connect.cursor()
        cursor.execute("DELETE FROM work_session")
        cursor.execute("DELETE FROM tasks")
        connect.commit()
        cursor.close()
        
    return redirect("/", code=302)


if __name__ == "__main__":
    app.run(debug=True)