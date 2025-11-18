/**
 * TableRenderer.js - Table HTML Rendering Module
 * Pure rendering logic - converts data into HTML
 * No state management, just transformation functions
 */

export class TableRenderer {
    constructor(options = {}) {
        this.maxRows = options.maxRows || 1000;
        this.escapeHtmlFn = options.escapeHtmlFn || this.escapeHtml.bind(this);
    }

    /**
     * Render complete table HTML (search + table + notes)
     * @param {Object} params - Rendering parameters
     * @returns {string} - Complete HTML string
     */
    renderFullTable(params) {
        const {
            features,
            totalFeatures,
            columnsToDisplay,
            columnMapping,
            sortColumn,
            sortDirection,
            searchHTML,
            searchNote
        } = params;

        let html = searchHTML || '';
        
        html += `
            <div class="table-wrapper">
                ${this.renderTable({
                    features,
                    columnsToDisplay,
                    columnMapping,
                    sortColumn,
                    sortDirection
                })}
            </div>
        `;

        // Add search note or row limit note
        if (searchNote) {
            html += searchNote;
        } else if (features.length > this.maxRows) {
            html += `<p class="table-note">Showing first ${this.maxRows} of ${features.length} features</p>`;
        }

        return html;
    }

    /**
     * Render just the table element (no wrapper, no search)
     * @param {Object} params - Rendering parameters
     * @returns {string} - Table HTML string
     */
    renderTable(params) {
        const {
            features,
            columnsToDisplay,
            columnMapping,
            sortColumn,
            sortDirection
        } = params;

        let html = `
            <table class="attribute-table">
                <thead>
                    <tr>
                        <th class="row-number">#</th>
                        ${this.renderHeaderCells({
                            columnsToDisplay,
                            columnMapping,
                            sortColumn,
                            sortDirection
                        })}
                    </tr>
                </thead>
                <tbody>
                    ${this.renderTableRows(features, columnsToDisplay)}
                </tbody>
            </table>
        `;

        return html;
    }

    /**
     * Render table header cells
     * @param {Object} params - Header parameters
     * @returns {string} - Header cells HTML
     */
    renderHeaderCells(params) {
        const { columnsToDisplay, columnMapping, sortColumn, sortDirection } = params;

        return columnsToDisplay.map(originalCol => {
            const displayName = columnMapping[originalCol];
            const isSorted = sortColumn === originalCol;
            const sortIndicator = isSorted 
                ? (sortDirection === 'asc' ? ' ▴' : ' ▾')
                : '';
            const sortedClass = isSorted ? 'sorted' : '';
            
            return `<th class="sortable ${sortedClass}" data-column="${originalCol}">${this.escapeHtmlFn(displayName)}${sortIndicator}</th>`;
        }).join('');
    }

    /**
     * Render table body rows
     * @param {Array} features - Feature array
     * @param {Array} columnsToDisplay - Column names to display
     * @returns {string} - Table rows HTML
     */
    renderTableRows(features, columnsToDisplay) {
        const maxRows = Math.min(features.length, this.maxRows);
        let html = '';

        for (let i = 0; i < maxRows; i++) {
            const props = features[i].properties || {};
            html += `
                <tr data-feature-index="${i}">
                    <td class="row-number">${i + 1}</td>
                    ${this.renderRowCells(props, columnsToDisplay)}
                </tr>
            `;
        }

        return html;
    }

    /**
     * Render cells for a single row
     * @param {Object} properties - Feature properties
     * @param {Array} columnsToDisplay - Column names
     * @returns {string} - Row cells HTML
     */
    renderRowCells(properties, columnsToDisplay) {
        return columnsToDisplay.map(col => {
            const value = properties[col];
            const displayValue = value !== null && value !== undefined ? value : '';
            return `<td>${this.escapeHtmlFn(String(displayValue))}</td>`;
        }).join('');
    }

    /**
     * Generate "no data" message HTML
     * @returns {string} - No data HTML
     */
    renderNoData() {
        return '<p class="no-data">No data available</p>';
    }

    /**
     * Generate error message HTML
     * @param {string} message - Error message
     * @returns {string} - Error HTML
     */
    renderError(message) {
        return `<p class="error-message">${this.escapeHtmlFn(message)}</p>`;
    }

    /**
     * Generate search results note element (dynamic update)
     * @param {HTMLElement} container - Parent container
     * @param {number} filteredCount - Number of filtered features
     * @param {number} totalCount - Total number of features
     * @param {string} query - Search query
     */
    updateResultsNote(container, filteredCount, totalCount, query) {
        if (!container) return;

        let noteElement = container.querySelector('.table-note');
        
        if (query && filteredCount !== totalCount) {
            const noteHTML = `Found ${filteredCount} of ${totalCount} features matching "${this.escapeHtmlFn(query)}"`;
            if (noteElement) {
                noteElement.className = 'table-note search-results';
                noteElement.textContent = noteHTML;
            } else {
                noteElement = document.createElement('p');
                noteElement.className = 'table-note search-results';
                noteElement.textContent = noteHTML;
                container.appendChild(noteElement);
            }
        } else if (filteredCount > this.maxRows) {
            const noteHTML = `Showing first ${this.maxRows} of ${filteredCount} features`;
            if (noteElement) {
                noteElement.className = 'table-note';
                noteElement.textContent = noteHTML;
            } else {
                noteElement = document.createElement('p');
                noteElement.className = 'table-note';
                noteElement.textContent = noteHTML;
                container.appendChild(noteElement);
            }
        } else if (noteElement) {
            // Remove note if no longer needed
            noteElement.remove();
        }
    }

    /**
     * Update stats display (feature count, column count)
     * @param {HTMLElement} featureCountSpan - Feature count element
     * @param {HTMLElement} columnCountSpan - Column count element
     * @param {number} featureCount - Number of features
     * @param {number} columnCount - Number of columns
     */
    updateStats(featureCountSpan, columnCountSpan, featureCount, columnCount) {
        if (featureCountSpan) {
            featureCountSpan.textContent = featureCount;
        }
        if (columnCountSpan) {
            columnCountSpan.textContent = columnCount;
        }
    }

    /**
     * Escape HTML to prevent XSS attacks
     * @param {string} str - String to escape
     * @returns {string} - Escaped string
     */
    escapeHtml(str) {
        const div = document.createElement('div');
        div.textContent = str;
        return div.innerHTML;
    }

    /**
     * Set maximum rows to display
     * @param {number} maxRows - Maximum number of rows
     */
    setMaxRows(maxRows) {
        this.maxRows = maxRows;
    }

    /**
     * Get current max rows setting
     * @returns {number} - Max rows
     */
    getMaxRows() {
        return this.maxRows;
    }
}
