---
tags:
  - python
  - GIL
  - global interpreter lock
---
#### Global Interpreter Lock (GIL)
The GIL is a mutex (lock) that only allows one [thread](Python%20Threading.md) to hold control of the python interpreter. 

When CPython started to support multiple operating system threads, it became necessary to protect various CPython internal data structures from concurrent access. Instead of adding lock or using atomic operations to protect the correctness of for instance reference counting, the content of lists, dictionaries, or internal data structures. The CPython developers decided to take a simpler approach and use a single global lock, the GIL, to protect all of these data structures from incorrect concurrent accesses.  One can start multiple threads in CPython but the byte code runs one thread at a time. 