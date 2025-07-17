import os
from PIL import Image, ImageSequence, ImageFilter
from natsort import natsorted
import pillow_avif  # AVIF support
import numpy as np

def ease_in_out(t):
    return t * t * (3 - 2 * t)  # Smoothstep

def add_noise(image, grain_strength=10):
    if grain_strength <= 0:
        return image
    arr = np.array(image).astype(np.int16)
    noise = np.random.normal(0, grain_strength, arr.shape[:2])
    if arr.ndim == 3:
        for c in range(3):  # RGB only
            arr[..., c] = np.clip(arr[..., c] + noise, 0, 255)
    return Image.fromarray(arr.astype(np.uint8))

def make_tiny_webp_loop(
    input_folder,
    output_path="tiny_loop.webp",
    duration=80,
    max_size=(512, 512),
    quality=90,
    blur_strength=0.3,
    grain_strength=8,
    hold_final_frame=3,
    use_curve=True
):
    files = [f for f in os.listdir(input_folder) if f.lower().endswith('.avif')]
    files = natsorted(files)

    if not files:
        print("No AVIF files found.")
        return

    frames = []
    for file in files:
        path = os.path.join(input_folder, file)
        img = Image.open(path).convert("RGBA")
        img.thumbnail(max_size, Image.LANCZOS)
        img = add_noise(img, grain_strength=grain_strength)
        frames.append(img)

    # Ping-pong loop
    pingpong_frames = frames + frames[-2:0:-1]

    # Apply motion blur (blend current with next)
    blurred_frames = []
    for i in range(len(pingpong_frames)):
        current = pingpong_frames[i]
        next_frame = pingpong_frames[(i + 1) % len(pingpong_frames)]
        blurred = Image.blend(current, next_frame, blur_strength)
        blurred_frames.append(blurred)

    total_frames = len(blurred_frames)
    if use_curve:
        durations = []
        for i in range(total_frames):
            t = i / (total_frames - 1)
            eased = ease_in_out(t)
            d = int(duration * (0.5 + eased))  # Varies between 0.5x to 1.5x
            durations.append(d)
    else:
        durations = [duration] * total_frames

    # Hold final frame
    for _ in range(hold_final_frame):
        blurred_frames.append(blurred_frames[-1].copy())
        durations.append(duration * 3)

    # Save WebP
    blurred_frames[0].save(
        output_path,
        save_all=True,
        append_images=blurred_frames[1:],
        duration=durations,
        loop=0,
        format="WEBP",
        quality=quality,
        method=6,
        lossless=False
    )

    print(f"✨ Animated WebP created: {output_path}")

# Example usage
make_tiny_webp_loop(
    "/Users/mamthenebo/Desktop/najm-photos-drive/media/01/avif-big",
    output_path="tiny_loop.webp",
    duration=120,
    max_size=(1000, 1000),
    quality=100,
    blur_strength=0.05,
    grain_strength=12,
    hold_final_frame=4,
    use_curve=True
)
