import { Router, Request, Response } from "express";

const router = Router();

// Health Check Route
router.get("/", async (req: Request, res: Response) => {
  return res.status(200).json({ message: "Server is running" });
});

export default router;