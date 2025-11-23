---
tags: [zsh, shell, builtins, history_search, history_previous_command, alias]
faces: [gram, sam]
---
A list of examples using zsh builtins

Formatting the date command
`$ date "+Today is %x, and the day numer id %j of year %Y"``
`Today is 12/10/2023, and the day numer id 344 of year 2023`

__Problem__: Obsidian only recognizes markdown files. I need to rename a deeply nested dart repository to have the `.md` extension.  `zmv` allows renaming with capture groups. Capture groups are declared with parenthesizes and are accessed with the dollar sign then the index.
`$ zmv '(*.dart)' '$1.md'`

##### Rerun previous command with substitution 
Given the erroneous first command then immediately following...
```shell
$ cal 77 1994 
cal: 77 is neither a month number (1..12) nor a name
$ ^7
cal 7 1994
     July 1994        
Su Mo Tu We Th Fr Sa  
                1  2  
 3  4  5  6  7  8  9  
10 11 12 13 14 15 16  
17 18 19 20 21 22 23  
24 25 26 27 28 29 30  
31
```
#### Overriding the `alias`
Overriding an alias that is an builtin can be done by calling the binary executable directly.
`$ /bin/ls ~/Deskop`
The above snippet calls the _vanilla_ version of the `ls` 
#### End Command Option Parsing
Use the double hyphen to tell the shell to end the option argument parsing.
In the below scenario, there are no options this is explicit
```zsh
#!/usr/bin/env zsh
setopt nullglob globstar

for f in **/*.mdx; do
  cp -- "$f" "${f%.mdx}.md"
done
```