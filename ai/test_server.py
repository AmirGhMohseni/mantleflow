from flask import Flask
import os

app = Flask(__name__)

@app.route('/health')
def health():
    return {"status": "ok", "server": "test"}

@app.route('/test')
def test():
    return "✅ Test server is working!"

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port, debug=True)
