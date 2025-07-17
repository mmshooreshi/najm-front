import os
import shutil
from pathlib import Path
from slugify import slugify
from PIL import Image
import argparse

# Optional: install pillow-avif-plugin for AVIF support
# pip install pillow-avif-plugin

SIZES = {
    'original': None,
    'big': 1920,
    'medium': 1280,
    'small': 640,
    'supersmall': 320,
}

FORMATS = [
    ('png', {'format': 'PNG', 'optimize': True, 'compress_level': 6}),
    ('webp', {'format': 'WEBP'}),
    ('avif', {'format': 'AVIF'}),
]


def process_image(src_path: Path, dest_dir: Path, base_name: str, quality_settings: dict):
    img = Image.open(src_path)
    width, height = img.size

    for size_label, target_width in SIZES.items():
        # compute resized image
        if target_width and width > target_width:
            ratio = target_width / width
            new_size = (int(width * ratio), int(height * ratio))
            resized = img.resize(new_size, Image.LANCZOS)
        else:
            resized = img.copy()

        for fmt_ext, opts in FORMATS:
            # skip re-saving original into other formats
            if size_label == 'original' and fmt_ext == 'png':
                out_name = f"{base_name}.{fmt_ext}"
            else:
                out_name = f"{base_name}_{size_label}.{fmt_ext}"

            out_path = dest_dir / fmt_ext / size_label / out_name
            out_path.parent.mkdir(parents=True, exist_ok=True)

            save_opts = opts.copy()
            # tunable quality per format
            if fmt_ext in quality_settings:
                save_opts.update(quality_settings[fmt_ext])

            resized.save(out_path, **save_opts)


def main(input_dir: Path, output_dir: Path, quality_settings: dict):
    # iterate top-level folders
    for folder in sorted(input_dir.iterdir()):
        if not folder.is_dir():
            continue
        # slug for folder
        slug = slugify(folder.name)
        target_folder = output_dir / slug
        # clean existing
        if target_folder.exists():
            shutil.rmtree(target_folder)

        for img_file in folder.iterdir():
            if img_file.suffix.lower() not in ['.png', '.jpg', '.jpeg', '.webp']:
                continue
            base_name = img_file.stem
            process_image(img_file, target_folder, base_name, quality_settings)


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description='Batch image processor')
    parser.add_argument('--input', '-i', type=Path, required=True, help='Input root directory')
    parser.add_argument('--output', '-o', type=Path, required=True, help='Output root directory')
    parser.add_argument('--png-quality', type=int, default=90, help='PNG quality (1-100)')
    parser.add_argument('--webp-quality', type=int, default=80, help='WEBP quality (1-100)')
    parser.add_argument('--avif-quality', type=int, default=50, help='AVIF quality (1-100)')
    args = parser.parse_args()

    quality_settings = {
        'png': {'optimize': True, 'compress_level': 6},
        'webp': {'quality': args.webp_quality, 'method': 6},
        'avif': {'quality': args.avif_quality}
    }

    main(args.input, args.output, quality_settings)
