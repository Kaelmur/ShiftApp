import { Router } from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware";
import {
  createBrigade,
  deleteBrigade,
  getBrigadeById,
  getBrigades,
  updateBrigade,
} from "../controller/brigadeController";
import { getUsersByBrigade } from "../controller/userController";

const router = Router();

router.post("/create", protect, adminOnly, createBrigade);
router.get("/", protect, adminOnly, getBrigades);
router.patch("/:id", protect, adminOnly, updateBrigade);
router.get("/:id", protect, adminOnly, getBrigadeById);
router.get("/:id/users", protect, adminOnly, getUsersByBrigade);
router.delete("/:id", protect, adminOnly, deleteBrigade);

export default router;
