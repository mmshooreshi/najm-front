import os
from PIL import Image
from natsort import natsorted
import pillow_avif  # enables AVIF support

def make_tiny_webp_loop(input_folder, output_path, duration=80, max_size=(512, 512), quality=90):
    files = [f for f in os.listdir(input_folder) if f.lower().endswith('.avif')]
    files = natsorted(files)

    if not files:
        print(f"❌ No AVIF files found in {input_folder}")
        return

    frames = []

    for file in files:
        path = os.path.join(input_folder, file)
        img = Image.open(path).convert("RGBA")
        img.thumbnail(max_size, Image.LANCZOS)
        frames.append(img)

    if not frames:
        print(f"⚠️ No frames loaded from {input_folder}")
        return

    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=duration,
        loop=0,
        format="WEBP",
        quality=quality,
        method=6,
        lossless=False
    )

    print(f"✅ Created: {output_path}")

def batch_generate_all(base_media_folder, output_folder):
    os.makedirs(output_folder, exist_ok=True)

    for item in os.listdir(base_media_folder):
        full_path = os.path.join(base_media_folder, item, "avif-big")
        if os.path.isdir(full_path):
            output_path = os.path.join(output_folder, f"{item}.webp")
            make_tiny_webp_loop(
                input_folder=full_path,
                output_path=output_path,
                duration=300,
                max_size=(1200, 1200),
                quality=100
            )

# Example usage
batch_generate_all(
    base_media_folder="/Users/mamthenebo/Desktop/najm-photos-drive/media",
    output_folder="videos"
)
