from flask import Flask, request, jsonify

app = Flask(__name__)

# Define routes
@app.route('/')
def hello():
    return 'Hello, world!'