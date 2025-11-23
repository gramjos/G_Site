---
tags: [javascript,]
---

##### My learnings about the language

`hoisting` the javascript default mechanism of moving all variable and function declarations to the top of there containing scope during compilation phase. __Note__, only declarations not initializations are hoisted.  Lifting up variable declarations to the top of file ... `hoisting them up`
valid js below. `5` will appear in `demo`'s innerHTML 
```js
 <!DOCTYPE html>
<html>
<body>
<p id="demo"></p>
<script>
	x = 5; // Assign 5 to x
	elem = document.getElementById("demo"); // Find an element 
	elem.innerHTML = x;           // Display x in the element
	var x; // Declare x
</script>
</body>
</html> 
```
The above techniques does not work for `let` (`ReferenceError`) and `const` (_just won't print it_). To avoid `hoisting` confusion just put all variables at the top of the file. The  `use strict` directive requires all variables to be declared before they are used. 
```js
var x = 5;  
var y;  
alert(y);  
y = 7;
```
The alert will be `undefined` because the assignment of `y` is not moved to the top. 
> [!info]+ Note [Web3Schools](https://www.w3schools.com/js/js_variables.asp)
The `var` keyword was used in all JavaScript code from 1995 to 2015.
The `let` and `const` keywords were added to JavaScript in 2015.
The `var` keyword should only be used in code written for older browsers.

- variables `let` V `var` V `const` 
	- `var`/`let` can be redeclare or updated. 
	- `const` cannot be changed
	

---
__Template Literal__ - a multi-line string surrounded with back ticks 

---
[Canvas Reference](https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API)

---
Private methods for event listeners. Private meaning this method cannot called outside this class.

---
Creating objects for reuse.

---
The spread operator `...` turns an array into its individual components

---
mobile compatibility HTML with `meta` tag
to prevent user from zooming in the meta tag set `user-scalable=0`
Event listeners for the touch are different than the mouse, but we can use most of the same helper functions