---
tags: [python, tensor, data, ai, torch, marimo]
web_code: 
---

We have torch installed but with what version of Nvidia' CUDA library? __12.4__
```python
print("torch version : {}".format(torch.__version__))
```
_torch version : 2.5.1+cu124_
#### Fundamental Data Structure of Machine Learning , __Tensor__
An image is an arrays of pixels. 
Computer images are stored as 2 dimensional arrays, which can be thought a 2D mathematical matrix. A matrix with more than 2 dimensions is the same structure as a __tensor__.
#### Batch, many images (as tensors) in one _`'batch tensor'`_
When working with an image what data structures are we using?
```python
# Download some digit images from MNIST dataset
# b/c the Marimo notebook
from subprocess import run as shell_lst

shell_lst(['curl','-s','https://learnopencv.com/wp-content/uploads/2024/07/mnist_1.jpg', '-o', 'mnist_1.jpg'])
shell_lst(['curl','-s','https://learnopencv.com/wp-content/uploads/2024/07/mnist_0.jpg', '-o', 'mnist_0.jpg'])

# with jupyter or colab way
!wget -q "https://learnopencv.com/wp-content/uploads/2024/%% 07 %%/mnist_0.jpg" -O "mnist_0.jpg"
import cv2
digit_0_array_og = cv2.imread("mnist_0.jpg")
digit_0_array_og.shape #  [ 28, 28, 3 ]

from sys import maxsize
np.set_printoptions(linewidth=100000, threshold=maxsize)
digit_0_array_og
# cell output below...
array([[[  0,   0,   0],
        [  0,   0,   0],
        [  0,   0,   0],
        [  0,   0,   0],
        [  7,   7,   7],
        [  1,   1,   1],
        [  0,   0,   0],
        [  3,   3,   3],
        [  0,   0,   0],
        [ 18,  18,  18],
        [  0,   0,   0],
        [  3,   3,   3],
        [  0,   0,   0],
        [  0,   0,   0],
        [  3,   3,   3],
        [  0,   0,   0],
        [  0,   0,   0],
        [  9,   9,   9],
        [  0,   0,   0],
        [  2,   2,   2],
        [  0,   0,   0],
        [ 11,  11,  11],
        [  0,   0,   0],
        [  1,   1,   1],
        [  0,   0,   0],
        [  0,   0,   0],
        [  0,   0,   0],
        [  0,   0,   0]], # NOTE: there are 27 more of these chunks
```
`digital_0_array_og` is a multi dimensional array from the numpy library called `ndarray`  (28, 28, 3) $\text{X,Y,Z}$. Can be read as grid of pixels, where each pixel is represented by 3 values. These three values typically correspond to the color channels Red, Green, and Blue (RGB). Therefore, this array structure holds the data for a 28 by 28 pixel color image
> [!info]+ Quiz question
> **Question** Which of the following is a key difference between PyTorch tensors and NumPy arrays?
> **Answer** PyTorch tensors support GPU acceleration and automatic differentiation, whereas NumPy arrays do not.
>

> [!info]+ Quiz question
> **Question** Which of the following is a key difference between PyTorch tensors and NumPy arrays?
> **Answer** PyTorch tensors support GPU acceleration and automatic differentiation, whereas NumPy arrays do not.
>
