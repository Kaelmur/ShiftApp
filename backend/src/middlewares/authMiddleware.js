"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.superAdminOnly = exports.adminOnly = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        if (token && token.startsWith("Bearer")) {
            token = token.split(" ")[1];
            const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
            const user = await prisma.user.findUnique({
                where: { id: Number(decoded.id) },
                select: {
                    id: true,
                    email: true,
                    name: true,
                    role: true,
                    companyId: true,
                    brigadeId: true,
                    createdAt: true,
                },
            });
            if (!user) {
                return res.status(401).json({ message: "User not found" });
            }
            req.user = user;
            next();
        }
        else {
            res.status(401).json({ message: "Not authorized, no token" });
        }
    }
    catch (err) {
        res.status(401).json({
            message: "Token failed",
            error: err instanceof Error ? err.message : "Unknown error",
        });
    }
};
exports.protect = protect;
const adminOnly = (req, res, next) => {
    const user = req.user;
    if (user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
        next();
    }
    else {
        res.status(403).json({ message: "Access denied, admin only" });
    }
};
exports.adminOnly = adminOnly;
const superAdminOnly = (req, res, next) => {
    if (req.user?.role === "SUPER_ADMIN") {
        return next();
    }
    return res.status(403).json({
        message: "Access denied. Super Admin only.",
    });
};
exports.superAdminOnly = superAdminOnly;
//# sourceMappingURL=authMiddleware.js.map