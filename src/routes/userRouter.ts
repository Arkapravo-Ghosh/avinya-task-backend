import { Router } from "express";
import { loginController, verifyController } from "../controllers/userController";
import authenticateToken from "../middlewares/authenticateToken";

const router = Router();

// Login Route
router.post("/login", loginController);
router.post("/verify", authenticateToken, verifyController);

export default router;