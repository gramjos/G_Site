only audio with highest quality 
```
yt-dlp -x --audio-format mp3 --audio-quality 0 "URL"
```

For Long Audio
```
yt-dlp -x --audio-format mp3 \
  --audio-quality 0 \
  --embed-thumbnail \
  --add-metadata \
  --output "~/Music/%(uploader)s - %(title)s.%(ext)s" \
  --continue \
  --no-part \
  --retries infinite \
  --fragment-retries infinite \
  --buffer-size 32K \
  --concurrent-fragments 4 \
  "https://www.youtube.com/watch?v=VIDEO_ID"
```