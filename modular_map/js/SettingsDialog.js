/**
 * SettingsDialog.js - Simple About/Info Dialog Module
 * Creates a clean, professional information dialog
 */

export class SettingsDialog {
    constructor(options = {}) {
        this.isOpen = false;
        this.onOpen = options.onOpen || null;
        this.onClose = options.onClose || null;
        
        // Dialog elements
        this.wrapper = null;
        this.dialog = null;
        this.closeButton = null;
    }

    /**
     * Initialize the dialog and inject into DOM
     */
    init() {
        this.createDialog();
        this.attachEventListeners();
        console.log('About Dialog initialized');
    }

    /**
     * Create and inject dialog HTML into the DOM
     */
    createDialog() {
        // Create wrapper
        this.wrapper = document.createElement('div');
        this.wrapper.className = 'about-dialog-wrapper';
        this.wrapper.style.display = 'none';

        // Create backdrop
        const backdrop = document.createElement('div');
        backdrop.className = 'about-backdrop';
        
        // Create the dialog
        this.dialog = document.createElement('div');
        this.dialog.className = 'about-dialog';
        this.dialog.innerHTML = this.generateDialogContent();

        // Assemble
        this.wrapper.appendChild(backdrop);
        this.wrapper.appendChild(this.dialog);
        document.body.appendChild(this.wrapper);

        // Get close button reference
        this.closeButton = this.dialog.querySelector('.about-close-btn');
    }

    /**
     * Generate the dialog content HTML
     * @returns {string} HTML content for the dialog
     */
    generateDialogContent() {
        return `
            <div class="about-header">
                <h2>ℹ️ About This Project</h2>
                <button class="about-close-btn" aria-label="Close">×</button>
            </div>
            <div class="about-content">
                <!-- Developer Profile Section -->
                <div class="about-profile">
                    <div class="profile-image-container">
                        <img src="assets/pro_pic.jpg" alt="Developer Profile" class="profile-image">
                    </div>
                    <div class="profile-info">
                        <h3>Developer</h3>
                        <p class="profile-name">Joshua Grams</p>
                        <a href="https://github.com/gramjos" target="_blank" rel="noopener noreferrer" class="github-link">
                            <img src="assets/Github-Logo-No-Background.webp" alt="GitHub" class="github-logo">
                            <span>github.com/gramjos</span>
                        </a>
                    </div>
                </div>

                <div class="about-divider"></div>

                <!-- Project Information -->
                <div class="about-section">
                    <h3>📊 Project Overview</h3>
                    <p><strong>Modular Map Application</strong></p>
                    <p>An exploratory data analysis tool for visualizing geospatial freight transportation networks.</p>
                    <p class="about-version">Version 1.0.0 • October 2025</p>
                </div>

                <!-- Data Sources Section -->
                <div class="about-section">
                    <h3>🗂️ Data Sources</h3>
                    
                    <div class="data-source">
                        <h4>BNSF Rail Network</h4>
                        <p>North American Rail Network Lines (BNSF)</p>
                        <p class="data-citation">
                            Source: <a href="https://data-usdot.opendata.arcgis.com/datasets/usdot::north-american-rail-network-lines/about" 
                                     target="_blank" rel="noopener noreferrer">
                                U.S. Department of Transportation - National Transportation Atlas Database (NTAD)
                            </a>
                        </p>
                        <p class="data-details">
                            <strong>Features:</strong> 21,004 rail line segments<br>
                            <strong>Operator:</strong> BNSF Railway Company<br>
                            <strong>Coverage:</strong> Western and Midwestern United States
                        </p>
                    </div>

                    <div class="data-source">
                        <h4>FAF5 Freight Data</h4>
                        <p>Freight Analysis Framework (FAF5.7.1)</p>
                        <p class="data-citation">
                            Source: <a href="https://www.bts.gov/faf" 
                                     target="_blank" rel="noopener noreferrer">
                                U.S. Bureau of Transportation Statistics (BTS)
                            </a>
                        </p>
                        <p class="data-details">
                            <strong>Version:</strong> 5.7.1<br>
                            <strong>Purpose:</strong> Freight flow analysis between regions<br>
                            <strong>Coverage:</strong> Commodity movements by mode and geography
                        </p>
                    </div>
                </div>

                <!-- Technology Stack -->
                <div class="about-section">
                    <h3>🛠️ Built With</h3>
                    <ul class="tech-list">
                        <li><strong>Leaflet.js</strong> - Interactive mapping library</li>
                        <li><strong>Vanilla JavaScript</strong> - ES6 modules, no frameworks</li>
                        <li><strong>GeoJSON</strong> - Spatial data format</li>
                        <li><strong>Modular Architecture</strong> - Clean separation of concerns</li>
                    </ul>
                </div>

                <!-- Footer -->
                <div class="about-footer">
                    <p>Built with ❤️ for transportation analysis and visualization</p>
                </div>
            </div>
        `;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Close button
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => this.close());
        }

        // Close on backdrop click
        const backdrop = this.wrapper.querySelector('.about-backdrop');
        if (backdrop) {
            backdrop.addEventListener('click', () => this.close());
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Prevent dialog clicks from closing
        if (this.dialog) {
            this.dialog.addEventListener('click', (e) => {
                e.stopPropagation();
            });
        }
    }

    /**
     * Open the dialog with fade-in
     */
    open() {
        if (this.isOpen) return;

        this.isOpen = true;
        this.wrapper.style.display = 'flex';

        // Force reflow
        this.wrapper.offsetHeight;

        // Trigger animation
        requestAnimationFrame(() => {
            this.wrapper.classList.add('active');
        });

        // Callback
        if (this.onOpen) {
            this.onOpen();
        }

        console.log('About dialog opened');
    }

    /**
     * Close the dialog with fade-out
     */
    close() {
        if (!this.isOpen) return;

        this.wrapper.classList.remove('active');

        // Wait for animation to complete
        setTimeout(() => {
            this.isOpen = false;
            this.wrapper.style.display = 'none';
        }, 300);

        // Callback
        if (this.onClose) {
            this.onClose();
        }

        console.log('About dialog closed');
    }

    /**
     * Toggle dialog open/closed
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Get current open state
     * @returns {boolean}
     */
    getIsOpen() {
        return this.isOpen;
    }

    /**
     * Destroy the dialog and remove from DOM
     */
    destroy() {
        if (this.wrapper && this.wrapper.parentNode) {
            this.wrapper.parentNode.removeChild(this.wrapper);
        }
        this.isOpen = false;
        console.log('About dialog destroyed');
    }
}
