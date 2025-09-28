import { useState, useEffect, useRef } from "react";

import { Tool, Toolbar } from "./Toolbar";
import { Game } from "../draw/Game";

export function Canvas({
  roomId,
  socket,
}: {
  roomId: string;
  socket: WebSocket;
}) {
  const [selectedTool, setSelectedTool] = useState<Tool>("rect");
  const [game, setGame] = useState<Game>();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    game?.setTool(selectedTool);
  }, [selectedTool, game]);

  useEffect(() => {
    if (canvasRef.current) {
      const g = new Game(canvasRef.current, roomId, socket);
      setGame(g);

      return () => {
        g.destroy();
      };
    }
  }, [canvasRef, roomId, socket]);

  return (
    <div className="relative w-full h-screen bg-black">
      <canvas
        ref={canvasRef}
        width={window.innerWidth}
        height={window.innerHeight}
        className="block"
      />
      <Toolbar selectedTool={selectedTool} onToolSelect={setSelectedTool} />
    </div>
  );
}
