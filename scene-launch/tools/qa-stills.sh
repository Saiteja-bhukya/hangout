#!/usr/bin/env bash
# Extract QA stills from the rendered MP4 at section boundaries and chat-readability moments; build labelled sheets.
set -euo pipefail
cd "$(dirname "$0")/.."
V=${1:-renders/scene-launch.mp4}; O=review/qa; rm -rf $O; mkdir -p $O
TIMES="0.3 2.9 4.9 5.1 7.0 8.5 9.5 11.0 11.9 12.4 12.6 14.9 15.1 17.0 18.9 19.1 20.9 22.3 22.5 24.6 25.9 26.1 27.0 28.5 29.3 29.5 31.2 32.7 32.9 34.2 35.9 36.9 37.1 39.0 40.5 41.6 42.9 44.2 45.2 46.6 47.9 48.1 49.0 50.6 51.5 53.9 54.1 55.3 56.9 59.5"
i=0; for t in $TIMES; do f=$(printf "%s/%02d_%06.2fs.png" $O $i $t); ffmpeg -loglevel error -y -ss $t -i $V -frames:v 1 "$f"; i=$((i+1)); done
# labelled 4-up sheets (960x540 tiles)
ls $O/*.png | sort > $O/_list.txt
n=0; batch=(); while read -r f; do batch+=("$f"); if [ ${#batch[@]} -eq 6 ]; then
  args=(); fl=""; k=0; for b in "${batch[@]}"; do t=$(basename "$b" .png | cut -d_ -f2); args+=(-i "$b"); fl+="[$k:v]scale=960:540,drawbox=x=0:y=0:w=150:h=44:color=black@0.7:t=fill,drawtext=text='$t':x=12:y=10:fontsize=26:fontcolor=white[v$k];"; k=$((k+1)); done
  ffmpeg -nostdin -loglevel error -y "${args[@]}" -filter_complex "${fl}[v0][v1][v2][v3][v4][v5]xstack=inputs=6:layout=0_0|w0_0|0_h0|w0_h0|0_h0+h0|w0_h0+h0[o]" -map "[o]" -q:v 3 $(printf "%s/sheet_%02d.jpg" $O $n); n=$((n+1)); batch=(); fi; done < $O/_list.txt
echo "stills: $(ls $O/*.png | wc -l), sheets: $(ls $O/sheet_*.jpg | wc -l)"
