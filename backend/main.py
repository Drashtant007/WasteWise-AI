from pathlib import Path
import shutil
import tempfile

from fastapi import FastAPI, File, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware

from src.inference.predict import WasteWisePredictor


# =========================================================
# Application
# =========================================================

app = FastAPI(
    title="WasteWise AI API",
    description="AI-powered waste classification and disposal guidance API.",
    version="1.0.0"
)


# =========================================================
# CORS
# =========================================================

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================================================
# Model
# =========================================================

predictor = WasteWisePredictor()


# =========================================================
# Allowed image formats
# =========================================================

ALLOWED_EXTENSIONS = {
    ".jpg",
    ".jpeg",
    ".png",
    ".webp"
}


# =========================================================
# Health Check
# =========================================================

@app.get("/")
def root():

    return {
        "name": "WasteWise AI",
        "status": "running",
        "model": "ResNet50 Stage 2"
    }


@app.get("/health")
def health():

    return {
        "status": "healthy",
        "model_loaded": True,
        "device": str(predictor.device)
    }


# =========================================================
# Prediction Endpoint
# =========================================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    # -----------------------------------------------------
    # Validate filename
    # -----------------------------------------------------

    if not file.filename:

        raise HTTPException(
            status_code=400,
            detail="No filename provided."
        )

    extension = Path(
        file.filename
    ).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:

        raise HTTPException(
            status_code=400,
            detail=(
                "Unsupported image format. "
                "Use JPG, JPEG, PNG, or WEBP."
            )
        )

    # -----------------------------------------------------
    # Save temporary image
    # -----------------------------------------------------

    temp_path = None

    try:

        with tempfile.NamedTemporaryFile(
            delete=False,
            suffix=extension
        ) as temp_file:

            temp_path = Path(
                temp_file.name
            )

            shutil.copyfileobj(
                file.file,
                temp_file
            )

        # -------------------------------------------------
        # Run model
        # -------------------------------------------------

        result = predictor.predict(
            str(temp_path)
        )

        return {
            "success": True,
            "filename": file.filename,
            "result": result
        }

    except Exception as exc:

        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(exc)}"
        )

    finally:

        # -------------------------------------------------
        # Remove temporary file
        # -------------------------------------------------

        if temp_path and temp_path.exists():

            temp_path.unlink()


# =========================================================
# Run directly
# =========================================================

if __name__ == "__main__":

    import uvicorn

    uvicorn.run(
        "backend.main:app",
        host="127.0.0.1",
        port=8000,
        reload=True
    )