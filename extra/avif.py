#!/usr/bin/env python3
"""
generate_avif_videos.py

Generate AV1 IVF videos from a folder of AVIF images using multiple interpolation methods.

Usage:
    python generate_avif_videos.py --input-dir PATH_TO_AVIF --output-dir OUTPUT_DIR \
        [--fps FPS] [--inter_frames N]

Dependencies:
    pip install opencv-python numpy pillow-avif-plugin ffmpeg-python imageio-ffmpeg
"""
import os
import argparse
import glob
import numpy as np
import cv2
import ffmpeg
from PIL import Image
import pillow_avif  # enable AVIF support

def ease_in_out_cubic(t: float) -> float:
    return 4*t**3 if t < 0.5 else 1 - ((-2*t + 2)**3) / 2

def ease_out_back(t: float, c1: float = 1.70158) -> float:
    c3 = c1 + 1
    return 1 + c3*(t-1)**3 + c1*(t-1)**2

def linear_interpolate(a: np.ndarray, b: np.ndarray, t: float) -> np.ndarray:
    return ((1-t)*a + t*b).astype(np.uint8)

def motion_blur_sequence(frames: list[np.ndarray], inter_frames: int, trail: int = 3) -> list[np.ndarray]:
    out = []
    n = len(frames)
    for i in range(n-1):
        A = frames[i].astype(np.float32)
        B = frames[i+1].astype(np.float32)
        for k in range(inter_frames+1):
            alpha = k / (inter_frames+1)
            img = np.zeros_like(A)
            for j in range(trail+1):
                w = max(alpha - j/(trail+1), 0)
                src = B if j==0 else frames[max(i-j,0)].astype(np.float32)
                img += w*src
            out.append(np.clip(img,0,255).astype(np.uint8))
    return out

def optical_flow_interpolate(frames: list[np.ndarray], inter_frames: int) -> list[np.ndarray]:
    out = []
    for i in range(len(frames)-1):
        prev = cv2.cvtColor(frames[i], cv2.COLOR_RGB2GRAY)
        nxt = cv2.cvtColor(frames[i+1], cv2.COLOR_RGB2GRAY)
        flow = cv2.calcOpticalFlowFarneback(prev, nxt, None, 0.5,3,15,3,5,1.2,0)
        h, w = prev.shape
        grid_x, grid_y = np.meshgrid(np.arange(w), np.arange(h))
        for k in range(inter_frames+1):
            alpha = k/(inter_frames+1)
            fx = grid_x + flow[...,0]*alpha
            fy = grid_y + flow[...,1]*alpha
            warped = cv2.remap(frames[i], fx.astype(np.float32), fy.astype(np.float32), cv2.INTER_LINEAR)
            blended = cv2.addWeighted(warped,1-alpha,frames[i+1],alpha,0)
            out.append(blended)
    return out

# Map method names to functions
INTERPOLATORS = {
    'linear': linear_interpolate,
    'ease_in_out_cubic': ease_in_out_cubic,
    'ease_out_back': ease_out_back,
    'motion_blur': motion_blur_sequence,
}

def load_images(input_dir: str) -> list[np.ndarray]:
    paths = sorted(glob.glob(os.path.join(input_dir, '*.avif')))
    imgs = []
    for p in paths:
        try:
            with Image.open(p) as img:
                frame = np.array(img.convert('RGB'))
                imgs.append(frame)
        except Exception as e:
            raise RuntimeError(f"Failed to load image {p}: {e}")
    return imgs


def write_video(frames: list[np.ndarray], out_path: str, fps: int = 24):
    h, w, _ = frames[0].shape
    process = (
        ffmpeg
        .input('pipe:', format='rawvideo', pix_fmt='rgb24', s=f'{w}x{h}', r=fps)
        .output(out_path, vcodec='libaom-av1', pix_fmt='yuv420p', crf=30)
        .overwrite_output()
        .run_async(pipe_stdin=True)
    )
    for frame in frames:
        process.stdin.write(frame.tobytes())
    process.stdin.close()
    process.wait()


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument('--input-dir', required=True)
    parser.add_argument('--output-dir', required=True)
    parser.add_argument('--fps', type=int, default=24)
    parser.add_argument('--inter_frames', type=int, default=5)
    args = parser.parse_args()

    images = load_images(args.input_dir)
    os.makedirs(args.output_dir, exist_ok=True)

    methods = ['linear', 'ease_in_out_cubic', 'ease_out_back', 'motion_blur']
    for idx, name in enumerate(methods, start=1):
        # Prepare interpolated frames
        frames_out = []
        for i in range(len(images) - 1):
            A = images[i].astype(np.float32)
            B = images[i + 1].astype(np.float32)
            for k in range(args.inter_frames + 1):
                t = k / (args.inter_frames + 1)
                if name == 'linear':
                    # Direct linear interpolation
                    frame = linear_interpolate(A, B, t)
                elif name in ('ease_in_out_cubic', 'ease_out_back'):
                    # Compute eased weight then blend
                    weight = INTERPOLATORS[name](t)  # single-parameter ease fn
                    frame = np.clip((1 - weight) * A + weight * B, 0, 255).astype(np.uint8)
                elif name == 'motion_blur':
                    # Motion blur handled separately below
                    frame = None
                else:
                    # Fallback to linear
                    frame = linear_interpolate(A, B, t)
                if frame is not None:
                    frames_out.append(frame)
        # Motion blur method produces its full sequence at once
        if name == 'motion_blur':
            frames_out = motion_blur_sequence(images, args.inter_frames)

        out_file = os.path.join(args.output_dir, f'video_{idx:02d}_{name}.ivf')
        write_video(frames_out, out_file, fps=args.fps)

    # Optical flow
    frames_of = optical_flow_interpolate(images, args.inter_frames)
    out_file = os.path.join(args.output_dir, 'video_05_optical_flow.ivf')
    write_video(frames_of, out_file, fps=args.fps)

    print(f"Generated {len(methods)+1} videos in '{args.output_dir}'")

if __name__ == '__main__':
    main()
