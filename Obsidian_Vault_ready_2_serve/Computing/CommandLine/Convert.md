---
tags: [convert, ffmpeg, zsh, shell, command_line, shell_scripting, media_editting, gif] 
---
###### Creating a GIF from pictures
`ffmpeg` was too complex to use. I found `convert` by **ImageMagick** 

`$ convert -delay 250 -loop 0 pic_*.png out.gif`
The GIF will be high quality, but the images must same size!