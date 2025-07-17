
import os
from PIL import Image, ImageSequence
from natsort import natsorted
import pillow_avif  # enable AVIF support

def make_tiny_webp_loop(input_folder, output_path="tiny_loop.webp", duration=80, max_size=(512, 512), quality=90):
    # Collect AVIF files, sorted
    files = [f for f in os.listdir(input_folder) if f.lower().endswith('.avif')]
    files = natsorted(files)

    if not files:
        print("No AVIF files found.")
        return

    frames = []

    for file in files:
        path = os.path.join(input_folder, file)
        img = Image.open(path).convert("RGBA")  # Preserve transparency
        img.thumbnail(max_size, Image.LANCZOS)  # Resize to max dimensions
        frames.append(img)

    if not frames:
        print("No frames loaded.")
        return

    # Save optimized WebP
    frames[0].save(
        output_path,
        save_all=True,
        append_images=frames[1:],
        duration=duration,
        loop=0,
        format="WEBP",
        quality=quality,
        method=6,       # Best compression method
        lossless=False  # Try lossy for tiny size + visual quality
    )

    print(f"✨ Animated WebP created: {output_path}")

# Example usage
make_tiny_webp_loop(
    "/Users/mamthenebo/Desktop/najm-photos-drive/media/01/avif-big",
    output_path="tiny_loop.webp",
    duration=300,            # ms per frame (~12.5 FPS)
    max_size=(1200, 1200),    # Resize for web-efficiency
    quality=100              # Tweak between 75–95 for best size-quality balance
)
