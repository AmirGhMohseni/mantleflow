import numpy as np
import pandas as pd
from sklearn.ensemble import RandomForestRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import joblib
import os
import json

def generate_sample_data():
    """تولید داده‌های نمونه برای آموزش اولیه"""
    np.random.seed(42)
    
    # تولید داده‌های تصادفی شبیه‌سازی شده
    n_samples = 1000
    
    # ویژگی‌ها: 5 ماه داده تاریخی
    X = np.random.randint(5000, 50000, size=(n_samples, 5))
    
    # هدف: پیش‌بینی ماه بعد
    y = X[:, -1] * 1.1 + np.random.normal(0, 1000, n_samples)
    
    # ذخیره داده‌ها
    df = pd.DataFrame(X, columns=[f'month_{i+1}' for i in range(5)])
    df['next_month'] = y
    
    return X, y, df

def train_cashflow_model():
    """آموزش مدل پیش‌بینی جریان نقدی"""
    print("🔄 Generating sample data...")
    X, y, df = generate_sample_data()
    
    # تقسیم داده‌ها
    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42
    )
    
    print(f"📊 Training data shape: {X_train.shape}")
    print(f"📊 Testing data shape: {X_test.shape}")
    
    # آموزش مدل
    print("🚀 Training Random Forest model...")
    model = RandomForestRegressor(
        n_estimators=100,
        max_depth=10,
        random_state=42,
        n_jobs=-1
    )
    
    model.fit(X_train, y_train)
    
    # ارزیابی
    y_pred = model.predict(X_test)
    mse = mean_squared_error(y_test, y_pred)
    rmse = np.sqrt(mse)
    
    print(f"✅ Model trained successfully!")
    print(f"📈 RMSE on test set: ${rmse:.2f}")
    print(f"🎯 R² Score: {model.score(X_test, y_test):.3f}")
    
    # ذخیره مدل
    os.makedirs('models', exist_ok=True)
    model_path = 'models/cashflow_model.pkl'
    joblib.dump(model, model_path)
    print(f"💾 Model saved to: {model_path}")
    
    # ذخیره داده‌ها برای تست
    df.to_csv('data/sample_data.csv', index=False)
    print(f"💾 Sample data saved to: data/sample_data.csv")
    
    return model

if __name__ == "__main__":
    train_cashflow_model()