---
tags: [conda, gis]
---
```shell
conda create -n geo_realm
conda activate geo_realm
conda config --env --add channels conda-forge
conda config --env --set channel_priority strict
conda install python=3 geopandas
```
Turn off base env on shell start
```shell
conda config --set auto_activate_base false
```
