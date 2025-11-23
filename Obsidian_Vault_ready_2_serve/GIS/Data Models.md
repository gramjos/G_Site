---
tags:
  - gis
  - datum
  - coordinates
  - spatial_data_model
  - layers
  - thematic_layer
  - planar_coordinate_system
  - xy
  - spherical_coordinate_system
  - degree_minute_second
  - decimal_degree
  - radian
---
Data in a GIS represent a simplified view of the real world. Data include information on the spatial location and the non spatial attributes of entities like roads, mountains or accident locations or other features we care about. Data include information on the spatial location and non-spatial properties of entities. Each entity is represented by a spatial object. This defines the entity correspondence. 
###### Spatial Data Model
- objects in a spatial data database plus the relationships among them.
###### GIS Layers
- groupings of spatial and attribute data that form cartographic object (thematic layer)
#### Coordinate Data
- define from the origin the location and extent of an object
- Each projection unambiguously defines coordinate values 
# Distinction made between 'lines of latitude' and latitude $\phi$ 
When dealing with a 3D object angular units are to describe positions on the surface. 
![[spherical_coordinates.png|350]]
Latitude/Longitude ellipsoid angular units are NOT measured from the origin. The latitude is measured from the perpendicular line from where the plane on the surface intersects with the equator line.  
![[oblate_ellipsoid.png|350]]
###### Planar Coordinate Systems
- 2 dimensional coordinate system that define two orthogonal axis forming a plane.
- Northing axis or the Y axis is vertical
- Easting axis of the X axis is horizontal
Viewing geography on 2D introduces un-avoidable distortion, but limiting the 2D area we are viewing limits the distortion. 
###### Spherical Coordinate System
- coordinates on a sphere measure with angular units like degrees
- to make a complete measurement we need: 2 angles (angles of rotation) and a defined fixed radius (R)
Angles of Rotations: longitude ( $\lambda$ ) and latitude ( $\phi$ )
$\lambda$ measures east-west distance 
$\phi$ measures north-south distance 
![[lines_V_angular_lat_long.png|410]]
___
Aside,
_linguistic confusion_ 
**We say that the parallel lines travel east-west, but these lines specify a locations north-south extent**
![[coordinate_sphere_measurements.png|400]]
Since $\lambda$ converge at the poles (points) any location with either a 90˚ or -90˚ $\phi$ means this local is at the North, South pole respectively.
___
By convention, latitudes increase to maximum of 90˚ and minimum of -90˚
![[coordinate_conventions.png|400]]
Spherical coordinate are usually measured in DMS (Degrees Minutes Seconds) notation for example, N43˚35'20" which represents forty-three degrees, thirty-five second, and 20 seconds of latitude. 
Each degree is 60 minutes of an arc and each minutes is 60 seconds of an arc. 
###### Datums
- 'various versions of the X Y Z coordinate system'
- the assumption(s) we make about the 3D shape of the Earth