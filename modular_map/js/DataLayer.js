/**
 * DataLayer.js - GeoJSON Data Layer Module
 * Handles loading and displaying GeoJSON data on the map
 */

export class DataLayer {
    constructor(map, options = {}) {
        this.map = map;
        this.dataLayer = null;
        this.data = null;
        
        // Styling options
        this.defaultStyle = options.style || {
            color: '#2E86AB',       // BNSF-inspired blue
            weight: 2,
            opacity: 0.7
        };
        
        this.highlightStyle = options.highlightStyle || {
            color: '#F24236',       // Red for highlight
            weight: 4,
            opacity: 1
        };
        
        // Callbacks
        this.onFeatureClick = options.onFeatureClick || null;
        this.onDataLoaded = options.onDataLoaded || null;
    }

    /**
     * Load GeoJSON data from a file
     * @param {string} filePath - Path to GeoJSON file
     */
    async loadGeoJSON(filePath) {
        try {
            console.log(`📡 Loading GeoJSON from: ${filePath}`);
            const startTime = performance.now();
            
            const response = await fetch(filePath);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            
            this.data = await response.json();
            
            const endTime = performance.now();
            console.log(`✅ GeoJSON loaded in ${(endTime - startTime).toFixed(2)}ms`);
            console.log(`📊 Features: ${this.data.features?.length || 0}`);
            
            // Add to map
            this.addToMap();
            
            // Zoom to data bounds
            this.fitBounds();
            
            // Callback
            if (this.onDataLoaded) {
                this.onDataLoaded(this.data);
            }
            
            return this.data;
            
        } catch (error) {
            console.error('❌ Error loading GeoJSON:', error);
            throw error;
        }
    }

    /**
     * Add GeoJSON data to the map
     */
    addToMap() {
        if (!this.data) {
            console.warn('No data to add to map');
            return;
        }

        // Remove existing layer if present
        this.removeFromMap();

        // Create GeoJSON layer with custom styling and interactions
        this.dataLayer = L.geoJSON(this.data, {
            style: (feature) => this.getFeatureStyle(feature),
            onEachFeature: (feature, layer) => this.onEachFeature(feature, layer)
        });

        // Add to map
        this.dataLayer.addTo(this.map);
        
        console.log('✅ Data layer added to map');
    }

    /**
     * Get style for a feature
     * @param {Object} feature - GeoJSON feature
     * @returns {Object} Leaflet path options
     */
    getFeatureStyle(feature) {
        // Custom styling based on properties
        const props = feature.properties;
        
        // Example: Color by STRACNET designation
        if (props.STRACNET === 'S') {
            return {
                ...this.defaultStyle,
                color: '#2E86AB',  // Blue for STRACNET
                weight: 3
            };
        } else if (props.STRACNET === 'C') {
            return {
                ...this.defaultStyle,
                color: '#A23B72',  // Purple for Connector
                weight: 2
            };
        }
        
        return this.defaultStyle;
    }

    /**
     * Attach interactions to each feature
     * @param {Object} feature - GeoJSON feature
     * @param {L.Layer} layer - Leaflet layer
     */
    onEachFeature(feature, layer) {
        const props = feature.properties;
        
        // Create popup content
        const popupContent = this.createPopupContent(props);
        layer.bindPopup(popupContent);
        
        // Tooltip on hover
        const tooltipContent = this.createTooltipContent(props);
        if (tooltipContent) {
            layer.bindTooltip(tooltipContent, {
                permanent: false,
                direction: 'top',
                className: 'rail-tooltip'
            });
        }
        
        // Highlight on mouseover
        layer.on('mouseover', (e) => {
            e.target.setStyle(this.highlightStyle);
        });
        
        layer.on('mouseout', (e) => {
            this.dataLayer.resetStyle(e.target);
        });
        
        // Click event
        layer.on('click', (e) => {
            if (this.onFeatureClick) {
                this.onFeatureClick(feature, layer, e);
            }
        });
    }

    /**
     * Create popup content HTML
     * @param {Object} props - Feature properties
     * @returns {string} HTML string
     */
    createPopupContent(props) {
        return `
            <div class="rail-popup">
                <h3>🚂 BNSF Rail Line</h3>
                <table>
                    <tr>
                        <td><strong>FRA ID:</strong></td>
                        <td>${props.FRAARCID || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td><strong>State:</strong></td>
                        <td>${props.STATEAB || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td><strong>Network:</strong></td>
                        <td>${props.STRACNET === 'S' ? 'STRACNET' : props.STRACNET === 'C' ? 'Connector' : 'N/A'}</td>
                    </tr>
                    <tr>
                        <td><strong>Railroad:</strong></td>
                        <td>${props.RROWNER1 || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td><strong>Track Type:</strong></td>
                        <td>${props.TRACKS || 'N/A'}</td>
                    </tr>
                    <tr>
                        <td><strong>Subdivision:</strong></td>
                        <td>${props.SUBDIV || 'N/A'}</td>
                    </tr>
                </table>
            </div>
        `;
    }

    /**
     * Create tooltip content (brief info on hover)
     * @param {Object} props - Feature properties
     * @returns {string} HTML string
     */
    createTooltipContent(props) {
        const network = props.STRACNET === 'S' ? 'STRACNET' : 
                       props.STRACNET === 'C' ? 'Connector' : 'Rail';
        const state = props.STATEAB || 'Unknown';
        return `${network} Line - ${state}`;
    }

    /**
     * Zoom map to fit data bounds
     */
    fitBounds() {
        if (this.dataLayer) {
            const bounds = this.dataLayer.getBounds();
            if (bounds.isValid()) {
                this.map.fitBounds(bounds, {
                    padding: [50, 50],
                    maxZoom: 10
                });
                console.log('🗺️ Map fitted to data bounds');
            }
        }
    }

    /**
     * Remove data layer from map
     */
    removeFromMap() {
        if (this.dataLayer) {
            this.map.removeLayer(this.dataLayer);
            this.dataLayer = null;
            console.log('Data layer removed from map');
        }
    }

    /**
     * Toggle layer visibility
     */
    toggleVisibility() {
        if (this.dataLayer) {
            if (this.map.hasLayer(this.dataLayer)) {
                this.removeFromMap();
            } else {
                this.dataLayer.addTo(this.map);
            }
        }
    }

    /**
     * Update layer style
     * @param {Object} newStyle - New style options
     */
    updateStyle(newStyle) {
        this.defaultStyle = { ...this.defaultStyle, ...newStyle };
        if (this.dataLayer) {
            this.dataLayer.setStyle(this.defaultStyle);
        }
    }

    /**
     * Get feature count
     * @returns {number}
     */
    getFeatureCount() {
        return this.data?.features?.length || 0;
    }

    /**
     * Get data layer reference
     * @returns {L.GeoJSON}
     */
    getLayer() {
        return this.dataLayer;
    }

    /**
     * Get raw data
     * @returns {Object}
     */
    getData() {
        return this.data;
    }

    /**
     * Check if data is loaded
     * @returns {boolean}
     */
    isLoaded() {
        return this.data !== null;
    }
}
