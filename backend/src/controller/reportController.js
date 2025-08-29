"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.exportShiftsReport = exports.exportUsersReport = void 0;
const exceljs_1 = __importDefault(require("exceljs"));
const client_1 = require("@prisma/client");
const luxon_1 = require("luxon");
const prisma = new client_1.PrismaClient();
// @desc Export all tasks as an Excel file
// @route GET /api/reports/export/tasks
// @access Private(Admin)
// const exportTasksReport = async (
//   req: Request,
//   res: Response,
//   next: NextFunction
// ): Promise<any> => {
//   try {
//     const tasks = await Task.find()
//       .populate("assignedTo", "name email")
//       .sort({ dueDate: 1 });
//     const workbook = new excelJS.Workbook();
//     const worksheet = workbook.addWorksheet("Отчет о задачах");
//     worksheet.columns = [
//       { header: "id", key: "_id", width: 25 },
//       { header: "Название", key: "title", width: 30 },
//       { header: "Описание", key: "description", width: 50 },
//       { header: "Приоритет", key: "priority", width: 15 },
//       { header: "Статус", key: "status", width: 20 },
//       { header: "Дата окончания", key: "dueDate", width: 20 },
//       {
//         header: "Объем",
//         key: "amount",
//         width: 30,
//         style: { alignment: { horizontal: "left" } },
//       },
//       { header: "Назначено", key: "assignedTo", width: 30 },
//     ];
//     tasks.forEach((task) => {
//       const assignedTo = task.assignedTo
//         .map((user: any) => `${user.name} (${user.email})`)
//         .join(", ");
//       worksheet.addRow({
//         _id: task._id,
//         title: task.title,
//         description: task.description,
//         priority: priorityMap[task.priority] || task.priority,
//         status: statusMap[task.status] || task.status,
//         dueDate: task.dueDate.toISOString().split("T")[0],
//         amount: task.amount,
//         assignedTo: assignedTo || "Неназначено",
//       });
//     });
//     res.setHeader(
//       "Content-Type",
//       "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
//     );
//     res.setHeader(
//       "Content-Disposition",
//       "attachment; filename='tasks_report.xlsx'"
//     );
//     return workbook.xlsx.write(res).then(() => {
//       res.end();
//     });
//   } catch (err) {
//     next(err);
//   }
// };
// @desc Export user-task report as an Excel file
// @route GET /api/reports/export/users
// @access Private (Admin)
const exportUsersReport = async (req, res, next) => {
    try {
        const users = await prisma.user.findMany({
            where: { role: "WORKER" },
            select: {
                id: true,
                name: true,
                email: true,
                brigade: { select: { name: true } },
                shifts: { select: { status: true } },
            },
        });
        const reportData = users.map((user) => {
            const totalShifts = user.shifts.length;
            return {
                name: user.name,
                email: user.email,
                brigade: user.brigade?.name || "—",
                totalShifts,
            };
        });
        const workbook = new exceljs_1.default.Workbook();
        const worksheet = workbook.addWorksheet("Отчет о Рабочих");
        worksheet.columns = [
            { header: "Имя", key: "name", width: 30 },
            { header: "Почта", key: "email", width: 30 },
            { header: "Бригада", key: "brigade", width: 25 },
            { header: "Всего смен", key: "totalShifts", width: 20 },
        ];
        reportData.forEach((row) => {
            worksheet.addRow(row);
        });
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("Content-Disposition", "attachment; filename='users_report.xlsx'");
        return workbook.xlsx.write(res).then(() => {
            res.end();
        });
    }
    catch (err) {
        next(err);
    }
};
exports.exportUsersReport = exportUsersReport;
const exportShiftsReport = async (req, res, next) => {
    try {
        const { brigadeId, month, year } = req.query;
        if (!brigadeId || !month || !year) {
            return res.status(400).json({ message: "Missing parameters" });
        }
        const startDate = luxon_1.DateTime.local(Number(year), Number(month), 1);
        const endDate = startDate.endOf("month");
        const daysInMonth = endDate.day;
        const shifts = await prisma.shift.findMany({
            where: {
                brigadeId: Number(brigadeId),
                startedAt: { gte: startDate.toJSDate(), lte: endDate.toJSDate() },
                NOT: { endedAt: null },
            },
            include: { user: { select: { name: true } } },
        });
        // Map user → { day: hours }
        const usersMap = {};
        shifts.forEach((shift) => {
            const start = luxon_1.DateTime.fromJSDate(shift.startedAt);
            const end = luxon_1.DateTime.fromJSDate(shift.endedAt);
            const diff = end.diff(start, ["hours", "minutes"]);
            const totalMinutes = diff.hours * 60 + diff.minutes;
            const excelTime = totalMinutes / (24 * 60); // fraction of day
            const day = start.day;
            if (!usersMap[shift.user.name]) {
                usersMap[shift.user.name] = {};
            }
            usersMap[shift.user.name][day] =
                (usersMap[shift.user.name][day] || 0) + excelTime;
        });
        const workbook = new exceljs_1.default.Workbook();
        const sheet = workbook.addWorksheet("Отчёт");
        // ---- First header row ----
        const firstRow = ["№", "ФИО", "Числа месяца"];
        sheet.addRow(firstRow);
        // Merge "Числа месяца" across all day columns
        // row 1, col 3 → row 1, col N+2
        sheet.mergeCells(1, 3, 1, daysInMonth + 2);
        // ---- Second header row ----
        const secondRow = ["", ""]; // empty under № and ФИО
        for (let d = 1; d <= daysInMonth; d++) {
            secondRow.push(d.toString());
        }
        sheet.addRow(secondRow);
        // Set column widths + formats
        sheet.getColumn(1).width = 5; // №
        sheet.getColumn(2).width = 25; // ФИО
        for (let d = 3; d <= daysInMonth + 2; d++) {
            sheet.getColumn(d).width = 10;
            sheet.getColumn(d).numFmt = "hh:mm";
        }
        // ---- Add worker rows ----
        let counter = 1;
        Object.entries(usersMap).forEach(([name, days]) => {
            const row = [counter, name];
            for (let d = 1; d <= daysInMonth; d++) {
                const value = days[d];
                if (value && value > 0) {
                    row.push(value); // excelTime fraction of a day
                }
                else {
                    row.push(""); // leave blank
                }
            }
            sheet.addRow(row);
            counter++;
        });
        sheet.eachRow((row) => {
            row.eachCell((cell) => {
                cell.alignment = { vertical: "middle", horizontal: "center" };
            });
        });
        res.setHeader("Content-Disposition", `attachment; filename="report_${year}_${month}.xlsx"`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        await workbook.xlsx.write(res);
        res.end();
    }
    catch (err) {
        next(err);
    }
};
exports.exportShiftsReport = exportShiftsReport;
//# sourceMappingURL=reportController.js.map