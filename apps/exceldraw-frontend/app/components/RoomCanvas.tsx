"use client";
import { useEffect, useState } from "react";
import { WS_URL } from "@/config";
import { Canvas } from "./Canvas";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export function RoomCanvas({ roomId }: { roomId: string }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const ws = new WebSocket(`${WS_URL}?token=${token}`);
    ws.onopen = () => {
      setSocket(ws);
      ws.send(
        JSON.stringify({
          type: "join_room",
          roomId,
        }),
      );
    };
  }, []);

  if (!socket) {
    return (
      <div className="flex items-center justify-center h-screen">
        Connecting to the server ... .. .
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen">
      <Link
        href="/dashboard"
        className="group flex items-center absolute top-4 left-4 z-50 bg-gradient-to-r from-white/20 to-white/10 backdrop-blur-md border border-white/30 text-white px-4 py-2 rounded-xl text-sm font-semibold shadow-md hover:from-white hover:to-white hover:text-black  transition-all duration-300"
      >
        <span className="transform transition-transform duration-300 group-hover:-translate-x-1">
          <ArrowLeft />
        </span>
        <span className="ml-2">Dashboard</span>
      </Link>
      <Canvas roomId={roomId} socket={socket} />
    </div>
  );
}
