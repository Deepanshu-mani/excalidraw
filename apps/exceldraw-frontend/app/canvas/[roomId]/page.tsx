"use client";

import { RoomCanvas } from "@/app/components/RoomCanvas";
import ProtectedRoute from "@/app/components/ProtectedRoute";
import { useParams } from "next/navigation";

export default function CanvasPage() {
  const params = useParams();
  const roomId = params.roomId as string;

  return (
    <ProtectedRoute>
      <RoomCanvas roomId={roomId} />
    </ProtectedRoute>
  );
}
