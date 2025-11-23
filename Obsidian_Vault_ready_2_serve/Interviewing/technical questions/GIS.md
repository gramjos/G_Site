---
tags: [gis, gis_interview]
---

> [!info]- What is a GIS
> High Level: A Geographic Information System is a set of computer tools that allows one to work with data that is tied a particular location on Earth.
> A database with attributes that have a spatial Object tied to each record. 
> A GIS includes the tools for creating data, map making and analyzing the relationships

> [!info]- What can a GIS be used to do?
> land use planning, environmental management, sociological analysis, business marketing, city planning. 
> "Bartlett Map hub" examples: "Railroad Crossing Complaint Logger" ArcGIS Online map and form. 

> [!info]- What are the types of map data? 
> **Discrete and Continuous**
> Discrete - finite or countably infinite set of values. Can be categorical or numeric. Example: Student in a class (cant have a half student) and outcomes of rolling a dice, or Land cover options.
> Continuous - Can take any value within a range (real numbers). Examples: Temperature, height and weight 

> [!info]- What are Data Formats?
> **Raster and Vector**
> Raster - used a bit map data structure (cells in a grid approach to defining space). Ideal for continuous change across a region like land cove classification 
> Vector - uses XY referenced vertices and paths for discrete data ideal for governmental boundaries
> TIN - Triangular Irregular Network, defines a set of adjacent triangles over a space.
> Raster V. Vector:
> - Vector provides more compact storage for discrete objects like for boundaries. Vector data models only store the perimeter of the entity while raster would have to store the area.

> [!info]- What is map scale
> Is the conversion of from a map distance to reality 

> [!info]- What is Resolution
> refers to the sampling interval at which data is acquired. 
> _spatial resolution_ - the distance interval at which the measurement was taken
> _temporal resolution_ - time interval 

> [!info]- What is precision
> number of significant figures

> [!info]- What are shapefile
> developed by ESRI
> vector format
> consists of many files: 
> .dbf for stores attributes
>  .sbn for
> .shx stores spatial extent 
> .shp stores location geometry 
>  .shp.xml for meta data 
>  .prj stores coordinate system

> [!info]- What are geodatabases
> types: personal, file and enterprise. Distinguished by storage. Respectively, MS Access file, folder in file system, commercial Relational Database Management System. 

> [!info]- What is Geographic Coordinate System?
> Angular measurement from the center of the Earth

> [!info]- What is Map Projection
> transformation of a 3D earth model to 2D map.
> Three major classes: Cylindrical (UTM), Conic (Lambert), Azimuthal (polar)

> [!info]- Geo-Reference V. Geocode
> geocode - given name of location coordinates are returned
> geo-reference - aligns different geo information to a known GCS (through: data shifting, scaling, rotating, rectifying)

> [!info]- Spatial Join
> combining tables based on spatial features by containment or proximity criterion 

> [!info]- Overlay 
> viewing two feature classes at once

> [!info]- Buffer
> creates new zone around the proximity of a feature

> [!info]- Buffer
> creates new zone around the proximity of a feature