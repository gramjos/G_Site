/**
 * Excalidraw Utilities
 * 
 * This module handles the loading and rendering of Excalidraw diagrams
 * embedded in markdown content.
 */

// Track whether Excalidraw libraries have been loaded
let excalidrawLibrariesLoaded = false;
let excalidrawLoadPromise = null;

/**
 * Load the Excalidraw libraries (React and Excalidraw) dynamically
 * @returns {Promise<void>}
 */
async function loadExcalidrawLibraries() {
  if (excalidrawLibrariesLoaded) {
    return Promise.resolve();
  }

  if (excalidrawLoadPromise) {
    return excalidrawLoadPromise;
  }

  excalidrawLoadPromise = new Promise((resolve, reject) => {
    // Load React
    const reactScript = document.createElement('script');
    reactScript.src = 'https://unpkg.com/react@18/umd/react.production.min.js';
    reactScript.crossOrigin = 'anonymous';
    
    reactScript.onload = () => {
      // Load ReactDOM
      const reactDOMScript = document.createElement('script');
      reactDOMScript.src = 'https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';
      reactDOMScript.crossOrigin = 'anonymous';
      
      reactDOMScript.onload = () => {
        // Load Excalidraw
        const excalidrawScript = document.createElement('script');
        excalidrawScript.src = 'https://unpkg.com/@excalidraw/excalidraw@0.17.6/dist/excalidraw.production.min.js';
        excalidrawScript.crossOrigin = 'anonymous';
        
        excalidrawScript.onload = () => {
          excalidrawLibrariesLoaded = true;
          resolve();
        };
        
        excalidrawScript.onerror = () => reject(new Error('Failed to load Excalidraw'));
        document.head.appendChild(excalidrawScript);
      };
      
      reactDOMScript.onerror = () => reject(new Error('Failed to load ReactDOM'));
      document.head.appendChild(reactDOMScript);
    };
    
    reactScript.onerror = () => reject(new Error('Failed to load React'));
    document.head.appendChild(reactScript);
  });

  return excalidrawLoadPromise;
}

/**
 * Load an Excalidraw file from the given path
 * @param {string} path - The path to the .excalidraw file
 * @returns {Promise<Object>} The Excalidraw data
 */
async function loadExcalidrawFile(path) {
  try {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to load Excalidraw file: ${response.statusText}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error loading Excalidraw file:', error);
    throw error;
  }
}

/**
 * Render an Excalidraw diagram into a container
 * @param {HTMLElement} container - The container element
 * @param {string} excalidrawPath - The path to the .excalidraw file
 */
async function renderExcalidraw(container, excalidrawPath) {
  try {
    // Load libraries if not already loaded
    await loadExcalidrawLibraries();
    
    // Load the Excalidraw data
    const excalidrawData = await loadExcalidrawFile(excalidrawPath);
    
    // Clear the loading message
    container.innerHTML = '';
    
    // Add some basic styling to the container
    container.style.width = '100%';
    container.style.height = '600px';
    container.style.border = '1px solid #e0e0e0';
    container.style.borderRadius = '4px';
    container.style.overflow = 'hidden';
    
    // Get the Excalidraw component from the global ExcalidrawLib
    const Excalidraw = window.ExcalidrawLib.Excalidraw;
    
    // Create Excalidraw component with initial data and API callback
    const excalidrawElement = React.createElement(Excalidraw, {
      initialData: {
        elements: excalidrawData.elements || [],
        appState: excalidrawData.appState || {},
        files: excalidrawData.files || {}
      },
      viewModeEnabled: true, // Set to view-only mode by default
      zenModeEnabled: false,
      gridModeEnabled: false,
      excalidrawAPI: (api) => {
        // Once the API is ready, scroll to content
        if (api && api.scrollToContent) {
          setTimeout(() => {
            api.scrollToContent();
          }, 100);
        }
      }
    });
    
    // Render the Excalidraw component
    ReactDOM.render(excalidrawElement, container);
    
    console.log('Excalidraw diagram rendered successfully:', excalidrawPath);
  } catch (error) {
    console.error('Error rendering Excalidraw:', error);
    container.innerHTML = `<div style="color: red; padding: 20px;">Error loading Excalidraw diagram: ${error.message}</div>`;
  }
}

/**
 * Initialize all Excalidraw embeds on the page
 */
function initializeExcalidrawEmbeds() {
  const embeds = document.querySelectorAll('.excalidraw-embed[data-excalidraw-src]');
  
  embeds.forEach(embed => {
    const src = embed.getAttribute('data-excalidraw-src');
    if (src) {
      renderExcalidraw(embed, src);
    }
  });
}

// Export functions for use in other modules
export {
  loadExcalidrawLibraries,
  loadExcalidrawFile,
  renderExcalidraw,
  initializeExcalidrawEmbeds
};
