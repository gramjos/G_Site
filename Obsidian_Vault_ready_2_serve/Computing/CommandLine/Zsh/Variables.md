---
tags: environment_variables, root_user
---
#### Checking if root user
```run-shell
if [[ $UID -ne 0 ]]; then 
  echo Non root user. Please run as root. 
else 
  echo Root user 
fi
```

#### Environment variables 
e.i. ` HOME PWD USER UID SHELL`
`$0` is shortcut to  `$SHELL`
```run-shell
echo $0 
echo $SHELL
```
```run-shell
var=12345678901234567890$
echo ${#var}
```


