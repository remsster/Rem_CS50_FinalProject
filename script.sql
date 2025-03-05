    CREATE TABLE IF NOT EXISTS tasks(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS work_session(
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        task_id INTEGER NOT NULL,
        promodoro INTEGER NOT NULL,
        work_year TEXT,
        work_month TEXT,
        work_day TEXT,
        FOREIGN KEY(task_id) REFERENCES tasks(id)
    );
