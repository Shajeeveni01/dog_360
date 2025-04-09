import tensorflow as tf
import numpy as np
from tensorflow.keras.preprocessing import image
import matplotlib.pyplot as plt
import os

# Load model
model = tf.keras.models.load_model("dog_disease_model.h5")

# Class labels
class_labels = [
    'Bacterial_Infection', 'Conjunctival_Injection_or_Redness', 'Demodicosis', 'Dermatitis',
    'Fungal_Infection', 'Healthy', 'Hypersensitivity', 'Keratosis', 'Malassezia',
    'Nasal_Discharge', 'Ocular_Discharge', 'Pyoderma', 'Skin_Lesions', 'flea_allergy',
    'hotspot', 'ringworm'
]

def predict_dog_disease(img_path):
    img = image.load_img(img_path, target_size=(224, 224))
    img_array = image.img_to_array(img) / 255.0
    img_array = np.expand_dims(img_array, axis=0)

    prediction = model.predict(img_array)[0]
    predicted_class = class_labels[np.argmax(prediction)]
    confidence = np.max(prediction) * 100

    # Display image with prediction
    plt.imshow(img)
    plt.title(f"Predicted: {predicted_class} ({confidence:.2f}%)", fontsize=12)
    plt.axis('off')
    plt.show()

    if confidence < 50:
        print("\n⚠️ Model is unsure. Try a clearer image or retrain for improvement.\n")
    else:
        print(f"\n🔍 Predicted Disease: **{predicted_class}** (Confidence: {confidence:.2f}%)\n")

if __name__ == "__main__":
    test_img = input("Enter path to dog image: ")
    if os.path.exists(test_img):
        predict_dog_disease(test_img)
    else:
        print("❌ Image file not found!")