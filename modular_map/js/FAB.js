/**
 * FAB.js - Floating Action Button Module
 * Manages the cinematic FAB with reveal animation
 */

import { SettingsDialog } from './SettingsDialog.js';

export class FAB {
    constructor() {
        this.fabContainer = null;
        this.fabMain = null;
        this.subButtons = null;
        this.isActive = false;
        
        // About dialog instance
        this.aboutDialog = null;
    }

    /**
     * Initialize the FAB component
     */
    init() {
        this.fabContainer = document.getElementById('fabContainer');
        this.fabMain = document.getElementById('fabMain');
        this.subButtons = document.querySelectorAll('.fab-sub-button');

        if (!this.fabContainer || !this.fabMain) {
            console.error('FAB elements not found in DOM');
            return;
        }

        // Initialize about dialog
        this.aboutDialog = new SettingsDialog({
            onOpen: () => {
                console.log('About dialog opened from FAB');
                this.close(); // Close FAB menu when dialog opens
            },
            onClose: () => {
                console.log('About dialog closed');
            }
        });
        this.aboutDialog.init();

        this.attachEventListeners();
        console.log('FAB initialized');
    }

    /**
     * Attach event listeners to FAB elements
     */
    attachEventListeners() {
        // Main FAB toggle
        this.fabMain.addEventListener('click', (e) => {
            e.stopPropagation();
            this.toggle();
        });

        // Close FAB when clicking outside
        document.addEventListener('click', (e) => {
            if (!this.fabContainer.contains(e.target) && this.isActive) {
                this.close();
            }
        });

        // Settings button - opens about dialog
        const settingsBtn = this.getButton('settings');
        if (settingsBtn) {
            settingsBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                this.openAbout();
            });
        }
    }

    /**
     * Toggle FAB menu open/closed
     */
    toggle() {
        if (this.isActive) {
            this.close();
        } else {
            this.open();
        }
    }

    /**
     * Open FAB menu
     */
    open() {
        this.isActive = true;
        this.fabContainer.classList.add('active');
        this.fabMain.classList.add('active');
        
        this.subButtons.forEach(button => {
            button.classList.add('visible');
        });
    }

    /**
     * Close FAB menu
     */
    close() {
        this.isActive = false;
        this.fabContainer.classList.remove('active');
        this.fabMain.classList.remove('active');
        
        this.subButtons.forEach(button => {
            button.classList.remove('visible');
        });
    }

    /**
     * Get a sub-button element by action name
     * @param {string} action - The action identifier
     * @returns {Element|null} - The button element
     */
    getButton(action) {
        return document.querySelector(`[data-action="${action}"]`);
    }

    /**
     * Get current FAB state
     * @returns {boolean} - True if FAB is open
     */
    isOpen() {
        return this.isActive;
    }

    /**
     * Open about dialog
     */
    openAbout() {
        if (this.aboutDialog) {
            this.aboutDialog.open();
            console.log('About dialog opened from FAB');
        }
    }

    /**
     * Get reference to about dialog
     * @returns {SettingsDialog|null}
     */
    getAboutDialog() {
        return this.aboutDialog;
    }
}
