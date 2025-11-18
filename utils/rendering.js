// Shared rendering helpers keep escaping logic in one place.
export function escapeHtml(value) {
    // Classic HTML escaping for rendered guide content.
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

export function codeBlock(source) {
    // Keep code examples safe from script injection.
    return `<pre class="code-block"><code>${escapeHtml(source)}</code></pre>`;
}

export function escapeRegExp(value) {
    // Everything special in regex land needs a backslash prepended.
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
