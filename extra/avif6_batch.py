import os
from PIL import Image
from natsort import natsorted
import pillow_avif  # enables AVIF support

def make_transparent_webp(
    input_folder,
    output_path="transparent_loop.webp",
    max_size=(512, 512),
    duration=100,            # ms per “fast” frame
    hold_multiplier=4,       # how many× longer “slow” frames are
    motion_blur_alpha=0.3,   # blend factor for motion blur (0–1)
    noise_level=6,           # per‑pixel noise strength
    noise_alpha=0.04,        # noise opacity (very subtle)
    quality=75,              # WebP color quality (0–100)
    alpha_quality=50,        # WebP alpha channel quality (0–100)
    method=4,                # WebP compression method (0–6)
):
    # 1) collect & natural‑sort AVIFs
    base_files = natsorted([
        f for f in os.listdir(input_folder)
        if f.lower().endswith('.avif')
    ])
    if not base_files:
        raise ValueError(f"No .avif files in {input_folder!r}")

    n = len(base_files)
    long_dur = duration * hold_multiplier
    fast_dur = duration

    # 2) load & resize into RGBA frames
    frames = []
    for fn in base_files:
        img = Image.open(os.path.join(input_folder, fn)).convert("RGBA")
        img.thumbnail(max_size, Image.LANCZOS)
        frames.append(img)

    # 3) build ping‑pong + return‑to‑start sequence
    seq_rev = frames[-2:0:-1]      # 2nd‑last back to index 1
    seq = frames + seq_rev + [frames[0]]
    # seq length = n + (n-2) + 1 = 2n-1

    # 4) apply motion blur + subtle noise
    final = []
    for i in range(len(seq)):
        curr = seq[i]
        nxt  = seq[(i+1) % len(seq)]
        blur = Image.blend(curr, nxt, motion_blur_alpha)
        noise = Image.effect_noise(blur.size, noise_level).convert("L")
        noise_rgba = Image.merge("RGBA", (noise, noise, noise, noise))
        
        # frame = Image.blend(blur, noise_rgba, noise_alpha)
        frame = Image.merge("RGBA", (*Image.blend(blur, noise_rgba, noise_alpha).split()[:3], curr.split()[3]))
        
        final.append(frame)

    # 5) build per-frame durations: [long] + fast*(n-2) + [long] + fast*(n-2) + [long]
    durations = (
        [long_dur] +
        [fast_dur] * (n-2) +
        [long_dur] +
        [fast_dur] * (n-2) +
        [long_dur]
    )

    # 6) save animated WebP with transparency
    final[0].save(
        output_path,
        save_all=True,
        append_images=final[1:],
        duration=durations,
        loop=0,
        format="WEBP",
        quality=quality,
        alpha_quality=alpha_quality,
        method=method,
        lossless=False
    )
    print(f"✅ Written {output_path}")

def batch_transparent_generate(
    base_media_folder,
    output_folder,
    **webp_kwargs
):
    """
    Generates one transparent WebP per subfolder’s 'avif-big'.
    """
    os.makedirs(output_folder, exist_ok=True)

    for item in os.listdir(base_media_folder):
        folder_path = os.path.join(base_media_folder, item, "avif-big")
        if os.path.isdir(folder_path):
            out = os.path.join(output_folder, f"{item}.webp")
            try:
                make_transparent_webp(
                    input_folder=folder_path,
                    output_path=out,
                    **webp_kwargs
                )
            except Exception as e:
                print(f"⚠️ Skipping '{item}': {e}")

# Example usage:
batch_transparent_generate(
    base_media_folder="/Users/mamthenebo/Desktop/najm-photos-drive/media",
    output_folder="public/videos",
    max_size=(800, 800),
    duration=120,
    hold_multiplier=4,
    motion_blur_alpha=0.01,
    noise_level=0.1,
    noise_alpha=0.1,
    quality=80,
    alpha_quality=50,
    method=6
)

