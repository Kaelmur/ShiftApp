import { PrismaClient } from "@prisma/client";
import { NextFunction, Response, Request } from "express";

const prisma = new PrismaClient();

export const getLocations = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const shiftId = Number(req.params.shiftId);

  if (isNaN(shiftId)) {
    return res.status(400).json({ message: "Invalid shift ID" });
  }
  try {
    const location = await prisma.shiftLocation.findMany({
      where: { shiftId },
      orderBy: { timestamp: "desc" },
    });

    res.json(location);
  } catch (err) {
    next(err);
  }
};

export const createShiftLocation = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { shiftId, lat, lng, timestamp } = req.body;

  if (!shiftId || !lat || !lng) {
    return res.status(400).json({ error: "Missing required fields" });
  }
  try {
    const existing = await prisma.shiftLocation.findFirst({
      where: {
        shiftId: Number(shiftId),
        timestamp: timestamp ? new Date(Number(timestamp)) : new Date(), // Prisma matches exact Date
      },
    });

    if (existing) {
      return res.status(200).json({ success: true, location: existing });
    }

    const location = await prisma.shiftLocation.create({
      data: {
        shiftId: parseFloat(shiftId),
        latitude: parseFloat(lat),
        longitude: parseFloat(lng),
        timestamp: timestamp ? new Date(Number(timestamp)) : new Date(),
      },
    });

    res.status(201).json({ success: true, location });
  } catch (err) {
    next(err);
  }
};
