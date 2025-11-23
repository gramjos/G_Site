---
tags:
  - coordinate_reference_system
  - datum
  - crs
  - map_projections
  - geodesy
  - coordinates
  - projected_coordinate_system
  - gis
---
## What’s the difference between a spatial reference and a coordinate system?
There isn’t one. At least not in Esri products. The terms are used interchangeably.
## What’s the difference between a GCS and a PCS?
A **geographic coordinate system (GCS)** is a reference framework that defines the locations of features on a model of the earth. It’s shaped like a globe—spherical. Its units are angular, usually degrees.
A **projected coordinate system (PCS)** is flat. It contains a GCS, but it converts that GCS into a flat surface, using math (the projection algorithm) and other parameters. Its units are linear, most commonly in meters
## Datum
_The spheroid origin_
A datum is one parameter in a geographic coordinate system (GCS). While a spheroid approximates the shape of the Earth. A datum defines the position of the spheroid relative to the center of the Earth. Datums provide the origin for latitude 
The **datum** is the part of the GCS that determines which model (spheroid) is used to represent the earth’s surface and where it is positioned relative to the surface. Since the earth’s surface is not perfectly smooth or round, there are many different datums designed for different parts of the world.
A **GCS** is the full definition of how to tie coordinate values to real locations on the earth. In addition to a datum, a GCS includes a prime meridian (which specifies the location of 0° longitude), and an angular unit (often degrees)
[Source  - ArcGIS blog](https://www.esri.com/arcgis-blog/products/arcgis-pro/mapping/coordinate-systems-difference/#spatial)

### Defining Coordinates for the Earth is complicated by 4 main reasons
1. 'Most' perceive geography as flat
2. The Earth is irregular shaped
3. Measurement error
4. Physical locations on the Earth change through time.

Data is geographically referenced, meaning that the pixels (raster) or the points (vector) are the building block for the spatial data model. This is measured in respect to the universally recognized coordinate reference system (CRS). The CRS uses ellipsoid, datum and map projection.   

**Coordinates** are sets of numbers (usually X,Y) that unambiguously define locations.  Coordinates are _only_ unique for:
- a specified measurement,
- calculation assumption,
- and time range. 
