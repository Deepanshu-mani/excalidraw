import express, { Router } from "express";
import authMiddleware from "../middleware.js";
const router: Router = express.Router();
import { CreateRoom } from "@repo/common/config";
import { prismaClient } from "@repo/db/client";

router.post("/", authMiddleware, async (req, res) => {
  const parsedData = CreateRoom.safeParse(req.body);
  if (!parsedData.success) {
    return res.json({
      messsage: "Incorrect Credentials",
    });
  }

  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const room = await prismaClient.room.create({
      data: {
        slug: parsedData.data.name,
        adminId: userId,
      },
    });
    res.json({
      roomId: room.id,
    });
  } catch (e) {
    res.status(411).json({
      message: "Room Already exists with this Name",
    });
  }
});

router.get("/chats/:roomId", authMiddleware, async (req, res) => {
  try {
    const roomId = Number(req.params.roomId);
    console.log(req.params.roomId);
    const messages = await prismaClient.chat.findMany({
      where: {
        roomId: roomId,
      },
      orderBy: {
        id: "desc",
      },
      take: 1000,
    });

    res.json({
      messages,
    });
  } catch (e) {
    console.log(e);
    res.json({
      messages: [],
    });
  }
});

router.get("/:slug", async (req, res) => {
  const slug = req.params.slug;
  const room = await prismaClient.room.findFirst({
    where: {
      slug,
    },
  });

  res.json({
    room,
  });
});

router.get("/user/rooms", authMiddleware, async (req, res) => {
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const rooms = await prismaClient.room.findMany({
      where: {
        adminId: userId,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({
      rooms,
    });
  } catch (e) {
    console.error("Error fetching user rooms:", e);
    res.status(500).json({
      message: "Failed to fetch rooms",
    });
  }
});

//deltete a room
router.delete("/:roomId", authMiddleware, async (req, res) => {
  const roomId = Number(req.params.roomId);
  const userId = req.userId;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  const room = await prismaClient.room.findFirst({
    where: {
      id: roomId,
      adminId: userId,
    },
  });
  if (!room) {
    return res.status(404).json({
      message: "Room not found",
    });
  }

  try {
    // Delete all chat messages first, then the room
    await prismaClient.chat.deleteMany({
      where: {
        roomId: roomId,
      },
    });

    await prismaClient.room.delete({
      where: {
        id: roomId,
      },
    });

    res.status(200).json({
      message: "Room deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting room:", error);
    res.status(500).json({
      message: "Failed to delete room",
    });
  }
});

// Delete specific chat messages (shapes) from a room
router.delete("/chats/:roomId", authMiddleware, async (req, res) => {
  const roomId = Number(req.params.roomId);
  const userId = req.userId;

  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }

  try {
    const { messageIds } = req.body;

    if (!Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        message: "Invalid message IDs",
      });
    }

    // Delete the specified chat messages
    await prismaClient.chat.deleteMany({
      where: {
        id: {
          in: messageIds,
        },
        roomId: roomId,
      },
    });

    res.status(200).json({
      message: "Messages deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting messages:", error);
    res.status(500).json({
      message: "Failed to delete messages",
    });
  }
});

export default router;
