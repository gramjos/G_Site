"""
This file is responsible for handling and resolving asset paths, like images.

Its main purpose is to take an image reference from a Markdown file (e.g.,
`![[image.png]]` or `![](../graphics/image.png)`) and resolve it to a
normalized, relative path that will be valid in the final static site. This
is a critical step for ensuring images render correctly.
"""

from pathlib import Path
from typing import Optional

from .models import BuildContext
from .utils import is_within, posix_relpath


def normalise_image_src(ctx: BuildContext, source_dir: Path, relative_dir: Path, raw_reference: str) -> str:
    """
    Resolves an image reference and normalizes it for the output HTML.

    It takes a raw image reference string, resolves its absolute path using
    `resolve_asset_reference`, and then calculates the relative path from the
    Markdown file's location to the asset's final location.

    Args:
        ctx: The build context.
        source_dir: The directory containing the Markdown file.
        relative_dir: The relative path of the source directory from the vault root.
        raw_reference: The image src from the Markdown (e.g., "image.png").

    Returns:
        A normalized, relative POSIX path for the <img> src attribute.
    """
    reference = (raw_reference or "").strip()
    if not reference:
        return ""

    resolved_asset_path = resolve_asset_reference(ctx, source_dir, reference)
    if not resolved_asset_path:
        # If resolution fails, return the original reference as a fallback.
        return reference

    # The asset's path relative to the *entire* vault.
    asset_relative_to_source_root = resolved_asset_path.relative_to(ctx.source_root)

    try:
        # Calculate the path from the current HTML file's directory to the asset.
        relative_path = posix_relpath(asset_relative_to_source_root, relative_dir)
    except ValueError:
        # This can happen on Windows if paths are on different drives.
        # Fallback to a root-relative path.
        relative_path = asset_relative_to_source_root.as_posix()

    return relative_path


def resolve_asset_reference(ctx: BuildContext, source_dir: Path, reference: str) -> Optional[Path]:
    """
    Finds the absolute path of an asset based on Obsidian's resolution rules.

    The resolution logic is as follows:
    1. Check for a relative path from the source file's directory.
    2. If it's a simple filename, check within the same directory.
    3. If not found, search in a 'graphics' subdirectory of the current
       directory and all ancestor directories up to the vault root.

    Args:
        ctx: The build context.
        source_dir: The directory of the Markdown file referencing the asset.
        reference: The raw string reference to the asset.

    Returns:
        An absolute Path object to the asset if found and within the vault,
        otherwise None.
    """
    normalised_ref = reference.replace("\\", "/")
    source_dir = source_dir.resolve()

    # Rule 1: Direct relative path (e.g., ../graphics/image.png)
    direct_candidate = (source_dir / normalised_ref).resolve()
    if direct_candidate.exists() and direct_candidate.is_file() and is_within(direct_candidate, ctx.source_root):
        return direct_candidate

    # If the reference contains a path separator but wasn't found, it's a broken link.
    if "/" in normalised_ref:
        return None

    # Rule 2: Simple filename in the same directory.
    candidate_in_same_dir = (source_dir / normalised_ref).resolve()
    if candidate_in_same_dir.exists() and candidate_in_same_dir.is_file() and is_within(candidate_in_same_dir, ctx.source_root):
        return candidate_in_same_dir
    
    # Rule 2b: If no extension, try adding .excalidraw extension
    if "." not in normalised_ref:
        excalidraw_candidate = (source_dir / f"{normalised_ref}.excalidraw").resolve()
        if excalidraw_candidate.exists() and excalidraw_candidate.is_file() and is_within(excalidraw_candidate, ctx.source_root):
            return excalidraw_candidate

    # Rule 3: Search in 'graphics' subdirectories up the tree.
    current_dir = source_dir
    while True:
        graphics_dir = current_dir / "graphics"
        candidate_in_graphics = (graphics_dir / normalised_ref).resolve()
        if candidate_in_graphics.exists() and candidate_in_graphics.is_file() and is_within(candidate_in_graphics, ctx.source_root):
            return candidate_in_graphics
        
        # Rule 3b: Also try with .excalidraw extension in graphics directories
        if "." not in normalised_ref:
            excalidraw_in_graphics = (graphics_dir / f"{normalised_ref}.excalidraw").resolve()
            if excalidraw_in_graphics.exists() and excalidraw_in_graphics.is_file() and is_within(excalidraw_in_graphics, ctx.source_root):
                return excalidraw_in_graphics
        
        if current_dir == ctx.source_root:
            # Stop searching once we've checked the root.
            break
        current_dir = current_dir.parent

    return None
