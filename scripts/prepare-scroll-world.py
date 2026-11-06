"""Prepare existing artwork with oso95/scroll-world's seek-friendly encoding settings."""
import argparse
from pathlib import Path
import shutil
import subprocess

parser = argparse.ArgumentParser()
parser.add_argument('--ffmpeg', default=shutil.which('ffmpeg'))
parser.add_argument('--variant', choices=('desktop', 'mobile', 'all'), default='all')
args = parser.parse_args()
if not args.ffmpeg:
    parser.error('Pass --ffmpeg with the path to an FFmpeg executable.')

assets = Path(__file__).resolve().parents[1] / 'public' / 'assets' / 'backgrounds'
variants = ('desktop', 'mobile') if args.variant == 'all' else (args.variant,)
for variant in variants:
    source = assets / f'metanoia-{variant}.mp4'
    output = assets / f'metanoia-{variant}-scrub.mp4'
    # At DPR 1 this covers phone viewports without decoding a 720p video every seek.
    filters = 'scale=576:1024' if variant == 'mobile' else 'unsharp=5:5:0.8:5:5:0.0'
    gop = '4' if variant == 'mobile' else '8'
    subprocess.run([
        args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(source),
        '-an', '-vf', filters, '-c:v', 'libx264', '-preset', 'slow',
        '-crf', '25' if variant == 'mobile' else '20', '-pix_fmt', 'yuv420p',
        '-g', gop, '-keyint_min', gop, '-sc_threshold', '0',
        '-movflags', '+faststart', str(output),
    ], check=True)
    subprocess.run([
        args.ffmpeg, '-hide_banner', '-loglevel', 'error', '-y', '-i', str(output),
        '-frames:v', '1', '-q:v', '2', str(assets / f'metanoia-{variant}-scrub.jpg'),
    ], check=True)
    print(f'{variant}: {output.stat().st_size / 1024 / 1024:.2f} MiB, GOP {gop}', flush=True)
