import { DateTime } from "luxon";

interface ShiftCardProps {
  id: number;
  status: string;
  startedAt: string;
  endedAt: string;
  durationHours: number;
  user: {
    name: string;
    email: string;
  };
  company: {
    name: string;
  };
  brigade: {
    name: string;
  } | null;
  onClick?: () => void;
}

function ShiftCard({
  status,
  startedAt,
  endedAt,
  durationHours,
  user,
  company,
  brigade,
  onClick,
}: ShiftCardProps) {
  const statusColor =
    {
      active: "text-green-600 bg-green-100 dark:bg-green-900",
      ended: "text-red-600 bg-red-100 dark:bg-red-900",
    }[status] ?? "text-gray-600 bg-gray-100 dark:bg-gray-800";

  return (
    <div
      className="bg-white dark:bg-darksecondary rounded-xl shadow-md border border-gray-200/60 dark:border-gray-700/50 hover:shadow-lg transition p-4 space-y-3 cursor-pointer"
      onClick={onClick}
    >
      {/* Top Section */}
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white">
          Смена:{" "}
          {DateTime.fromISO(startedAt, { zone: "Asia/Almaty" })
            .setLocale("ru")
            .toFormat("dd MMMM yyyy")}
        </h3>
        <span
          className={`text-xs font-semibold px-2 py-1 rounded-full ${statusColor}`}
        >
          {status === "active"
            ? "Активна"
            : status === "ended"
            ? "Завершена"
            : "Неизвестно"}
        </span>
      </div>

      {/* Times */}
      <div className="grid grid-cols-2 gap-3 text-sm">
        <div>
          <p className="text-gray-500 dark:text-gray-400">Начало</p>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {startedAt
              ? DateTime.fromISO(startedAt, { zone: "Asia/Almaty" })
                  .setLocale("ru")
                  .toFormat("HH:mm")
              : "-"}
          </p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400">Окончание</p>
          <p className="font-medium text-gray-900 dark:text-gray-100">
            {endedAt
              ? DateTime.fromISO(endedAt, { zone: "Asia/Almaty" })
                  .setLocale("ru")
                  .toFormat("HH:mm")
              : "—"}
          </p>
        </div>
      </div>

      {/* Duration */}
      <div>
        <p className="text-gray-500 text-sm dark:text-gray-400">Длительность</p>
        <p className="font-medium text-gray-800 dark:text-gray-200">
          {durationHours ?? "?"} ч.
        </p>
      </div>

      {/* Worker info */}
      <div className="pt-2 border-t border-dashed border-gray-200 dark:border-gray-700">
        <p className="text-sm text-gray-500 dark:text-gray-400">Работник</p>
        <p className="text-md font-semibold text-gray-900 dark:text-white">
          {user.name}
        </p>
        <p className="text-xs text-gray-500 dark:text-gray-400">{user.email}</p>
      </div>

      {/* Brigade & Company */}
      <div className="grid grid-cols-2 gap-3 pt-2">
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Бригада</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
            {brigade?.name ?? "—"}
          </p>
        </div>
        <div>
          <p className="text-xs text-gray-500 dark:text-gray-400">Компания</p>
          <p className="text-sm font-medium text-gray-900 dark:text-gray-300">
            {company.name}
          </p>
        </div>
      </div>
    </div>
  );
}

export default ShiftCard;
