// View functions for projects section
import { projects, projectsById } from './projects-data.js';
import { escapeHtml } from '../utils/rendering.js';

export function renderProjects(ctx) {
    document.title = 'Projects · Plain Vanilla SPA';
    ctx.mount.innerHTML = `
        <section>
            <h1>Projects</h1>
            <p>
                A collection of interactive web applications and tools I've built.
                Each project demonstrates different aspects of web development, from mapping to data visualization.
            </p>
            <div class="card-grid">
                ${projects.map((project) => `
                    <article class="card project-card">
                        <h2>${escapeHtml(project.title)}</h2>
                        <p>${escapeHtml(project.description)}</p>
                        <div class="project-tags">
                            ${project.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
                        </div>
                        <div class="card-actions">
                            <a href="/projects/${escapeHtml(project.id)}" class="button-secondary">Learn More</a>
                            <a href="${escapeHtml(project.url)}" class="button-primary" target="_blank" rel="noopener noreferrer">
                                Open Project
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333M10 2H14M14 2V6M14 2L6.66667 9.33333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                                </svg>
                            </a>
                        </div>
                    </article>
                `).join('')}
            </div>
        </section>
    `;
}

export function renderProjectDetail(ctx) {
    const projectId = ctx.params.id;
    const project = projectsById[projectId];

    if (!project) {
        document.title = 'Project Not Found · Plain Vanilla SPA';
        ctx.mount.innerHTML = `
            <section>
                <h1>Project not found</h1>
                <p>The project you're looking for doesn't exist.</p>
                <a href="/projects">← Back to Projects</a>
            </section>
        `;
        return;
    }

    document.title = `${project.title} · Projects · Plain Vanilla SPA`;
    ctx.mount.innerHTML = `
        <section>
            <nav class="breadcrumb">
                <a href="/projects">← Projects</a>
            </nav>
            <h1>${escapeHtml(project.title)}</h1>
            <p class="lead">${escapeHtml(project.description)}</p>
            
            <div class="project-tags">
                ${project.tags.map(tag => `<span class="tag">${escapeHtml(tag)}</span>`).join('')}
            </div>

            <div class="project-actions">
                <a href="${escapeHtml(project.url)}" class="button-primary" target="_blank" rel="noopener noreferrer">
                    Open Project
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M12 8.66667V12.6667C12 13.0203 11.8595 13.3594 11.6095 13.6095C11.3594 13.8595 11.0203 14 10.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V5.33333C2 4.97971 2.14048 4.64057 2.39052 4.39052C2.64057 4.14048 2.97971 4 3.33333 4H7.33333M10 2H14M14 2V6M14 2L6.66667 9.33333" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
                    </svg>
                </a>
            </div>

            <h2>Features</h2>
            <ul class="feature-list">
                ${project.features.map(feature => `<li>${escapeHtml(feature)}</li>`).join('')}
            </ul>
        </section>
    `;
}
