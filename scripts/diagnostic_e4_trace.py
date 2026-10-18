import sys
from pathlib import Path
from PIL import Image

PROJECT_ROOT = Path(__file__).resolve().parents[1]
if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from src.inference.predict import WasteWisePredictor

E4_MODEL = PROJECT_ROOT / "runs" / "detect" / "results" / "taco_external_balanced" / "yolo11s_balanced" / "weights" / "best.pt"
DATASET_DIR = PROJECT_ROOT / "data" / "raw" / "garbage-dataset"

conf = float(sys.argv[1]) if len(sys.argv) > 1 else 0.35
predictor = WasteWisePredictor(yolo_model_path=str(E4_MODEL), detection_confidence=conf)

print("=" * 80)
print(f"STAGE-BY-STAGE E4 SANITY CHECK TRACE (CONF={conf:.2f})")
print("=" * 80)

for class_dir in sorted(DATASET_DIR.iterdir()):
    if not class_dir.is_dir():
        continue
    images = [p for p in class_dir.iterdir() if p.suffix.lower() in {".jpg", ".jpeg", ".png"}]
    if not images:
        continue
    image_path = images[0]
    gt = class_dir.name

    result = predictor.predict(str(image_path))
    acc = result["accounting"]
    objs = result["objects"]
    rej = result["rejected_objects"]

    print(f"\n>>> Ground Truth: {gt.upper()} (file: {image_path.name})")
    print(f"    Raw YOLO detections: {acc['raw_detections']}")
    if acc['raw_detections'] == 0:
        print("    -> FAILURE: Zero YOLO detections above threshold (conf=0.50)")
    
    for o in objs:
        print(f"    [ACCEPTED] ID={o['object_id']} YOLO={o['detector']['class']} (conf={o['detector']['confidence']}%) "
              f"-> ResNet={o['classifier']['prediction']} (conf={o['classifier']['confidence']}%) "
              f"OOD_sim={o['classifier']['ood_similarity']} OOD_th={o['classifier']['ood_threshold']}")

    for r in rej:
        cls_info = r.get("classifier") or {}
        print(f"    [REJECTED: {r['rejection_reason']}] ID={r['object_id']} YOLO={r['detector']['class']} (conf={r['detector']['confidence']}%) "
              f"-> ResNet={cls_info.get('prediction')} (conf={cls_info.get('confidence')}%) "
              f"OOD_sim={cls_info.get('ood_similarity')} OOD_th={cls_info.get('ood_threshold')}")

print("\n" + "=" * 80)
