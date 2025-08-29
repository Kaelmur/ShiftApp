"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const shiftController_1 = require("../controller/shiftController");
const locationController_1 = require("../controller/locationController");
const router = (0, express_1.Router)();
router.post("/start", authMiddleware_1.protect, shiftController_1.startShift);
router.patch("/end", authMiddleware_1.protect, shiftController_1.endShift);
router.get("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, shiftController_1.getAllShifts);
router.get("/user/:userId", authMiddleware_1.protect, authMiddleware_1.adminOnly, shiftController_1.getShiftsByUserId);
router.get("/:shiftId/locations", authMiddleware_1.protect, authMiddleware_1.adminOnly, locationController_1.getLocations);
router.post("/shift-location", authMiddleware_1.protect, locationController_1.createShiftLocation);
router.get("/active", authMiddleware_1.protect, shiftController_1.checkActiveShift);
exports.default = router;
//# sourceMappingURL=shiftRoutes.js.map