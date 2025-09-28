import { HTTP_BACKEND } from "@/config";
import axiosInstance from "../utils/axiosInstance";

export async function getExistingShapes(roomId: string) {
  const res = await axiosInstance.get(`${HTTP_BACKEND}/room/chats/${roomId}`);
  const messages = res.data.messages;

  const shapesWithIds = messages
    .map((x: { id: number; message: string }) => {
      try {
        const messageData = JSON.parse(x.message);
        if (messageData.shape && messageData.shape.type) {
          return {
            shape: messageData.shape,
            messageId: x.id,
          };
        }
        return null;
      } catch (error) {
        console.warn("Invalid message format:", x.message);
        return null;
      }
    })
    .filter((item: any) => item !== null); // Filter out null items

  return shapesWithIds;
}

// deleteMessages function removed - eraser functionality disabled for now
