/**
 * MarimoPanel.js - Marimo WASM Notebook Panel Manager
 * Manages the left-side panel with embedded WASM-powered Marimo notebook
 * 
 * The notebook runs Python code in the browser via WebAssembly (Pyodide).
 * No server required - works on GitHub Pages!
 */

export class MarimoPanel {
    constructor(options = {}) {
        this.panelId = options.panelId || 'marimoPanel';
        this.containerId = options.containerId || 'marimoPanelContainer';
        this.closeButtonId = options.closeButtonId || 'closeMarimoPanel';
        this.resizeHandleId = options.resizeHandleId || 'marimoResizeHandle';
        this.frameId = options.frameId || 'marimoFrame';
        
        // Panel state
        this.isOpen = false;
        
        // Resize state
        this.isResizing = false;
        this.startX = 0;
        this.startWidth = 0;
        this.minWidth = options.minWidth || 300;
        this.maxWidth = options.maxWidth || window.innerWidth * 0.7;
        
        // DOM references
        this.panel = null;
        this.container = null;
        this.closeButton = null;
        this.resizeHandle = null;
        this.iframe = null;
        
        // Callbacks
        this.onOpen = options.onOpen || null;
        this.onClose = options.onClose || null;
        this.onResize = options.onResize || null;
    }

    /**
     * Initialize the panel component
     */
    init() {
        this.panel = document.getElementById(this.panelId);
        this.container = document.getElementById(this.containerId);
        this.closeButton = document.getElementById(this.closeButtonId);
        this.resizeHandle = document.getElementById(this.resizeHandleId);
        this.iframe = document.getElementById(this.frameId);

        if (!this.panel || !this.container) {
            console.error('Marimo panel elements not found in DOM');
            return false;
        }

        this.attachEventListeners();
        console.log('Marimo panel initialized');
        return true;
    }

    /**
     * Attach event listeners
     */
    attachEventListeners() {
        // Close button
        if (this.closeButton) {
            this.closeButton.addEventListener('click', () => {
                this.close();
            });
        }

        // Close on Escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && this.isOpen) {
                this.close();
            }
        });

        // Resize handle events
        if (this.resizeHandle) {
            this.resizeHandle.addEventListener('mousedown', (e) => {
                this.startResize(e);
            });
        }

        // Global mouse events for resizing
        document.addEventListener('mousemove', (e) => {
            this.handleResize(e);
        });

        document.addEventListener('mouseup', () => {
            this.stopResize();
        });

        // Update max width on window resize
        window.addEventListener('resize', () => {
            this.maxWidth = window.innerWidth * 0.7;
            if (this.panel) {
                const currentWidth = this.panel.offsetWidth;
                if (currentWidth > this.maxWidth) { this.panel.style.width = this.maxWidth + 'px';
                }
            }
        });
    }

    /**
     * Start resizing the panel
     * @param {MouseEvent} e - Mouse event
     */
    startResize(e) {
        this.isResizing = true;
        this.startX = e.clientX;
        this.startWidth = this.panel.offsetWidth;
        
        // Disable transitions during resize for smooth dragging
        this.panel.style.transition = 'none';
        
        // Prevent text selection during drag
        e.preventDefault();
    }

    /**
     * Handle panel resize while dragging
     * @param {MouseEvent} e - Mouse event
     */
    handleResize(e) {
        if (!this.isResizing) return;

        // Calculate new width (mouse moves right = increase width, left = decrease)
        const deltaX = e.clientX - this.startX;
        let newWidth = this.startWidth + deltaX;

        // Constrain to min/max bounds
        newWidth = Math.max(this.minWidth, Math.min(newWidth, this.maxWidth));

        // Apply new width
        this.panel.style.width = newWidth + 'px';
        
        // Update CSS variable for Leaflet controls
        document.documentElement.style.setProperty('--marimo-panel-width', `${newWidth}px`);
        
        // Notify callback if provided
        if (this.onResize) {
            this.onResize(newWidth);
        }
    }

    /**
     * Stop resizing the panel
     */
    stopResize() {
        if (!this.isResizing) return;
        
        this.isResizing = false;
        
        // Re-enable transitions
        this.panel.style.transition = '';
    }

    /**
     * Open the panel
     */
    async open() {
        if (!this.panel) return;

        this.isOpen = true;
        this.panel.classList.add('open');
        document.body.classList.add('marimo-panel-open');
        
        // Set initial panel width as CSS variable for Leaflet controls
        if (this.panel) {
            document.documentElement.style.setProperty('--marimo-panel-width', `${this.panel.offsetWidth}px`);
        }
        
        console.log('Marimo WASM panel opened');
        
        if (this.onOpen) {
            this.onOpen();
        }
    }

    /**
     * Close the panel
     */
    close() {
        if (!this.panel) return;
        
        this.isOpen = false;
        this.panel.classList.remove('open');
        document.body.classList.remove('marimo-panel-open');
        
        console.log('Marimo panel closed');
        
        if (this.onClose) {
            this.onClose();
        }
    }

    /**
     * Toggle the panel open/closed
     */
    toggle() {
        if (this.isOpen) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Get current panel state
     * @returns {boolean} - True if panel is open
     */
    getIsOpen() {
        return this.isOpen;
    }
}
