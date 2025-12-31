from flask import Flask, request, jsonify
import numpy as np
import joblib
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)

def load_model():
    model_path = 'models/cashflow_model.pkl'
    if not os.path.exists(model_path):
        print("❌ Model not found. Please train the model first.")
        return None
    
    try:
        model = joblib.load(model_path)
        print("✅ Model loaded successfully")
        return model
    except Exception as e:
        print(f"❌ Error loading model: {e}")
        return None

model = load_model()

@app.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        'status': 'ok',
        'model_loaded': model is not None,
        'timestamp': str(np.datetime64('now'))
    })

@app.route('/predict', methods=['POST'])
def predict_cashflow():
    if model is None:
        return jsonify({'error': 'Model not loaded'}), 503
    
    try:
        data = request.get_json()
        
        if not data or 'historical_data' not in data:
            return jsonify({'error': 'Missing historical_data field'}), 400
        
        historical_data = data['historical_data']
        
        if not isinstance(historical_data, list) or len(historical_data) < 2:
            return jsonify({'error': 'historical_data must be a list with at least 2 values'}), 400
        
        historical_array = np.array(historical_data)
        
        if len(historical_array) < 5:
            last_value = historical_array[-1] if len(historical_array) > 0 else 10000
            padded_data = np.full(5, last_value)
            padded_data[-len(historical_array):] = historical_array
            historical_array = padded_data
        elif len(historical_array) > 5:
            historical_array = historical_array[-5:]
        
        prediction = model.predict([historical_array])[0]
        
        base_confidence = 0.85
        confidence = base_confidence * min(1.0, len(historical_data) / 5)
        
        result = {
            'predicted_cashflow': float(round(prediction, 2)),
            'confidence': float(round(confidence, 2)),
            'input_data': [float(x) for x in historical_array.tolist()],
            'data_points': len(historical_data),
            'status': 'success'
        }
        
        print(f"🎯 Prediction: ${prediction:.2f} (confidence: {confidence:.2f})")
        return jsonify(result)
    
    except Exception as e:
        print(f"❌ Prediction error: {e}")
        return jsonify({
            'error': str(e),
            'message': 'Prediction failed'
        }), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    debug = os.getenv('DEBUG', 'False').lower() == 'true'
    
    print(f"🚀 Starting AI server on port {port}")
    print(f"🔧 Debug mode: {debug}")
    
    app.run(host='0.0.0.0', port=port, debug=debug)