// src/pages/TetrisPage.tsx
import React, { useEffect, useState } from "react";
import Tetris from "react-tetris";

interface TetrisPageProps {
  open: boolean;
}

const TetrisPage: React.FC<TetrisPageProps> = ({open}) => {
  const [gameStarted, setGameStarted] = useState(false);

  useEffect(() => {
    if (open) {
      setGameStarted(true);
    } else {
      setGameStarted(false);
    }
  }, [open]);

  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-900 text-white">
      <h1 className="text-2xl mb-4 text-green-400 font-mono">🧩 TETRIS</h1>
      {gameStarted ? (
        <Tetris>
          {({
            HeldPiece,
            Gameboard,
            PieceQueue,
            points,
            linesCleared,
            state,
            controller,
          }) => {
            return (
              <div className="flex flex-col items-center">
                <div className="mb-4 text-center">
                  <p className="text-green-400 font-mono">Score: {points}</p>
                  <p className="text-green-400 font-mono">Lines: {linesCleared}</p>
                </div>
                
                <Gameboard />

                <div className="flex mt-2 gap-4">
                  <div className="text-center">
                    <p className="text-xs text-green-400 font-mono">Held</p>
                    <HeldPiece />
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-green-400 font-mono">Next</p>
                    <PieceQueue />
                  </div>
                </div>

                {state === "LOST" && (
                  <button
                    className="mt-4 px-4 py-2 bg-red-600 text-white rounded font-mono hover:bg-red-700"
                    onClick={controller.restart}
                  >
                    Restart Game
                  </button>
                )}

                {state !== "PLAYING" && state !== "LOST" && (
                  <button
                    className="mt-4 px-4 py-2 bg-green-600 text-white rounded font-mono hover:bg-green-700"
                    onClick={controller.restart}
                  >
                    Start Game
                  </button>
                )}
              </div>
            );
          }}
        </Tetris>
      ) : (
        <div className="text-center">
          <p className="text-green-400 font-mono mb-4">Loading Tetris...</p>
        </div>
      )}
    </div>
  );
};

export default TetrisPage;
