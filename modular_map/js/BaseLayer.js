/**
 * BaseLayer Module
 * Manages multiple base layer options for the map
 * Provides layer switching functionality
 */

export class BaseLayer {
    constructor(map) {
        this.map = map;
        this.currentLayer = null;
        this.layers = this.initializeLayers();
        this.layerControl = null;
    }

    /**
     * Initialize all available base layers
     * @returns {Object} Collection of base layer definitions
     */
    initializeLayers() {
        return {
            osm: {
                name: 'OpenStreetMap',
                layer: L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
                    maxZoom: 19
                })
            },
            osmHot: {
                name: 'OpenStreetMap HOT',
                layer: L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a>',
                    maxZoom: 19
                })
            },
            cartoDB: {
                name: 'CartoDB Positron',
                layer: L.tileLayer('https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    maxZoom: 19
                })
            },
            cartoDBDark: {
                name: 'CartoDB Dark Matter',
                layer: L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                    maxZoom: 19
                })
            },
            esriWorldImagery: {
                name: 'ESRI World Imagery',
                layer: L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
                    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community',
                    maxZoom: 18
                })
            },
            topoMap: {
                name: 'OpenTopoMap',
                layer: L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
                    attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
                    maxZoom: 17
                })
            }
        };
    }

    /**
     * Add base layer control to the map
     * Allows user to switch between different base layers
     */
    addLayerControl() {
        const baseLayers = {};
        
        // Convert layer objects to format expected by L.control.layers
        for (const [key, value] of Object.entries(this.layers)) {
            baseLayers[value.name] = value.layer;
        }

        // Add layer control to map
        this.layerControl = L.control.layers(baseLayers, null, {
            position: 'topright',
            collapsed: true
        }).addTo(this.map);

        return this.layerControl;
    }

    /**
     * Set the active base layer
     * @param {string} layerKey - Key of the layer to activate (e.g., 'osm', 'cartoDB')
     */
    setBaseLayer(layerKey = 'osm') {
        // Remove current layer if exists
        if (this.currentLayer) {
            this.map.removeLayer(this.currentLayer);
        }

        // Add new layer
        if (this.layers[layerKey]) {
            this.currentLayer = this.layers[layerKey].layer;
            this.currentLayer.addTo(this.map);
        } else {
            console.warn(`Layer ${layerKey} not found. Defaulting to OSM.`);
            this.currentLayer = this.layers.osm.layer;
            this.currentLayer.addTo(this.map);
        }

        return this.currentLayer;
    }

    /**
     * Get all available layer keys
     * @returns {Array} Array of layer keys
     */
    getAvailableLayers() {
        return Object.keys(this.layers);
    }
}
