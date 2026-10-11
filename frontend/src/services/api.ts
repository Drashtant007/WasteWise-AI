export interface TopPrediction {
  class: string;
  confidence: number;
}

export interface PredictionResult {
  prediction: string;
  confidence: number;
  confidence_level: string;
  category: string;
  recommendation: string;
  top_predictions: TopPrediction[];
}

export interface PredictionResponse {
  success: boolean;
  filename: string;
  result: PredictionResult;
}

const API_BASE_URL = "http://127.0.0.1:8000";

export async function predictWaste(
  file: File,
): Promise<PredictionResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch(`${API_BASE_URL}/predict`, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    let message = `Request failed with status ${response.status}`;

    try {
      const error = await response.json();

      if (error?.detail) {
        message = error.detail;
      }
    } catch {
      // Keep the default error message.
    }

    throw new Error(message);
  }

  return response.json();
}