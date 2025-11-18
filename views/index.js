// View functions stay modular so routing just chooses among them.
import { guides, guidesBySlug } from '../guides.js';
import { resolveNode, fetchHtml, toNotesHref } from '../notes/content-store.js';
import { codeBlock, escapeHtml } from '../utils/rendering.js';
import { initializeExcalidrawEmbeds } from '../utils/excalidraw.js';

export function renderHome(ctx) {
    document.title = " 𝔾𝓡⍲ℳ "; 
    ctx.mount.innerHTML = `
        <section class="home-hero">
            <div class="home-hero__text">
                <h1>A Curious Tinkeria </h1>
                <p>
                    My musings for you.
                </p>
				<ul>
					<li> To learn what it means to be Graham: </li>
				</ul>
            </div>
            <div class="home-hero__image">
                <img src="/assets/pro_pic_grey.jpg" alt="A picture of Graham Joss">
            </div>
        </section>
        <section>
            <h2>Documents</h2>
            <div class="card-actions">
                <a href="/assets/Resume.pdf" target="_blank" rel="noopener noreferrer" class="button-primary">View Resume</a>
                <a href="/assets/CoverLetter.pdf" target="_blank" rel="noopener noreferrer" class="button-secondary">View Cover Letter</a>
            </div>
        </section>
    `;

    const img = ctx.mount.querySelector('.home-hero__image img');
    const greySrc = '/assets/pro_pic_grey.jpg';
    const colorSrc = '/assets/pro_pic.jpg';
    const root = document.documentElement;
    const originalBg = getComputedStyle(root).getPropertyValue('--bg').trim();
    const deepBlueBg = '#2e8aecff';

    // Preload the color image to prevent a flash on first hover
    const colorImage = new Image();
    colorImage.src = colorSrc;

    img.addEventListener('mouseenter', () => {
        img.src = colorSrc;
        root.style.setProperty('--bg', deepBlueBg);
    });
    img.addEventListener('mouseleave', () => {
        img.src = greySrc;
        root.style.setProperty('--bg', originalBg);
    });
}
export function renderAbout(ctx) {
    document.title = " about - 𝔾𝓡⍲ℳ "; 
    ctx.mount.innerHTML = `
        <section class="">
            <div class="">
                <h1>What does it mean to live a life worth live? </h1>
					"To live is to risk it all; otherwise, you're just an inert chunk of randomly assembled molecules drifting wherever the universe blows you" - Rick C137
                </p>
                <p>
				Only those who will risk going too far can possibly find out how far one can go. -T. S. Eliot
                </p>
            </div>
        </section>
    `;
}

export function renderGuides(ctx) {
    document.title = 'Guides · Plain Vanilla SPA';
    ctx.mount.innerHTML = `
        <section>
            <h1>Routing building blocks</h1>
            <p>Pick a guide to explore a focused topic. Each one is a live route, so you can deep link straight to it.</p>
            <div class="card-grid">
                ${guides.map((guide) => `
                    <article class="card">
                        <h2>${escapeHtml(guide.title)}</h2>
                        <p>${escapeHtml(guide.summary)}</p>
                        <a href="/guides/${escapeHtml(guide.slug)}">Open guide</a>
                    </article>
                `).join('')}
            </div>
        </section>
    `;
}

export function renderNotes(ctx) {
    renderNotesPath(ctx, []);
}

export function renderNoteDetail(ctx) {
    const slugParam = ctx.params.path || '';
    const segments = slugParam.split('/').map((segment) => segment.trim()).filter(Boolean);
    renderNotesPath(ctx, segments);
}

function renderNotesPath(ctx, segments) {
    const requestPath = ctx.location.path;
    ctx.mount.innerHTML = renderNotesLoading();

    resolveNode(segments)
        .then(async (result) => {
            if (ctx.location.path !== requestPath) return;

            if (result.kind === 'directory') {
                const readmeHtml = await fetchHtml(result.node.readme.html);
                if (ctx.location.path !== requestPath) return;
                document.title = directoryTitle(result.node);
                ctx.mount.innerHTML = buildDirectoryMarkup(result.node, readmeHtml);
                // Initialize any Excalidraw embeds in the content
                initializeExcalidrawEmbeds();
                return;
            }

            const fileHtml = await fetchHtml(result.node.html);
            if (ctx.location.path !== requestPath) return;
            document.title = fileTitle(result.node);
            ctx.mount.innerHTML = buildFileMarkup(result.node, fileHtml);
            // Initialize any Excalidraw embeds in the content
            initializeExcalidrawEmbeds();
        })
        .catch((error) => {
            console.error(error);
            if (ctx.location.path !== requestPath) return;
            document.title = 'Notes not found · Plain Vanilla SPA';
            ctx.mount.innerHTML = renderNotesError(segments);
        });
}

function buildDirectoryMarkup(node, readmeHtml) {
    return `
        <section class="notes-view">
            ${renderBreadcrumbs(node.breadcrumbs, node.title, node.slugPath)}
            <header class="notes-header">
                <h1>${escapeHtml(node.title)}</h1>
            </header>
            ${renderDirectoryLists(node)}
            <article class="notes-content">${readmeHtml}</article>
        </section>
    `;
}

function buildFileMarkup(node, fileHtml) {
    const breadcrumbs = node.breadcrumbs || [];
    const parentCrumb = breadcrumbs[breadcrumbs.length - 1] || null;
    const backHref = parentCrumb ? toNotesHref(parentCrumb.slugPath) : '/notes';
    const backLabel = parentCrumb ? parentCrumb.title : 'Notes';
    return `
        <section class="notes-view">
            ${renderBreadcrumbs(breadcrumbs, node.title, node.slugPath)}
            <a class="notes-backlink" href="${backHref}">← Back to ${escapeHtml(backLabel)}</a>
            <h1>${escapeHtml(node.title)}</h1>
            <article class="notes-content">${fileHtml}</article>
        </section>
    `;
}

function renderDirectoryLists(node) {
    const sections = [];
    if (Array.isArray(node.directories) && node.directories.length > 0) {
        sections.push(renderDirectoryPanel('Directories', node.directories));
    }
    if (Array.isArray(node.files) && node.files.length > 0) {
        sections.push(renderDirectoryPanel('Files', node.files));
    }
    if (sections.length === 0) {
        return '<p class="muted">No additional content in this section yet.</p>';
    }
    return `<div class="notes-directory-lists">${sections.join('')}</div>`;
}

function renderDirectoryPanel(label, items) {
    return `
        <div class="notes-directory-panel">
            <h2>${escapeHtml(label)}</h2>
            <ul>
                ${items.map((item) => `
                    <li><a href="${toNotesHref(item.slugPath)}">${escapeHtml(item.title)}</a></li>
                `).join('')}
            </ul>
        </div>
    `;
}

function renderBreadcrumbs(trail, currentTitle, currentSlugPath) {
    const crumbs = Array.isArray(trail) ? [...trail] : [];
    if (currentTitle) {
        crumbs.push({ title: currentTitle, slugPath: currentSlugPath, current: true });
    }
    if (crumbs.length === 0) {
        return '';
    }

    const parts = crumbs.map((crumb) => {
        if (crumb.current) {
            return `<span aria-current="page">${escapeHtml(crumb.title)}</span>`;
        }
        return `<a href="${toNotesHref(crumb.slugPath)}">${escapeHtml(crumb.title)}</a>`;
    });

    const joined = parts.map((part, index) => {
        if (index === 0) return part;
        return `<span class="notes-breadcrumbs__sep">/</span>${part}`;
    }).join('');

    return `<nav class="notes-breadcrumbs" aria-label="Breadcrumb">${joined}</nav>`;
}

function renderNotesLoading(message = 'Loading notes…') {
    return `
        <section class="notes-view">
            <p>${escapeHtml(message)}</p>
        </section>
    `;
}

function renderNotesError(segments) {
    const target = segments.length ? segments.join('/') : 'notes home';
    return `
        <section class="notes-view">
            <h1>We could not find that note</h1>
            <p>No content exists for <code>${escapeHtml(target)}</code>.</p>
            <p><a href="/notes">Return to the notes home</a> to browse available content.</p>
        </section>
    `;
}

function directoryTitle(node) {
    return node.slugPath
        ? `${node.title} · Notes · Plain Vanilla SPA`
        : 'Notes · Plain Vanilla SPA';
}

function fileTitle(node) {
    return `${node.title} · Notes · Plain Vanilla SPA`;
}

export function renderGuideDetail(ctx) {
    const guide = guidesBySlug.get(ctx.params.slug);
    if (!guide) {
        document.title = 'Guide not found · Plain Vanilla SPA';
        ctx.mount.innerHTML = `
            <section>
                <h1>We could not find that guide</h1>
                <p>No guide exists for <code>${escapeHtml(ctx.params.slug)}</code>.</p>
                <p><a href="/guides">Return to the list</a> and choose another topic.</p>
            </section>
        `;
        return;
    }

    document.title = `${guide.title} · Plain Vanilla SPA`;
    ctx.mount.innerHTML = `
        <section>
            <a class="back-link" href="/guides">← Back to guides</a>
            <h1>${escapeHtml(guide.title)}</h1>
            <p class="muted">Deep link: <code>${escapeHtml(ctx.location.path)}</code></p>
            ${guide.render()}
        </section>
    `;
}

export function renderNotFound(ctx) {
    document.title = '404 · Plain Vanilla SPA';
    ctx.mount.innerHTML = `
        <section>
            <h1>Lost in the twisty maze</h1>
            <p>Looks like <code>${escapeHtml(ctx.location.path)}</code> does not map to a registered route.</p>
            <p>Head <a href="/">home</a> or explore the <a href="/guides">guided tour</a>.</p>
        </section>
    `;
}
