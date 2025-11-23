---
tags: [shell, zsh, processes, debug, file_descriptors, redirect_standard_in, redirect_standard_out, exit_code, path, env_path]
---
How to determine the current shell?
Below is a Zsh interaction
```shell
echo $0
-zsh
```
`$0` holds current shell
```shell
$ ps -p $$
  PID TTY           TIME CMD
83328 ttys001    0:01.66 -zsh
```
`$$` represents the current __PID__ which is the current shell
```shell
$ echo $SHELL
/bin/zsh
```
From within Zsh, switch to Bash. Notice how the environment variable is still set to Zsh. 
```shell
$ bash
$ echo $0
bash
$ ps -p $$
  PID TTY           TIME CMD
20504 ttys001    0:00.01 bash
$ echo $SHELL
/bin/zsh
$ exit
exit
```
###### Exit code of previous command
`$ echo $?`
###### Shell history expansion character
`$ !_`
where the underscore is the starting of command in the recent history. Very similar to the reverse search of ctrl-r ('bck-i-search:')
###### To Debug a script line by line
At the top of file after the shebang line
`set -xv`
The above will output what line the script is on and show all errors (output) associated with each command for each line of the script. `-v` is for verbose. 
`set -e`
will exit on first error.
#### Standard Error/Output Redirection 
###### File Descriptor 1 is for standard output
###### File Descriptor 2 is for standard error
###### `&` is for both unless prefixed by 1 or 2
**All the errors from the 'command' will be written to the file**
`$ command 2> error.txt`
**Both standard error and standard output written to file**
`$ command &> output.txt`
**Redirecting standard error to the standard output stream**
`$ command > file.txt 2>&1`
##### Writing Error Messages 
Writing to the error stream (file descriptor 2) explicitly,
`$ echo 'Default API call used. ${STATUS}' 1>&2`
The above command redirects standard output to standard error.
Aside, error message written to a log should begin the scripts name for clarity. 
```shell 
echo `basename $0`
```
#### Path Variable 
The environment variable `$PATH` is a colon separated list of directories. This list is searched every time a command is ran. [[Pipeline_example]] works with one of the common directories `/bin/` 
[[Computing/Data/ZacMWilson_6wk/Day1]]

##### Previous Command Substitution
Replace the `x` for `y` from the previous command and run it. Replaces the first occurrence.  
```zsh
^x^y
```
Need to replace every occurrence in the previous command? Use the `Global` modifier.
```zsh
^x^y:G
```
