"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const reportController_1 = require("../controller/reportController");
const router = (0, express_1.Router)();
router.get("/export/users", authMiddleware_1.protect, authMiddleware_1.adminOnly, reportController_1.exportUsersReport);
router.get("/export/shifts", authMiddleware_1.protect, authMiddleware_1.adminOnly, reportController_1.exportShiftsReport);
exports.default = router;
//# sourceMappingURL=reportRoutes.js.map