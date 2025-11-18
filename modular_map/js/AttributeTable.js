/**
 * AttributeTable.js - Attribute Table Coordinator
 * Orchestrates TablePanel, TableRenderer, TableSearch, and DataLoader modules
 * Handles data operations and coordinates between components
 */

import { TablePanel } from './TablePanel.js';
import { TableRenderer } from './TableRenderer.js';
import { TableSearch } from './TableSearch.js';
import { ColumnConfig } from './ColumnConfig.js';
import { DataLoader } from './DataLoader.js';

export class AttributeTable {
    constructor(options = {}) {
        this.data = null;
        this.featureCountSpan = null;
        this.columnCountSpan = null;
        
        // Map and data layer references for zoom-to-feature
        this.map = options.map || null;
        this.dataLayer = options.dataLayer || null;
        this.highlightLayer = null; // Temporary highlight layer
        
        // Sort state
        this.sortColumn = null;
        this.sortDirection = 'asc'; // 'asc' or 'desc'
        
        // Initialize modules (composition over inheritance)
        this.panel = new TablePanel({
            panelId: 'attributePanel',
            containerId: 'attributeTableContainer',
            closeButtonId: 'closeAttributePanel',
            resizeHandleId: 'resizeHandle',
            minHeight: 150,
            maxHeight: window.innerHeight * 0.9,
            onOpen: () => {
                // Add class to body when panel opens
                document.body.classList.add('attribute-panel-open');
                // Set initial panel height as CSS variable
                const panel = document.getElementById('attributePanel');
                if (panel) {
                    document.documentElement.style.setProperty('--panel-height', `${panel.offsetHeight}px`);
                }
            },
            onClose: () => {
                // Remove class when panel closes
                document.body.classList.remove('attribute-panel-open');
            },
            onResize: (height) => {
                // Update CSS variable when panel is resized
                document.documentElement.style.setProperty('--panel-height', `${height}px`);
            }
        });
        
        this.columns = new ColumnConfig();
        
        this.renderer = new TableRenderer({
            maxRows: 1000,
            escapeHtmlFn: this.escapeHtml.bind(this)
        });
        
        this.search = new TableSearch({
            debounceDelay: 150,
            onSearchComplete: () => this.renderTableContent(),
            onClearSearch: () => {
                this.renderTable();
                this.search.focus();
            }
        });
        
        this.loader = new DataLoader({
            timeout: 30000,
            validateGeoJSON: true
        });
    }

    /**
     * Initialize the attribute table component
     */
    init() {
        // Initialize panel
        if (!this.panel.init()) {
            console.error('Failed to initialize panel');
            return;
        }
        
        // Get reference to stats elements
        this.featureCountSpan = document.querySelector('.feature-count');
        this.columnCountSpan = document.querySelector('.column-count');

        console.log('Attribute table initialized');
    }

    /**
     * Open the panel
     */
    open() {
        this.panel.open();
    }

    /**
     * Close the panel
     */
    close() {
        this.panel.close();
    }

    /**
     * Toggle the panel
     */
    toggle() {
        this.panel.toggle();
    }

    /**
     * Load GeoJSON from file path and display
     * @param {string} filePath - Path to GeoJSON file
     */
    async loadFromFile(filePath) {
        try {
            this.data = await this.loader.loadGeoJSON(filePath);
            this.initializeSearch();
            this.renderTable();
            
        } catch (error) {
            console.error('Error loading GeoJSON file:', error);
            this.showError(error.message);
        }
    }

    /**
     * Initialize search module with data and columns
     */
    initializeSearch() {
        const searchableColumns = this.columns.getColumns();
        
        this.search.setData(this.data);
        this.search.setIndexedColumns(searchableColumns);
        this.search.buildIndex();
    }

    /**
     * Render the complete table
     */
    renderTable() {
        const container = this.panel.getContainer();
        if (!container) return;
        
        if (!this.data || !this.data.features || this.data.features.length === 0) {
            container.innerHTML = this.renderer.renderNoData();
            return;
        }

        const features = this.getDisplayData();
        const totalFeatures = this.data.features.length;
        const columnsToDisplay = this.columns.getColumns();
        const columnMapping = this.columns.getMapping();

        // Update stats in header
        this.renderer.updateStats(
            this.featureCountSpan,
            this.columnCountSpan,
            features.length,
            this.columns.getColumnCount()
        );

        // Generate complete HTML
        const html = this.renderer.renderFullTable({
            features,
            totalFeatures,
            columnsToDisplay,
            columnMapping,
            sortColumn: this.sortColumn,
            sortDirection: this.sortDirection,
            searchHTML: this.search.generateSearchHTML(this.escapeHtml.bind(this)),
            searchNote: this.search.generateResultsNote(
                features.length,
                totalFeatures,
                this.escapeHtml.bind(this)
            )
        });

        container.innerHTML = html;
        
        // Attach event handlers
        this.attachSortHandlers(container);
        this.attachSearchHandlers(container);
        this.attachRowClickHandlers(container);
    }

    /**
     * Render only table content (preserves search input focus)
     */
    renderTableContent() {
        const container = this.panel.getContainer();
        if (!container) return;
        
        const wrapper = container.querySelector('.table-wrapper');
        if (!wrapper) return;
        
        if (!this.data || !this.data.features || this.data.features.length === 0) {
            wrapper.innerHTML = this.renderer.renderNoData();
            return;
        }

        const features = this.getDisplayData();
        const totalFeatures = this.data.features.length;
        const columnsToDisplay = this.columns.getColumns();
        const columnMapping = this.columns.getMapping();

        // Update stats
        this.renderer.updateStats(
            this.featureCountSpan,
            this.columnCountSpan,
            features.length,
            this.columns.getColumnCount()
        );

        // Render just the table (not the wrapper)
        const tableHTML = this.renderer.renderTable({
            features,
            columnsToDisplay,
            columnMapping,
            sortColumn: this.sortColumn,
            sortDirection: this.sortDirection
        });

        wrapper.innerHTML = tableHTML;
        
        // Re-attach sort handlers
        this.attachSortHandlers(container);
        this.attachRowClickHandlers(container);

        // Update search results note
        this.renderer.updateResultsNote(
            container,
            features.length,
            totalFeatures,
            this.search.getQuery()
        );

        // Update clear button
        const searchContainer = container.querySelector('.table-search');
        this.search.updateClearButton(searchContainer, () => {
            this.renderTable();
            this.search.focus();
        });
    }

    /**
     * Attach click handlers to column headers for sorting
     * @param {HTMLElement} container - Container element
     */
    attachSortHandlers(container) {
        const headers = container.querySelectorAll('th.sortable');
        headers.forEach(header => {
            header.addEventListener('click', () => {
                const column = header.getAttribute('data-column');
                this.sortByColumn(column);
            });
        });
    }

    /**
     * Attach event handlers to search input
     * @param {HTMLElement} container - Container element
     */
    attachSearchHandlers(container) {
        const searchInput = container.querySelector('#attributeSearchInput');
        const searchContainer = container.querySelector('.table-search');
        
        if (searchInput && searchContainer) {
            this.search.attachHandlers(searchInput, searchContainer);
        }
    }

    /**
     * Attach click handlers to table rows for map zoom
     * @param {HTMLElement} container - Container element
     */
    attachRowClickHandlers(container) {
        if (!this.map || !this.dataLayer) return;
        
        const rows = container.querySelectorAll('tbody tr');
        rows.forEach(row => {
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => {
                const featureIndex = parseInt(row.getAttribute('data-feature-index'));
                const features = this.getDisplayData();
                
                if (featureIndex >= 0 && featureIndex < features.length) {
                    const feature = features[featureIndex];
                    this.zoomToFeature(feature);
                }
            });
        });
    }

    /**
     * Zoom map to a specific feature
     * @param {Object} feature - GeoJSON feature object
     */
    zoomToFeature(feature) {
        if (!this.map || !feature || !feature.geometry) return;
        
        // Create temporary layer for bounds calculation
        const tempLayer = L.geoJSON(feature);
        const bounds = tempLayer.getBounds();
        
        // Zoom to feature with padding
        this.map.fitBounds(bounds, {
            padding: [100, 100],
            maxZoom: 16,
        });
        
        // Highlight the feature temporarily
        this.highlightFeature(feature, 2500); // 2.5 seconds
    }

    /**
     * Temporarily highlight a feature on the map
     * @param {Object} feature - GeoJSON feature object
     * @param {number} duration - Highlight duration in milliseconds
     */
    highlightFeature(feature, duration = 2500) {
        // Remove existing highlight layer
        if (this.highlightLayer) {
            this.map.removeLayer(this.highlightLayer);
            this.highlightLayer = null;
        }
        
        // Create highlight layer with distinctive styling
        this.highlightLayer = L.geoJSON(feature, {
            style: {
                color: '#FFD700',      // Gold
                weight: 6,
                opacity: 1,
                dashArray: '10, 10'    // Dashed line for visibility
            }
        }).addTo(this.map);
        
        // Auto-remove highlight after duration
        setTimeout(() => {
            if (this.highlightLayer) {
                this.map.removeLayer(this.highlightLayer);
                this.highlightLayer = null;
            }
        }, duration);
    }

    /**
     * Sort table by column (toggle between ascending/descending)
     * Works on filtered results if search is active, or full dataset otherwise
     * @param {string} column - The column name to sort by
     */
    sortByColumn(column) {
        if (!this.data || !this.data.features) return;

        // Toggle sort direction if clicking same column, otherwise start with ascending
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'asc';
        }

        // Create sort comparator function
        const sortComparator = (a, b) => {
            const aVal = a.properties[column];
            const bVal = b.properties[column];

            // Handle null/undefined values
            if (aVal === null || aVal === undefined) return 1;
            if (bVal === null || bVal === undefined) return -1;

            // Determine if numeric or string comparison
            const aNum = parseFloat(aVal);
            const bNum = parseFloat(bVal);
            const isNumeric = !isNaN(aNum) && !isNaN(bNum);

            let comparison = 0;
            if (isNumeric) {
                comparison = aNum - bNum;
            } else {
                comparison = String(aVal).localeCompare(String(bVal));
            }

            // Apply sort direction
            return this.sortDirection === 'asc' ? comparison : -comparison;
        };

        // Check if we have active search results
        const filteredData = this.search.getFilteredData();
        
        if (filteredData !== null) {
            // Sort only the filtered results
            filteredData.sort(sortComparator);
            console.log(`🔄 Sorted ${filteredData.length} filtered results by ${column} (${this.sortDirection})`);
        } else {
            // Sort the full dataset
            this.data.features.sort(sortComparator);
            // Rebuild search index after sorting full dataset to maintain sync
            this.search.rebuildIndex();
            console.log(`🔄 Sorted all ${this.data.features.length} features by ${column} (${this.sortDirection})`);
        }

        // Re-render table with sorted data
        this.renderTableContent();
    }

    /**
     * Get the current dataset to display (filtered or full)
     * @returns {Array} - Array of features to display
     */
    getDisplayData() {
        const filtered = this.search.getFilteredData();
        return filtered !== null ? filtered : this.data.features;
    }

    /**
     * Show error message
     * @param {string} message - Error message to display
     */
    showError(message) {
        const container = this.panel.getContainer();
        if (!container) return;
        
        container.innerHTML = this.renderer.renderError(message);
    }

    /**
     * Escape HTML to prevent XSS
     * @param {string} str - String to escape
     * @returns {string} - Escaped string
     */
    escapeHtml(str) {
        return this.renderer.escapeHtml(str);
    }

    /**
     * Clear the table
     */
    clear() {
        const container = this.panel.getContainer();
        if (container) {
            container.innerHTML = '';
        }
        this.data = null;
    }

    /**
     * Get current state
     * @returns {boolean} - True if panel is open
     */
    getIsOpen() {
        return this.panel.getIsOpen();
    }
}
