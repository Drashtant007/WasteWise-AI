from pathlib import Path

p = Path(r"scripts\diagnose_taco_invalid_boxes.py")

text = p.read_text(encoding="utf-8")

old = """    if orientation == 6:
        return H - (y + h), x, h, w

    if orientation == 8:
        return y, W - (x + w), h, w

    return x, y, w, h
"""

new = """    if orientation == 3:
        return W - (x + w), H - (y + h), w, h

    if orientation == 6:
        return W - (y + h), x, h, w

    if orientation == 8:
        return y, H - (x + w), h, w

    return x, y, w, h
"""

if old not in text:
    raise RuntimeError("Original diagnostic transformation block was not found.")

p.write_text(text.replace(old, new), encoding="utf-8")

print("SUCCESS: TACO diagnostic transformation corrected.")
