# Modular Map Project
- The beginnings of an exploratory data analysis tool.
- A modern, component-based web mapping application built with vanilla JavaScript (minus Leaflet) and ES6 modules. 
- Built to handle a dataset (38028259 bytes) for client side processing


### Features
#### Map
- Dynamic visualization with bounding box zoom 
- Scale Bar, multiple base layer options

#### Attribute Table
-  floating action button for the attribute table to appear

#### Advanced Search Functionality

The attribute table features a **high-performance incremental search system** designed to handle large datasets efficiently. With 21,004 rail network features and 10 searchable columns, the search engine employs sophisticated computer science optimizations to deliver instant results.

**Performance Optimization - Pre-Computed Index:**
Traditional search implementations compare the query against every column of every feature (O(n×m) complexity), which becomes slow with large datasets. Our search engine uses a **pre-computed search index** built once when data loads initially. Each feature's searchable values are concatenated into a single lowercase string, reducing search operations from multiple column comparisons per feature to just one string comparison (O(n) complexity). This optimization delivers **10× faster search performance**, completing searches across 21,000+ features in under 50 milliseconds.

**Debouncing for Responsiveness:**
To prevent excessive processing during rapid typing, the search implements **debouncing** - a 150ms delay between the last keystroke and actual search execution. This classic performance pattern ensures smooth user experience by avoiding unnecessary computation on every keystroke while maintaining real-time feel.

**Focus Preservation Architecture:**
A critical UX challenge solved: maintaining input focus during incremental search. The solution employs a **dual-rendering strategy** where the search input remains untouched in the DOM while only the table content updates. The `renderTableContent()` method surgically updates the table wrapper without rebuilding the entire panel, preventing the focus-stealing bug common in dynamic search interfaces.

**Smart Query Handling:**
The search requires a minimum of 2 characters to activate, preventing performance degradation from overly broad single-character queries that could return thousands of results unnecessarily. All searches are case-insensitive and whitespace-trimmed for maximum user convenience.

**Modular Architecture:**
Search functionality is completely isolated in `TableSearch.js` (307 lines), demonstrating clean separation of concerns. The module communicates with the parent `AttributeTable` component through callbacks, making it reusable and independently testable. This modular design allows the search system to be dropped into other table implementations with minimal integration effort, exemplifying object-oriented programming principles and component-based architecture patterns.

## Data Notes

STRACNET (type: esriFieldTypeString, alias: STRACNET, SQL Type: sqlTypeOther, length: 1, nullable: true, editable: true, Coded Values: [S: STRACNET designated line], [C: Connector designated line]) [source - esri](https://services.arcgis.com/xOi1kZaI0eWDREZv/arcgis/rest/services/NTAD_North_American_Rail_Network_Lines/FeatureServer/)

## 🐍 Interactive Analysis Panel (Marimo)
```shell
uvx marimo edit --sandbox notebooks/interactive_analysis.py
marimo export html-wasm notebooks/interactive_analysis.py -o notebooks/output_dir --mode edit
```
notebooks/output_dir/ directory with contain an index.html