import os
import numpy as np
import imageio
from PIL import Image

def is_grayish(r, g, b, a, threshold=20, alpha_threshold=230):
    return (
        a < alpha_threshold and
        abs(r - g) < threshold and
        abs(r - b) < threshold and
        abs(g - b) < threshold
    )

def clean_frame(frame: np.ndarray) -> Image.Image:
    img = Image.fromarray(frame).convert("RGBA")
    data = np.array(img)

    r, g, b, a = data[..., 0], data[..., 1], data[..., 2], data[..., 3]
    mask = (
        (a < 230) &
        (np.abs(r - g) < 20) &
        (np.abs(r - b) < 20) &
        (np.abs(g - b) < 20)
    )

    data[mask] = [0, 0, 0, 0]  # Fully transparent
    return Image.fromarray(data, "RGBA")

def clean_animated_webp(input_path, output_path):
    reader = imageio.get_reader(input_path, format="webp")
    meta = reader.get_meta_data()

    frames = []
    durations = []

    for i, frame in enumerate(reader):
        cleaned = clean_frame(frame)
        frames.append(np.array(cleaned))
        durations.append(meta['duration'] if isinstance(meta['duration'], int) else meta['duration'][i])

    imageio.mimsave(output_path, frames, format="webp", duration=durations, loop=0)

    print(f"Saved cleaned animation: {output_path}")

# Example:
# clean_animated_webp("input/my_anim.webp", "output/my_anim_cleaned.webp")

clean_animated_webp("32.webp","32'.webp")