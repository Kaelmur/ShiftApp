"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controller/authController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
// Auth Routes
router.post("/login", authController_1.loginUser);
router.get("/profile", authMiddleware_1.protect, authController_1.getUserProfile);
exports.default = router;
//# sourceMappingURL=authRoutes.js.map