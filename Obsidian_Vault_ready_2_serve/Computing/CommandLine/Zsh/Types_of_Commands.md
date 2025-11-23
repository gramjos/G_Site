---
tags: path, builtins
---
## Builtins Commands Versus Commands located on `PATH`
_Most_ commands come from a program on the file system. In contrast, some commands, out of necessity need to be baked into the shell's program file (making it a **builtin**) because the command affects the current shell. For this reason and efficiencies (a bloated shell file) commands are either placed in the builtins or on `PATH`
#### Shell Builtins 
- These commands do not start separate process. 
`$ type pwd`
`pwd is a shell builtin`
Same information can be found by using the `which` command
#### File System Commands
- located on the **PATH** variable
#### Builtin example `alias`
- they are created using shell builtins because `alias` stores an `alias` the currently running shell process, so t must be a builtin 
`$ type alias`
`alias is a shell builtin`
