import requests
import json
import numpy as np

def test_prediction():
    """تست پیش‌بینی با داده‌های نمونه"""
    url = 'http://localhost:5000/predict'
    
    # داده‌های تست
    test_cases = [
        {
            'name': 'کسب‌وکار کوچک',
            'data': [10000, 12000, 11000, 13000, 14000]
        },
        {
            'name': 'کسب‌وکار متوسط',
            'data': [50000, 55000, 60000, 58000, 62000]
        },
        {
            'name': 'داده‌های ناقص',
            'data': [8000, 9000]
        }
    ]
    
    print("🧪 Testing cash flow prediction API...\n")
    
    for case in test_cases:
        print(f"🔸 Testing: {case['name']}")
        print(f"   💹 Historical data: {case['data']}")
        
        try:
            response = requests.post(
                url,
                json={'historical_data': case['data']},
                timeout=10
            )
            
            if response.status_code == 200:
                result = response.json()
                print(f"   ✅ Prediction: ${result['predicted_cashflow']:,.2f}")
                print(f"   📊 Confidence: {result['confidence']:.2f}")
                print(f"   📈 Input used: {[round(x, 2) for x in result['input_data']]}\n")
            else:
                print(f"   ❌ Failed: {response.status_code}")
                print(f"   💥 Error: {response.json().get('error', 'Unknown error')}\n")
        
        except Exception as e:
            print(f"   ❌ Request failed: {e}\n")

if __name__ == "__main__":
    test_prediction()echo $! > server.pid
