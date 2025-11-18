"""
This file is dedicated to converting Markdown text into HTML fragments.

It implements a lightweight parser that specifically targets the required
subset of Markdown for this project: H1-H5 headings, standard and Obsidian-style
image links, and paragraphs. All other Markdown is ignored, and text is
HTML-escaped to be displayed as-is. This ensures a consistent and predictable
output for the SPA to consume.
"""

import re
from pathlib import Path
from typing import List
from .assets import normalise_image_src
from .models import BuildContext
from .utils import escape_html


def render_markdown(ctx: BuildContext, source_file: Path, markdown_text: str) -> str:
    """
    Converts a string of Markdown into an HTML fragment.

    This function iterates through the text line by line. It handles block-level
    elements like headings separately. For paragraph content, it processes each
    line to find and replace any inline image references (both standard and
    Obsidian-style) with their corresponding HTML `<img>` tags.

    Args:
        ctx: The build context, needed for resolving image paths.
        source_file: The path to the Markdown file being rendered.
        markdown_text: The raw text content of the Markdown file.

    Returns:
        A string containing the generated HTML fragment.
    """
    html_lines: List[str] = []

    x = markdown_text.splitlines()
    for raw_line in x:
        line = raw_line.strip() # Strip leading/trailing whitespace
        if not line.strip(): # if line empty
            continue

        # Markdown processing:
        ## artifacts that occurs to the whole line VERSUS to an element within the line
        # - Source ParsingRules.md

        # Is Heading
        heading_match = re.match(r"^(#{1,5})\s+(.*)$", line)
        if heading_match:
            level = len(heading_match.group(1))
            content = escape_html(heading_match.group(2).strip())
            html_lines.append(f"<h{level}>{content}</h{level}>")
            continue

        # Is Img
        image_pattern = re.compile(r"!\[\[(.+?)\]\]|!\[(.*?)\]\((.+?)\)")
        img_matches = image_pattern.findall(line)
        if img_matches:
            for img_match in img_matches:
                obsidian_style_match = img_match[0]
                markdown_style_alt = img_match[1]
                markdown_style_src = img_match[2]

                src = obsidian_style_match or markdown_style_src
                alt = markdown_style_alt

                # First resolve the asset to get the actual file path
                from .assets import resolve_asset_reference
                resolved_path = resolve_asset_reference(ctx, source_file.parent, src)
                
                # Check if this is an Excalidraw file (either by extension in src or resolved path)
                is_excalidraw = (src.lower().endswith('.excalidraw') or 
                               src.lower().endswith('.excalidraw.md') or
                               (resolved_path and resolved_path.suffix.lower() == '.excalidraw'))
                
                if is_excalidraw:
                    # Handle Excalidraw files specifically
                    # Use the resolved path's name to ensure we have the correct extension
                    if resolved_path:
                        excalidraw_src = resolved_path.name
                    else:
                        # Fallback: strip .md if present
                        excalidraw_src = src.replace('.excalidraw.md', '.excalidraw') if src.endswith('.excalidraw.md') else src
                    
                    asset_path = normalise_image_src(ctx, source_file.parent, source_file.parent.relative_to(ctx.source_root), excalidraw_src)
                    
                    # Generate a unique ID for this Excalidraw instance
                    import hashlib
                    unique_id = hashlib.md5(asset_path.encode()).hexdigest()[:8]
                    
                    # Create a container div with data attributes that will be picked up by the client-side JS
                    excalidraw_html = f'''<div class="excalidraw-embed" data-excalidraw-src="{asset_path}" id="excalidraw-{unique_id}">
    <div class="excalidraw-loading">Loading Excalidraw diagram...</div>
</div>'''
                    html_lines.append(excalidraw_html)
                else:
                    # Handle regular images
                    asset_path = normalise_image_src(ctx, source_file.parent, source_file.parent.relative_to(ctx.source_root), src)
                    html_lines.append(f'<img src="{asset_path}" alt="{escape_html(alt)}"/>')
            continue
        # Is Paragraph
        # catch all is paragraph
        html_lines.append(f"<p>{line}</p>")

    return "\n".join(html_lines)
