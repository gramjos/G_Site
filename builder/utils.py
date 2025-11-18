"""
This file provides general-purpose utility functions for the build script.

These helpers perform common, reusable tasks such as string manipulation,
path normalization, and HTML escaping. They are designed to be pure functions
without side effects, ensuring they are easy to test and reason about. This
module helps keep other parts of the codebase focused on their specific
responsibilities.
"""

import posixpath
import re
from pathlib import Path


def slugify(value: str) -> str:
    """
    Converts a string into a URL-friendly "slug".

    This involves lowercasing, removing non-alphanumeric characters, replacing
    spaces and hyphens with a single hyphen, and stripping leading/trailing
    hyphens.

    Args:
        value: The input string to slugify.

    Returns:
        A URL-friendly slug.
    """
    slug = re.sub(r"[^a-z0-9]+", "-", value.lower())
    slug = slug.strip("-")
    return slug or "section"


def derive_title(value: str) -> str:
    """
    Creates a human-readable title from a filename or directory name.

    It splits the name by hyphens, underscores, or spaces, capitalizes each
    word, and joins them with spaces.

    Args:
        value: The string to convert into a title.

    Returns:
        A capitalized, space-separated title.
    """
    words = [w for w in re.split(r"[-_\s]+", value.strip()) if w]
    if not words:
        return value
    return " ".join(word.capitalize() for word in words)


def escape_html(value: str) -> str:
    """
    Escapes special HTML characters to prevent them from being interpreted.

    Args:
        value: The string to escape.

    Returns:
        The HTML-escaped string.
    """
    return (value.replace("&", "&amp;")
                 .replace("<", "&lt;")
                 .replace(">", "&gt;")
                 .replace('"', "&quot;")
                 .replace("'", "&#39;"))


def posix_path(path: Path) -> str:
    """
    Converts a pathlib.Path object to a POSIX-style path string.

    This ensures that all paths in the manifest and HTML are consistent,
    using forward slashes, regardless of the operating system the build
    script is run on.

    Args:
        path: The Path object to convert.

    Returns:
        A string representing the path with forward slashes.
    """
    return "/".join(path.parts)


def posix_relpath(target: Path, start: Path) -> str:
    """
    Calculates the relative path from a start directory to a target path,
    returning a POSIX-style string.

    Args:
        target: The path to which the relative path is calculated.
        start: The path from which the relative path is calculated.

    Returns:
        A POSIX-style relative path string.
    """
    target_str = target.as_posix()
    start_str = start.as_posix()
    if not start_str or start_str == ".":
        start_str = "."
    result = posixpath.relpath(target_str, start_str)
    return result.replace("\\", "/")


def is_within(path: Path, ancestor: Path) -> bool:
    """
    Checks if a path is located within a given ancestor directory.

    This is a security and correctness check to ensure file operations
    do not escape the intended source or output directories.

    Args:
        path: The path to check.
        ancestor: The directory that should contain the path.

    Returns:
        True if the path is within the ancestor, False otherwise.
    """
    try:
        path.relative_to(ancestor)
        return True
    except ValueError:
        return False
