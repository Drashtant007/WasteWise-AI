import {
  AlertCircle,
  Battery,
  CheckCircle2,
  CircleHelp,
  Clock3,
  GlassWater,
  Leaf,
  Loader2,
  Package,
  Recycle,
  RotateCcw,
  Shirt,
  Sparkles,
  Trash2,
  Zap,
} from "lucide-react";
import { useEffect, useState } from "react";

import UploadZone from "./UploadZone";
import {
  predictWaste,
  type PredictionResponse,
} from "../services/api";

function getWasteIcon(wasteClass: string) {
  const normalized = wasteClass.toLowerCase();

  if (normalized === "battery") return Battery;
  if (normalized === "biological") return Leaf;
  if (normalized === "cardboard") return Package;
  if (normalized === "clothes") return Shirt;
  if (normalized === "glass") return GlassWater;
  if (normalized === "metal") return Zap;
  if (normalized === "paper") return Package;
  if (normalized === "plastic") return Recycle;
  if (normalized === "shoes") return Shirt;
  if (normalized === "trash") return Trash2;

  return CircleHelp;
}

function getCategoryDescription(category: string) {
  const normalized = category.toLowerCase();

  if (normalized.includes("recycl")) {
    return "This item belongs to a recyclable waste stream.";
  }

  if (normalized.includes("organic")) {
    return "This item can generally be handled through an organic-waste stream.";
  }

  if (normalized.includes("hazard")) {
    return "This item may require special handling. Avoid placing it in regular waste.";
  }

  if (normalized.includes("textile")) {
    return "Consider reuse, donation, or an appropriate textile collection stream.";
  }

  if (normalized.includes("general")) {
    return "This item is currently classified as general waste.";
  }

  return "Follow your local waste-management guidelines for final disposal.";
}

function getConfidenceColor(confidence: number) {
  if (confidence >= 85) {
    return "text-emerald-300";
  }

  if (confidence >= 60) {
    return "text-amber-300";
  }

  return "text-red-300";
}

function getConfidenceBarClass(confidence: number) {
  if (confidence >= 85) {
    return "bg-emerald-400";
  }

  if (confidence >= 60) {
    return "bg-amber-400";
  }

  return "bg-red-400";
}

function WasteAnalyzer() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [prediction, setPrediction] =
    useState<PredictionResponse | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  const handleFileSelected = (file: File) => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(file);
    setPreviewUrl(URL.createObjectURL(file));
    setPrediction(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setError(null);

    try {
      const result = await predictWaste(selectedFile);
      setPrediction(result);
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Unable to analyze the image.";

      setError(message);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setSelectedFile(null);
    setPreviewUrl(null);
    setPrediction(null);
    setError(null);
    setIsAnalyzing(false);
  };

  const result = prediction?.result;

  const WasteIcon = result
    ? getWasteIcon(result.prediction)
    : CircleHelp;

  return (
    <section
      id="analyzer"
      className="scroll-mt-24 py-10 md:py-16"
    >
      {/* Section heading */}
      {!selectedFile && !isAnalyzing && (
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-emerald-400/15 bg-emerald-400/5 px-4 py-2 text-sm text-emerald-300">
            <Sparkles size={15} />
            Intelligent waste analysis
          </div>

          <h2 className="text-3xl font-bold tracking-tight md:text-5xl">
            What kind of waste is this?
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-white/40 md:text-base">
            Upload a clear image of a waste item and WasteWise AI
            will classify it using our trained ResNet50 model.
          </p>
        </div>
      )}

      {/* Upload state */}
      {!selectedFile && !isAnalyzing && (
        <UploadZone onFileSelected={handleFileSelected} />
      )}

      {/* Selected image / analyzing / result */}
      {selectedFile && previewUrl && (
        <div className="overflow-hidden rounded-[28px] border border-emerald-400/20 bg-[#091611] shadow-2xl shadow-black/20">
          <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
            {/* Image panel */}
            <div className="border-b border-white/10 bg-black/20 p-4 lg:border-b-0 lg:border-r lg:p-6">
              <div className="relative flex min-h-[320px] items-center justify-center overflow-hidden rounded-2xl bg-black/40 md:min-h-[440px]">
                <img
                  src={previewUrl}
                  alt="Selected waste"
                  className="h-full max-h-[520px] w-full object-contain"
                />

                {/* Analyzing overlay */}
                {isAnalyzing && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#06100c]/75 backdrop-blur-sm">
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-emerald-400/20 bg-emerald-400/10">
                      <Loader2
                        size={30}
                        className="animate-spin text-emerald-400"
                      />
                    </div>

                    <p className="mt-5 text-lg font-semibold">
                      Analyzing image
                    </p>

                    <p className="mt-2 text-sm text-white/40">
                      Running WasteWise AI...
                    </p>

                    <div className="mt-5 flex items-center gap-2">
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:150ms]" />
                      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400 [animation-delay:300ms]" />
                    </div>
                  </div>
                )}
              </div>

              {/* Filename */}
              <div className="mt-4 flex items-center justify-between gap-4">
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white/70">
                    {selectedFile.name}
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>

                {!prediction && !isAnalyzing && (
                  <button
                    type="button"
                    onClick={handleReset}
                    className="shrink-0 rounded-lg border border-white/10 px-3 py-2 text-xs text-white/50 transition hover:border-white/20 hover:bg-white/5 hover:text-white"
                  >
                    Change
                  </button>
                )}
              </div>
            </div>

            {/* Right side */}
            <div className="p-5 md:p-8 lg:p-10">
              {/* Initial selected state */}
              {!prediction && !isAnalyzing && (
                <div className="flex h-full flex-col justify-center">
                  <p className="text-xs font-medium uppercase tracking-[0.2em] text-emerald-300/70">
                    Ready to analyze
                  </p>

                  <h3 className="mt-4 text-3xl font-bold tracking-tight md:text-4xl">
                    Let AI identify this waste.
                  </h3>

                  <p className="mt-4 max-w-lg text-sm leading-7 text-white/40">
                    WasteWise will classify the image into one of
                    ten supported waste categories and provide
                    disposal guidance.
                  </p>

                  <button
                    type="button"
                    onClick={handleAnalyze}
                    className="mt-8 inline-flex w-fit items-center gap-2 rounded-xl bg-emerald-400 px-6 py-3.5 font-semibold text-[#07110d] transition hover:bg-emerald-300 hover:shadow-lg hover:shadow-emerald-400/10"
                  >
                    <Sparkles size={18} />
                    Analyze waste
                  </button>
                </div>
              )}

              {/* Loading state */}
              {isAnalyzing && (
                <div className="flex h-full min-h-[360px] flex-col justify-center">
                  <div className="flex items-center gap-3 text-emerald-300">
                    <Loader2 size={20} className="animate-spin" />
                    <span className="text-sm font-medium">
                      Analysis in progress
                    </span>
                  </div>

                  <h3 className="mt-5 text-3xl font-bold tracking-tight">
                    Understanding your image...
                  </h3>

                  <p className="mt-4 max-w-lg text-sm leading-7 text-white/40">
                    The ResNet50 model is processing the image and
                    generating the most likely waste category.
                  </p>

                  <div className="mt-8 h-2 overflow-hidden rounded-full bg-white/5">
                    <div className="h-full w-1/2 animate-pulse rounded-full bg-emerald-400" />
                  </div>
                </div>
              )}

              {/* Prediction */}
              {result && !isAnalyzing && (
                <div>
                  {/* Status */}
                  <div className="flex items-center gap-2 text-emerald-300">
                    <CheckCircle2 size={18} />
                    <span className="text-sm font-medium">
                      Analysis complete
                    </span>
                  </div>

                  {/* Prediction heading */}
                  <div className="mt-7">
                    <p className="text-xs font-medium uppercase tracking-[0.2em] text-white/35">
                      Detected waste
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-emerald-400/15 bg-emerald-400/10 text-emerald-300">
                        <WasteIcon size={24} />
                      </div>

                      <h3 className="text-4xl font-bold capitalize tracking-tight md:text-5xl">
                        {result.prediction}
                      </h3>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="mt-8">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-sm text-white/45">
                          Model confidence
                        </p>

                        <p
                          className={`mt-1 text-xs capitalize ${getConfidenceColor(
                            result.confidence,
                          )}`}
                        >
                          {result.confidence_level} confidence
                        </p>
                      </div>

                      <span
                        className={`text-xl font-semibold ${getConfidenceColor(
                          result.confidence,
                        )}`}
                      >
                        {result.confidence.toFixed(1)}%
                      </span>
                    </div>

                    <div className="mt-3 h-2 overflow-hidden rounded-full bg-white/5">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${getConfidenceBarClass(
                          result.confidence,
                        )}`}
                        style={{
                          width: `${Math.min(
                            result.confidence,
                            100,
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  {/* Category */}
                  <div className="mt-7 inline-flex items-center gap-2 rounded-full border border-emerald-400/20 bg-emerald-400/5 px-4 py-2 text-sm font-medium text-emerald-300">
                    <Recycle size={17} />
                    {result.category}
                  </div>

                  <p className="mt-3 text-xs leading-5 text-white/30">
                    {getCategoryDescription(result.category)}
                  </p>

                  {/* Disposal guidance */}
                  <div className="mt-7 rounded-2xl border border-white/10 bg-white/[0.025] p-5">
                    <div className="flex items-center gap-2">
                      <Leaf size={17} className="text-emerald-300" />

                      <h4 className="text-sm font-semibold">
                        Disposal guidance
                      </h4>
                    </div>

                    <p className="mt-3 text-sm leading-7 text-white/55">
                      {result.recommendation}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="mt-7 flex flex-wrap gap-3">
                    <button
                      type="button"
                      onClick={handleReset}
                      className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/[0.02] px-5 py-3 text-sm font-medium text-white/70 transition hover:bg-white/[0.06] hover:text-white"
                    >
                      <RotateCcw size={17} />
                      Analyze another image
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Error */}
          {error && (
            <div className="border-t border-red-400/10 bg-red-400/[0.03] px-5 py-4 md:px-8">
              <div className="flex items-start gap-3">
                <AlertCircle
                  size={18}
                  className="mt-0.5 shrink-0 text-red-300"
                />

                <div>
                  <p className="text-sm font-medium text-red-200">
                    Analysis failed
                  </p>

                  <p className="mt-1 text-xs leading-5 text-red-200/50">
                    {error}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Top predictions */}
          {result && !isAnalyzing && (
            <div className="border-t border-white/10 px-5 py-7 md:px-8 md:py-8">
              <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-end">
                <div>
                  <p className="text-sm font-semibold">
                    Top predictions
                  </p>

                  <p className="mt-1 text-xs text-white/30">
                    The three highest-scoring classes from the model.
                  </p>
                </div>

                <span className="text-xs text-white/25">
                  ResNet50 • 10 classes
                </span>
              </div>

              <div className="mt-6 grid gap-3 md:grid-cols-3">
                {result.top_predictions
                  .slice(0, 3)
                  .map((item, index) => {
                    const ItemIcon = getWasteIcon(item.class);

                    return (
                      <div
                        key={`${item.class}-${index}`}
                        className={`rounded-2xl border p-4 transition ${
                          index === 0
                            ? "border-emerald-400/20 bg-emerald-400/[0.04]"
                            : "border-white/10 bg-white/[0.02]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <div className="flex min-w-0 items-center gap-3">
                            <div
                              className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                                index === 0
                                  ? "bg-emerald-400/10 text-emerald-300"
                                  : "bg-white/5 text-white/40"
                              }`}
                            >
                              <ItemIcon size={17} />
                            </div>

                            <div className="min-w-0">
                              <p className="text-xs text-white/30">
                                #{index + 1}
                              </p>

                              <p className="truncate text-sm font-medium capitalize">
                                {item.class}
                              </p>
                            </div>
                          </div>

                          <span
                            className={`shrink-0 text-sm font-semibold ${
                              index === 0
                                ? "text-emerald-300"
                                : "text-white/70"
                            }`}
                          >
                            {item.confidence.toFixed(1)}%
                          </span>
                        </div>

                        <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/5">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${
                              index === 0
                                ? "bg-emerald-400"
                                : "bg-white/20"
                            }`}
                            style={{
                              width: `${Math.min(
                                item.confidence,
                                100,
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          )}

          {/* Model information */}
          {result && !isAnalyzing && (
            <div className="border-t border-white/10 px-5 py-7 md:px-8 md:py-8">
              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs text-white/30">
                    Model
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    ResNet50
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs text-white/30">
                    Task
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    Image classification
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs text-white/30">
                    Categories
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    10 waste classes
                  </p>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/[0.02] p-4">
                  <p className="text-xs text-white/30">
                    Input
                  </p>

                  <p className="mt-2 text-sm font-medium">
                    224 × 224
                  </p>
                </div>
              </div>

              <div className="mt-4 flex items-center gap-2 text-xs text-white/25">
                <Clock3 size={13} />
                Prediction generated locally through the WasteWise
                FastAPI inference service.
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
}

export default WasteAnalyzer;