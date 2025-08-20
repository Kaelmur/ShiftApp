import moment from "moment/min/moment-with-locales";

moment.locale("ru");

function BrigadeCard({ name, userCount, onClick }: BrigadeCardProps) {
  return (
    <div
      className="bg-white dark:bg-darksecondary rounded-xl py-4 shadow-md dark:shadow-xs shadow-gray-100 dark:shadow-gray-500 border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-500/50 dark:hover:border-gray-300/50 cursor-pointer"
      onClick={onClick}
    >
      <div className="px-4">
        <div className="flex justify-between items-center">
          <h3 className="text-md font-semibold text-gray-800 dark:text-white">
            {name}
          </h3>
          <label className="text-xs text-gray-500 dark:text-gray-400">
            Работников: {userCount}
          </label>
        </div>
      </div>
    </div>
  );
}

export default BrigadeCard;
