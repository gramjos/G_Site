"""
This file is dedicated to converting Markdown text into HTML fragments.

It uses the Python markdown library with custom extensions to support
Obsidian-style features like wiki-links, Obsidian-style images, and Excalidraw
diagrams. This provides a robust markdown parser while maintaining all the
required features for this project.
"""

import re
import hashlib
from pathlib import Path
from typing import Optional
from xml.etree import ElementTree as etree

import markdown
from markdown.extensions import Extension
from markdown.inlinepatterns import InlineProcessor
from markdown.postprocessors import Postprocessor

from .assets import normalise_image_src, resolve_asset_reference
from .models import BuildContext
from .utils import slugify


class ObsidianImageProcessor(InlineProcessor):
    """
    Processes Obsidian-style image links: ![[image.png]]
    
    Also handles Excalidraw files with special rendering.
    """
    
    def __init__(self, pattern, md, ctx, source_file):
        super().__init__(pattern, md)
        self.ctx = ctx
        self.source_file = source_file
    
    def handleMatch(self, m, data):
        src_with_params = m.group(1)
        
        # Handle Obsidian-style size parameters: image.png|600
        # The size parameter is stripped as it's not used in the HTML output.
        # Obsidian uses it for display sizing, but our CSS handles image sizing.
        if '|' in src_with_params:
            src = src_with_params.split('|')[0]
        else:
            src = src_with_params
        
        # Resolve the asset to get the actual file path
        resolved_path = resolve_asset_reference(self.ctx, self.source_file.parent, src)
        
        # Check if this is an Excalidraw file
        is_excalidraw = (src.lower().endswith('.excalidraw') or 
                        src.lower().endswith('.excalidraw.md') or
                        (resolved_path and resolved_path.suffix.lower() == '.excalidraw'))
        
        if is_excalidraw:
            # Handle Excalidraw files specifically
            if resolved_path:
                excalidraw_src = resolved_path.name
            else:
                # Fallback: strip .md if present
                excalidraw_src = src.replace('.excalidraw.md', '.excalidraw') if src.endswith('.excalidraw.md') else src
            
            asset_path = normalise_image_src(self.ctx, self.source_file.parent, 
                                            self.source_file.parent.relative_to(self.ctx.source_root), 
                                            excalidraw_src)
            
            # Generate a unique ID for this Excalidraw instance
            unique_id = hashlib.md5(asset_path.encode()).hexdigest()[:8]
            
            # Create a container div with data attributes
            div = etree.Element('div')
            div.set('class', 'excalidraw-embed')
            div.set('data-excalidraw-src', asset_path)
            div.set('id', f'excalidraw-{unique_id}')
            
            loading_div = etree.SubElement(div, 'div')
            loading_div.set('class', 'excalidraw-loading')
            loading_div.text = 'Loading Excalidraw diagram...'
            
            return div, m.start(0), m.end(0)
        else:
            # Handle regular images
            asset_path = normalise_image_src(self.ctx, self.source_file.parent, 
                                            self.source_file.parent.relative_to(self.ctx.source_root), 
                                            src)
            
            img = etree.Element('img')
            img.set('src', asset_path)
            img.set('alt', '')
            img.set('loading', 'lazy')
            img.set('decoding', 'async')
            
            return img, m.start(0), m.end(0)


class WikiLinkProcessor(InlineProcessor):
    """
    Processes wiki-style internal links: [[Link]] or [[target|label]]
    """
    
    def __init__(self, pattern, md, ctx):
        super().__init__(pattern, md)
        self.ctx = ctx
    
    def handleMatch(self, m, data):
        text = m.group(1)
        
        if '|' in text:
            target, label = text.split('|', 1)
        else:
            target, label = text, text
        
        # Find the file
        found_path = None
        try:
            found_path = next(self.ctx.source_root.rglob(f"{target}.md"), None)
            
            if not found_path:
                # Search for directory/README.md
                for path in self.ctx.source_root.rglob(target):
                    if path.is_dir() and (path / "README.md").exists():
                        found_path = path / "README.md"
                        break
        except Exception:
            pass
        
        if found_path:
            relative_path = found_path.relative_to(self.ctx.source_root)
            parts = list(relative_path.parent.parts)
            if found_path.name.lower() != 'readme.md':
                parts.append(found_path.stem)
            
            slug_parts = [slugify(p) for p in parts]
            slug_path = "/".join(slug_parts)
            
            a = etree.Element('a')
            a.set('href', f'/notes/{slug_path}')
            a.text = label
            return a, m.start(0), m.end(0)
        
        # If link not found, return plain text
        return label, m.start(0), m.end(0)


class CodeBlockWrapperPostprocessor(Postprocessor):
    """
    Wraps code blocks with a div and adds a copy button.
    """
    
    def run(self, text):
        # Wrap code blocks with copy button wrapper.
        # Process in a single pass to avoid double-wrapping.
        # Pattern matches both language-specified and plain code blocks.
        
        def replace_code_block(match):
            # Check if this is a language-specified block
            if match.group(1):
                lang = match.group(1)
                code = match.group(2)
                return f'''<div class="code-wrapper">
    <button class="copy-btn">Copy Code</button>
    <pre><code class="language-{lang}">{code}</code></pre>
</div>'''
            else:
                # Plain code block without language
                code = match.group(3)
                return f'''<div class="code-wrapper">
    <button class="copy-btn">Copy Code</button>
    <pre><code>{code}</code></pre>
</div>'''
        
        # Single regex to match both patterns
        pattern = r'<pre><code class="language-([^"]*)">(.*?)</code></pre>|<pre><code>(.*?)</code></pre>'
        text = re.sub(pattern, replace_code_block, text, flags=re.DOTALL)
        
        return text


class ObsidianExtension(Extension):
    """
    Extension to add Obsidian-specific markdown features.
    """
    
    def __init__(self, ctx, source_file, **kwargs):
        self.ctx = ctx
        self.source_file = source_file
        super().__init__(**kwargs)
    
    def extendMarkdown(self, md):
        # Obsidian image pattern: ![[image.png]]
        # Priority 175 to process before standard images
        md.inlinePatterns.register(
            ObsidianImageProcessor(r'!\[\[([^\]]+)\]\]', md, self.ctx, self.source_file),
            'obsidian_image',
            175
        )
        
        # Wiki link pattern: [[Link]] but not ![[Image]]
        # Priority 75 to process after images
        md.inlinePatterns.register(
            WikiLinkProcessor(r'(?<!\!)\[\[([^\]]+)\]\]', md, self.ctx),
            'wikilink',
            75
        )
        
        # Add postprocessor for code block wrappers
        md.postprocessors.register(
            CodeBlockWrapperPostprocessor(md),
            'code_wrapper',
            25
        )


def render_markdown(ctx: BuildContext, source_file: Path, markdown_text: str) -> str:
    """
    Converts a string of Markdown into an HTML fragment using the Python markdown library.

    This function uses the markdown library with custom extensions to support
    Obsidian-style features while maintaining compatibility with standard markdown.

    Args:
        ctx: The build context, needed for resolving image paths and links.
        source_file: The path to the Markdown file being rendered.
        markdown_text: The raw text content of the Markdown file.

    Returns:
        A string containing the generated HTML fragment.
    """
    # Create markdown instance with extensions
    md = markdown.Markdown(
        extensions=[
            'fenced_code',  # Support for ``` code blocks
            ObsidianExtension(ctx, source_file),
        ],
        output_format='html'
    )
    
    # Convert markdown to HTML
    html = md.convert(markdown_text)
    
    return html
