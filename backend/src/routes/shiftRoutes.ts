import { Router } from "express";
import { adminOnly, protect } from "../middlewares/authMiddleware";
import {
  checkActiveShift,
  endShift,
  getAllShifts,
  getShiftsByUserId,
  startShift,
} from "../controller/shiftController";
import {
  createShiftLocation,
  getLocations,
} from "../controller/locationController";

const router = Router();

router.post("/start", protect, startShift);
router.patch("/end", protect, endShift);
router.get("/", protect, adminOnly, getAllShifts);
router.get("/user/:userId", protect, adminOnly, getShiftsByUserId);
router.get("/:shiftId/locations", protect, adminOnly, getLocations);
router.post("/shift-location", protect, createShiftLocation);

router.get("/shifts/active", protect, checkActiveShift);

export default router;
