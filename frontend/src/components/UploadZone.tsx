import {
  Camera,
  ImagePlus,
  Upload,
} from "lucide-react";
import { useRef, useState } from "react";

interface UploadZoneProps {
  onFileSelected: (file: File) => void;
}

const ACCEPTED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
];

function UploadZone({ onFileSelected }: UploadZoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = (file?: File) => {
    if (!file) return;

    if (!ACCEPTED_TYPES.includes(file.type)) {
      alert("Please select a JPG, PNG, or WebP image.");
      return;
    }

    onFileSelected(file);
  };

  const handleInputChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleFile(event.target.files?.[0]);
    event.target.value = "";
  };

  const handleDrop = (
    event: React.DragEvent<HTMLDivElement>,
  ) => {
    event.preventDefault();
    setIsDragging(false);

    handleFile(event.dataTransfer.files?.[0]);
  };

  return (
    <div
      onDragOver={(event) => {
        event.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={handleDrop}
      className={[
        "group relative overflow-hidden rounded-3xl border",
        "border-dashed p-10 text-center transition-all duration-300",
        isDragging
          ? "border-emerald-400 bg-emerald-400/10"
          : "border-white/15 bg-white/[0.025] hover:border-emerald-400/40 hover:bg-white/[0.04]",
      ].join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleInputChange}
      />

      <div className="mx-auto flex max-w-xl flex-col items-center">
        <div
          className={[
            "mb-6 flex h-16 w-16 items-center justify-center rounded-2xl",
            "bg-emerald-400/10 text-emerald-400 transition-transform duration-300",
            "group-hover:scale-105",
          ].join(" ")}
        >
          <ImagePlus size={30} strokeWidth={1.7} />
        </div>

        <h3 className="text-xl font-semibold text-white">
          Drop your waste image here
        </h3>

        <p className="mt-2 text-sm text-white/45">
          Upload a clear image of the item you want WasteWise AI
          to identify.
        </p>

        <div className="mt-7 flex flex-col gap-3 sm:flex-row">
          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl bg-emerald-400 px-5 py-3 font-medium text-[#07110d] transition hover:bg-emerald-300"
          >
            <Upload size={18} />
            Choose Image
          </button>

          <button
            type="button"
            onClick={() => inputRef.current?.click()}
            className="flex items-center justify-center gap-2 rounded-xl border border-white/10 bg-white/[0.04] px-5 py-3 font-medium text-white/75 transition hover:bg-white/[0.08] hover:text-white"
          >
            <Camera size={18} />
            Use Camera
          </button>
        </div>

        <p className="mt-5 text-xs text-white/25">
          JPG, PNG or WebP · Maximum 10 MB
        </p>
      </div>
    </div>
  );
}

export default UploadZone;