import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { PrismaClient } from "@prisma/client";

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

const prisma = new PrismaClient();

const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token = req.headers.authorization;

    if (token && token.startsWith("Bearer")) {
      token = token.split(" ")[1];
      const decoded = jwt.verify(
        token,
        process.env.JWT_SECRET!
      ) as jwt.JwtPayload;
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
    } else {
      res.status(401).json({ message: "Not authorized, no token" });
    }
  } catch (err) {
    res.status(401).json({
      message: "Token failed",
      error: err instanceof Error ? err.message : "Unknown error",
    });
  }
};

const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  const user = req.user;

  if (user && (user.role === "ADMIN" || user.role === "SUPER_ADMIN")) {
    next();
  } else {
    res.status(403).json({ message: "Access denied, admin only" });
  }
};

const superAdminOnly = (req: Request, res: Response, next: NextFunction) => {
  if (req.user?.role === "SUPER_ADMIN") {
    return next();
  }

  return res.status(403).json({
    message: "Access denied. Super Admin only.",
  });
};

export { protect, adminOnly, superAdminOnly };
