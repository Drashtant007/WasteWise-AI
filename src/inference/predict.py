from pathlib import Path
from typing import Dict, List

import torch
from PIL import Image
from torchvision import transforms

from src.models.resnet50_model import WasteResNet50


# =========================================================
# Configuration
# =========================================================

MODEL_PATH = Path("models/resnet50_stage2_best.pth")
CLASS_NAMES_PATH = Path("data/splits/class_names.txt")

IMAGE_SIZE = 224

DEVICE = torch.device(
    "cuda" if torch.cuda.is_available() else "cpu"
)


# =========================================================
# Confidence Handling
# =========================================================

def get_confidence_level(confidence: float) -> str:
    """
    Convert prediction confidence into an
    application-level confidence category.
    """

    if confidence >= 85:
        return "high"

    elif confidence >= 60:
        return "moderate"

    else:
        return "low"


# =========================================================
# Waste Disposal Guidance
# =========================================================

DISPOSAL_GUIDANCE = {

    "battery": {
        "category": "Hazardous / E-waste",
        "recommendation": (
            "Do not place batteries in regular waste. "
            "Take them to an authorized battery or e-waste "
            "collection point."
        )
    },

    "biological": {
        "category": "Organic Waste",
        "recommendation": (
            "Place in the appropriate organic/biodegradable "
            "waste collection."
        )
    },

    "cardboard": {
        "category": "Recyclable",
        "recommendation": (
            "Keep cardboard dry and place it in the "
            "paper/cardboard recycling stream."
        )
    },

    "clothes": {
        "category": "Reusable / Textile",
        "recommendation": (
            "Donate, reuse, or place in a textile collection "
            "program where available."
        )
    },

    "glass": {
        "category": "Recyclable",
        "recommendation": (
            "Separate glass from general waste and place it "
            "in an appropriate glass recycling container."
        )
    },

    "metal": {
        "category": "Recyclable",
        "recommendation": (
            "Separate metal items and place them in the "
            "appropriate metal recycling stream."
        )
    },

    "paper": {
        "category": "Recyclable",
        "recommendation": (
            "Keep paper reasonably clean and dry and place it "
            "in the paper recycling stream."
        )
    },

    "plastic": {
        "category": "Recyclable",
        "recommendation": (
            "Clean the plastic item where appropriate and "
            "place it in the correct plastic recycling stream."
        )
    },

    "shoes": {
        "category": "Reusable / Textile",
        "recommendation": (
            "Donate or reuse shoes when possible; otherwise "
            "use an appropriate textile/shoe collection program."
        )
    },

    "trash": {
        "category": "General Waste",
        "recommendation": (
            "Place in the appropriate general-waste collection "
            "unless the item can be separated into a recyclable "
            "or special-waste category."
        )
    }
}


# =========================================================
# Image Preprocessing
# =========================================================

TRANSFORM = transforms.Compose([
    transforms.Resize(256),
    transforms.CenterCrop(IMAGE_SIZE),
    transforms.ToTensor(),
    transforms.Normalize(
        mean=[0.485, 0.456, 0.406],
        std=[0.229, 0.224, 0.225]
    )
])


# =========================================================
# WasteWise Predictor
# =========================================================

class WasteWisePredictor:

    def __init__(
        self,
        model_path: Path = MODEL_PATH,
        class_names_path: Path = CLASS_NAMES_PATH
    ):

        self.device = DEVICE

        # -------------------------------------------------
        # Load class names
        # -------------------------------------------------

        with open(
            class_names_path,
            "r",
            encoding="utf-8"
        ) as f:

            self.class_names = [
                line.strip()
                for line in f
                if line.strip()
            ]

        # -------------------------------------------------
        # Create model
        # -------------------------------------------------

        self.model = WasteResNet50(
            num_classes=len(self.class_names),
            pretrained=False
        )

        # -------------------------------------------------
        # Load trained checkpoint
        # -------------------------------------------------

        checkpoint = torch.load(
            model_path,
            map_location=self.device
        )

        if "model_state_dict" in checkpoint:
            state_dict = checkpoint["model_state_dict"]

        else:
            state_dict = checkpoint

        self.model.load_state_dict(state_dict)

        # -------------------------------------------------
        # Move model to device
        # -------------------------------------------------

        self.model.to(self.device)

        self.model.eval()

    # =====================================================
    # Prediction
    # =====================================================

    @torch.no_grad()
    def predict(
        self,
        image_path: str,
        top_k: int = 3
    ) -> Dict:

        # -------------------------------------------------
        # Load image
        # -------------------------------------------------

        image = Image.open(
            image_path
        ).convert("RGB")

        # -------------------------------------------------
        # Preprocess image
        # -------------------------------------------------

        tensor = TRANSFORM(image)

        tensor = tensor.unsqueeze(0)

        tensor = tensor.to(
            self.device
        )

        # -------------------------------------------------
        # Model inference
        # -------------------------------------------------

        with torch.amp.autocast(
            device_type="cuda",
            enabled=self.device.type == "cuda"
        ):

            logits = self.model(tensor)

        # -------------------------------------------------
        # Convert logits to probabilities
        # -------------------------------------------------

        probabilities = torch.softmax(
            logits,
            dim=1
        )[0]

        # -------------------------------------------------
        # Get Top-K predictions
        # -------------------------------------------------

        k = min(
            top_k,
            len(self.class_names)
        )

        top_probs, top_indices = torch.topk(
            probabilities,
            k=k
        )

        predictions: List[Dict] = []

        for probability, index in zip(
            top_probs,
            top_indices
        ):

            class_name = self.class_names[
                index.item()
            ]

            predictions.append({
                "class": class_name,
                "confidence": round(
                    probability.item() * 100,
                    2
                )
            })

        # -------------------------------------------------
        # Primary prediction
        # -------------------------------------------------

        predicted_class = predictions[0]["class"]

        confidence = predictions[0]["confidence"]

        confidence_level = get_confidence_level(
            confidence
        )

        # -------------------------------------------------
        # Disposal guidance
        # -------------------------------------------------

        guidance = DISPOSAL_GUIDANCE.get(
            predicted_class,
            {
                "category": "Unknown",

                "recommendation": (
                    "Check local waste-management "
                    "guidelines."
                )
            }
        )

        # -------------------------------------------------
        # Final result
        # -------------------------------------------------

        return {
            "prediction": predicted_class,

            "confidence": confidence,

            "confidence_level": confidence_level,

            "category": guidance["category"],

            "recommendation": guidance["recommendation"],

            "top_predictions": predictions
        }


# =========================================================
# Command-Line Interface
# =========================================================

def main():

    import sys

    # -----------------------------------------------------
    # Check command-line argument
    # -----------------------------------------------------

    if len(sys.argv) < 2:

        print(
            "Usage:\n"
            "python -m src.inference.predict "
            "<image_path>"
        )

        return

    image_path = sys.argv[1]

    # -----------------------------------------------------
    # Create predictor
    # -----------------------------------------------------

    predictor = WasteWisePredictor()

    # -----------------------------------------------------
    # Run prediction
    # -----------------------------------------------------

    result = predictor.predict(
        image_path
    )

    # -----------------------------------------------------
    # Display result
    # -----------------------------------------------------

    print("\n" + "=" * 60)

    print(
        "WASTEWISE AI PREDICTION"
    )

    print("=" * 60)

    print(
        f"\nPrediction       : "
        f"{result['prediction']}"
    )

    print(
        f"Confidence       : "
        f"{result['confidence']:.2f}%"
    )

    print(
        f"Confidence Level : "
        f"{result['confidence_level']}"
    )

    print(
        f"Category         : "
        f"{result['category']}"
    )

    # -----------------------------------------------------
    # Top predictions
    # -----------------------------------------------------

    print(
        "\nTop Predictions:"
    )

    for i, item in enumerate(
        result["top_predictions"],
        start=1
    ):

        print(
            f"{i}. "
            f"{item['class']:12s} "
            f"{item['confidence']:.2f}%"
        )

    # -----------------------------------------------------
    # Recommendation
    # -----------------------------------------------------

    print(
        "\nRecommendation:"
    )

    print(
        result["recommendation"]
    )

    print(
        "=" * 60
    )


# =========================================================
# Entry Point
# =========================================================

if __name__ == "__main__":
    main()