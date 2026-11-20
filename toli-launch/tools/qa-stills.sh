#!/usr/bin/env bash
# Extract QA stills from the rendered MP4 at section boundaries and chat-readability moments; build labelled sheets.
set -euo pipefail
cd "$(dirname "$0")/.."
V=${1:-renders/toli-launch.mp4}; O=review/qa; rm -rf $O; mkdir -p $O
TIMES="0.0 1.9 3.4 3.95 4.05 5.0 7.0 8.1 8.3 9.6 10.9 11.95 12.1 12.45 12.6 14.4 14.95 15.1 16.6 18.6 18.95 19.1 21.2 22.95 23.1 25.2 26.95 27.1 29.6 30.95 31.1 33.2 34.5 34.95 35.1 36.5 39.6 42.0 44.6 45.95 46.1 48.8 50.95 51.1 52.6 54.6 55.4 56.5 58.0 59.6"
i=0; for t in $TIMES; do f=$(printf "%s/%02d_%06.2fs.png" $O $i $t); ffmpeg -loglevel error -y -ss $t -i $V -frames:v 1 "$f"; i=$((i+1)); done
# labelled 4-up sheets (960x540 tiles)
ls $O/*.png | sort > $O/_list.txt
n=0; batch=(); while read -r f; do batch+=("$f"); if [ ${#batch[@]} -eq 6 ]; then
  args=(); fl=""; k=0; for b in "${batch[@]}"; do t=$(basename "$b" .png | cut -d_ -f2); args+=(-i "$b"); fl+="[$k:v]scale=960:540,drawbox=x=0:y=0:w=150:h=44:color=black@0.7:t=fill,drawtext=text='$t':x=12:y=10:fontsize=26:fontcolor=white[v$k];"; k=$((k+1)); done
  ffmpeg -nostdin -loglevel error -y "${args[@]}" -filter_complex "${fl}[v0][v1][v2][v3][v4][v5]xstack=inputs=6:layout=0_0|w0_0|0_h0|w0_h0|0_h0+h0|w0_h0+h0[o]" -map "[o]" -q:v 3 $(printf "%s/sheet_%02d.jpg" $O $n); n=$((n+1)); batch=(); fi; done < $O/_list.txt
echo "stills: $(ls $O/*.png | wc -l), sheets: $(ls $O/sheet_*.jpg | wc -l)"
