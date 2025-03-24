import tensorflow as tf
import numpy as np
from sklearn.metrics import classification_report, confusion_matrix
import matplotlib.pyplot as plt
import seaborn as sns

# Load model and validation set
model = tf.keras.models.load_model("dog_disease_model.h5")

IMG_SIZE = 224
BATCH_SIZE = 32
class_labels = [
    'Bacterial_Infection', 'Conjunctival_Injection_or_Redness', 'Demodicosis', 'Dermatitis',
    'Fungal_Infection', 'Healthy', 'Hypersensitivity', 'Keratosis', 'Malassezia',
    'Nasal_Discharge', 'Ocular_Discharge', 'Pyoderma', 'Skin_Lesions', 'flea_allergy',
    'hotspot', 'mange', 'ringworm'
]

val_datagen = tf.keras.preprocessing.image.ImageDataGenerator(rescale=1./255, validation_split=0.2)

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

# Classification report
print(classification_report(y_true, y_pred, target_names=class_labels))

# Confusion matrix
cm = confusion_matrix(y_true, y_pred)
plt.figure(figsize=(12, 10))
sns.heatmap(cm, annot=True, fmt='d', xticklabels=class_labels, yticklabels=class_labels, cmap='Blues')
plt.title('Confusion Matrix')
plt.xlabel('Predicted')
plt.ylabel('True')
plt.xticks(rotation=90)
plt.yticks(rotation=0)
plt.tight_layout()
plt.show()