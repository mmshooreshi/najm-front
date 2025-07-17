import os
from PIL import Image, ImageFilter
from natsort import natsorted
import pillow_avif  # enables AVIF support

def make_transparent_webp(
    input_folder,
    output_path="transparent_loop.webp",
    max_size=(512, 512),
    duration=100,            # ms per frame
    motion_blur_alpha=0.3,   # blend factor for motion blur (0–1)
    noise_level=6,           # per‑pixel noise strength
    noise_alpha=0.04,        # noise opacity (very subtle)
    hold_frames=4,           # how many copies of last frame
    quality=75,              # WebP color quality (0–100)
    alpha_quality=50,        # WebP alpha channel quality (0–100)
    method=4,                # WebP compression method (0–6)
):
    # 1) collect & natural‑sort AVIFs
    files = natsorted([
        f for f in os.listdir(input_folder)
        if f.lower().endswith('.avif')
    ])
    if not files:
        raise ValueError(f"No .avif files in {input_folder!r}")

    # 2) load & resize into RGBA frames
    seq = []
    for fn in files:
        img = Image.open(os.path.join(input_folder, fn)).convert("RGBA")
        img.thumbnail(max_size, Image.LANCZOS)
        seq.append(img)

    # 3) build ping‑pong order
    seq = seq + seq[-2:0:-1]

    # 4) apply motion blur + noise
    final = []
    for i in range(len(seq)):
        curr = seq[i]
        nxt  = seq[(i+1) % len(seq)]
        # motion blur: blend current + next
        blur = Image.blend(curr, nxt, motion_blur_alpha)
        # noise: generate grayscale noise and treat as alpha mask
        noise = Image.effect_noise(blur.size, noise_level).convert("L")
        noise_rgba = Image.merge("RGBA", (noise, noise, noise, noise))
        frame = Image.blend(blur, noise_rgba, noise_alpha)
        final.append(frame)

    # 5) hold first frame
    final.extend([final[0]] * hold_frames)

    # 6) save animated WebP with transparency
    final[0].save(
        output_path,
        save_all=True,
        append_images=final[1:],
        duration=duration,
        loop=0,
        format="WEBP",
        quality=quality,
        alpha_quality=alpha_quality,
        method=method,
        lossless=False
    )
    print(f"✅ Written {output_path}")

# Example usage:
make_transparent_webp(
    "/Users/mamthenebo/Desktop/najm-photos-drive/media/01/avif-big",
    output_path="fast_transparent_loop.webp",
    max_size=(800, 800),
    duration=120,
    
    # 0.35
    motion_blur_alpha=0.01,
    
    noise_level=0.1,
    noise_alpha=0.1,
    hold_frames=20,
    quality=80,
    alpha_quality=100,
    method=4
)
