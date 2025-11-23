---
tags: zsh, shell, processes, process, pid
---
Unix systems run programs in a __process__. A process is a program running in memory (programs come from an executable file). A process keeps track of the state of the program, whether is running or stopped, its `pwd` and its `env` variables. A __PID__ is the _process identifier_. __PID__'s are assigned at program start. The __PID__ is used to get information about the process and control it.  __PID__'s are assigned in numerical ascending order and once the top (highest number) __PID__ number has been used its starts back around with the since finished __PID__'s. A process can start once or more processes (child processes) making the initiating process a now parent process. 
##### Inheritance
When on processes a new process, like when the main shell process runs a script, many attributes are passed from the parent (main) process to the child (script).
##### Running script starts a new process
Once a script is started it is started in its own environment. Separate from its parent and only modify if both the parent and the child set up to communicate. 
##### A shell function does not start a new process
**But** all pipes start a new process.  Given the example of a function  loop with a pipe in the iterator, variables that are set in the body of the loop will persist outside the scope of the function. _"New pipe, new scope"_ -graham 
