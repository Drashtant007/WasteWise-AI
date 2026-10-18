from ultralytics import YOLO

MODEL = r"runs\detect\results\taco_external_balanced\yolo11s_balanced\weights\best.pt"
IMAGE = r"data\external\trashnet_plus_plus\TrashNet\YOLO Formet\test\images\20250616_194002_jpg.rf.cf3b582fbf379b94c71f0beb08c823a7.jpg"

model = YOLO(MODEL)

for conf in [0.10, 0.15, 0.20, 0.25, 0.30, 0.35]:
    result = model.predict(
        source=IMAGE,
        conf=conf,
        imgsz=640,
        iou=0.50,
        verbose=False,
    )[0]

    print()
    print("=" * 70)
    print(f"CONFIDENCE THRESHOLD: {conf}")
    print(f"DETECTIONS: {len(result.boxes)}")

    for i, box in enumerate(result.boxes):
        cls_id = int(box.cls[0])
        score = float(box.conf[0])
        name = model.names[cls_id]

        xyxy = [round(float(v), 1) for v in box.xyxy[0].tolist()]

        print(
            f"{i+1:02d}. "
            f"{name:<18} "
            f"{score*100:6.2f}%   "
            f"box={xyxy}"
        )

print()
print("DIAGNOSTIC COMPLETE")
