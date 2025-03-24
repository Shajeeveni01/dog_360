from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from tensorflow.keras.models import load_model
from PIL import Image
import numpy as np
import io

app = FastAPI()

# 🛡️ CORS for React
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Or ["http://localhost:5173"] if you're strict
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 🔁 Load Model
model = load_model("model/dog_disease_model.keras")

# 🏷️ Class labels
class_labels = [
    'Bacterial_Infection', 'Conjunctival_Injection_or_Redness', 'Demodicosis', 'Dermatitis',
    'Fungal_Infection', 'Healthy', 'Hypersensitivity', 'Keratosis', 'Malassezia',
    'Nasal_Discharge', 'Ocular_Discharge', 'Pyoderma', 'Skin_Lesions', 'flea_allergy',
    'hotspot', 'mange', 'ringworm'
]

@app.get("/")
def home():
    return {"message": "🚀 Dog360 API is running!"}

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    contents = await file.read()
    image = Image.open(io.BytesIO(contents)).convert("RGB")
    image = image.resize((224, 224))
    img_array = np.array(image) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    predictions = model.predict(img_array)[0]
    top_index = int(np.argmax(predictions))
    confidence = float(predictions[top_index]) * 100
    predicted_label = class_labels[top_index]

    return {
        "prediction": predicted_label,
        "confidence": round(confidence, 2)
    }
