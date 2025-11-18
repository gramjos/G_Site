/**
 * DataLoader.js - Data Loading Utility
 * Reusable module for loading GeoJSON and other data formats
 * Handles fetch, validation, and error handling
 */

export class DataLoader {
    constructor(options = {}) {
        this.timeout = options.timeout || 30000; // 30 seconds default
        this.validateGeoJSON = options.validateGeoJSON !== false; // Default true
    }

    /**
     * Load GeoJSON from a file path
     * @param {string} filePath - Path to GeoJSON file
     * @returns {Promise<Object>} - GeoJSON FeatureCollection
     */
    async loadGeoJSON(filePath) {
        try {
            const response = await this.fetchWithTimeout(filePath, this.timeout);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            
            if (this.validateGeoJSON) {
                this.validateGeoJSONData(data);
            }
            
            console.log(`✅ Loaded GeoJSON: ${data.features?.length || 0} features from ${filePath}`);
            return data;
            
        } catch (error) {
            console.error('❌ Error loading GeoJSON:', error);
            throw new Error(`Failed to load GeoJSON from ${filePath}: ${error.message}`);
        }
    }

    /**
     * Fetch with timeout
     * @param {string} url - URL to fetch
     * @param {number} timeout - Timeout in milliseconds
     * @returns {Promise<Response>} - Fetch response
     */
    async fetchWithTimeout(url, timeout) {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), timeout);
        
        try {
            const response = await fetch(url, {
                signal: controller.signal
            });
            clearTimeout(timeoutId);
            return response;
        } catch (error) {
            clearTimeout(timeoutId);
            if (error.name === 'AbortError') {
                throw new Error(`Request timeout after ${timeout}ms`);
            }
            throw error;
        }
    }

    /**
     * Validate GeoJSON structure
     * @param {Object} data - GeoJSON data to validate
     * @throws {Error} - If validation fails
     */
    validateGeoJSONData(data) {
        if (!data) {
            throw new Error('Data is null or undefined');
        }
        
        if (typeof data !== 'object') {
            throw new Error('Data is not an object');
        }
        
        if (data.type !== 'FeatureCollection') {
            throw new Error(`Invalid GeoJSON type: ${data.type}. Expected FeatureCollection`);
        }
        
        if (!Array.isArray(data.features)) {
            throw new Error('GeoJSON FeatureCollection must have a features array');
        }
        
        if (data.features.length === 0) {
            console.warn('⚠️ GeoJSON FeatureCollection is empty (0 features)');
        }
    }

    /**
     * Load JSON from a file path (generic)
     * @param {string} filePath - Path to JSON file
     * @returns {Promise<Object>} - JSON data
     */
    async loadJSON(filePath) {
        try {
            const response = await this.fetchWithTimeout(filePath, this.timeout);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const data = await response.json();
            console.log(`✅ Loaded JSON from ${filePath}`);
            return data;
            
        } catch (error) {
            console.error('❌ Error loading JSON:', error);
            throw new Error(`Failed to load JSON from ${filePath}: ${error.message}`);
        }
    }

    /**
     * Load text file
     * @param {string} filePath - Path to text file
     * @returns {Promise<string>} - File content as string
     */
    async loadText(filePath) {
        try {
            const response = await this.fetchWithTimeout(filePath, this.timeout);
            
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            
            const text = await response.text();
            console.log(`✅ Loaded text from ${filePath}`);
            return text;
            
        } catch (error) {
            console.error('❌ Error loading text:', error);
            throw new Error(`Failed to load text from ${filePath}: ${error.message}`);
        }
    }

    /**
     * Load CSV and parse to array of objects
     * @param {string} filePath - Path to CSV file
     * @param {Object} options - Parsing options
     * @returns {Promise<Array>} - Array of row objects
     */
    async loadCSV(filePath, options = {}) {
        const delimiter = options.delimiter || ',';
        const hasHeader = options.hasHeader !== false; // Default true
        
        try {
            const text = await this.loadText(filePath);
            const lines = text.split('\n').filter(line => line.trim());
            
            if (lines.length === 0) {
                return [];
            }
            
            let headers;
            let dataStartIndex = 0;
            
            if (hasHeader) {
                headers = lines[0].split(delimiter).map(h => h.trim());
                dataStartIndex = 1;
            } else {
                // Generate generic headers
                const firstRow = lines[0].split(delimiter);
                headers = firstRow.map((_, i) => `column_${i}`);
            }
            
            const data = [];
            for (let i = dataStartIndex; i < lines.length; i++) {
                const values = lines[i].split(delimiter).map(v => v.trim());
                const row = {};
                headers.forEach((header, index) => {
                    row[header] = values[index] || '';
                });
                data.push(row);
            }
            
            console.log(`✅ Loaded CSV: ${data.length} rows from ${filePath}`);
            return data;
            
        } catch (error) {
            console.error('❌ Error loading CSV:', error);
            throw new Error(`Failed to load CSV from ${filePath}: ${error.message}`);
        }
    }

    /**
     * Set timeout for requests
     * @param {number} timeout - Timeout in milliseconds
     */
    setTimeout(timeout) {
        this.timeout = timeout;
    }

    /**
     * Get current timeout setting
     * @returns {number} - Timeout in milliseconds
     */
    getTimeout() {
        return this.timeout;
    }
}
