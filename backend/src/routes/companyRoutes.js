"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const companyController_1 = require("../controller/companyController");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const router = (0, express_1.Router)();
router.post("/", authMiddleware_1.protect, authMiddleware_1.superAdminOnly, companyController_1.createCompany);
router.get("/", authMiddleware_1.protect, authMiddleware_1.superAdminOnly, companyController_1.getCompanies);
router.get("/:id", authMiddleware_1.protect, authMiddleware_1.superAdminOnly, companyController_1.getCompanyById);
router.patch("/:id", authMiddleware_1.protect, authMiddleware_1.superAdminOnly, companyController_1.updateCompany);
router.delete("/:id", authMiddleware_1.protect, authMiddleware_1.superAdminOnly, companyController_1.deleteCompany);
exports.default = router;
//# sourceMappingURL=companyRoutes.js.map