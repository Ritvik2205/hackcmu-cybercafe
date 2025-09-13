import React, { useEffect, useRef } from "react";

// Simple Tetris game implementation
const createSimpleTetris = (gameBoard: HTMLElement) => {
  console.log('Creating simple Tetris game...');
  
  // Game state
  let gameGrid: string[][] = Array(20).fill(null).map(() => Array(10).fill(''));
  let currentPiece: { shape: number[][]; x: number; y: number; color: string } | null = null;
  let gameRunning = true;
  let score = 0;
  
  // Tetris pieces
  const pieces = [
    { shape: [[1, 1, 1, 1]], color: '#00FFFF' }, // I
    { shape: [[1, 1], [1, 1]], color: '#FFFF00' }, // O
    { shape: [[0, 1, 0], [1, 1, 1]], color: '#800080' }, // T
    { shape: [[0, 1, 1], [1, 1, 0]], color: '#00FF00' }, // S
    { shape: [[1, 1, 0], [0, 1, 1]], color: '#FF0000' }, // Z
    { shape: [[1, 0, 0], [1, 1, 1]], color: '#FF8C00' }, // J
    { shape: [[0, 0, 1], [1, 1, 1]], color: '#0000FF' }  // L
  ];
  
  // Create game board
  gameBoard.innerHTML = '';
  gameBoard.style.cssText = `
    display: grid;
    grid-template-rows: repeat(20, 1fr);
    grid-template-columns: repeat(10, 1fr);
    width: 300px;
    height: 600px;
    background: #333;
    gap: 1px;
    padding: 2px;
    margin: 0 auto;
  `;
  
  // Create cells
  for (let row = 0; row < 20; row++) {
    for (let col = 0; col < 10; col++) {
      const cell = document.createElement('div');
      cell.id = `cell-${row}-${col}`;
      cell.style.cssText = `
        background: #222;
        border: 1px solid #444;
        width: 100%;
        height: 100%;
      `;
      gameBoard.appendChild(cell);
    }
  }
  
  // Spawn new piece
  const spawnPiece = () => {
    // Only spawn if no current piece exists
    if (currentPiece) {
      console.log('Piece already exists, not spawning new one');
      return;
    }
    
    console.log('Spawning new piece...');
    const piece = pieces[Math.floor(Math.random() * pieces.length)];
    currentPiece = {
      shape: piece.shape,
      x: Math.floor(10 / 2) - Math.floor(piece.shape[0].length / 2),
      y: 0,
      color: piece.color
    };
    
    if (isCollision()) {
      gameRunning = false;
      console.log('Game Over!');
      return;
    }
    
    console.log('New piece spawned:', currentPiece.color);
  };
  
  // Check collision
  const isCollision = () => {
    if (!currentPiece) return false;
    
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          const newX = currentPiece.x + col;
          const newY = currentPiece.y + row;
          
          if (newX < 0 || newX >= 10 || newY >= 20 || 
              (newY >= 0 && gameGrid[newY][newX])) {
            return true;
          }
        }
      }
    }
    return false;
  };
  
  // Place piece
  const placePiece = () => {
    if (!currentPiece) return;
    
    for (let row = 0; row < currentPiece.shape.length; row++) {
      for (let col = 0; col < currentPiece.shape[row].length; col++) {
        if (currentPiece.shape[row][col]) {
          const newX = currentPiece.x + col;
          const newY = currentPiece.y + row;
          if (newY >= 0) {
            gameGrid[newY][newX] = currentPiece.color;
          }
        }
      }
    }
    
    // Clear lines
    for (let row = 19; row >= 0; row--) {
      if (gameGrid[row].every(cell => cell !== '')) {
        gameGrid.splice(row, 1);
        gameGrid.unshift(Array(10).fill(''));
        score += 100;
        console.log('Line cleared! Score:', score);
      }
    }
    
    console.log('Piece placed, clearing current piece');
    currentPiece = null;
    
    // Spawn new piece after a short delay to prevent conflicts
    setTimeout(() => {
      spawnPiece();
    }, 50);
  };
  
  // Move piece
  const movePiece = (dx: number, dy: number) => {
    if (!currentPiece) return;
    
    currentPiece.x += dx;
    currentPiece.y += dy;
    
    if (isCollision()) {
      currentPiece.x -= dx;
      currentPiece.y -= dy;
      
      if (dy > 0) {
        placePiece();
      }
    }
  };
  
  // Rotate piece
  const rotatePiece = () => {
    if (!currentPiece) return;
    
    const rotated = currentPiece.shape[0].map((_, index) =>
      currentPiece!.shape.map(row => row[index]).reverse()
    );
    
    const oldShape = currentPiece.shape;
    currentPiece.shape = rotated;
    
    if (isCollision()) {
      currentPiece.shape = oldShape;
    }
  };
  
  // Get shadow position (where piece would land)
  const getShadowPosition = () => {
    if (!currentPiece) return { x: 0, y: 0 };
    
    let shadowY = currentPiece.y;
    while (shadowY < 20) {
      shadowY++;
      // Check if this position would collide
      let wouldCollide = false;
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col]) {
            const newX = currentPiece.x + col;
            const newY = shadowY + row;
            if (newY >= 20 || (newY >= 0 && gameGrid[newY][newX])) {
              wouldCollide = true;
              break;
            }
          }
        }
        if (wouldCollide) break;
      }
      if (wouldCollide) {
        shadowY--; // Go back one step
        break;
      }
    }
    
    return { x: currentPiece.x, y: shadowY };
  };

  // Render
  const render = () => {
    // Clear board - reset all cells first
    for (let row = 0; row < 20; row++) {
      for (let col = 0; col < 10; col++) {
        const cell = document.getElementById(`cell-${row}-${col}`);
        if (cell) {
          cell.style.background = gameGrid[row][col] || '#222';
          cell.style.border = '1px solid #444';
        }
      }
    }
    
    // Render shadow (where piece would land)
    if (currentPiece) {
      const shadow = getShadowPosition();
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col]) {
            const newX = shadow.x + col;
            const newY = shadow.y + row;
            if (newY >= 0 && newY < 20 && newX >= 0 && newX < 10 && 
                newY !== currentPiece.y + row) { // Don't overlap with current piece
              const cell = document.getElementById(`cell-${newY}-${newX}`);
              if (cell && !gameGrid[newY][newX]) { // Only show shadow on empty cells
                cell.style.background = 'rgba(255, 255, 255, 0.2)'; // Very transparent white
                cell.style.border = '1px solid rgba(255, 255, 255, 0.3)';
              }
            }
          }
        }
      }
    }
    
    // Render current piece (on top of everything)
    if (currentPiece) {
      for (let row = 0; row < currentPiece.shape.length; row++) {
        for (let col = 0; col < currentPiece.shape[row].length; col++) {
          if (currentPiece.shape[row][col]) {
            const newX = currentPiece.x + col;
            const newY = currentPiece.y + row;
            if (newY >= 0 && newY < 20 && newX >= 0 && newX < 10) {
              const cell = document.getElementById(`cell-${newY}-${newX}`);
              if (cell) {
                cell.style.background = currentPiece.color;
                cell.style.border = '1px solid #fff';
              }
            }
          }
        }
      }
    }
  };
  
  // Game loop
  let gameLoopId: NodeJS.Timeout | null = null;
  const gameLoop = () => {
    if (gameRunning) {
      movePiece(0, 1);
      render();
      gameLoopId = setTimeout(gameLoop, 500);
    }
  };
  
  // Stop game loop function
  const stopGameLoop = () => {
    if (gameLoopId) {
      clearTimeout(gameLoopId);
      gameLoopId = null;
    }
  };
  
  // Controls
  const handleKeyPress = (e: KeyboardEvent) => {
    if (!gameRunning) return;
    
    switch (e.key) {
      case 'ArrowLeft':
        movePiece(-1, 0);
        break;
      case 'ArrowRight':
        movePiece(1, 0);
        break;
      case 'ArrowDown':
        movePiece(0, 1);
        break;
      case 'ArrowUp':
        rotatePiece();
        break;
      case ' ':
        e.preventDefault();
        while (!isCollision()) {
          movePiece(0, 1);
        }
        movePiece(0, -1);
        break;
    }
    render();
  };
  
  // Start game
  document.addEventListener('keydown', handleKeyPress);
  spawnPiece();
  render();
  gameLoop();
  
  console.log('Simple Tetris game created and started!');
  
  // Return cleanup function
  return () => {
    stopGameLoop();
    document.removeEventListener('keydown', handleKeyPress);
    gameRunning = false;
    console.log('Simple Tetris game cleaned up');
  };
};

const TetrisPage: React.FC = () => {
  const gameRef = useRef<HTMLDivElement>(null);
  const scriptLoadedRef = useRef(false);
  const gameInstanceRef = useRef<any>(null);
  const animationFrameRef = useRef<number | null>(null);
  const eventHandlersRef = useRef<{ keydown?: EventListener; keyup?: EventListener }>({});
  const allAnimationFramesRef = useRef<Set<number>>(new Set());

  useEffect(() => {
    // Add custom CSS for Tetris sizing
    const style = document.createElement('style');
    style.textContent = `
      #tetris-container {
        width: 100% !important;
        height: 100% !important;
        max-width: 100% !important;
        max-height: 100% !important;
        overflow: hidden !important;
        position: relative !important;
        display: flex !important;
        justify-content: center !important;
        align-items: center !important;
        background: black !important;
      }
      #tetris-container #game-board {
        width: 300px !important;
        height: 600px !important;
        max-width: 300px !important;
        max-height: 600px !important;
        background-color: rgb(70, 70, 70) !important;
        display: grid !important;
        grid-template-rows: repeat(20, 1fr) !important;
        grid-template-columns: repeat(10, 1fr) !important;
      }
      #tetris-container #preview-board,
      #tetris-container #hold-board {
        width: 100px !important;
        height: 75px !important;
        max-width: 100px !important;
        max-height: 75px !important;
        background-color: rgb(70, 70, 70) !important;
        display: grid !important;
        grid-template-rows: repeat(3, 1fr) !important;
        grid-template-columns: repeat(4, 1fr) !important;
      }
      #tetris-container #score {
        font-size: 1.2rem !important;
        position: absolute !important;
        top: 10px !important;
        right: 10px !important;
        color: white !important;
        z-index: 10 !important;
      }
      #tetris-container #preview__container {
        position: absolute !important;
        top: 50px !important;
        right: 10px !important;
        width: 100px !important;
        height: 20px !important;
      }
      #tetris-container #preview__container h1 {
        color: white !important;
        font-size: 14px !important;
        margin: 0 !important;
      }
      #tetris-container #hold__container {
        position: absolute !important;
        top: 50px !important;
        left: 10px !important;
        width: 100px !important;
        height: 20px !important;
      }
      #tetris-container #hold__container h1 {
        color: white !important;
        font-size: 14px !important;
        margin: 0 !important;
      }
      #tetris-container #preview-board {
        position: absolute !important;
        top: 75px !important;
        right: 10px !important;
      }
      #tetris-container #hold-board {
        position: absolute !important;
        top: 75px !important;
        left: 10px !important;
      }
      #tetris-container #audio__button {
        display: none !important;
      }
      #tetris-container #back {
        display: none !important;
      }
      #tetris-container .buttons__container {
        display: none !important;
      }
    `;
    document.head.appendChild(style);

    const loadTetrisScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        // Check if script already exists
        if (document.querySelector(`script[src="${src}"]`)) {
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = src;
        script.type = 'module'; // All Tetris scripts are ES6 modules
        script.onload = () => resolve();
        script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
        document.head.appendChild(script);
      });
    };

    const initializeGame = async () => {
      if (scriptLoadedRef.current || !gameRef.current) return;

      console.log('Starting Tetris game initialization...');

      try {
        // Set default difficulty if not set
        if (typeof localStorage !== 'undefined' && !localStorage.difficulty) {
          localStorage.difficulty = 2; // Medium difficulty
        }

        if (gameRef.current) {
          console.log('Creating game container...');
          
          // Create the Tetris game container with all necessary elements
          gameRef.current.innerHTML = `
            <div id="tetris-container">
              <button id="audio__button">sound</button>
              <audio loop id="audio">
                <source src="/games/tetris/audio/tetris.mp3">
              </audio>
              <audio id="pop">
                <source src="/games/tetris/audio/pop.mp3">
              </audio>
              <div id="game-board"></div>
              <label id="score">Score: 0</label>
              <button id="back"><a>BACK</a></button>
              <div id="preview__container">
                <h1>NEXT:</h1>
              </div>
              <div id="preview-board"></div>
              <div id="hold__container">
                <h1>HOLD:</h1>
              </div>
              <div class="buttons__container">
                <button id="left"><img src="/games/tetris/images_tetris/left.png" id="mobile"></button>
                <button id="leftm"><img src="/games/tetris/images_tetris/leftm.png" id="mobile"></button>
                <button id="down"><img src="/games/tetris/images_tetris/down.png" id="mobile"></button>
                <button id="hold"><img src="/games/tetris/images_tetris/hold.png" id="mobile"></button>
                <button id="downh"><img src="/games/tetris/images_tetris/downh.png" id="mobile"></button>
                <button id="rightm"><img src="/games/tetris/images_tetris/rightm.png" id="mobile"></button>
                <button id="right"><img src="/games/tetris/images_tetris/right.png" id="mobile"></button>
              </div>
              <div id="hold-board"></div>
            </div>
          `;

          console.log('Game container created, loading scripts...');

          // Load the blockset.js first since game.js imports from it
          await loadTetrisScript('/games/tetris/blockset.js');
          console.log('Blockset script loaded');
          
          // Load the Tetris game scripts
          await loadTetrisScript('/games/tetris/game.js');
          console.log('Game script loaded');
          
          await loadTetrisScript('/games/tetris/audio.js');
          console.log('Audio script loaded');

          // Intercept requestAnimationFrame to capture game animation frames
          const originalRequestAnimationFrame = window.requestAnimationFrame;
          (window as any).requestAnimationFrame = function(callback: any) {
            const frameId = originalRequestAnimationFrame.call(this, callback);
            allAnimationFramesRef.current.add(frameId);
            animationFrameRef.current = frameId;
            console.log('Animation frame captured:', frameId);
            return frameId;
          };

          // Intercept addEventListener to capture event handlers
          const originalAddEventListener = document.addEventListener;
          document.addEventListener = function(type: string, listener: any, options?: any) {
            if (type === 'keydown' || type === 'keyup') {
              eventHandlersRef.current[type as keyof typeof eventHandlersRef.current] = listener;
              console.log('Event listener captured:', type);
            }
            return originalAddEventListener.call(this, type, listener, options);
          };

          scriptLoadedRef.current = true;

          // Restore original functions after a short delay
          setTimeout(() => {
            (window as any).requestAnimationFrame = originalRequestAnimationFrame;
            document.addEventListener = originalAddEventListener;
          }, 100);

          console.log('Tetris game initialized successfully');
          
          // Immediate check of game state
          console.log('=== IMMEDIATE GAME STATE CHECK ===');
          const immediateGameBoard = document.getElementById('game-board');
          console.log('Immediate gameBoard found:', !!immediateGameBoard);
          console.log('Immediate gameBoard children:', immediateGameBoard?.children.length);
          console.log('Immediate gameOver:', (window as any).gameOver);
          console.log('Immediate done:', (window as any).done);
          console.log('Immediate speed:', (window as any).speed);
          console.log('=== END IMMEDIATE CHECK ===');
          
          // Try to force start the game immediately
          if (immediateGameBoard && immediateGameBoard.children.length === 0) {
            console.log('Game board is empty immediately, trying to force start...');
            try {
              // Initialize all game variables that might be undefined
              console.log('Initializing game variables...');
              (window as any).gameOver = false;
              (window as any).done = true;
              (window as any).speed = localStorage.difficulty || 2;
              (window as any).score = 0;
              (window as any).end = false;
              (window as any).pressed_hold = false;
              (window as any).a = -1;
              (window as any).visibleBlock = [];
              (window as any).shadow = [];
              (window as any).next = undefined;
              (window as any).visNext = [];
              (window as any).bag = [];
              (window as any).held_a = [];
              (window as any).visHold = [];
              (window as any).first_hold = false;
              (window as any).actual_first_hold = true;
              (window as any).hold = 0;
              (window as any).lastRenderTime = 0;
              
              console.log('Game variables initialized, calling spawn...');
              
              // Try to call spawn directly
              if (typeof (window as any).spawn === 'function') {
                console.log('Calling spawn function immediately...');
                (window as any).spawn();
                console.log('Spawn function called');
                
                // Check if spawn created any elements
                setTimeout(() => {
                  console.log('After spawn - gameBoard children:', immediateGameBoard?.children.length);
                  if (immediateGameBoard?.children.length === 0) {
                    console.log('Spawn function did not create any elements');
                    // Try to manually create a block to test
                    console.log('Attempting manual block creation...');
                    try {
                      // Create a simple test block
                      const testBlock = document.createElement('div');
                      testBlock.style.cssText = 'width: 30px; height: 30px; background: red; position: absolute; top: 0; left: 0;';
                      testBlock.textContent = 'T';
                      immediateGameBoard.appendChild(testBlock);
                      console.log('Created test block manually');
                    } catch (error) {
                      console.error('Error creating test block:', error);
                    }
                  }
                }, 100);
              } else {
                console.log('Spawn function not available - creating simple Tetris game');
                
                // Since the external game functions aren't accessible, create a simple working Tetris
                try {
                  const cleanup = createSimpleTetris(immediateGameBoard);
                  // Store cleanup function for later use
                  if (cleanup && typeof cleanup === 'function') {
                    (window as any).tetrisCleanup = cleanup;
                  }
                } catch (error) {
                  console.error('Error creating simple Tetris:', error);
                }
              }
            } catch (error) {
              console.error('Error in immediate game start:', error);
            }
          }
          
          // Give the game a moment to start, then check if it's running
          setTimeout(() => {
            const gameBoard = document.getElementById('game-board');
            if (gameBoard && gameBoard.children.length === 0) {
              console.log('Game board is empty, trying to trigger game start...');
              
              // Debug: Check game variables and DOM elements
              console.log('Checking game variables...');
              console.log('gameOver:', (window as any).gameOver);
              console.log('done:', (window as any).done);
              console.log('speed:', (window as any).speed);
              console.log('localStorage.difficulty:', localStorage.difficulty);
              
              // Check DOM elements
              const previewBoard = document.getElementById('preview-board');
              const holdBoard = document.getElementById('hold-board');
              console.log('gameBoard element:', gameBoard);
              console.log('previewBoard element:', previewBoard);
              console.log('holdBoard element:', holdBoard);
              console.log('gameBoard children:', gameBoard?.children.length);
              console.log('gameBoard computed style:', gameBoard ? window.getComputedStyle(gameBoard) : 'null');
              console.log('gameBoard dimensions:', gameBoard ? `${gameBoard.offsetWidth}x${gameBoard.offsetHeight}` : 'null');
              
              // Test if we can add content to the game board
              if (gameBoard) {
                console.log('Testing game board by adding a test element...');
                const testDiv = document.createElement('div');
                testDiv.style.cssText = 'width: 30px; height: 30px; background: red; position: absolute; top: 0; left: 0; z-index: 1000;';
                testDiv.textContent = 'TEST';
                gameBoard.appendChild(testDiv);
                console.log('Added test element to game board');
                
                // Remove test element after a moment
                setTimeout(() => {
                  if (testDiv.parentNode) {
                    testDiv.parentNode.removeChild(testDiv);
                    console.log('Removed test element');
                  }
                }, 2000);
              }
              
              // Try to manually trigger the first block spawn
              // The game should start automatically, but let's help it along
              if (typeof window !== 'undefined' && (window as any).spawn) {
                console.log('Calling spawn function manually...');
                try {
                  (window as any).spawn();
                  console.log('Spawn function called successfully');
                  // Check if anything was created
                  setTimeout(() => {
                    console.log('After spawn - gameBoard children:', gameBoard?.children.length);
                  }, 100);
                } catch (error) {
                  console.error('Error calling spawn function:', error);
                }
              } else {
                console.log('Spawn function not available');
              }
              
              // Also try to reset game state
              if (typeof window !== 'undefined') {
                (window as any).gameOver = false;
                (window as any).done = true;
                console.log('Reset game state');
              }
              
              // Also try dispatching a keydown event to wake up the game
              const startEvent = new KeyboardEvent('keydown', {
                key: 'ArrowDown',
                keyCode: 40,
                which: 40,
                bubbles: true
              });
              document.dispatchEvent(startEvent);
              
              // Check again after a short delay and create fallback
              setTimeout(() => {
                const gameBoardCheck = document.getElementById('game-board');
                console.log('Final check - gameBoard children:', gameBoardCheck?.children.length);
                if (gameBoardCheck && gameBoardCheck.children.length === 0) {
                  console.log('Game still not starting, creating interactive fallback...');
                  // Create an interactive fallback game board
                  gameBoardCheck.innerHTML = `
                    <div style="display: grid; grid-template-rows: repeat(20, 1fr); grid-template-columns: repeat(10, 1fr); width: 100%; height: 100%; gap: 1px;">
                      ${Array.from({length: 200}, (_, i) => 
                        `<div class="tetris-cell" style="border: 1px solid #444; background: rgb(70, 70, 70); cursor: pointer;" onclick="this.style.background='red'"></div>`
                      ).join('')}
                    </div>
                  `;
                  console.log('Created interactive fallback game board with 200 clickable cells');
                  
                  // Also add a start button
                  const startButton = document.createElement('button');
                  startButton.textContent = 'START GAME';
                  startButton.style.cssText = 'position: absolute; top: 10px; left: 10px; z-index: 1000; background: green; color: white; padding: 10px; border: none; cursor: pointer;';
                  startButton.onclick = () => {
                    console.log('Start button clicked');
                    // Try to start the real game
                    try {
                      (window as any).gameOver = false;
                      (window as any).done = true;
                      if (typeof (window as any).spawn === 'function') {
                        (window as any).spawn();
                        startButton.remove();
                      }
                    } catch (error) {
                      console.error('Error starting game:', error);
                    }
                  };
                  gameBoardCheck.parentElement?.appendChild(startButton);
                }
              }, 500);
            }
          }, 1000);
        }
      } catch (error) {
        console.error('Failed to initialize Tetris game:', error);
        if (gameRef.current) {
          gameRef.current.innerHTML = `
            <div style="color: white; text-align: center; padding: 20px;">
              Failed to load Tetris game: ${error}
              <br><br>
              <div style="background: black; padding: 10px; border: 1px solid white;">
                <button id="audio__button">sound</button>
                <audio loop id="audio">
                  <source src="/games/tetris/audio/tetris.mp3">
                </audio>
                <audio id="pop">
                  <source src="/games/tetris/audio/pop.mp3">
                </audio>
                <div id="game-board" style="width: 300px; height: 600px; background: gray; margin: 20px auto;"></div>
                <label id="score">Score: 0</label>
                <button id="back"><a>BACK</a></button>
                <div id="preview__container">
                  <h1>NEXT:</h1>
                </div>
                <div id="preview-board" style="width: 100px; height: 75px; background: gray; display: inline-block;"></div>
                <div id="hold__container">
                  <h1>HOLD:</h1>
                </div>
                <div class="buttons__container">
                  <button id="left">L</button>
                  <button id="leftm">LM</button>
                  <button id="down">D</button>
                  <button id="hold">H</button>
                  <button id="downh">DH</button>
                  <button id="rightm">RM</button>
                  <button id="right">R</button>
                </div>
                <div id="hold-board" style="width: 100px; height: 75px; background: gray; display: inline-block;"></div>
              </div>
            </div>
          `;
        }
      }
    };

    initializeGame();

    // Cleanup function
    return () => {
      // Clear ONLY the animation frames that were created during game initialization
      allAnimationFramesRef.current.forEach(frameId => {
        cancelAnimationFrame(frameId);
      });
      allAnimationFramesRef.current.clear();
      
      // Clear the main game animation frame
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
        animationFrameRef.current = null;
      }
      
      // Remove event listeners that the game added
      if (eventHandlersRef.current.keydown) {
        document.removeEventListener("keydown", eventHandlersRef.current.keydown, true);
      }
      if (eventHandlersRef.current.keyup) {
        document.removeEventListener("keyup", eventHandlersRef.current.keyup, true);
      }
      
      // Clear the game canvas
      if (gameRef.current) {
        gameRef.current.innerHTML = '';
      }
      
      // Remove custom styles
      const styles = document.querySelectorAll('style');
      styles.forEach(styleEl => {
        if (styleEl.textContent && styleEl.textContent.includes('#tetris-container')) {
          styleEl.remove();
        }
      });
      
      // Clean up scripts if needed
      const scripts = document.querySelectorAll('script[src*="tetris"]');
      scripts.forEach(script => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
      
      // Clean up simple Tetris game if it exists
      if (typeof (window as any).tetrisCleanup === 'function') {
        console.log('Cleaning up simple Tetris game...');
        (window as any).tetrisCleanup();
        delete (window as any).tetrisCleanup;
      }
      
      // Clear game instance reference
      gameInstanceRef.current = null;
      scriptLoadedRef.current = false;
      eventHandlersRef.current = {};
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-black text-white p-4">
      <h1 className="text-2xl mb-4 font-mono">🧩 TETRIS</h1>

      <div
        ref={gameRef}
        id="tetris-game"
        className="flex items-center justify-center overflow-hidden"
        style={{
          width: '100%',
          height: 'calc(100% - 80px)',
          maxWidth: '100%',
          maxHeight: 'calc(100% - 80px)'
        }}
      >
        <div className="text-center">
          <p className="text-green-400 font-mono">Loading Tetris...</p>
          <p className="text-green-400 font-mono text-sm mt-2">
            Use arrow keys to move, space to drop, C to hold piece
          </p>
          <div className="mt-4">
            <div style={{
              width: '300px',
              height: '600px',
              background: 'rgb(70, 70, 70)',
              margin: '0 auto',
              border: '2px solid white',
              display: 'grid',
              gridTemplateRows: 'repeat(20, 1fr)',
              gridTemplateColumns: 'repeat(10, 1fr)'
            }}>
              {/* This will be replaced by the actual game */}
            </div>
            <p className="text-yellow-400 text-xs mt-2">Game board placeholder</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TetrisPage;
