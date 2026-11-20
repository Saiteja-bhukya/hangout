#!/usr/bin/env bash
# Splice re-rendered ranges into the full render (frame-accurate) and mux the current master mix.
# Ranges (frames @30fps): r1 120-246 (4.0-8.2 s, hook), r2 360-378 (12.0-12.6 s, reveal fly-in)
set -euo pipefail
cd "$(dirname "$0")/.."
O=renders/toli-launch.mp4; P=renders
ffmpeg -nostdin -loglevel error -y -ss 12.0 -i $O -frames:v 1 /tmp/_o.png; ffmpeg -nostdin -loglevel error -y -i $P/patch-r2.mp4 -frames:v 1 /tmp/_p.png
echo "r2 first-frame PSNR vs original (unchanged black): $(ffmpeg -nostdin -i /tmp/_o.png -i /tmp/_p.png -lavfi psnr -f null - 2>&1 | grep -oE 'average:[0-9.inf]+')"
ffmpeg -nostdin -hide_banner -loglevel error -y -i $O -i $P/patch-r1.mp4 -i $P/patch-r2.mp4 -i assets/audio/scene-mix.wav -filter_complex "
[0:v]trim=start_frame=0:end_frame=120,setpts=PTS-STARTPTS[a];
[1:v]trim=start_frame=0:end_frame=126,setpts=PTS-STARTPTS[b];
[0:v]trim=start_frame=246:end_frame=360,setpts=PTS-STARTPTS[c];
[2:v]trim=start_frame=0:end_frame=18,setpts=PTS-STARTPTS[d];
[0:v]trim=start_frame=378:end_frame=1800,setpts=PTS-STARTPTS[e];
[a][b][c][d][e]concat=n=5:v=1:a=0,fps=30[v]" -map "[v]" -map 3:a -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -profile:v high -c:a aac -b:a 192k -ar 48000 -t 60 -movflags +faststart $P/toli-launch-60s.mp4
ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames,width,height,r_frame_rate -show_entries format=duration,size -of compact $P/toli-launch-60s.mp4
