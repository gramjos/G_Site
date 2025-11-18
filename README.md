 azzk
# ;)
 ctags -R --languages=Python,JavaScript,HTML,CSS --exclude=node_modules --exclude=dist --exclude=.git --exclude='*.geojson' --exclude='*.jpg' --exclude='*.excalidraw'

### Summary of Key Technical Pieces
app.js: The "main" function. It defines the Route Table (the map of paths to functions) and starts the router.

router.js: The "engine".

createRoute: A compiler that turns path strings into efficient RegEx matchers.

onLinkClick: An event delegate that "hijacks" navigation.

history.pushState: The browser API to change the URL.

onLocationChange: The central dispatcher that resolves the current path against the route table and triggers the render.

popstate listener: The handler for the browser's back/forward buttons.

views/index.js: The "functional rendering" layer. A set of functions that simply take state (context) and return HTML. They are "dumb" and don't know why they are being called, which is a good design.

---

This system is a great example of a client-side router. Its main job is to map browser URL paths to specific JavaScript functions that render content, all without requesting a new page from the server. This creates a Single-Page Application (SPA) experience.

Here are the concepts, in logical order, that describe its functionality.

1. Initialization & Route Definition (app.js)
Bootstrapping: The app.js file acts as the application's entry point or "bootstrap" script.

Route Table: It defines a "route table"—an array of routes. This table maps URL path templates (like /guides/:slug) to specific view functions (like renderGuideDetail).

Router Instantiation: It calls createRouter() from router.js. This is a factory function that creates and configures a new router instance.

Route Compilation: As part of createRoute(), each URL template string is compiled into a Regular Expression (RegEx). This is how your app will later match dynamic paths. For example, :slug is turned into a named capture group ((?<slug>[^/]+)), which you'll be familiar with.

Mounting: The router is given a mountNode (the <main id="app"></main> element from index.html). This is the DOM element its view functions will control.

Event Listener Attachment: The router.start() call officially "activates" the router by attaching two key global event listeners:

A click listener on the document to intercept navigation.

A popstate listener on the window to detect browser back/forward button clicks.

Initial Dispatch: router.start() immediately triggers the first onLocationChange(). This ensures the correct view is rendered for the URL the user first landed on, which is the key to enabling Deep Linking.

2. User Navigation Sequence (A User Clicks a Link)
This is the core sequence that makes it an "SPA":

Event Interception (Link Hijacking): A user clicks an <a> link.

Event Delegation: The click listener attached to the document (not the individual link) catches this event. This is a highly efficient pattern called event delegation.

Navigation Guard: The onLinkClick handler in router.js acts as a "guard." It checks if the click was a standard, same-origin navigation. If it was (e.g., not a ctrl+click, not a link to another site, not a download), it calls event.preventDefault(). This is the crucial step that prevents the browser's default full-page reload.

Programmatic Navigation: The handler then calls the router's internal Maps() function with the link's href.

History API Manipulation: The Maps() function uses the browser's History API. Specifically, it calls history.pushState({}, '', newPath). This manually updates the URL in the browser's address bar and adds an entry to the session history, all without making a network request.

Manual Dispatch: history.pushState() does not trigger a popstate event (a common "gotcha" for beginners). Therefore, the Maps() function must manually call onLocationChange() to force the router to render the new view.

Route Resolution: onLocationChange() gets the new path from window.location. It loops through its list of compiled routes and uses their RegEx match functions to find the first one that fits.

Parameter Extraction: When the RegEx for /guides/:slug matches, its named capture group extracts the dynamic part (e.g., { slug: 'history-api' }). This becomes the params object.

View Invocation (Functional Rendering): The router calls the matched route's render function (e.g., renderGuideDetail). This is a functional programming approach: the view is just a function that receives a ctx (context) object containing the mountNode, location info, and the extracted params.

DOM Update: The view function does its one job: it generates the new HTML and updates the innerHTML of the ctx.mount node. The user now sees the new "page."

3. Browser Back/Forward Sequence
Popstate Event: The user clicks the browser's back or forward button.

Event Firing: This action does fire a popstate event, which the router's onPopState listener catches.

Dispatch: This listener also just calls onLocationChange().

Resolution & Rendering: From here, the flow is identical to steps 7-10 above. The router resolves the "new" (but old) path, finds the matching view, and re-renders the content.
