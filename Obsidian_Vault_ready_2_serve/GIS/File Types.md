---
tags:
  - gis
  - file_types
  - shapefile
  - geodatabase
  - vector
  - raster
  - gis_data
---
##### Shapefile
- developed by ESRI
- vector format
- consists of many files: 
	- .dbf for stores attributes
	- .sbn for
	- .shx stores spatial extent 
	- .shp stores location geometry 
	- .shp.xml for meta data 
	- .prj stores coordinate system

##### Geodatabase
is the native data structure for ArcGIS. Made up of
- table, attribute data
- feature class, vector
- raster, image

##### Raster V Vector
![[Raster_v_Vector.png|Raster_v_Vector]]
[Picture Source - ESRI](https://www.esri.com/content/dam/esrisites/en-us/media/pdf/teach-with-gis/raster-faster.pdf)
Vector use point and line (or, vertices and paths, respectively) segments to identify locations on the Earth. Vector points are XY coordinates that latitude and longitude with a spatial reference. A vector polygon is made when a set of vertices are form a 'closed loop.' 
Raster is pixels or grid cells. Usually square but do not have to be. appear pixelated because each pixel has its own class or value. for example each pixel in a satellite image has its own RGB value. Raster is ideal for continuous data. 
- pixel size is the spatial resolution
###### Raster Continuous V Discrete
**Discrete** - usually are integers that represent a class 
**Continuous** - 

Free GIS Data
![[free_gis_data.png]]


