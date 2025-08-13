#!/usr/bin/env python3
"""
compress_media.py

Batch-compress images and videos for web use with optimized quality settings.
Images → WebP (or JPEG) via Pillow with better quality defaults.
Videos → MP4 (H.264) via ffmpeg with optimized settings.

Usage:
    python compress_media.py \
        --input-dir ./src/assets \
        --output-dir ./src/assets/optimized \
        --img-quality 85 \
        --max-img-dim 2048 \
        --video-crf 20 \
        --max-video-dim 1920 \
        --to-webp
"""

import os
import sys
import argparse
import logging
import subprocess
from pathlib import Path
from PIL import Image
from tqdm import tqdm

SUPPORTED_IMAGES = {'.jpg', '.jpeg', '.png', '.gif', '.bmp', '.tiff'}
SUPPORTED_VIDEOS = {'.mp4', '.mov', '.avi', '.mkv', '.webm'}


def compress_image(src_path: Path, dest_path: Path, quality: int, max_dim: int, to_webp: bool, preserve_alpha: bool = True):
    """Compress image with better quality settings and alpha channel preservation."""
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    
    with Image.open(src_path) as img:
        # Convert to RGB if saving as JPEG and image has alpha channel
        if not to_webp and img.mode in ('RGBA', 'LA', 'P'):
            # Create white background for transparent images
            background = Image.new('RGB', img.size, (255, 255, 255))
            if img.mode == 'P':
                img = img.convert('RGBA')
            background.paste(img, mask=img.split()[-1] if img.mode == 'RGBA' else None)
            img = background
        
        # Resize if too large while maintaining aspect ratio
        if max(img.size) > max_dim:
            img.thumbnail((max_dim, max_dim), Image.Resampling.LANCZOS)
        
        # Prepare save arguments
        fmt = 'WEBP' if to_webp else 'JPEG'
        save_kwargs = {'quality': quality}
        
        if to_webp:
            save_kwargs.update({
                'method': 6,  # Best compression method
                'lossless': False,
                'exact': True  # Preserve exact pixel values
            })
        else:
            save_kwargs.update({
                'optimize': True,
                'progressive': True,  # Progressive JPEG for better perceived loading
                'subsampling': 0  # No chroma subsampling for better quality
            })

        img.save(dest_path.with_suffix('.webp' if to_webp else '.jpg'), fmt, **save_kwargs)


def compress_video(src_path: Path, dest_path: Path, crf: int, max_dim: int, preset: str = 'slow'):
    """Compress video with optimized settings for better quality."""
    dest_path.parent.mkdir(parents=True, exist_ok=True)
    
    # Build scale filter to maintain aspect ratio
    scale_filter = f"scale='min({max_dim},iw)':-2"
    
    cmd = [
        'ffmpeg',
        '-i', str(src_path),
        '-vf', scale_filter,
        '-c:v', 'libx264',
        '-preset', preset,  # 'slow' for better compression
        '-crf', str(crf),
        '-c:a', 'aac',
        '-b:a', '192k',  # Higher audio bitrate for better quality
        '-movflags', '+faststart',  # Optimize for web streaming
        '-pix_fmt', 'yuv420p',  # Ensure compatibility
        '-y',  # Overwrite
        str(dest_path.with_suffix('.mp4'))
    ]
    
    try:
        subprocess.run(cmd, check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
    except subprocess.CalledProcessError as e:
        logging.error(f"FFmpeg failed for {src_path}: {e}")
        raise


def get_file_size_mb(file_path: Path) -> float:
    """Get file size in MB."""
    return file_path.stat().st_size / (1024 * 1024)


def main(args):
    logging.basicConfig(level=logging.INFO, format='%(levelname)s: %(message)s')
    in_dir = Path(args.input_dir)
    out_dir = Path(args.output_dir)

    if not in_dir.exists():
        logging.error(f"Input directory does not exist: {in_dir}")
        return

    # Create output directory
    out_dir.mkdir(parents=True, exist_ok=True)

    all_files = list(in_dir.rglob('*'))
    processed_count = 0
    total_saved_mb = 0

    for src in tqdm(all_files, desc="Processing media"):
        if src.is_dir():
            continue
            
        rel = src.relative_to(in_dir)
        ext = src.suffix.lower()
        
        try:
            if ext in SUPPORTED_IMAGES:
                # Decide output extension
                to_webp = args.to_webp
                dest = out_dir / rel
                if to_webp:
                    dest = dest.with_suffix('.webp')
                else:
                    dest = dest.with_suffix('.jpg')
                
                if dest.exists() and not args.force:
                    logging.debug(f"Skipping existing file: {dest}")
                    continue
                    
                original_size = get_file_size_mb(src)
                compress_image(src, dest, args.img_quality, args.max_img_dim, to_webp)
                compressed_size = get_file_size_mb(dest)
                saved_mb = original_size - compressed_size
                total_saved_mb += saved_mb
                processed_count += 1
                
                logging.info(f"Compressed {src.name}: {original_size:.1f}MB → {compressed_size:.1f}MB (saved {saved_mb:.1f}MB)")
                
            elif ext in SUPPORTED_VIDEOS:
                dest = out_dir / rel
                dest = dest.with_suffix('.mp4')
                
                if dest.exists() and not args.force:
                    logging.debug(f"Skipping existing file: {dest}")
                    continue
                    
                original_size = get_file_size_mb(src)
                compress_video(src, dest, args.video_crf, args.max_video_dim, args.video_preset)
                compressed_size = get_file_size_mb(dest)
                saved_mb = original_size - compressed_size
                total_saved_mb += saved_mb
                processed_count += 1
                
                logging.info(f"Compressed {src.name}: {original_size:.1f}MB → {compressed_size:.1f}MB (saved {saved_mb:.1f}MB)")
                
            else:
                logging.debug(f"Skipping unsupported file: {src}")
                
        except Exception as e:
            logging.error(f"Failed to process {src}: {e}")

    logging.info(f"All done! Processed {processed_count} files, saved {total_saved_mb:.1f}MB total")


if __name__ == '__main__':
    p = argparse.ArgumentParser(description="Compress images and videos for web with optimized quality.")
    p.add_argument('--input-dir',  '-i', required=True, help="Source folder of raw media")
    p.add_argument('--output-dir', '-o', required=True, help="Destination folder for compressed media")
    p.add_argument('--img-quality', type=int, default=85, help="Image quality (0–100, default: 85)")
    p.add_argument('--max-img-dim', type=int, default=2048, help="Max width/height for images (default: 2048)")
    p.add_argument('--to-webp', action='store_true', help="Convert images to WebP (better compression)")
    p.add_argument('--video-crf', type=int, default=20, help="FFmpeg CRF for video (18-28, lower=better, default: 20)")
    p.add_argument('--max-video-dim', type=int, default=1920, help="Max width for videos (default: 1920)")
    p.add_argument('--video-preset', default='slow', choices=['ultrafast', 'superfast', 'veryfast', 'faster', 'fast', 'medium', 'slow', 'slower', 'veryslow'], help="FFmpeg preset (default: slow)")
    p.add_argument('--force', action='store_true', help="Overwrite existing files")
    args = p.parse_args()
    main(args)