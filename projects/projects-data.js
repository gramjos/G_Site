// Project definitions and metadata
export const projects = [
    {
        id: 'modular-map',
        title: 'Modular Map',
        description: 'An interactive mapping application with data layers, attribute tables, and Marimo integration for geospatial analysis.',
        url: '/modular_map/',
        tags: ['mapping', 'geospatial', 'data-visualization'],
        features: [
            'Interactive map with multiple base layers',
            'GeoJSON data loading and visualization',
            'Attribute table with search and filtering',
            'Marimo notebook integration',
            'Responsive design with FAB controls'
        ]
    },
    // Future projects can be added here
];

export const projectsById = Object.fromEntries(
    projects.map((project) => [project.id, project])
);
