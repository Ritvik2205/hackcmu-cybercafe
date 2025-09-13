// src/pages/PacmanPage.tsx
import React, { useEffect, useRef } from "react";

const PacmanPage: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const gameInstanceRef = useRef<any>(null);
  const gameTimerRef = useRef<NodeJS.Timeout | null>(null);
  const eventHandlersRef = useRef<{ keydown?: EventListener; keypress?: EventListener }>({});
  const allIntervalsRef = useRef<Set<NodeJS.Timeout>>(new Set());

  useEffect(() => {
    // Add custom CSS for Pac-Man sizing
    const style = document.createElement('style');
    style.textContent = `
      #pacman canvas {
        max-width: 100% !important;
        max-height: 100% !important;
        width: auto !important;
        height: auto !important;
      }
    `;
    document.head.appendChild(style);

    // Load Modernizr first
    const loadModernizr = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/games/pacman/modernizr-1.5.min.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Modernizr"));
        document.head.appendChild(script);
      });
    };

    // Load Pac-Man script
    const loadPacman = () => {
      return new Promise<void>((resolve, reject) => {
        const script = document.createElement("script");
        script.src = "/games/pacman/pacman.js";
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Failed to load Pac-Man script"));
        document.body.appendChild(script);
      });
    };

    // Initialize the game
    const initializeGame = async () => {
      if (scriptLoadedRef.current || !gameRef.current) return;

      try {
        await loadModernizr();
        await loadPacman();

        // Check if PACMAN is available and initialize
        if ((window as any).Modernizr && (window as any).PACMAN && gameRef.current) {
          const modernizr = (window as any).Modernizr;
          
          if (modernizr.canvas && modernizr.localstorage && 
              modernizr.audio && (modernizr.audio.ogg || modernizr.audio.mp3)) {
            
            // Clear any existing content
            if (gameRef.current) {
              gameRef.current.innerHTML = '';
            }
            
            // Store the game instance reference
            gameInstanceRef.current = (window as any).PACMAN;
            
            // Intercept setInterval to capture ALL intervals created by the game
            const originalSetInterval = window.setInterval;
            (window as any).setInterval = function(callback: any, delay: number) {
              const intervalId = originalSetInterval.call(this, callback, delay);
              // Store ALL intervals created during game initialization
              allIntervalsRef.current.add(intervalId);
              // Store the main game timer (30 FPS = ~33ms delay)
              if (delay === 1000 / 30) {
                gameTimerRef.current = intervalId;
              }
              return intervalId;
            };
            
            // Intercept addEventListener to capture event handlers
            const originalAddEventListener = document.addEventListener;
            document.addEventListener = function(type: string, listener: any, options?: any) {
              if (type === 'keydown' || type === 'keypress') {
                eventHandlersRef.current[type as keyof typeof eventHandlersRef.current] = listener;
              }
              return originalAddEventListener.call(this, type, listener, options);
            };
            
            // Initialize Pac-Man with custom sizing
            (window as any).PACMAN.init(gameRef.current, "/games/pacman/");
            scriptLoadedRef.current = true;
            
            // Restore original functions
            setTimeout(() => {
              (window as any).setInterval = originalSetInterval;
              document.addEventListener = originalAddEventListener;
            }, 100);
            
            // Auto-start the game after a longer delay to ensure full initialization
            setTimeout(() => {
              // Simulate pressing 'N' to start new game
              const startEvent = new KeyboardEvent('keydown', {
                key: 'n',
                keyCode: 78,
                which: 78,
                bubbles: true
              });
              document.dispatchEvent(startEvent);
            }, 3000);
          } else {
            if (gameRef.current) {
              gameRef.current.innerHTML = `
                <div class="text-center text-yellow-400 font-mono p-4">
                  Sorry, needs a decent browser<br />
                  <small>(firefox 3.6+, Chrome 4+, Opera 10+ and Safari 4+)</small>
                </div>
              `;
            }
          }
        }
      } catch (error) {
        console.error("Failed to load Pac-Man game:", error);
        if (gameRef.current) {
          gameRef.current.innerHTML = `
            <div class="text-center text-red-400 font-mono p-4">
              Failed to load Pac-Man game
            </div>
          `;
        }
      }
    };

    initializeGame();

    // Cleanup function
    return () => {
      // Clear ONLY the intervals that were created during game initialization
      allIntervalsRef.current.forEach(intervalId => {
        clearInterval(intervalId);
      });
      allIntervalsRef.current.clear();
      
      // Clear the main game timer
      if (gameTimerRef.current !== null) {
        clearInterval(gameTimerRef.current);
        gameTimerRef.current = null;
      }
      
      // Remove event listeners that the game added
      if (eventHandlersRef.current.keydown) {
        document.removeEventListener("keydown", eventHandlersRef.current.keydown, true);
      }
      if (eventHandlersRef.current.keypress) {
        document.removeEventListener("keypress", eventHandlersRef.current.keypress, true);
      }
      
      // Clear the game canvas
      if (gameRef.current) {
        gameRef.current.innerHTML = '';
      }
      
      // Remove custom styles
      const styles = document.querySelectorAll('style');
      styles.forEach(styleEl => {
        if (styleEl.textContent && styleEl.textContent.includes('#pacman canvas')) {
          styleEl.remove();
        }
      });
      
      // Clean up scripts if needed
      const scripts = document.querySelectorAll('script[src*="pacman"], script[src*="modernizr"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      
      // Clear game instance reference (but don't delete global objects that might be used elsewhere)
      gameInstanceRef.current = null;
      scriptLoadedRef.current = false;
      eventHandlersRef.current = {};
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black text-green-400 p-4">
      <h1 className="text-2xl mb-4 font-mono">🟡 PAC-MAN</h1>
      
      <div 
        ref={gameRef} 
        id="pacman"
        className="flex items-center justify-center overflow-hidden"
        style={{ 
          width: '100%',
          maxWidth: '400px',
          maxHeight: 'calc(100% - 80px)',
          aspectRatio: '19/22'
        }}
      >
        <div className="text-center">
          <p className="text-yellow-400 font-mono">Loading Pac-Man...</p>
          <p className="text-green-400 font-mono text-sm mt-2">
            Game will auto-start in 3 seconds
          </p>
        </div>
      </div>
    </div>
  );
};

export default PacmanPage;
