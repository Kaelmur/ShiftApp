import { Router } from "express";
import {
  createCompany,
  deleteCompany,
  getCompanies,
  getCompanyById,
  updateCompany,
} from "../controller/companyController";
import { protect, superAdminOnly } from "../middlewares/authMiddleware";

const router = Router();

router.post("/", protect, superAdminOnly, createCompany);
router.get("/", protect, superAdminOnly, getCompanies);
router.get("/:id", protect, superAdminOnly, getCompanyById);
router.patch("/:id", protect, superAdminOnly, updateCompany);
router.delete("/:id", protect, superAdminOnly, deleteCompany);

export default router;
