from src.inference.predict import WasteWisePredictor

IMAGE = r"data\external\trashnet_plus_plus\TrashNet\YOLO Formet\test\images\20250616_194002_jpg.rf.cf3b582fbf379b94c71f0beb08c823a7.jpg"

predictor = WasteWisePredictor(
    detection_confidence=0.35,
)

for threshold in [0.20, 0.25, 0.30, 0.35]:

    predictor.detection_confidence = threshold

    result = predictor.predict(IMAGE)

    print()
    print("=" * 80)
    print(f"INTEGRATED THRESHOLD: {threshold}")
    print("=" * 80)

    print(f"Raw detections      : {result['summary']['raw_detections']}")
    print(f"Accepted objects    : {result['summary']['accepted_objects']}")
    print(f"Total rejections    : {result['summary']['total_rejections']}")
    print(f"OOD rejections      : {result['summary']['ood_rejections']}")
    print(f"Compatibility reject: {result['summary']['compatibility_rejections']}")

    print()
    print("ACCEPTED:")

    for obj in result.get("objects", []):
        print(
            f"  Object {obj['object_id']:02d} | "
            f"YOLO={obj['detector']['class']} "
            f"{obj['detector']['confidence']:.1f}% | "
            f"ResNet={obj['classifier']['prediction']} "
            f"{obj['classifier']['confidence']:.1f}% | "
            f"OOD={obj['classifier']['ood_similarity']:.3f}"
        )

    print()
    print("REJECTED:")

    for obj in result.get("rejected_objects", []):
        print(
            f"  Object {obj['object_id']:02d} | "
            f"YOLO={obj['detector']['class']} "
            f"{obj['detector']['confidence']:.1f}% | "
            f"ResNet={obj['classifier']['prediction']} "
            f"{obj['classifier']['confidence']:.1f}% | "
            f"Reason={obj.get('rejection_reason')}"
        )

print()
print("=" * 80)
print("THRESHOLD DIAGNOSTIC COMPLETE")
print("=" * 80)
