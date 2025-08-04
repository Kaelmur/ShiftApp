import { Router } from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware";
import {
  createBrigade,
  deleteBrigade,
  getBrigades,
} from "../controller/brigadeController";
import { getUsersByBrigade } from "../controller/userController";

const router = Router();

router.post("/create", protect, adminOnly, createBrigade);
router.get("/", protect, adminOnly, getBrigades);
router.get("/:id/users", protect, adminOnly, getUsersByBrigade);
router.delete("/:id", protect, adminOnly, deleteBrigade);

export default router;
