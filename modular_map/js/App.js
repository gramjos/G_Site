/**
 * App.js - Main Application Entry Point
 * Modular Map: Exploratory Data Analysis Tool
 * Initializes map and all components
 */

import { BaseLayer } from './BaseLayer.js';
import { FAB } from './FAB.js';
import { AttributeTable } from './AttributeTable.js';
import { DataLayer } from './DataLayer.js';
import { MarimoPanel } from './MarimoPanel.js';

class MapApplication {
    constructor() {
        this.map = null;
        this.baseLayer = null;
        this.dataLayer = null;
        this.fab = null;
        this.attributeTable = null;
        this.marimoPanel = null;
    }

    /**
     * Initialize the map and all components
     */
    init() {
        // Create map instance
        this.map = L.map('map').setView([39.8283, -98.5795], 4); // Centered on USA

        // Initialize base layers
        this.baseLayer = new BaseLayer(this.map);
        this.baseLayer.setBaseLayer('osm'); // Set default layer
        this.baseLayer.addLayerControl(); // Add layer switcher control

        // Add scale bar control
        this.addScaleBar();

        // Initialize data layer
        this.initDataLayer();

        // Log available layers for debugging
        console.log('Available base layers:', this.baseLayer.getAvailableLayers());

        // Initialize Attribute Table
        this.initAttributeTable();

        // Initialize Marimo Panel
        this.initMarimoPanel();

        // Initialize Floating Action Button
        this.initFAB();

        console.log('Map application initialized');
    }

    /**
     * Add scale bar to the map
     */
    addScaleBar() {
        this.scaleControl = L.control.scale({
            position: 'bottomleft',
            metric: true,
            imperial: true,
            maxWidth: 200
        }).addTo(this.map);
        
        // Add custom class for positioning control
        setTimeout(() => {
            const scaleElement = document.querySelector('.leaflet-control-scale');
            if (scaleElement) {
                scaleElement.classList.add('scale-bar-positioned');
            }
        }, 100);
        
        console.log('📏 Scale bar added to map');
    }

    /**
     * Initialize data layer and load GeoJSON
     */
    async initDataLayer() {
        this.dataLayer = new DataLayer(this.map, {
            style: {
                color: '#2E86AB',
                weight: 2,
                opacity: 0.7
            },
            onFeatureClick: (feature, layer, e) => {
                console.log('Rail line clicked:', feature.properties);
            },
            onDataLoaded: (data) => {
                console.log(`✅ ${data.features.length} rail features loaded and displayed`);
            }
        });

        // Load BNSF rail data
        try {
            await this.dataLayer.loadGeoJSON('data/bnsf_rail.geojson');
        } catch (error) {
            console.error('Failed to load rail data:', error);
        }
    }

    /**
     * Initialize Floating Action Button
     */
    initFAB() {
        this.fab = new FAB();
        this.fab.init();

        // Direct event handlers - no action registry needed
        const layerBtn = this.fab.getButton('layer');
        const searchBtn = this.fab.getButton('search');
        const settingsBtn = this.fab.getButton('settings');

        // Layer button - toggle attribute table
        if (layerBtn) {
            layerBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleAttributeTable();
            });
        }

        // Search button - toggle marimo panel
        if (searchBtn) {
            searchBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.toggleMarimoPanel();
            });
        }

        // Settings button - coming soon
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                console.log('Settings panel - Coming soon!');
                // Future: this.openSettings();
            });
        }
    }

    /**
     * Toggle attribute table (simplified - no abstraction layers)
     */
    async toggleAttributeTable() {
        if (!this.attributeTable) return;

        if (this.attributeTable.getIsOpen()) {
            this.attributeTable.close();
        } else {
            // Load and display in one step
            await this.attributeTable.loadFromFile('data/bnsf_rail.geojson');
            this.attributeTable.open();
        }
    }

    /**
     * Initialize Attribute Table
     */
    initAttributeTable() {
        this.attributeTable = new AttributeTable({
            map: this.map,
            dataLayer: this.dataLayer
        });
        this.attributeTable.init();
    }

    /**
     * Initialize Marimo Panel
     */
    initMarimoPanel() {
        this.marimoPanel = new MarimoPanel({
            panelId: 'marimoPanel',
            containerId: 'marimoPanelContainer',
            closeButtonId: 'closeMarimoPanel',
            resizeHandleId: 'marimoResizeHandle',
            minWidth: 300,
            maxWidth: window.innerWidth * 0.7,
            onOpen: () => {
                console.log('Marimo panel opened');
            },
            onClose: () => {
                console.log('Marimo panel closed');
            },
            onResize: (width) => {
                console.log('Marimo panel resized:', width);
            }
        });
        this.marimoPanel.init();
    }

    /**
     * Toggle Marimo panel open/closed
     */
    toggleMarimoPanel() {
        if (!this.marimoPanel) return;
        this.marimoPanel.toggle();
    }

}

// Initialize application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const app = new MapApplication();
    app.init();
});
