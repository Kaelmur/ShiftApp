import { PrismaClient } from "@prisma/client";
import { Request, Response, NextFunction } from "express";

const prisma = new PrismaClient();

// Get all brigades
const getBrigades = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user = req.user;

    if (user.role === "SUPER_ADMIN") {
      const brigades = await prisma.brigade.findMany({
        include: {
          company: true,
          users: true,
        },
      });
      return res.status(200).json(brigades);
    }
    if (user.role === "ADMIN") {
      if (!user.companyId) {
        return res
          .status(400)
          .json({ message: "Admin has no company assigned." });
      }

      const brigades = await prisma.brigade.findMany({
        where: { companyId: user.companyId },
        include: { users: true },
      });
      return res.status(200).json(brigades);
    }

    return res.status(403).json({ message: "Access denied." });
  } catch (err) {
    next(err);
  }
};

// Create Brigade
const createBrigade = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const { name, companyId } = req.body;
    const user = req.user!;

    let targetCompanyId: number;

    if (user.role === "SUPER_ADMIN") {
      if (!companyId) {
        return res
          .status(400)
          .json({ message: "SUPER_ADMIN must provide companyId" });
      }
      const company = await prisma.company.findUnique({
        where: { id: companyId },
      });
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      targetCompanyId = companyId;
    } else if (user.role === "ADMIN") {
      if (!user.companyId) {
        return res
          .status(403)
          .json({ message: "ADMIN has no assigned company" });
      }
      targetCompanyId = user.companyId;
    } else {
      return res
        .status(403)
        .json({ message: "Only ADMIN or SUPER_ADMIN can create brigades" });
    }

    const brigade = await prisma.brigade.create({
      data: {
        name,
        companyId: targetCompanyId,
      },
    });

    res.status(201).json(brigade);
  } catch (err) {
    next(err);
  }
};

// Update brigade
const updateBrigade = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user = req.user!;
    const brigadeId = Number(req.params.id);
    const { name, companyId } = req.body;

    const brigade = await prisma.brigade.findUnique({
      where: { id: brigadeId },
      select: {
        id: true,
        name: true,
        companyId: true,
      },
    });

    if (!brigade) {
      return res.status(404).json({ message: "Brigade not found" });
    }

    const isSuperAdmin = user.role === "SUPER_ADMIN";
    const isAdmin = user.role === "ADMIN";

    if (!isSuperAdmin) {
      if (user.companyId !== brigade.companyId) {
        return res.status(403).json({ message: "Access denied" });
      }
    }

    const updateData: any = {};
    if (name !== undefined) updateData.name = name;

    if (companyId !== undefined && isSuperAdmin) {
      updateData.companyId = companyId;
    }

    const updatedBrigade = await prisma.brigade.update({
      where: { id: brigadeId },
      data: updateData,
      select: {
        id: true,
        name: true,
        companyId: true,
      },
    });

    res.json(updatedBrigade);
  } catch (err) {
    next(err);
  }
};

// Get Brigade by ID
const getBrigadeById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const brigadeId = Number(req.params.id);

    if (isNaN(brigadeId)) {
      return res.status(400).json({ message: "Invalid brigade ID." });
    }

    const brigade = await prisma.brigade.findUnique({
      where: { id: brigadeId },
      select: {
        id: true,
        name: true,
        companyId: true,
      },
    });

    if (brigade) {
      return res.status(404).json({ message: "Brigade not found." });
    }

    return res.json(brigade);
  } catch (err) {
    next(err);
  }
};

// Delete brigade
const deleteBrigade = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  try {
    const user = req.user!;
    const brigadeId = Number(req.params.id);

    const brigade = await prisma.brigade.findUnique({
      where: { id: brigadeId },
    });

    if (!brigade) {
      return res.status(404).json({ message: "Brigade not found" });
    }

    // SUPERADMIN can delete any
    if (user.role === "SUPER_ADMIN") {
      await prisma.brigade.delete({ where: { id: brigadeId } });
      return res
        .status(200)
        .json({ message: "Brigade deleted by super admin" });
    }

    // ADMIN can only delete from their company
    if (user.role === "ADMIN") {
      if (brigade.companyId !== user.companyId) {
        return res.status(403).json({
          message: "You cannot delete brigades from other companies.",
        });
      }

      await prisma.brigade.delete({ where: { id: brigadeId } });
      return res.status(200).json({ message: "Brigade deleted by admin" });
    }

    return res
      .status(403)
      .json({ message: "You are not allowed to delete brigades." });
  } catch (err) {
    next(err);
  }
};

export {
  createBrigade,
  getBrigades,
  deleteBrigade,
  updateBrigade,
  getBrigadeById,
};
