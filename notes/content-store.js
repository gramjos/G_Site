// Lightweight client-side manifest loader for dynamically rendered notes.
const CONTENT_BASE = '/try1_ready_2_serve';
const MANIFEST_URL = `${CONTENT_BASE}/manifest.json`;

let manifestPromise;
let manifestData;
let contentBase = CONTENT_BASE;
const htmlCache = new Map();

export function loadManifest() {
    if (!manifestPromise) {
        manifestPromise = fetch(MANIFEST_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Unable to fetch notes manifest (status ${response.status}).`);
                }
                return response.json();
            })
            .then((data) => {
                manifestData = data;
                if (data && typeof data.publicPath === 'string') {
                    contentBase = normaliseBasePath(data.publicPath);
                }
                return (manifestData = data);
            })
            .catch((error) => {
                manifestPromise = undefined;
                throw error;
            });
    }
    return manifestPromise;
}

export async function resolveNode(slugSegments) {
    const manifest = manifestData || await loadManifest();
    const segments = slugSegments.filter(Boolean);
    if (segments.length === 0) {
        return { node: manifest.root, kind: 'directory' };
    }
    const result = walk(manifest.root, segments);
    if (!result) {
        throw new Error('Not Found');
    }
    return result;
}

export function fetchHtml(relativePath) {
    const normalised = relativePath.replace(/^\/+/, '');
    if (htmlCache.has(normalised)) {
        return htmlCache.get(normalised);
    }
    const url = buildContentUrl(normalised);
    const promise = fetch(url)
        .then((response) => {
            if (!response.ok) {
                throw new Error(`Unable to fetch HTML fragment (${response.status}).`);
            }
            return response.text();
        })
        .then((html) => {
            const rewritten = rewriteRelativeUrls(html, normalised);
            return rewritten;
        })
        .catch((error) => {
            htmlCache.delete(normalised);
            throw error;
        });
    htmlCache.set(normalised, promise);
    return promise;
}

function walk(directoryNode, segments) {
    if (segments.length === 0) {
        return { node: directoryNode, kind: 'directory' };
    }
    const [head, ...rest] = segments;
    const nextDirectory = (directoryNode.directories || []).find((entry) => entry.slug === head);
    if (nextDirectory) {
        return walk(nextDirectory, rest);
    }
    const fileMatch = (directoryNode.files || []).find((entry) => entry.slug === head);
    if (fileMatch && rest.length === 0) {
        return { node: fileMatch, kind: 'file' };
    }
    return null;
}

export function toNotesHref(slugPath) {
    if (!slugPath) {
        return '/notes';
    }
    return `/notes/${slugPath}`;
}

function getContentBase() {
    return contentBase;
}

function buildContentUrl(relativePath) {
    const base = getContentBase();
    const trimmed = relativePath.replace(/^\/+/, '');
    if (!base) {
        return `/${trimmed}`;
    }
    return `${base}/${trimmed}`.replace(/\/+/g, '/');
}

function rewriteRelativeUrls(html, relativePath) {
    const base = getContentBase();
    if (!base) {
        return html;
    }
    const dirSegments = relativePath.split('/').slice(0, -1).filter(Boolean);
    const prefix = dirSegments.length > 0
        ? `${base}/${dirSegments.join('/')}`.replace(/\/+/g, '/')
        : base;
    
    // Rewrite img src attributes
    let result = html.replace(/(<img\b[^>]*\ssrc\s*=\s*["'])([^"'?#]+)(["'])/gi, (match, start, src, end) => {
        const trimmedSrc = src.trim();
        if (/^(?:[a-z]+:|data:|\/)/i.test(trimmedSrc)) {
            return match;
        }
        const cleaned = trimmedSrc.replace(/^\.\//, '').replace(/^\/+/, '');
        const full = `${prefix}/${cleaned}`.replace(/\/+/g, '/');
        return `${start}${full}${end}`;
    });
    
    // Rewrite data-excalidraw-src attributes
    result = result.replace(/(data-excalidraw-src\s*=\s*["'])([^"'?#]+)(["'])/gi, (match, start, src, end) => {
        const trimmedSrc = src.trim();
        if (/^(?:[a-z]+:|data:|\/)/i.test(trimmedSrc)) {
            return match;
        }
        const cleaned = trimmedSrc.replace(/^\.\//, '').replace(/^\/+/, '');
        const full = `${prefix}/${cleaned}`.replace(/\/+/g, '/');
        return `${start}${full}${end}`;
    });
    
    return result;
}

function normaliseBasePath(value) {
    if (!value) {
        return CONTENT_BASE;
    }
    let base = value.trim();
    if (!base.startsWith('/')) {
        base = `/${base}`;
    }
    return base.replace(/\/+$/, '');
}
