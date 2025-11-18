"""
This file contains the core logic for generating the manifest.json file.

It recursively traverses the vault directory structure, applying the project's
rules to determine which files and directories are included in the final
output. It orchestrates calls to other modules for file operations, Markdown
conversion, and asset resolution, ultimately producing a structured dictionary
that represents the entire navigable content of the "Notes" section.
"""

from pathlib import Path
from typing import Dict, List, Optional

from .constants import GRAPHICS_DIR_NAME, MARKDOWN_SUFFIX, README_NAME
from .file_system import copy_file, copy_graphics_directory, find_readme
from .markdown import render_markdown
from .models import BuildContext
from .utils import derive_title, posix_path, slugify


def build_directory(ctx: BuildContext, directory: Path, slug_segments: List[str], ancestor_chain: List[Dict[str, str]]) -> Optional[Dict]:
    """
    Recursively processes a directory to build a node for the manifest.

    A directory is processed only if it contains a README.md. This function
    builds the manifest entry for the directory, its files, and recursively
    for its subdirectories.

    Args:
        ctx: The build context.
        directory: The absolute path to the directory to process.
        slug_segments: A list of URL slugs representing the path to this directory.
        ancestor_chain: A list of breadcrumb nodes for parent directories.

    Returns:
        A dictionary representing the manifest node for this directory, or None
        if the directory is not eligible for inclusion.
    """
    relative_dir = directory.relative_to(ctx.source_root)
    is_root = not slug_segments

    # Special handling for 'graphics' directories, which are just copied.
    if directory.name.lower() == GRAPHICS_DIR_NAME:
        copy_graphics_directory(ctx, directory, relative_dir)
        return None

    readme_path = find_readme(directory)
    if readme_path is None:
        # A directory without a README is not included, unless it's the root.
        # The root *must* have a README to start the build.
        return None

    output_dir = ctx.output_root / relative_dir
    output_dir.mkdir(parents=True, exist_ok=True)

    # Process the README file for this directory.
    copy_file(readme_path, ctx, relative_dir)
    readme_html_rel_path = convert_markdown_file(ctx, readme_path)

    title = derive_title(directory.name if not is_root else "Notes")
    slug_path = "/".join(slug_segments)

    current_crumb = {"title": title, "slugPath": slug_path}
    breadcrumbs = build_breadcrumbs(ancestor_chain)

    directory_children: List[Dict] = []
    file_children: List[Dict] = []

    # Iterate over children to process subdirectories and files.
    for child in sorted(directory.iterdir(), key=lambda p: p.name.lower()):
        if child.is_dir():
            child_slug_segments = slug_segments + [slugify(child.name)]
            child_manifest = build_directory(
                ctx,
                directory=child,
                slug_segments=child_slug_segments,
                ancestor_chain=ancestor_chain + [current_crumb]
            )
            if child_manifest:
                directory_children.append(child_manifest)
        elif child.is_file():
            if child.name.lower() == README_NAME.lower():
                continue  # README is handled separately.

            if child.suffix.lower() == MARKDOWN_SUFFIX:
                copy_file(child, ctx, relative_dir)
                html_rel_path = convert_markdown_file(ctx, child)
                file_slug_segments = slug_segments + [slugify(child.stem)]
                file_children.append({
                    "type": "file",
                    "name": child.name,
                    "title": derive_title(child.stem),
                    "slug": slugify(child.stem),
                    "slugPath": "/".join(file_slug_segments),
                    "source": posix_path(relative_dir / child.name),
                    "html": html_rel_path,
                    "breadcrumbs": build_breadcrumbs(ancestor_chain + [current_crumb]),
                })
            else:
                # Copy other files (e.g., non-markdown attachments) directly.
                copy_file(child, ctx, relative_dir)

    return {
        "type": "directory",
        "name": directory.name,
        "title": title,
        "slug": slugify(directory.name) if not is_root else "",
        "slugPath": slug_path,
        "readme": {
            "source": posix_path(relative_dir / README_NAME),
            "html": readme_html_rel_path,
        },
        "breadcrumbs": breadcrumbs,
        "directories": directory_children,
        "files": file_children,
    }


def convert_markdown_file(ctx: BuildContext, source: Path) -> str:
    """
    Reads a Markdown file, renders it to HTML, and saves the output.

    Args:
        ctx: The build context.
        source: The path to the source Markdown file.

    Returns:
        The relative POSIX path to the generated HTML file.
    """
    relative_dir = source.parent.relative_to(ctx.source_root)
    destination = ctx.output_root / relative_dir / f"{source.stem}.html"
    html_content = render_markdown(ctx, source, source.read_text(encoding="utf-8"))
    destination.write_text(html_content, encoding="utf-8")
    return posix_path(destination.relative_to(ctx.output_root))


def build_breadcrumbs(chain: List[Dict[str, str]]) -> List[Dict[str, str]]:
    """
    Filters and returns a clean list of breadcrumbs.

    Args:
        chain: The list of potential ancestor breadcrumbs.

    Returns:
        A list of valid breadcrumb dictionaries.
    """
    return [crumb for crumb in chain if crumb.get("slugPath") is not None]
