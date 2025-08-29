"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const userController_1 = require("../controller/userController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post("/create", authMiddleware_1.protect, authMiddleware_1.adminOnly, userController_1.createUser);
router.get("/", authMiddleware_1.protect, authMiddleware_1.adminOnly, userController_1.getUsers);
router.get("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, userController_1.getUserById);
router.get("/company/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, userController_1.fetchUsersByCompanyId);
router.post("/expo-token", authMiddleware_1.protect, userController_1.saveExpoToken);
router.patch("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, userController_1.updateUser);
router.patch("/:id/assign-brigade", authMiddleware_1.protect, authMiddleware_1.adminOnly, userController_1.assignUserToBrigade);
router.delete("/:id", authMiddleware_1.protect, authMiddleware_1.adminOnly, userController_1.deleteUser);
exports.default = router;
//# sourceMappingURL=userRoutes.js.map