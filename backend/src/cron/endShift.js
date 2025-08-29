"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const node_cron_1 = __importDefault(require("node-cron"));
const luxon_1 = require("luxon");
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
node_cron_1.default.schedule("* 17 * * *", // minute, hour, day of month, month, day of week
async () => {
    const now = luxon_1.DateTime.now().setZone("Asia/Almaty");
    try {
        const updated = await prisma.$executeRawUnsafe(`
        UPDATE "Shift"
        SET "endedAt" = NOW(),
            "status" = 'ended',
            "durationHours" = ROUND(EXTRACT(EPOCH FROM (NOW() - "startedAt")) / 3600, 2)
        WHERE "status" = 'active'
      `);
        console.log(`[CRON] Ended ${updated} shifts at ${new Date().toISOString()}`);
    }
    catch (err) {
        console.error("Failed to auto-end shifts:", err);
    }
}, {
    timezone: "Asia/Almaty",
});
//# sourceMappingURL=endShift.js.map