---
tags: [loops, zsh, linux, command_line, iteration, c_shell, foreach]
---
Copy all files not directories and rename.
```shell
for f in *
do
	echo "copying ${f} to OLD-${f}"
	cp -i "${f}" "OLD-${f}"
done
```