
```run-python
from typing import List

def findPrime(N) -> List[int] :
	for i in range(1, int(N**(0.5))):
		if N%i==0: print(i)
	return [1,2]

print(findPrime(78))
```
