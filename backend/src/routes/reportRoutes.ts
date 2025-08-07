import express, { Router } from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware";
import { exportUsersReport } from "../controller/reportController";

const router = Router();

router.get("/export/users", protect, adminOnly, exportUsersReport);

export default router;
