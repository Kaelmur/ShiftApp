import { Router } from "express";
import { getUserProfile, loginUser } from "../controller/authController";
import { protect } from "../middlewares/authMiddleware";

const router = Router();

// Auth Routes
router.post("/login", loginUser);
router.get("/profile", protect, getUserProfile);

export default router;
