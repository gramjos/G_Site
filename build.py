#!/usr/bin/env python3
"""
Converts a subset of an Obsidian vault into static HTML fragments plus a
navigable manifest for the Notes tab of the SPA.

This script acts as the main entry point for the build process. It parses
command-line arguments, sets up the build context, and orchestrates the
conversion by calling the core logic from the 'builder' package.

Usage:
    python build.py /path/to/your/vault [--out /path/to/output_dir]

Example:
    python build.py ~/Documents/Obsidian/MyVault --out ./my-site

The script will:
1.  Read the source vault.
2.  Create an output directory (e.g., 'MyVault_ready_2_serve').
3.  Recursively scan the vault, starting from the root.
4.  For each directory containing a 'README.md', it will:
    - Convert Markdown files (.md) to HTML fragments.
    - Copy over any other files (e.g., images, PDFs).
    - Special 'graphics' directories are copied directly.
5.  Generate a 'manifest.json' file in the output directory, which contains
    the entire navigable structure of the processed notes for the SPA to use.
"""

import json
import shutil
import sys
from datetime import datetime, timezone
from pathlib import Path

from builder.constants import DEFAULT_OUTPUT_SUFFIX, MANIFEST_FILENAME
from builder.manifest import build_directory
from builder.models import BuildContext


def main() -> None:
    """
    Main function to run the build process.

    Parses arguments, prepares directories, and initiates the manifest build.
    """
    if len(sys.argv) != 2:
        raise SystemExit(f"Usage: python {sys.argv[0]} /path/to/your/vault")

    vault_path = sys.argv[1]
    source_root = Path(vault_path).resolve()

    if not source_root.exists() or not source_root.is_dir():
        raise SystemExit(f"Error: Vault path not found or is not a directory.\nProvided path: {source_root}")

    output_root = Path(f"{source_root.name}{DEFAULT_OUTPUT_SUFFIX}").resolve()

    if output_root.exists():
        print(f"Removing existing output directory: {output_root}")
        shutil.rmtree(output_root)
    output_root.mkdir(parents=True, exist_ok=True)

    print(f"Source vault: {source_root}")
    print(f"Outputting to: {output_root}")

    # The BuildContext holds all the essential path information.
    ctx = BuildContext(source_root=source_root, output_root=output_root)

    # Start the recursive build process from the root of the vault.
    manifest_root = build_directory(ctx, directory=source_root, slug_segments=[], ancestor_chain=[])
    if manifest_root is None:
        raise SystemExit("Build failed: Root directory must contain a README.md to seed the Notes content.")

    # Assemble the final manifest object.
    manifest = {
        "source": str(source_root),
        "output": str(output_root),
        "publicPath": f"/{output_root.name}",
        "generatedAt": datetime.now(timezone.utc).isoformat(),
        "version": 1,
        "root": manifest_root,
    }

    # Write the manifest.json file.
    manifest_path = output_root / MANIFEST_FILENAME
    manifest_path.write_text(json.dumps(manifest, indent=2), encoding="utf-8")

    print(f"\nBuild complete. Manifest written to {manifest_path}")


if __name__ == "__main__":
    main()
