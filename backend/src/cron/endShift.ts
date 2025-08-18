import cron from "node-cron";
import { DateTime } from "luxon";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

cron.schedule(
  "10 11 * * *",
  async () => {
    const now = DateTime.now().setZone("Asia/Almaty");

    try {
      const activeShifts = await prisma.shift.findMany({
        where: { status: "active" },
      });

      for (const shift of activeShifts) {
        await prisma.shift.update({
          where: { id: shift.id },
          data: {
            endedAt: now.toJSDate(),
            status: "ended",
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
