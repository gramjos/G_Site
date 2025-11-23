---
tags:
  - gis
  - data
  - data_classification
---
#### How to Observe the Data
[Source - Cartography Playground](https://cartography-playground.gitlab.io/playgrounds/data-classification-methods/)
Use a histogram to visualize the frequency table. Four ways to group/bin/class an attribute to visualize the distribution.
![[data_classification_types.png|600]]
###### Equal Interval
divides the range of attributes values into equal sized bins. Therefore, number elements in each bin can differ

$$Interval\ Size = \frac{maxX_i - minX_i}{Number\ of\ Classes}$$
![[equal_interval_pros_cons.png|500]]
###### Quantile
Each class has a equal number of features.  

$$Number\ of\ Elements\ per\ class = \frac{Total\ Number\ of\ Elements}{Number\ of\ Quantiles}$$

##### Quantile versus Equal Interval(EI)
EI binning is based on the min/max (range) of the data, while quantile is based off the count of the features 

###### Jenks
"the Jenks classification is not recommended for data that have a low variance" - [Wikipedia](https://en.wikipedia.org/wiki/Jenks_natural_breaks_optimization#Use_in_cartography)
###### Standard Deviation 
- A measure of dispersion
- Low SD means data is tight and much variation from the mean (expected value)
- High SD values are spread out
Population Formula below
$$SD\ =\ \sqrt{\frac{\Sigma {\\|x-\mu\\|}^2}{N}}$$
"For a finite set of numbers, the population standard deviation is found by taking the square root of the average of the squared deviations of the values subtracted from their average value."
### Normalization
think, does pure count have valid/meaningful comparison? 
What should we normalize (divide) by 

##### Douglas-Peucker Algorithm
Visualization at [Cartography Playground](https://cartography-playground.gitlab.io/playgrounds/douglas-peucker-algorithm/)
_"iterative end point fit"_ - Sungsoon Hwang
Broadly, it smoothes poly-lines by reducing the number of points. This will preserve the rough shape of the object 

#### Ordinal or Nominal Data
Ordinal - Can be "ordered"
Nominal - Categorical Data with no rank (order)
