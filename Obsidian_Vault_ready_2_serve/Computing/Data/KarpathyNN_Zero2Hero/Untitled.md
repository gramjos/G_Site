YT Video: https://www.youtube.com/watch?v=VMj-3S1tku0
#### `micrograd` is an automatic gradient engine(back prop)
_Back Propagation_ efficient evaluate the a gradient of a loss function with respect to the weight of a Neural Net (NN). Therefore, one can iteratively tune the weights to improve accuracy.
#### `micrograd` allows one to build mathematical expressions
Aside, Rectified Linear Unit `.relu()`. Informally described as _keep or squash to zero_. Can otherwise be stated as, `relu = max(0, x)`, and with the latex expression.
$$\text{relu }= \begin{cases} 0 & \text{if } x < 0 \\ x & \text{if } x \ge 0 \end{cases}$$
__Jargon__: "Forward pass," meaning the series of expression calculated before the `.backward()` call (initialize back prop at node `g`)
```python
from micrograd.engine import Value

a = Value(-4.0)
b = Value(2.0)
c = a + b
d = a * b + b**3
c += c + 1
c += 1 + c + (-a)
d += d * 2 + (b + a).relu()
d += 3 * d + (b - a).relu()
e = c - d
f = e**2
g = f / 2.0
g += 10.0 / f
print(f'{g.data:.4f}') # prints 24.7041, the outcome of this forward pass
g.backward()
print(f'{a.grad:.4f}') # prints 138.8338, i.e. the numerical value of dg/da
print(f'{b.grad:.4f}') # prints 645.5773, i.e. the numerical value of dg/db
```
At node `g`, recursively, go through the expression graph to apply the chain rule from calculus. Every edge between nodes has a gradient, `a.grad`. `a.grad` how `a` is affecting `g`. 
![[hypothesis_node_graph_backprop.excalidraw|center]]
#### Interpretation
_How does `g` respond when `a` is tweaked?_ 
 If we make `a` slightly larger then because `138.8338` is positive `g` will grow and the slope of that growth is `138.8338`.
## Zooming Out
`micrograd` is a scalar value AutoGrad Engine. This is a pedagogical and in practice these scalars would n-dimensional tensors