import express from "express";
import userRouter from "./UserRouter.js";
import roomRouter from "./RoomRouter.js";
import authMiddleware from "../middleware.js";

const router = express.Router();

router.use("/user", userRouter);
router.use("/room", authMiddleware, roomRouter);

export default router;
