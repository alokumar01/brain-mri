import cv2
import numpy as np
import sys
import json

def process_mri(image_path):
    try:
        img = cv2.imread(image_path, 0)  # Grayscale
        if img is None:
            raise ValueError("Failed to load image")
        # Dummy processing (replace with real logic if needed)
        tumor_size = np.random.randint(5, 20)  # Random size between 5-20 mm
        risk = "High" if tumor_size > 15 else "Low"
        return {"tumor_size": tumor_size, "risk": risk}
    except Exception as e:
        return {"tumor_size": 0, "risk": f"Error: {str(e)}"}

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print(json.dumps({"tumor_size": 0, "risk": "Error: No image path provided"}))
        sys.exit(1)
    result = process_mri(sys.argv[1])
    print(json.dumps(result))