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
from typing import List, Tuple, Dict
from .assets import normalise_image_src
from .models import BuildContext
from .utils import escape_html, slugify


def parse_bold(text: str) -> str:
    """
    Parses bold text enclosed in double underscores.
    Example: __bold__ -> <strong>bold</strong>
    """
    return re.sub(r"__(.+?)__", r"<strong>\1</strong>", text)


def parse_italic(text: str) -> str:
    """
    Parses italic text enclosed in single underscores.
    Example: _italic_ -> <em>italic</em>
    """
    return re.sub(r"_(.+?)_", r"<em>\1</em>", text)


def parse_inline_code(text: str, escape_content: bool = False) -> Tuple[str, Dict[str, str]]:
    """
    Parses inline code enclosed in backticks.
    Returns the text with placeholders and a dictionary of placeholders to code HTML.
    """
    stash = {}
    def repl(match):
        # Use a placeholder without underscores to avoid interference with bold/italic parsing
        key = f"HTMCODEBLOCK{len(stash)}"
        content = match.group(1)
        if escape_content:
            content = escape_html(content)
        stash[key] = f'<code class="inline-code">{content}</code>'
        return key

    return re.sub(r"`([^`\n]+)`", repl, text), stash


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
    in_code_block = False
    code_block_content = []
    code_block_lang = ""

    x = markdown_text.splitlines()
    for raw_line in x:
        line = raw_line.strip() # Strip leading/trailing whitespace
        
        # Code Block Processing
        if in_code_block:
            if line.startswith("```"):
                # End of code block
                in_code_block = False
                code_content = "\n".join(code_block_content)
                escaped_code = escape_html(code_content)
                
                html_lines.append(f'''<div class="code-wrapper">
    <button class="copy-btn">Copy Code</button>
    <pre><code class="language-{code_block_lang}">{escaped_code}</code></pre>
</div>''')
                code_block_content = []
                code_block_lang = ""
            else:
                code_block_content.append(raw_line)
            continue

        if line.startswith("```"):
            in_code_block = True
            code_block_lang = line[3:].strip()
            continue

        if not line: # if line empty
            continue

        # Markdown processing:
        ## artifacts that occurs to the whole line VERSUS to an element within the line
        # - Source ParsingRules.md

        # Is Heading
        heading_match = re.match(r"^(#{1,5})\s+(.*)$", line)
        if heading_match:
            level = len(heading_match.group(1))
            content = escape_html(heading_match.group(2).strip())
            
            # Parse inline code first to protect it
            content, stash = parse_inline_code(content, escape_content=False)
            
            # Parse formatting
            content = parse_bold(content)
            content = parse_italic(content)
            
            # Restore code
            for key, val in stash.items():
                content = content.replace(key, val)
                
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
                    html_lines.append(f'<img src="{asset_path}" alt="{escape_html(alt)}" loading="lazy" decoding="async" />')
            continue
        # Is Link
        # We process links before wrapping in paragraph tags.
        # This regex matches [[Link]] but ignores ![[Image]]
        link_pattern = re.compile(r"(?<!\!)\[\[(.+?)\]\]")
        
        def replace_link(match):
            text = match.group(1)
            if '|' in text:
                target, label = text.split('|', 1)
            else:
                target, label = text, text
            
            # Find the file
            found_path = None
            # Search for file.md
            try:
                found_path = next(ctx.source_root.rglob(f"{target}.md"), None)
                
                if not found_path:
                    # Search for directory/README.md
                    for path in ctx.source_root.rglob(target):
                        if path.is_dir() and (path / "README.md").exists():
                            found_path = path / "README.md"
                            break
            except Exception:
                pass
            
            if found_path:
                relative_path = found_path.relative_to(ctx.source_root)
                parts = list(relative_path.parent.parts)
                if found_path.name.lower() != 'readme.md':
                    parts.append(found_path.stem)
                
                slug_parts = [slugify(p) for p in parts]
                slug_path = "/".join(slug_parts)
                return f'<a href="/notes/{slug_path}">{label}</a>'
            
            return label

        line = link_pattern.sub(replace_link, line)

        # Is Paragraph
        # catch all is paragraph
        
        # Parse inline code first to protect it
        line, stash = parse_inline_code(line, escape_content=True)
        
        # Parse formatting
        line = parse_bold(line)
        line = parse_italic(line)
        
        # Restore code
        for key, val in stash.items():
            line = line.replace(key, val)
            
        html_lines.append(f"<p>{line}</p>")

    return "\n".join(html_lines)
