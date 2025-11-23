import matplotlib.pyplot as plt
import numpy as np

x = np.arange(1, 1001)
y_logn = x * np.log10(x)
y_square = x**2
n_by_n = x
log_n = np.log10(x)

plt.figure(figsize=(10, 10))
plt.plot(x, y_logn, color="blue", label="n log n")
plt.plot(x, y_square, color="red", label="n^2")
plt.plot(x, n_by_n, color="black", label="n")
plt.plot(x, log_n, color="green", label="log n")

plt.xlabel("n")
plt.ylabel("n")
plt.title("Graph of run time")
plt.legend()
plt.grid(True)
plt.xlim(0,1000)
plt.ylim(0,1000)
plt.show()
