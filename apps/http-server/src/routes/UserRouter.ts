import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { SignupBody, SigninBody } from "@repo/common/config";
import { JWT_SECRET } from "@repo/backend-common/config";
import { prismaClient } from "@repo/db/client";
import authMiddleware from "../middleware.js";
const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, password, name } = SignupBody.parse(req.body);
    const existing = await prismaClient.user.findFirst({
      where: {
        email: username,
      },
    });
    if (existing) {
      return res.status(400).json({
        message: "User Already Exists",
      });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await prismaClient.user.create({
      data: {
        email: username,
        name: name,
        password: hashPassword,
      },
    });
    const userId = user.id;
    const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: "1h" });
    res.status(200).json({
      message: "Sign up success",
      username,
      name,
      token,
    });
  } catch (e) {
    console.error("Sign up error", e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.post("/signin", async (req, res) => {
  try {
    const { username, password } = SigninBody.parse(req.body);
    const user = await prismaClient.user.findUnique({
      where: { email: username },
    });
    if (user && (await bcrypt.compare(password, user.password))) {
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
        expiresIn: "1h",
      });
      return res.status(200).json({
        message: "sign in success",
        token,
      });
    } else {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }
  } catch (e) {
    console.error("Error while sign in", e);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

router.get("/me", authMiddleware, async (req, res) => {

  const userId = req.userId;
  try {
    const user = await prismaClient.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true },
    });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(user);
  } catch (e) {
    console.error("Error fetching user", e);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
