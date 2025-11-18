// Route docs double as content and in-app help for the router below.
import { codeBlock } from './utils/rendering.js';

export const guides = [
    {
        slug: "history-api",
        title: "History API essentials",
        summary: "Understand pushState, replaceState, and popstate for deep-link friendly navigation.",
        render: () => `
            <p>The History API lets us change the browser address bar without full page reloads. We push a new entry when navigating forward, replace the current one for redirects, and listen to <code>popstate</code> for back/forward.</p>
            ${codeBlock(`history.pushState(stateObject, '', '/details');
window.addEventListener('popstate', (event) => {
  // restore your UI using event.state
});`)}
            <p>Routers bridge this API and the DOM by mapping URLs to view functions.</p>
        `,
    },
    {
        slug: "link-interception",
        title: "Intercepting anchor navigation",
        summary: "Convert standard anchor clicks into client-side route changes while preserving accessibility.",
        render: () => `
            <p>Anchors remain fully accessible and crawlable, but the SPA hijacks clicks so the browser stays on the same document.</p>
            ${codeBlock(`document.addEventListener('click', (event) => {
  if (event.defaultPrevented || event.metaKey) return;
  const anchor = event.target.closest('a[href]');
  if (!anchor || anchor.target && anchor.target !== '_self') return;
  event.preventDefault();
  history.pushState({}, '', anchor.pathname);
});`)}
            <p>Always allow modified clicks (cmd/ctrl) to preserve expected browser behaviour.</p>
        `,
    },
    {
        slug: "routing-architecture",
        title: "Designing a tiny router",
        summary: "Compose route patterns, renderers, and navigation helpers into a clear architecture.",
        render: () => `
            <p>A minimal router only needs a route table, a render loop, and a navigation helper. The clarity comes from keeping those responsibilities explicit.</p>
            ${codeBlock(`const routes = [
  { pattern: /^\/$/, render: renderHome },
  { pattern: /^\/guides$/, render: renderGuides },
  { pattern: /^\/guides\/(?<slug>[^/]+)$/, render: renderGuide },
];`)}
            <p>Everything else (state stores, transitions) can layer on top.</p>
        `,
    },
];

// Cache guides for detail lookups without re-scanning the array.
export const guidesBySlug = new Map(guides.map((guide) => [guide.slug, guide]));
