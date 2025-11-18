# Projects Module

This folder contains the projects feature of the SPA, isolated from the main application code.

## Structure

- `projects-data.js` - Defines all project metadata and configurations
- `projects-view.js` - View functions for rendering project pages

## Adding a New Project

### 1. Add Project Metadata

Edit `projects-data.js` and add a new project object to the `projects` array:

```javascript
{
    id: 'my-project',  // URL-friendly identifier
    title: 'My Project',  // Display name
    description: 'A brief description of what the project does.',
    url: '/my_project/',  // Path to the project (can be relative or external)
    tags: ['tag1', 'tag2', 'tag3'],  // Category tags
    features: [  // List of key features
        'Feature 1',
        'Feature 2',
        'Feature 3'
    ]
}
```

### 2. Create Symbolic Link (for local projects)

If your project is in another directory, create a symbolic link:

```bash
cd /Users/gramjos/Computation/vanilla_web_dev/gramjos.github.io
ln -sf ~/path/to/your/project project_name
```

### 3. Test

Navigate to `/projects` to see your new project card, and `/projects/my-project` to see the detail page.

## Design Philosophy

This module follows the SPA's functional programming approach:
- View functions receive context and render HTML
- Data is separate from presentation
- No framework dependencies
- Deep linking is preserved for all routes

## Routes

The following routes are registered for projects:

- `/projects` - Lists all projects (grid view)
- `/projects/:id` - Shows project detail page
