import cron from "node-cron";
import { DateTime } from "luxon";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

cron.schedule(
  "* 17 * * *", // minute, hour, day of month, month, day of week
  async () => {
    const now = DateTime.now().setZone("Asia/Almaty");

    try {
      const activeShifts = await prisma.shift.findMany({
        where: { status: "active" },
      });

      for (const shift of activeShifts) {
        const durationMs = now.toJSDate().getTime() - shift.startedAt.getTime();
        const durationHours = durationMs / (1000 * 60 * 60);

        await prisma.shift.update({
          where: { id: shift.id },
          data: {
            endedAt: now.toJSDate(),
            status: "ended",
            durationHours: Math.round(durationHours * 100) / 100,
          },
        });
      }
      console.log(
        `[CRON] Ended ${activeShifts.length} shifts at ${now.toISO()}`
      );
    } catch (err) {
      console.error("Failed to auto-end shifts:", err);
    }
  },
  {
    timezone: "Asia/Almaty",
  }
);
