/**
 * TablePanel.js - Sliding Panel UI Component
 * Manages panel open/close/resize behavior independently of content
 * Reusable for any sliding panel UI
 */

export class TablePanel {
    constructor(options = {}) {
        // Panel elements
        this.panelId = options.panelId || 'attributePanel';
        this.containerId = options.containerId || 'attributeTableContainer';
        this.closeButtonId = options.closeButtonId || 'closeAttributePanel';
        this.resizeHandleId = options.resizeHandleId || 'resizeHandle';
        
        // DOM references
        this.panel = null;
        this.container = null;
        this.closeButton = null;
        this.resizeHandle = null;
        
        // Panel state
        this.isOpen = false;
        
        // Resize state
        this.isResizing = false;
        this.startY = 0;
        this.startHeight = 0;
        this.minHeight = options.minHeight || 150;
        this.maxHeight = options.maxHeight || window.innerHeight * 0.9;
        
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

        if (!this.panel || !this.container) {
            console.error('Panel elements not found in DOM');
            return false;
        }

        this.attachEventListeners();
        console.log('Panel initialized');
        return true;
    }

    /**
     * Attach event listeners for panel interactions
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

        // Update max height on window resize
        window.addEventListener('resize', () => {
            this.maxHeight = window.innerHeight * 0.9;
            if (this.panel) {
                const currentHeight = this.panel.offsetHeight;
                if (currentHeight > this.maxHeight) {
                    this.panel.style.height = this.maxHeight + 'px';
                }
            }
        });
    }

    /**
     * Open the panel
     */
    open() {
        if (!this.panel) return;
        
        this.isOpen = true;
        this.panel.classList.add('open');
        console.log('Panel opened');
        
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
        console.log('Panel closed');
        
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
     * Start resizing the panel
     * @param {MouseEvent} e - Mouse event
     */
    startResize(e) {
        this.isResizing = true;
        this.startY = e.clientY;
        this.startHeight = this.panel.offsetHeight;
        
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

        // Calculate new height (mouse moves up = increase height, down = decrease)
        const deltaY = this.startY - e.clientY;
        let newHeight = this.startHeight + deltaY;

        // Constrain to min/max bounds
        newHeight = Math.max(this.minHeight, Math.min(newHeight, this.maxHeight));

        // Apply new height
        this.panel.style.height = newHeight + 'px';
        
        // Notify callback if provided
        if (this.onResize) {
            this.onResize(newHeight);
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
     * Get the container element (for content injection)
     * @returns {HTMLElement} - Container element
     */
    getContainer() {
        return this.container;
    }

    /**
     * Get current panel state
     * @returns {boolean} - True if panel is open
     */
    getIsOpen() {
        return this.isOpen;
    }

    /**
     * Set panel height programmatically
     * @param {number} height - Height in pixels
     */
    setHeight(height) {
        if (!this.panel) return;
        
        const constrainedHeight = Math.max(
            this.minHeight, 
            Math.min(height, this.maxHeight)
        );
        
        this.panel.style.height = constrainedHeight + 'px';
    }

    /**
     * Get current panel height
     * @returns {number} - Panel height in pixels
     */
    getHeight() {
        return this.panel ? this.panel.offsetHeight : 0;
    }
}
