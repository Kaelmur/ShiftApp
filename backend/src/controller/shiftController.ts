import { PrismaClient } from "@prisma/client";
import { NextFunction, Request, Response } from "express";

const prisma = new PrismaClient();

export const startShift = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  const now = new Date();

  const todayStart = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  todayStart.setHours(0, 0, 0, 0);

  const todayEnd = new Date(todayStart);
  todayEnd.setHours(23, 59, 59, 999);

  try {
    const existingShift = await prisma.shift.findFirst({
      where: {
        userId: user.id,
        startedAt: {
          gte: todayStart,
          lte: todayEnd,
        },
      },
    });

    if (existingShift) {
      return res.status(400).json({
        message: "Смена уже начиналась сегодня. Попробуйте еще раз завтра.",
      });
    }

    const activeShift = await prisma.shift.findFirst({
      where: { userId: user.id, status: "active" },
    });

    if (activeShift) {
      return res.status(400).json({ message: "Смена уже начата." });
    }

    const shift = await prisma.shift.create({
      data: {
        status: "active",
        startedAt: now,
        user: { connect: { id: user.id } },
        company: { connect: { id: user.companyId } },
        brigade: user.brigadeId
          ? { connect: { id: user.brigadeId } }
          : undefined,
      },
    });

    return res.status(201).json({ shift });
  } catch (err) {
    next(err);
  }
};

export const endShift = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user!;
  const shift = await prisma.shift.findFirst({
    where: {
      userId: user.id,
      status: "active",
    },
  });

  if (!shift) {
    return res.status(404).json({ message: "No active shift found." });
  }

  const now = new Date();
  // const fivePM = new Date(now);
  // fivePM.setHours(17, 0, 0, 0);

  // const effectiveEnd = now > fivePM ? fivePM : now;

  // const durationMs = effectiveEnd.getTime() - shift.startedAt.getTime();
  const durationMs = now.getTime() - shift.startedAt.getTime();
  const durationHours = durationMs / (1000 * 60 * 60);

  const updated = await prisma.shift.update({
    where: { id: shift.id },
    data: {
      status: "ended",
      endedAt: now,
      durationHours: Math.round(durationHours * 100) / 100,
    },
  });

  res.status(200).json({ message: "Shift ended", shift: updated });
};

export const getAllShifts = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> => {
  const user = req.user!;
  try {
    if (user.role === "SUPER_ADMIN") {
      const shifts = await prisma.shift.findMany({
        include: {
          user: true,
          brigade: true,
          company: true,
        },
        orderBy: { startedAt: "desc" },
      });

      return res.json({ shifts });
    }

    if (user.role === "ADMIN") {
      const shifts = await prisma.shift.findMany({
        where: { companyId: user.companyId },
        include: {
          user: true,
          brigade: true,
          company: true,
        },
        orderBy: { startedAt: "desc" },
      });
      return res.json({ shifts });
    }
  } catch (err) {
    next(err);
  }
};

export const getShiftsByUserId = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = Number(req.params.userId);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid userId" });
  }

  try {
    const shifts = await prisma.shift.findMany({
      where: {
        userId,
      },
      include: {
        user: {
          select: { name: true, email: true },
        },
        company: {
          select: { name: true },
        },
        brigade: {
          select: { name: true },
        },
      },
      orderBy: {
        startedAt: "desc",
      },
    });

    return res.json({ shifts });
  } catch (error) {
    next(error);
  }
};
