---
tags: zsh, variables, shell, parameter_exspansion
---

##### Removing character (singular)
given the assignment,
`$ x=./screens/location_detail/text_section.dart`
task, remove the leading period
`$ echo ${x#./}`
`screens/location_detail/text_section.dart`

### **General Rules**
##### Replacing Sub-strings
- `${VAR/pattern/replacement}`: Replaces the first occurrence of `pattern` in `VAR` with `replacement`.
- `${VAR//pattern/replacement}`: Replaces all occurrences of `pattern` in `VAR` with `replacement`.
- `${VAR/#pattern/replacement}`: Replaces `pattern` at the beginning of `VAR` with `replacement`.
- `${VAR/%pattern/replacement}`: Replaces `pattern` at the end of `VAR` with `replacement`.
##### Default Values
- `${VAR:-default}`: Use `default` if `VAR` is unset or null.
- `${VAR:=default}`: Assign `default` to `VAR` if `VAR` is unset or null.
- `${VAR:+value}`: Use `value` if `VAR` is set.
- `${VAR:?message}`: Display an error message if `VAR` is unset or null.
##### Indirection
`${!VAR}`: Use the value of the variable whose name is the value of `VAR`
```zsh
ref="foo"
foo="bar"
echo ${!ref}  # Output: bar (the value of the variable named in ref)
```