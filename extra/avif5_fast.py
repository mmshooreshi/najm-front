import os
from PIL import Image, ImageFilter
from natsort import natsorted
import pillow_avif  # enables AVIF support

def make_simple_webp(
    input_folder,
    output_path="simple_loop.webp",
    max_size=(512, 512),
    duration=100,       # ms per frame
    blur_radius=1,      # single Gaussian blur radius
    hold_frames=5       # how many extra copies of last frame
):
    # 1) load & resize
    # “natural” sort (1,2,10 instead of 1,10,2):
    files = natsorted([f for f in os.listdir(input_folder)
                   if f.lower().endswith('.avif')])

    frames = []
    for fn in files:
        img = Image.open(os.path.join(input_folder, fn)).convert("RGBA")
        img.thumbnail(max_size, Image.LANCZOS)
        # apply a single, fast blur
        if blur_radius > 0:
            img = img.filter(ImageFilter.GaussianBlur(blur_radius))
        frames.append(img)
    if not frames:
        raise ValueError("No .avif files found in “%s”." % input_folder)

    # 2) build ping‑pong sequence (forward + backward, minus duplicate endpoints)
    pingpong = frames + frames[-2:0:-1]

    # 3) stick extra copies of the last frame at the end for a “hold”
    pingpong.extend([pingpong[0]] * hold_frames)

    # 4) save out as an animated WebP
    pingpong[0].save(
        output_path,
        save_all=True,
        append_images=pingpong[1:],
        duration=duration,
        loop=0,
        format="WEBP"
    )
    print("✅ Saved to", output_path)

# Example:
make_simple_webp(
    "/Users/mamthenebo/Desktop/najm-photos-drive/media/01/avif-big",
    output_path="fast_loop.webp",
    max_size=(800,800),
    duration=120,
    blur_radius=0,
    hold_frames=8
)
