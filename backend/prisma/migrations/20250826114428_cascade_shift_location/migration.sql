-- DropForeignKey
ALTER TABLE "ShiftLocation" DROP CONSTRAINT "ShiftLocation_shiftId_fkey";

-- AddForeignKey
ALTER TABLE "ShiftLocation" ADD CONSTRAINT "ShiftLocation_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE CASCADE ON UPDATE CASCADE;
