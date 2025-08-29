"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const brigadeController_1 = require("../controller/brigadeController");
const userController_1 = require("../controller/userController");
const router = (0, express_1.Router)();
router.post("/create", authMiddleware_1.protect, authMiddleware_1.adminOnly, brigadeController_1.createBrigade);
router.get("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, brigadeController_1.getBrigades);
router.patch("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, brigadeController_1.updateBrigade);
router.get("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, brigadeController_1.getBrigadeById);
router.get("/:id/users", authMiddleware_1.protect, authMiddleware_1.adminOnly, userController_1.getUsersByBrigade);
router.delete("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, brigadeController_1.deleteBrigade);
exports.default = router;
//# sourceMappingURL=brigadeRotes.js.map