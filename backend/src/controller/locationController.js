"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createShiftLocation = exports.getLocations = void 0;
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const getLocations = async (req, res, next) => {
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
    }
    catch (err) {
        next(err);
    }
};
exports.getLocations = getLocations;
const createShiftLocation = async (req, res, next) => {
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
    }
    catch (err) {
        next(err);
    }
};
exports.createShiftLocation = createShiftLocation;
//# sourceMappingURL=locationController.js.map