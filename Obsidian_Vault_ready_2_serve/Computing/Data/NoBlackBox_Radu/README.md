---
tags: [data, javascript, data_science, html, web_dev, hoisting]
---
Video playlist from [YouTube](https://www.youtube.com/playlist?list=PLB0Tybl0UNfYe9aJXfWw-Dw_4VnFrqRC4)

Why learn machine learning without libraries? It is the only way to learn the inner-workings. The main goal of this project is create a web application that recognizes a set of drawings. For any machine learning project, we need data. The data used is form the Youtube channel [Radu Mariescu-Istodor](Radu Mariescu-Istodor). The training data collection tool will be built out too. This is an step important because we are not working with a pre-made dataset for machine rather we are creating one. The data engineering part is an essential part because it more accurately reflects real world scenarios. After data collection we move on to feature extraction and visualization with a hand made tool. The first machine learning technique will be K-nearest neighbor and this will have mediocre results, but will be improved with data scaling. 

Features are properties of the data like paths, points, width, and hight
##### Questions about the project I must know
- HTML `id` versus `class`
	- `class` sharing style across many elements (CSS identifies it with a `.`)
	- `id` for individual elements (CSS identifies it with a `#`)
- developer tools crash course
- _Since this system is online, I should address concurrency. For the data collection tool what is the unique identifier as of now the the millisecond precision timestamp is working but not a not production/scalable method_
- Since we are asking for user input is it important to standardize the input characters with the HTML `<meta charset="UTF-8">`

- in HTML files between script tags js functions need the reserve word `function` and in js files function do not?
- have a blurb what the prototype object is. the base object all inherit from


---
Presentation Ideas:
- Do strategic git pushes during project milestone
- Demonstrate a chunk-a-able development path

---
#### Shell commands along the way
How many json samples are in this directory?
`l|wc -l` 
`find . -maxdepth 1 -type f -name "*.json" | wc -l`

I have too many samples in this directory 