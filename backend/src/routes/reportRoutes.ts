import express, { Router } from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware";
import {
  exportShiftsReport,
  exportUsersReport,
} from "../controller/reportController";

const router = Router();

router.get("/export/users", protect, adminOnly, exportUsersReport);
router.get("/export/shifts", protect, adminOnly, exportShiftsReport);

export default router;
