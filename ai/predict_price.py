import joblib
import pandas as pd
import sys
import json
import os

# Load the trained model
categorical = ['ProfileType', 'Alloy', 'SurfaceTreatment']
model_path = os.path.join(os.path.dirname(__file__), 'model', 'price_predictor.pkl')
model = joblib.load(model_path)
input_data = json.loads(sys.argv[1])
# Convert input to DataFrame
df_input = pd.DataFrame([input_data])

# One-hot encode input
df_input_encoded = pd.get_dummies(df_input, columns=categorical)
training_path = os.path.join(os.path.dirname(__file__), 'data', 'quotes.csv')
df_training = pd.read_csv(training_path)
df_training_encoded = pd.get_dummies(df_training.drop(columns=["FinalPrice"]), columns=categorical)

# Add any missing columns (present in training, missing in input)
for col in df_training_encoded.columns:
    if col not in df_input_encoded.columns:
        df_input_encoded[col] = 0

# Drop any extra columns in input that weren't in training
df_input_encoded = df_input_encoded[df_training_encoded.columns]

# Ensure all columns are float (XGBoost requirement)
df_input_encoded = df_input_encoded.astype(float)

# Predict
pred = model.predict(df_input_encoded)[0]
print("Predicted Price:", pred)
