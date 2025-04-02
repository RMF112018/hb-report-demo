// src/renderer/utils/NavigationManager.js
// Centralized navigation manager for global keyboard and mouse event handling
// Initialize in App.js to set up global listeners; components register handlers as needed
// Reference: https://react.dev/reference/react/useEffect
// *Additional Reference*: https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
// *Additional Reference*: https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent

class NavigationManager {
    constructor() {
      this.keyboardShortcuts = new Map();
      this.mouseHandlers = new Map();
      this.scrollMode = 'ratchet';
      // Fallback for navigator.platform in non-browser environments
      this.isMac = typeof navigator !== 'undefined' && navigator.platform
        ? navigator.platform.toLowerCase().includes('mac')
        : false;
      this.setupEventListeners();
    }
  
    setupEventListeners() {
      window.addEventListener('keydown', (event) => {
        const { key, ctrlKey, metaKey, shiftKey, altKey } = event;
        const modifier = this.isMac ? metaKey : ctrlKey;
        const shortcutKey = `${modifier ? 'Ctrl+' : ''}${shiftKey ? 'Shift+' : ''}${altKey ? 'Alt+' : ''}${key.toLowerCase()}`;
        const handler = this.keyboardShortcuts.get(shortcutKey);
        if (handler) {
          event.preventDefault();
          handler(event);
        }
      });
  
      // Mouse event listeners
      window.addEventListener('mousedown', (event) => {
        const backHandler = this.mouseHandlers.get('back');
        const forwardHandler = this.mouseHandlers.get('forward');
        const middleClickHandler = this.mouseHandlers.get('middleClick');
        const gestureHandler = this.mouseHandlers.get('gesture');
  
        if (event.button === 3 && backHandler) {
          // Back (Mouse Button 4)
          event.preventDefault();
          backHandler();
        } else if (event.button === 4 && forwardHandler) {
          // Forward (Mouse Button 5)
          event.preventDefault();
          forwardHandler();
        } else if (event.button === 1 && middleClickHandler) {
          // Middle click
          event.preventDefault();
          middleClickHandler();
        }
  
        // Gesture support (right-click drag)
        if (event.buttons === 2 && gestureHandler) {
          window.addEventListener('mousemove', (moveEvent) => {
            if (moveEvent.movementX !== 0) {
              gestureHandler(moveEvent.movementX > 0 ? 'right' : 'left');
            }
          }, { once: true });
        }
      });
  
      window.addEventListener('wheel', (event) => {
        // Precision mode toggle (Logitech MX Ergo)
        if (event.ctrlKey && event.deltaY !== 0) {
          this.scrollMode = this.scrollMode === 'ratchet' ? 'free' : 'ratchet';
        }
        // Horizontal scroll (Logitech MX Ergo tilt wheel)
        if (event.deltaX !== 0) {
          event.preventDefault();
          document.querySelector('.ant-table-body')?.scrollBy({
            left: event.deltaX,
            behavior: this.scrollMode === 'free' ? 'auto' : 'smooth',
          });
        }
      }, { passive: false });
    }
  
    // Register a keyboard shortcut
    registerKeyboardShortcut(shortcut, handler) {
      if (this.keyboardShortcuts.has(shortcut)) {
        console.warn(`Shortcut ${shortcut} is already registered. Overriding.`);
      }
      this.keyboardShortcuts.set(shortcut, handler);
      return () => this.unregisterKeyboardShortcut(shortcut);
    }
  
    // Unregister a keyboard shortcut
    unregisterKeyboardShortcut(shortcut) {
      this.keyboardShortcuts.delete(shortcut);
    }
  
    // Register a mouse event handler
    registerMouseHandler(eventType, handler) {
      if (this.mouseHandlers.has(eventType)) {
        console.warn(`Mouse handler for ${eventType} is already registered. Overriding.`);
      }
      this.mouseHandlers.set(eventType, handler);
      return () => this.unregisterMouseHandler(eventType);
    }
  
    // Unregister a mouse event handler
    unregisterMouseHandler(eventType) {
      this.mouseHandlers.delete(eventType);
    }
  
    // Get current scroll mode
    getScrollMode() {
      return this.scrollMode;
    }
  }
  
  // Singleton instance
  const navigationManager = new NavigationManager();
  export default navigationManager;