import tensorflow as tf
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import pickle
from sklearn.metrics import classification_report, confusion_matrix

# Load trained model
model = tf.keras.models.load_model("dog_disease_model.h5")

# Constants
IMG_SIZE = 224
BATCH_SIZE = 32
class_labels = [
    'Bacterial_Infection', 'Conjunctival_Injection_or_Redness', 'Demodicosis', 'Dermatitis',
    'Fungal_Infection', 'Healthy', 'Hypersensitivity', 'Keratosis', 'Malassezia',
    'Nasal_Discharge', 'Ocular_Discharge', 'Pyoderma', 'Skin_Lesions', 'flea_allergy',
    'hotspot', 'mange', 'ringworm'
]

# Load validation data
val_datagen = tf.keras.preprocessing.image.ImageDataGenerator(
    rescale=1./255, validation_split=0.2)

val_generator = val_datagen.flow_from_directory(
    'dog_disease_dataset',
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation',
    shuffle=False
)

# Predict
predictions = model.predict(val_generator)
y_pred = np.argmax(predictions, axis=1)
y_true = val_generator.classes

# 📌 1. Classification Report
print("Classification Report:")
report = classification_report(y_true, y_pred, target_names=class_labels)
print(report)
with open("classification_report.txt", "w") as f:
    f.write(report)

# 📌 2. Confusion Matrix
cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(12, 10))
sns.heatmap(cm, annot=True, fmt='d', xticklabels=class_labels, yticklabels=class_labels, cmap='Blues')
plt.title('Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('True')
plt.xticks(rotation=90)
plt.yticks(rotation=0)
plt.tight_layout()
plt.savefig("confusion_matrix.png")
plt.show()

# 📌 3. Accuracy Curve
with open("training_history.pkl", "rb") as f:
    history = pickle.load(f)

plt.figure(figsize=(10, 5))
plt.plot(history['accuracy'], label='Train Accuracy')
plt.plot(history['val_accuracy'], label='Validation Accuracy')
plt.title('Model Accuracy Over Epochs')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig("accuracy_curve.png")
plt.show()

# 📌 4. Loss Curve
plt.figure(figsize=(10, 5))
plt.plot(history['loss'], label='Train Loss')
plt.plot(history['val_loss'], label='Validation Loss')
plt.title('Model Loss Over Epochs')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig("loss_curve.png")
plt.show()

# 📌 5. F1-Score Over Epochs
with open("f1_scores.pkl", "rb") as f:
    f1_scores = pickle.load(f)

plt.figure(figsize=(10, 5))
plt.plot(f1_scores, label='Validation F1-Score', color='purple')
plt.title('Weighted F1-Score Over Epochs')
plt.xlabel('Epoch')
plt.ylabel('F1-Score')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig("f1_score_curve.png")
plt.show()

# 📌 6. Learning Rate Trend (assume static unless tracked manually)
learning_rates = [1e-5] * len(history['loss'])  # Update if you logged LR changes
plt.figure(figsize=(10, 5))
plt.plot(range(1, len(learning_rates) + 1), learning_rates, label='Learning Rate')
plt.title('Learning Rate Over Epochs')
plt.xlabel('Epoch')
plt.ylabel('Learning Rate')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig("learning_rate_curve.png")
plt.show()
