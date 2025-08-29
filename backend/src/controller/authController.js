"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProfile = exports.loginUser = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
// Generate JWT Token
const generateToken = (userId, name, role) => {
    return jsonwebtoken_1.default.sign({ id: userId, name: name, role: role }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });
};
// Login User
const loginUser = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt_1.default.compare(password, user?.password))) {
            return res.status(401).json({ message: "Invalid email or password" });
        }
        res.json({
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            brigadeId: user.brigadeId,
            companyId: user.companyId,
            createdAt: user.createdAt,
            token: generateToken(user.id.toString(), user.name.toString(), user.role.toString()),
        });
    }
    catch (err) {
        next(err);
    }
};
exports.loginUser = loginUser;
const getUserProfile = async (req, res, next) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
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
        if (!user)
            return res.status(404).json({ message: "User not found." });
        res.json(user);
    }
    catch (err) {
        next(err);
    }
};
exports.getUserProfile = getUserProfile;
//# sourceMappingURL=authController.js.map