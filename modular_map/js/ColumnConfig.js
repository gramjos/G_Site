/**
 * ColumnConfig.js - Table Column Configuration
 * Centralized column definitions and mappings
 * Makes it easy to modify what columns are displayed and how they're labeled
 */

export class ColumnConfig {
    constructor() {
        // Column mapping: GeoJSON property name -> Display name
        this.columnMapping = {
            "FRAARCID": "Fed. Rail Assn. ID",
            "STATEAB": "State",
            "STRACNET": "Strategic Corridor",
            "COUNTRY": "Country",
            "MILES": "Miles",
            "TRACKS": "Tracks",
            "RROWNER1": "Railroad Owner 1",
            "TRKRGHTS1": "Track Rights 1",
            "DIVISION": "Divisions",
            "SUBDIV": "Subdivision"
        };
    }

    /**
     * Get all column property names (GeoJSON field names)
     * @returns {Array<string>} - Array of property names
     */
    getColumns() {
        return Object.keys(this.columnMapping);
    }

    /**
     * Get display name for a column
     * @param {string} column - Column property name
     * @returns {string} - Display name
     */
    getDisplayName(column) {
        return this.columnMapping[column] || column;
    }

    /**
     * Get the full column mapping
     * @returns {Object} - Column mapping object
     */
    getMapping() {
        return this.columnMapping;
    }

    /**
     * Get number of columns
     * @returns {number} - Column count
     */
    getColumnCount() {
        return Object.keys(this.columnMapping).length;
    }

    /**
     * Check if a column exists in the mapping
     * @param {string} column - Column property name
     * @returns {boolean} - True if column exists
     */
    hasColumn(column) {
        return column in this.columnMapping;
    }

    /**
     * Add a new column to the mapping
     * @param {string} propertyName - GeoJSON property name
     * @param {string} displayName - Display label
     */
    addColumn(propertyName, displayName) {
        this.columnMapping[propertyName] = displayName;
    }

    /**
     * Remove a column from the mapping
     * @param {string} propertyName - Column to remove
     */
    removeColumn(propertyName) {
        delete this.columnMapping[propertyName];
    }

    /**
     * Set a new column mapping (replaces existing)
     * @param {Object} mapping - New column mapping
     */
    setMapping(mapping) {
        this.columnMapping = mapping;
    }
}
