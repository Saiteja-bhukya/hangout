#!/usr/bin/env bash
# Mix the stems (SFX ~8 dB under the music), fade the last 0.4 s, master to -14 LUFS integrated / -1 dBTP.
set -euo pipefail
cd "$(dirname "$0")/.."
A=assets/audio
meas() { ffmpeg -hide_banner -nostats -i "$1" -af loudnorm=I=-14:TP=-1:LRA=11:print_format=json -f null - 2>&1 | python3 -c "import sys,json,re; t=sys.stdin.read(); print(json.loads(t[t.rindex('{'):])['input_i'])"; }
MI=$(meas $A/music.wav); SI=$(meas $A/sfx.wav)
SG=$(python3 -c "print(round(($MI - 8) - ($SI), 2))")
echo "music $MI LUFS, sfx $SI LUFS -> sfx gain $SG dB (sfx sits 8 dB under the music)"
ffmpeg -hide_banner -loglevel error -y -i $A/music.wav -i $A/sfx.wav \
  -filter_complex "[1:a]volume=${SG}dB[s];[0:a][s]amix=inputs=2:normalize=0,afade=t=out:st=59.6:d=0.4[m]" -map "[m]" -c:a pcm_f32le $A/_premaster.wav
J=$(ffmpeg -hide_banner -nostats -i $A/_premaster.wav -af loudnorm=I=-14:TP=-1.5:LRA=11:print_format=json -f null - 2>&1 | python3 -c "import sys; t=sys.stdin.read(); print(t[t.rindex('{'):])")
get() { echo "$J" | python3 -c "import sys,json; print(json.load(sys.stdin)['$1'])"; }
ffmpeg -hide_banner -loglevel error -y -i $A/_premaster.wav \
  -af "loudnorm=I=-14:TP=-1.5:LRA=11:measured_I=$(get input_i):measured_TP=$(get input_tp):measured_LRA=$(get input_lra):measured_thresh=$(get input_thresh):offset=$(get target_offset):linear=true,aresample=48000" \
  -t 60 -c:a pcm_s24le $A/scene-mix.wav
rm -f $A/_premaster.wav
echo "master:"; ffmpeg -hide_banner -nostats -i $A/scene-mix.wav -af ebur128=peak=true -f null - 2>&1 | grep -E "I:|Peak:|LRA:" | tail -3
