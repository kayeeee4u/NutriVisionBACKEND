"""
Flask ML Server untuk Nutrivision
Port: 5001
Endpoint: POST /predict
"""

import os
import sys
import json
import numpy as np
from flask import Flask, request, jsonify
from flask_cors import CORS
from PIL import Image
import io

# Suppress TF logs
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'
os.environ['TF_ENABLE_ONEDNN_OPTS'] = '0'

import tensorflow as tf

app = Flask(__name__)
CORS(app)

# ── Paths ──────────────────────────────────────────────────────────────────
BASE_DIR    = os.path.dirname(os.path.abspath(__file__))
# For Hugging Face Spaces, model is in same directory level
MODEL_PATH  = os.path.join(BASE_DIR, 'saved_model1')
LABELS_PATH = os.path.join(BASE_DIR, 'food_labels.json')

# ── Load resources at startup ──────────────────────────────────────────────
print("[INFO] Loading food labels...")
with open(LABELS_PATH, 'r', encoding='utf-8') as f:
    FOOD_LABELS = json.load(f)
print(f"[OK] Loaded {len(FOOD_LABELS)} food labels")

print("[INFO] Loading TensorFlow SavedModel...")
try:
    loaded_model = tf.saved_model.load(MODEL_PATH)
    infer        = loaded_model.signatures['serving_default']
    MODEL_LOADED = True
    print(f"[OK] Model loaded successfully")
    print(f"     Input : input_image (None, 224, 224, 3) float32")
    print(f"     Output: output_0    (None, {len(FOOD_LABELS)}) float32")
except Exception as e:
    MODEL_LOADED = False
    print(f"[ERROR] Model load failed: {e}")


# ── Helper functions ────────────────────────────────────────────────────────

def preprocess_image(image_bytes: bytes) -> tf.Tensor:
    """Convert raw image bytes → (1, 224, 224, 3) float32 tensor in [0,1]."""
    img = Image.open(io.BytesIO(image_bytes)).convert('RGB')
    img = img.resize((224, 224), Image.LANCZOS)
    arr = np.array(img, dtype=np.float32) / 255.0   # Normalize 0-1
    return tf.constant(arr[np.newaxis, ...])          # Add batch dim


def get_nutrition(class_idx: int, confidence: float) -> dict:
    """Look up nutrition data from class index."""
    if 0 <= class_idx < len(FOOD_LABELS):
        food = FOOD_LABELS[class_idx]
    else:
        # Fallback: generic mixed meal
        food = {
            "name": "unknown_food", "label": "Makanan",
            "carbs": 40, "protein": 15, "fat": 10,
            "calories": 310, "fiber": 3, "veggies": 40
        }
    return {
        "foodName"    : food["label"],
        "foodNameEn"  : food["name"].replace("_", " ").title(),
        "carbs"       : food["carbs"],
        "protein"     : food["protein"],
        "fat"         : food["fat"],
        "calories"    : food["calories"],
        "fiber"       : food["fiber"],
        "veggies"     : food["veggies"],
        "confidence"  : round(confidence * 100, 1),
        "healthScore" : calculate_health_score(food)
    }


def calculate_health_score(food: dict) -> int:
    """
    Simple scoring:
      +20  for veggies >= 80 g
      +10  for veggies >= 40 g
      +15  for fiber   >= 5  g
      +10  for fiber   >= 3  g
      -10  for fat     >= 20 g
      -5   for fat     >= 14 g
      -10  for calories >= 400
      -5   for calories >= 300
    Base 60.
    """
    score = 60
    v = food.get("veggies", 0)
    fi = food.get("fiber", 0)
    fat = food.get("fat", 10)
    cal = food.get("calories", 300)

    score += 20 if v >= 80 else (10 if v >= 40 else 0)
    score += 15 if fi >= 5  else (10 if fi >= 3  else 0)
    score -= 10 if fat >= 20 else (5  if fat >= 14 else 0)
    score -= 10 if cal >= 400 else (5 if cal >= 300 else 0)

    return max(30, min(98, score))


# ── Routes ──────────────────────────────────────────────────────────────────

@app.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status"     : "ok",
        "modelLoaded": MODEL_LOADED,
        "numClasses" : len(FOOD_LABELS)
    })


@app.route('/predict', methods=['POST'])
def predict():
    if not MODEL_LOADED:
        return jsonify({"error": "Model not loaded"}), 503

    # Accept image via multipart OR raw bytes
    if 'image' in request.files:
        image_bytes = request.files['image'].read()
    elif request.data:
        image_bytes = request.data
    else:
        return jsonify({"error": "No image provided"}), 400

    try:
        tensor = preprocess_image(image_bytes)

        # Run inference
        output = infer(input_image=tensor)
        raw = output['output_0'].numpy()[0]             # (174,)

        # Cek apakah output sudah probabilitas (semua >= 0 & jumlah ~ 1.0)
        # Jika ya, pakai langsung. Jika logit mentah, terapkan softmax.
        is_prob = (raw.min() >= 0.0 and abs(raw.sum() - 1.0) < 0.05)
        if is_prob:
            probs = raw
        else:
            probs = np.exp(raw - raw.max())
            probs = probs / probs.sum()

        # Top-3 predictions
        top3_idx = probs.argsort()[-3:][::-1]

        top_class = int(top3_idx[0])
        top_prob  = float(probs[top3_idx[0]])

        nutrition = get_nutrition(top_class, top_prob)

        # Build top-3 list
        alternatives = []
        for idx in top3_idx[1:]:
            alt_food = FOOD_LABELS[int(idx)] if int(idx) < len(FOOD_LABELS) else {}
            alternatives.append({
                "foodName"  : alt_food.get("label", "Unknown"),
                "confidence": round(float(probs[idx]) * 100, 1)
            })

        return jsonify({
            "success"     : True,
            "prediction"  : nutrition,
            "alternatives": alternatives,
            "method"      : "TensorFlow SavedModel (174 classes)"
        })

    except Exception as e:
        print(f"[ERROR] Prediction failed: {e}")
        import traceback
        traceback.print_exc()
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    # Support both local (5001) and Hugging Face Spaces (7860)
    port = int(os.environ.get('PORT', 5001))
    print(f"\n[INFO] Starting Nutrivision ML Server on port {port}...")
    print(f"[INFO] Endpoint: POST http://0.0.0.0:{port}/predict")
    print(f"[INFO] Health  : GET  http://0.0.0.0:{port}/health\n")
    app.run(host='0.0.0.0', port=port, debug=False)
