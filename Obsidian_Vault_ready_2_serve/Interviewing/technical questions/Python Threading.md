---
tags:
  - python
  - threading
  - real python
---
Broadly speaking, threading allows for different parts of a program to run concurrently. 
A thread is a separate flow of execution, meaning two things will happen at "**once**" (not really for most python implementations) they merely appear to happen at once. Getting python to run multiple tasks simultaneously requires a non-standard implementation or using the multi-processing library. The mainstream CPython implementation causes threads to be ineffective is some situations dues to [[Python's GIL]] that *essentially* limits only one thread to run at once. 
#### What is a good candidate for threads?
Tasks that spend time waiting for external resources 
#### What is **NOT** a good candidate for threads?
CPU-bound problems. Then use the multi-processing library.

```python
import logging
import threading
import time

def thread_function(name):
    logging.info("Thread %s: starting", name)
    time.sleep(2)
    logging.info("Thread %s: finishing", name)

if __name__ == "__main__":
    format = "%(asctime)s: %(message)s"
    logging.basicConfig(format=format, level=logging.INFO,
                        datefmt="%H:%M:%S")

    logging.info("Main    : before creating thread")
    x = threading.Thread(target=thread_function, args=(1,))
    logging.info("Main    : before running thread")
    x.start()
    logging.info("Main    : wait for the thread to finish")
    # x.join()
    logging.info("Main    : all done")

```

```shell
$ ./single_thread.py
Main    : before creating thread
Main    : before running thread
Thread 1: starting
Main    : wait for the thread to finish
Main    : all done
Thread 1: finishing
```

In python a daemon thread is a type of thread that will shut down immediately after the program exits. If a program is running threads that are not daemons then the program will wait for those to finish before terminating the program. 


---
[Source - Real Python](https://realpython.com/intro-to-python-threading/)
