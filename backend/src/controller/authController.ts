import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// Generate JWT Token
const generateToken = (userId: string, name: string) => {
  return jwt.sign({ id: userId, name: name }, process.env.JWT_SECRET!, {
    expiresIn: "7d",
  });
};

// Login User
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user?.password))) {
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
      token: generateToken(user.id.toString(), user.name.toString()),
    });
  } catch (err) {
    next(err);
  }
};

export const getUserProfile = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
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
    if (!user) return res.status(404).json({ message: "User not found." });

    res.json(user);
  } catch (err) {
    next(err);
  }
};
