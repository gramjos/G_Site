// Entry point wires the router to the DOM mount point.
import { createRoute, createRouter } from './router.js';
import { renderNoteDetail, renderGuideDetail, renderAbout, renderGuides, renderNotes, renderHome, renderNotFound } from './views/index.js';
import { renderProjects, renderProjectDetail } from './projects/projects-view.js';

// Wire up the view functions to URL templates.
debugger; 
const router = createRouter({
    mountNode: document.getElementById('app'),
    routes: [
        createRoute('/', renderHome),
        createRoute('/about', renderAbout),
        createRoute('/guides', renderGuides),
        createRoute('/notes', renderNotes),
        createRoute('/projects', renderProjects),
        createRoute('/guides/:slug', renderGuideDetail),
        createRoute('/notes/:path*', renderNoteDetail),
        createRoute('/projects/:id', renderProjectDetail),
        createRoute('*', renderNotFound),
    ],
});

// This call attaches the global click/popstate listeners
// and runs the first route match to render the initial page.
debugger; 
router.start();

// Global event listener for copy buttons
document.addEventListener('click', (event) => {
    if (event.target.classList.contains('copy-btn')) {
        const button = event.target;
        const wrapper = button.closest('.code-wrapper');
        const code = wrapper.querySelector('code');
        const textToCopy = code.innerText;

        navigator.clipboard.writeText(textToCopy).then(() => {
            const originalText = button.innerText;
            button.innerText = 'Copied!';
            button.classList.add('copied');

            setTimeout(() => {
                button.innerText = originalText;
                button.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error('Failed to copy text: ', err);
        });
    }
});
