import cron from "node-cron";
import { DateTime } from "luxon";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

cron.schedule(
  "* 11 * * *", // minute, hour, day of month, month, day of week
  async () => {
    const now = DateTime.now().setZone("Asia/Almaty");

    try {
      const updated = await prisma.$executeRawUnsafe(`
        UPDATE "Shift"
        SET "endedAt" = NOW(),
            "status" = 'ended',
            "durationHours" = ROUND(EXTRACT(EPOCH FROM (NOW() - "startedAt")) / 3600, 2)
        WHERE "status" = 'active'
      `);

      console.log(
        `[CRON] Ended ${updated} shifts at ${new Date().toISOString()}`
      );
    } catch (err) {
      console.error("Failed to auto-end shifts:", err);
    }
  },
  {
    timezone: "Asia/Almaty",
  }
);
