from flask import Flask
from flask import render_template


app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<h1>hello world</h1>"

