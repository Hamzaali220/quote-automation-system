import pandas as pd
from xgboost import XGBRegressor
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_absolute_error
import joblib
import os

# Load CSV data
training_path = os.path.join(os.path.dirname(__file__), 'data', 'quotes.csv')
data = pd.read_csv(training_path)
data = data.dropna()  # Drop rows with missing values

# Encode categorical features if needed
categorical = ['ProfileType', 'Alloy', 'SurfaceTreatment']
data = pd.get_dummies(data, columns=categorical)

X = data.drop('FinalPrice', axis=1)
y = data['FinalPrice']

X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2)

# Train model
model = XGBRegressor()
model.fit(X_train, y_train)
print("Model training complete.")
print("x_train shape:", X_train)
print("y_train shape:", y_train)
# Evaluate
preds = model.predict(X_test)
mae = mean_absolute_error(y_test, preds)
print(f"Validation MAE: {mae}")

# Save model
os.makedirs('model', exist_ok=True)
model_path = os.path.join(os.path.dirname(__file__), 'model', 'price_predictor.pkl')
joblib.dump(model, model_path)
