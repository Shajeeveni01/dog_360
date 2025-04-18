import tensorflow as tf
from sklearn.utils.class_weight import compute_class_weight
from sklearn.metrics import f1_score, confusion_matrix, ConfusionMatrixDisplay, classification_report
import numpy as np
import matplotlib.pyplot as plt
from tensorflow.keras.applications import MobileNetV2
from tensorflow.keras.models import Model
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.optimizers import Adam
from tensorflow.keras.callbacks import ReduceLROnPlateau, ModelCheckpoint, EarlyStopping, Callback
import pickle

IMG_SIZE = 224
BATCH_SIZE = 32
EPOCHS = 20

# Custom F1-score tracking callback
class F1ScoreCallback(Callback):
    def __init__(self, val_data):
        super().__init__()
        self.validation_data = val_data
        self.f1_scores = []

    def on_epoch_end(self, epoch, logs=None):
        val_data = self.validation_data
        val_preds = self.model.predict(val_data)
        y_true = val_data.classes
        y_pred = val_preds.argmax(axis=1)

        f1 = f1_score(y_true, y_pred, average='weighted')
        self.f1_scores.append(f1)
        print(f"\n📊 Epoch {epoch+1} - Weighted F1-score: {f1:.4f}")

# Load training & validation sets
train_datagen = tf.keras.preprocessing.image.ImageDataGenerator(
    rescale=1./255,
    validation_split=0.2,
    rotation_range=20,
    zoom_range=0.2,
    horizontal_flip=True
)

train_generator = train_datagen.flow_from_directory(
    'dog_disease_dataset',
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='training'
)

val_generator = train_datagen.flow_from_directory(
    'dog_disease_dataset',
    target_size=(IMG_SIZE, IMG_SIZE),
    batch_size=BATCH_SIZE,
    class_mode='categorical',
    subset='validation',
    shuffle=False  # Important for matching indices
)

# Compute class weights
class_weights = compute_class_weight(
    class_weight='balanced',
    classes=np.unique(train_generator.classes),
    y=train_generator.classes
)
class_weights = dict(enumerate(class_weights))

# Load MobileNetV2 base
base_model = MobileNetV2(input_shape=(IMG_SIZE, IMG_SIZE, 3), include_top=False, weights='imagenet')
base_model.trainable = True

# Freeze first 100 layers
for layer in base_model.layers[:100]:
    layer.trainable = False

# Add custom classification head
x = base_model.output
x = GlobalAveragePooling2D()(x)
x = Dense(128, activation='relu')(x)
output = Dense(train_generator.num_classes, activation='softmax')(x)

model = Model(inputs=base_model.input, outputs=output)

# Compile the model
model.compile(optimizer=Adam(learning_rate=1e-5),
              loss='categorical_crossentropy',
              metrics=['accuracy'])

# Callbacks
checkpoint = ModelCheckpoint('dog_disease_model.h5', save_best_only=True, monitor='val_accuracy', mode='max')
early_stop = EarlyStopping(monitor='val_accuracy', patience=5, restore_best_weights=True)
lr_scheduler = ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2, verbose=1)
f1_callback = F1ScoreCallback(val_generator)

# Train the model
history = model.fit(
    train_generator,
    epochs=EPOCHS,
    validation_data=val_generator,
    callbacks=[checkpoint, early_stop, lr_scheduler, f1_callback],
    class_weight=class_weights
)

model.save('dog_disease_model.keras')
print("🎉 Training Complete! Model saved as 'dog_disease_model.keras'")

# ----------------------- PLOTS -----------------------

# Accuracy Curve
plt.figure(figsize=(10, 5))
plt.plot(history.history['accuracy'], label='Train Accuracy')
plt.plot(history.history['val_accuracy'], label='Val Accuracy')
plt.title('Model Accuracy Over Epochs')
plt.xlabel('Epoch')
plt.ylabel('Accuracy')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig("accuracy_curve.png")
plt.show()

# Loss Curve
plt.figure(figsize=(10, 5))
plt.plot(history.history['loss'], label='Train Loss')
plt.plot(history.history['val_loss'], label='Val Loss')
plt.title('Model Loss Over Epochs')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig("loss_curve.png")
plt.show()

# F1-Score Curve
plt.figure(figsize=(10, 5))
plt.plot(f1_callback.f1_scores, label='Val F1-Score', color='purple')
plt.title('Weighted F1-Score Over Epochs')
plt.xlabel('Epoch')
plt.ylabel('F1-Score')
plt.legend()
plt.grid(True)
plt.tight_layout()
plt.savefig("f1_score_curve.png")
plt.show()

# Confusion Matrix
val_preds = model.predict(val_generator)
y_true = val_generator.classes
y_pred = val_preds.argmax(axis=1)

cm = confusion_matrix(y_true, y_pred)
disp = ConfusionMatrixDisplay(confusion_matrix=cm, display_labels=list(val_generator.class_indices.keys()))
plt.figure(figsize=(10, 8))
disp.plot(cmap='Blues', values_format='d')
plt.title("Confusion Matrix - Validation Set")
plt.savefig("confusion_matrix.png")
plt.show()

# Classification Report
report = classification_report(y_true, y_pred, target_names=list(val_generator.class_indices.keys()))
print("Classification Report:\n", report)
with open("classification_report.txt", "w") as f:
    f.write(report)

# Learning Rate Curve (static value used across all epochs if ReduceLROnPlateau doesn’t log dynamically)
lrs = [1e-5] * len(history.history['loss'])  # Update this if learning rate changed
plt.figure(figsize=(10, 5))
plt.plot(range(1, len(lrs) + 1), lrs, label='Learning Rate')
plt.xlabel('Epoch')
plt.ylabel('Learning Rate')
plt.title('Learning Rate Over Epochs')
plt.grid(True)
plt.tight_layout()
plt.savefig("learning_rate_curve.png")
plt.show()

# Save training history
with open("training_history.pkl", "wb") as f:
    pickle.dump(history.history, f)

# Save F1 scores
with open("f1_scores.pkl", "wb") as f:
    pickle.dump(f1_callback.f1_scores, f)

print("✅ training_history.pkl and f1_scores.pkl saved successfully!")
