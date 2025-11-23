---
tags: [unix, homebrew, vim, tags, ctags]
---

To create a tags file in the local directory.
```shell
ctags -R .
```
to be more explicit
```zsh
$ tree
.
├── data
│   ├── bnsf_rail.geojson
│   └── pro_pic.jpg
├── index.html
├── js
│   ├── app.js
│   ├── basemap-control.js
│   ├── charts-panel.js
│   ├── landing-page.js
│   ├── modal-info.js
│   ├── table-interactions.js
│   └── table-resize.js
├── package.json
├── README.md
├── server.js
├── styles.css

$ ctags -R --languages=JavaScript,HTML,CSS \
  --exclude=node_modules \
  --exclude=dist \
  --exclude=.git \
  --exclude='*.geojson' \
  --exclude='*.jpg'

```
copyme version
```zsh
ctags -R --languages=JavaScript,HTML,CSS --exclude=node_modules --exclude=dist --exclude=.git --exclude='*.geojson' -exclude='*.jpg'
```
