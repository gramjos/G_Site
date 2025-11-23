---
tags: [data, algorithm, machine_learning]
---
[Source](https://machinelearningmastery.com/parametric-and-nonparametric-machine-learning-algorithms/)
##### _Machine learning can be summarized as learning a function $(f)$ that maps input variables $(X)$ to output variables $(Y)$._
$$ Y = f(x)$$
An algorithm learns this target mapping function from training data.
The form of the function is unknown, so our job as machine learning practitioners is to evaluate different machine learning algorithms and see which is better at approximating the underlying function.
## Parametric Machine Learning Algorithms
Assumptions can greatly simplify the learning process, but can also limit what can be learned. Algorithms that simplify the function to a known form are called parametric machine learning algorithms.
> [!info]+ — [Artificial Intelligence: A Modern Approach](https://amzn.to/2Y0QDox), page 737
> A learning model that summarizes data with a set of parameters of fixed size (independent of the number of training examples) is called a parametric model. No matter how much data you throw at a parametric model, it won’t change its mind about how many parameters it needs.

The algorithms involve two steps
1. Select a form for the function.
2. Learn the coefficients for the function from the training data.
An easy to understand functional form for the mapping function is a line, as is used in linear regression:
$$ b_{0} + b_{1}*x_{1} + b_{2}*x_{2} = 0 $$
Where $b_{0}, b_{1} \scriptstyle{\text{ \& }} b_{2}$ are the coefficients of the line that control the intercept and slope, and $x_{1} \text{ \& } x_{2}$ are two input variables.
Assuming the functional form of a line greatly simplifies the learning process. Now, all we need to do is estimate the coefficients of the line equation and we have a predictive model for the problem.
Often the assumed functional form is a linear combination of the input variables and as such parametric machine learning algorithms are often also called “_linear machine learning algorithms_“.
The problem is, the actual unknown underlying function may not be a linear function like a line. It could be almost a line and require some minor transformation of the input data to work right. Or it could be nothing like a line in which case the assumption is wrong and the approach will produce poor results.
Some more examples of parametric machine learning algorithms include:
- Logistic Regression
- Linear Discriminant Analysis
- Perceptron
- Naive Bayes
- Simple Neural Networks
## Nonparametric Machine Learning Algorithms
Algorithms that do not make strong assumptions about the form of the mapping function are called nonparametric machine learning algorithms. By not making assumptions, they are free to learn any functional form from the training data.
> [!info]+ [Artificial Intelligence: A Modern Approach](https://amzn.to/2Y0QDox), page 757
> Nonparametric methods are good when you have a lot of data and no prior knowledge, and when you don’t want to worry too much about choosing just the right features.
Nonparametric methods seek to best fit the training data in constructing the mapping function, whilst maintaining some ability to generalize to unseen data. As such, they are able to fit a large number of functional forms.

An easy to understand nonparametric model is the k-nearest neighbors algorithm that makes predictions based on the k most similar training patterns for a new data instance. The method does not assume anything about the form of the mapping function other than patterns that are close are likely to have a similar output variable.
Some more examples of popular nonparametric machine learning algorithms are:
- k-Nearest Neighbors
- Decision Trees like CART and C4.5
- Support Vector Machines