#!/usr/bin/env bash
# Splice re-rendered ranges into the full render (frame-accurate), keeping the original audio.
# Ranges (frames @30fps): r1 339-390 (11.3-13.0 s), r2 1005-1338 (33.5-44.6 s), r3 1647-1677 (54.9-55.9 s)
set -euo pipefail
cd "$(dirname "$0")/.."
O=renders/scene-launch.mp4; P=renders
# alignment check: a patch's first frame (unchanged content) must match the original at the same time
for spec in "r1 11.3" "r2 33.5" "r3 54.9"; do set -- $spec
  ffmpeg -nostdin -loglevel error -y -ss $2 -i $O -frames:v 1 /tmp/_o.png
  ffmpeg -nostdin -loglevel error -y -i $P/patch-$1.mp4 -frames:v 1 /tmp/_p.png
  echo "$1 @ $2 s first-frame PSNR vs original: $(ffmpeg -nostdin -i /tmp/_o.png -i /tmp/_p.png -lavfi psnr -f null - 2>&1 | grep -oE 'average:[0-9.inf]+')"
done
ffmpeg -nostdin -hide_banner -loglevel error -y -i $O -i $P/patch-r1.mp4 -i $P/patch-r2.mp4 -i $P/patch-r3.mp4 -filter_complex "
[0:v]trim=start_frame=0:end_frame=339,setpts=PTS-STARTPTS[a];
[1:v]trim=start_frame=0:end_frame=51,setpts=PTS-STARTPTS[b];
[0:v]trim=start_frame=390:end_frame=1005,setpts=PTS-STARTPTS[c];
[2:v]trim=start_frame=0:end_frame=333,setpts=PTS-STARTPTS[d];
[0:v]trim=start_frame=1338:end_frame=1647,setpts=PTS-STARTPTS[e];
[3:v]trim=start_frame=0:end_frame=30,setpts=PTS-STARTPTS[f];
[0:v]trim=start_frame=1677:end_frame=1800,setpts=PTS-STARTPTS[g];
[a][b][c][d][e][f][g]concat=n=7:v=1:a=0,fps=30[v]" -map "[v]" -map 0:a -c:v libx264 -preset slow -crf 19 -pix_fmt yuv420p -profile:v high -c:a copy -movflags +faststart $P/SCENE-launch-60s.mp4
ffprobe -v error -count_frames -select_streams v -show_entries stream=nb_read_frames,width,height,r_frame_rate -show_entries format=duration,size -of compact $P/SCENE-launch-60s.mp4
