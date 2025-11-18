"""
This file handles all direct interactions with the file system.

It contains functions for finding, copying, and writing files and directories.
By isolating file I/O, the rest of the application can remain agnostic about
the underlying storage, making the code cleaner and easier to test. This module
is responsible for the side effects of reading from and writing to disk.
"""

import shutil
from pathlib import Path
from typing import Optional

from .constants import README_NAME
from .models import BuildContext


def find_readme(directory: Path) -> Optional[Path]:
    """
    Finds the README.md file in a directory, case-insensitively.

    The build process is initiated in any directory containing a README, so this
    function is the entry point for processing a given directory.

    Args:
        directory: The directory to search within.

    Returns:
        A Path object to the README file if found, otherwise None.
    """
    for entry in directory.iterdir():
        if entry.is_file() and entry.name.lower() == README_NAME.lower():
            return entry
    return None


def copy_file(source: Path, ctx: BuildContext, relative_dir: Path) -> None:
    """
    Copies a single file to its corresponding location in the output directory.

    It ensures the destination directory exists before copying.

    Args:
        source: The absolute path to the source file.
        ctx: The build context containing output paths.
        relative_dir: The file's parent directory relative to the vault root.
    """
    destination = ctx.output_root / relative_dir / source.name
    destination.parent.mkdir(parents=True, exist_ok=True)
    shutil.copy2(source, destination)


def copy_graphics_directory(ctx: BuildContext, directory: Path, relative_dir: Path) -> None:
    """
    Recursively copies an entire 'graphics' directory to the output.

    If the destination already exists, it is removed first to ensure a clean
    copy. This is used to transfer all image assets without processing them.

    Args:
        ctx: The build context containing output paths.
        directory: The source 'graphics' directory.
        relative_dir: The directory's path relative to the vault root.
    """
    destination = ctx.output_root / relative_dir
    if destination.exists():
        shutil.rmtree(destination)
    shutil.copytree(directory, destination)
