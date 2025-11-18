"""
This file defines the data models used across the build process.

Using dataclasses provides type-hinting, auto-generated boilerplate for
__init__ and __repr__, and a clear structure for passing around shared state,
such as file paths. The BuildContext class encapsulates the essential paths
needed for various modules to perform their tasks.
"""

from dataclasses import dataclass
from pathlib import Path


@dataclass
class BuildContext:
    """
    A container for all contextual information required for the build.

    This includes the absolute paths to the source vault and the output
    directory, which are fundamental for resolving, reading, and writing files.
    """
    source_root: Path
    output_root: Path
