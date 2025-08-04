import { Router } from "express";
import {
  assignUserToBrigade,
  createUser,
  deleteUser,
  fetchUsersByCompanyId,
  getUsers,
  updateUser,
} from "../controller/userController";
import { adminOnly, protect } from "../middlewares/authMiddleware";

const router = Router();

router.post("/create", protect, adminOnly, createUser);
router.get("/", protect, adminOnly, getUsers);
router.get("/company/:id", protect, adminOnly, fetchUsersByCompanyId);
router.patch("/:id", protect, adminOnly, updateUser);
router.patch("/:id/assign-brigade", protect, adminOnly, assignUserToBrigade);
router.delete("/:id", protect, adminOnly, deleteUser);

export default router;
