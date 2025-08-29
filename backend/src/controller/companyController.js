"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = exports.updateCompany = exports.getCompanyById = exports.getCompanies = exports.createCompany = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const createCompany = async (req, res, next) => {
    try {
        const { name } = req.body;
        const company = await prisma.company.create({ data: { name } });
        res.status(201).json(company);
    }
    catch (err) {
        next(err);
    }
};
exports.createCompany = createCompany;
const getCompanies = async (req, res, next) => {
    try {
        const companies = await prisma.company.findMany();
        res.status(200).json(companies);
    }
    catch (err) {
        next(err);
    }
};
exports.getCompanies = getCompanies;
const getCompanyById = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const company = await prisma.company.findUnique({ where: { id } });
        if (!company) {
            return res.status(404).json({ message: "Company not found." });
        }
        res.status(200).json(company);
    }
    catch (err) {
        next(err);
    }
};
exports.getCompanyById = getCompanyById;
const updateCompany = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        const { name } = req.body;
        const updated = await prisma.company.update({
            where: { id },
            data: { name },
        });
        res.status(200).json(updated);
    }
    catch (err) {
        next(err);
    }
};
exports.updateCompany = updateCompany;
const deleteCompany = async (req, res, next) => {
    try {
        const id = Number(req.params.id);
        await prisma.company.delete({ where: { id } });
        res.status(200).json({ message: "Company deleted successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteCompany = deleteCompany;
//# sourceMappingURL=companyController.js.map