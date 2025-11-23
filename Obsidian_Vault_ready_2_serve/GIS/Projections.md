_keep in mind that every PCS contains a GCS as part of its definition_
*Equal Area* - preserves proportional area among regions. 
![[equal_area_project.png|200]]
*Conformal*  - shape is correct of small areas. graticule lines intersect at 90-degree angles, and at any point on the map the scale is the same in all directions.
![[small_mercator_projection.png|200]]
[ESRI GIS-dictionary](https://support.esri.com/en-us/gis-dictionary/conformal-projection)

_Conformal projections preserve angles locally, so the shapes of features appear true. But the cost of this quality is the distortion of areas and distances. Equal area projections preserve area, at the expense of angles, so the shapes of some places appear skewed. Equidistant projections preserve distances, although only from certain points or along certain lines on the map._
![[3_projects_distorts.png]]
[ESRI - Learn](https://learn.arcgis.com/en/projects/choose-the-right-projection/)
##### Process of Defining a Coordinate System
Use the geoid (mean sea level) to approximate the real rugged surface. 
![[geoid_1.png|590]]
![[geoid_2.png]]
#### Datum
##### To measure Latitude and Longitude we have to define the Earth's shape as 3D geometric object/surface 
When dealing with a projected coordinate system (Cartesian plane) negative values are shifted out of the area of interest. This process is called called false easting/northing depending on the direction of the shift. 

### Universal Transverse Mercator (UTM)
The world is divided into 6˚ longitudinal strips 
![[trans_mercator_project.png|290]]
### Lambert Conformal Conic (LCC)
![[lambert_conformal_conic_project.png|300]]

### State Plane Coordinate system
![[state_plane_zones.png|300]]
Notice, within each state and within each section, the pattern based off which projection is chosen.
**wider regions need to two standard parallels like Tennessee while thin, long regions can use a cylindrical intersection meridian**

Central meridian is the term used for single point of tangency 
Standard Parallel 1 & 2 are the terms used for a double secant intersection 