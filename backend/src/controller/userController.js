"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveExpoToken = exports.getUserById = exports.getUsersByBrigade = exports.assignUserToBrigade = exports.deleteUser = exports.updateUser = exports.fetchUsersByCompanyId = exports.getUsers = exports.createUser = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const prisma = new client_1.PrismaClient();
const createUser = async (req, res, next) => {
    try {
        const admin = req.user;
        const { name, email, password, role, companyId, brigadeId } = req.body;
        if (admin.role === "ADMIN" && role !== "WORKER") {
            return res
                .status(403)
                .json({ message: "ADMINs can only create WORKERs" });
        }
        if (admin.role === "SUPER_ADMIN" &&
            !["WORKER", "ADMIN", "SUPER_ADMIN"].includes(role)) {
            return res.status(400).json({ message: "Invalid role provided" });
        }
        const userExists = await prisma.user.findUnique({ where: { email } });
        if (userExists) {
            return res.status(400).json({ message: "User already exists!" });
        }
        if (!email || !password || !name || !role) {
            return res.status(400).json({ message: "Missing required fields" });
        }
        const hashedPassword = await bcrypt_1.default.hash(password, 10);
        let assignedCompanyId = null;
        if (admin.role === "SUPER_ADMIN") {
            if (!companyId) {
                return res
                    .status(400)
                    .json({ message: "Company ID is required for SUPER_ADMIN" });
            }
            // 📌 Validate the company exists
            const companyExists = await prisma.company.findUnique({
                where: { id: Number(companyId) },
            });
            if (!companyExists) {
                return res.status(400).json({ message: "Invalid company ID" });
            }
            assignedCompanyId = Number(companyId);
        }
        // 🔐 ADMIN can only assign to their own company
        if (admin.role === "ADMIN") {
            if (!admin.companyId) {
                return res
                    .status(400)
                    .json({ message: "Admin must belong to a company" });
            }
            assignedCompanyId = admin.companyId;
        }
        const user = await prisma.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
                companyId: assignedCompanyId,
                brigadeId,
            },
        });
        res.status(201).json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            companyId: user.companyId,
            brigadeId: user.brigadeId,
        });
    }
    catch (err) {
        next(err);
    }
};
exports.createUser = createUser;
const getUsers = async (req, res, next) => {
    const user = req.user;
    try {
        if (user.role === "SUPER_ADMIN") {
            const users = await prisma.user.findMany({
                include: { company: true, brigade: true },
            });
            const sanitizedUsers = users.map(({ password, ...rest }) => rest);
            return res.json(sanitizedUsers);
        }
        if (user.role === "ADMIN") {
            const users = await prisma.user.findMany({
                where: { companyId: user.companyId },
                include: { company: true, brigade: true },
            });
            const sanitizedUsers = users.map(({ password, ...rest }) => rest);
            return res.json(sanitizedUsers);
        }
        return res.status(403).json({ message: "Access denied." });
    }
    catch (err) {
        next(err);
    }
};
exports.getUsers = getUsers;
// Super Admin only
const fetchUsersByCompanyId = async (req, res) => {
    const user = req.user;
    const companyId = parseInt(req.params.id);
    if (user.role !== "SUPER_ADMIN") {
        return res
            .status(403)
            .json({ message: "Only superadmin can access this route." });
    }
    try {
        const users = await prisma.user.findMany({
            where: { companyId },
            include: { company: true, brigade: true },
        });
        return res.json(users);
    }
    catch (err) {
        console.error(err);
        return res
            .status(500)
            .json({ message: "Failed to fetch users", error: err });
    }
};
exports.fetchUsersByCompanyId = fetchUsersByCompanyId;
const updateUser = async (req, res, next) => {
    const requestingUser = req.user;
    const userIdToUpdate = Number(req.params.id);
    const { name, email, password, role, companyId, brigadeId } = req.body;
    try {
        const userToUpdate = await prisma.user.findUnique({
            where: { id: userIdToUpdate },
        });
        if (!userToUpdate) {
            return res.status(404).json({ message: "User not found" });
        }
        const isSuperAdmin = requestingUser.role === "SUPER_ADMIN";
        if (!isSuperAdmin && requestingUser.companyId !== userToUpdate.companyId) {
            return res.status(403).json({ message: "Access denied" });
        }
        const updateData = {};
        if (name !== undefined)
            updateData.name = name;
        if (email !== undefined)
            updateData.email = email;
        if (role !== undefined)
            updateData.role = role;
        if (brigadeId !== undefined)
            updateData.brigadeId = brigadeId;
        // Only superadmin can change company
        if (companyId !== undefined && isSuperAdmin) {
            updateData.companyId = companyId;
        }
        // If password is included, hash it
        if (password !== undefined) {
            updateData.password = await bcrypt_1.default.hash(password, 10);
        }
        const updatedUser = await prisma.user.update({
            where: { id: userIdToUpdate },
            data: updateData,
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                companyId: true,
                brigadeId: true,
                createdAt: true,
            },
        });
        res.json(updatedUser);
    }
    catch (error) {
        next(error);
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res, next) => {
    const requster = req.user;
    const targetUserId = Number(req.params.id);
    try {
        const targetUser = await prisma.user.findUnique({
            where: { id: targetUserId },
        });
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        if (requster.role === "ADMIN" &&
            requster.companyId !== targetUser.companyId) {
            return res.status(403).json({
                message: "Access denied. Cannot delete user from another company.",
            });
        }
        await prisma.user.delete({ where: { id: targetUserId } });
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch (err) {
        next(err);
    }
};
exports.deleteUser = deleteUser;
const assignUserToBrigade = async (req, res, next) => {
    const userId = Number(req.params.id);
    const { brigadeId } = req.body;
    const currentUser = req.user;
    if (!brigadeId) {
        return res.status(400).json({ message: "Brigade ID is required." });
    }
    try {
        const targetUser = await prisma.user.findUnique({
            where: { id: userId },
            select: { id: true, companyId: true },
        });
        if (!targetUser) {
            return res.status(404).json({ message: "User not found" });
        }
        const targetBrigade = await prisma.brigade.findUnique({
            where: { id: brigadeId },
            select: { id: true, companyId: true },
        });
        if (!targetBrigade) {
            return res.status(404).json({ message: "Brigade not found" });
        }
        if (currentUser.role === "ADMIN") {
            if (targetUser.companyId !== currentUser.companyId ||
                targetBrigade.companyId !== currentUser.companyId) {
                return res.status(403).json({
                    message: "Admins can only assign users and brigades within their company.",
                });
            }
        }
        // Super admin can do whatever
        await prisma.user.update({
            where: { id: userId },
            data: { brigadeId },
        });
        return res.status(200).json({ message: "User assigned to brigade" });
    }
    catch (err) {
        next(err);
    }
};
exports.assignUserToBrigade = assignUserToBrigade;
const getUsersByBrigade = async (req, res, next) => {
    const brigadeId = Number(req.params.id);
    if (isNaN(brigadeId)) {
        return res.status(400).json({ message: "Invalid brigade ID" });
    }
    try {
        const users = await prisma.user.findMany({
            where: {
                brigadeId: brigadeId,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true,
                brigade: {
                    select: {
                        name: true,
                    },
                },
            },
        });
        return res.status(200).json(users);
    }
    catch (err) {
        next(err);
    }
};
exports.getUsersByBrigade = getUsersByBrigade;
const getUserById = async (req, res, next) => {
    try {
        const userId = Number(req.params.id);
        const user = await prisma.user.findUnique({
            where: { id: userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                brigadeId: true,
                companyId: true,
            },
        });
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        return res.json(user);
    }
    catch (err) {
        next(err);
    }
};
exports.getUserById = getUserById;
const saveExpoToken = async (req, res, next) => {
    try {
        const { expoPushToken } = req.body;
        const userId = req.user.id;
        await prisma.user.update({
            where: { id: userId },
            data: { expoPushToken },
        });
        res.json({ message: "Token saved" });
    }
    catch (err) {
        next(err);
    }
};
exports.saveExpoToken = saveExpoToken;
//# sourceMappingURL=userController.js.map