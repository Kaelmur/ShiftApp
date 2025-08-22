import { DateTime } from "luxon";

interface Company {
  id: number;
  name: string;
  createdAt: string;
}

interface CompanyCardProps {
  company: Company;
  onClick?: () => void;
}

function CompanyCard({ company, onClick }: CompanyCardProps) {
  return (
    <div
      className="bg-white dark:bg-darksecondary rounded-xl shadow-md border border-gray-200/60 dark:border-gray-700/50 hover:shadow-lg transition p-4 space-y-3 cursor-pointer"
      onClick={onClick}
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-md font-semibold text-gray-900 dark:text-white">
          Компания: {company.name}
        </h3>
        <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
          ID: {company.id}
        </span>
      </div>

      {/* Created At */}
      <div>
        <p className="text-xs text-gray-500 dark:text-gray-400">Создана</p>
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {DateTime.fromISO(company.createdAt, { zone: "Asia/Almaty" })
            .setLocale("ru")
            .toFormat("dd MMMM yyyy, HH:mm")}
        </p>
      </div>
    </div>
  );
}

export default CompanyCard;
