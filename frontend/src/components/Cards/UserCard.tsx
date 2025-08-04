interface UserInfo {
  id: string;
  name: string;
  email: string;
  createdAt: string;
  updatedAt: string;
  role: string;
  brigade: {
    name: string;
  };
  onClick: () => void;
}

interface UserCardProps {
  userInfo: UserInfo;
  onClick?: () => void;
}

function UserCard({ userInfo, onClick }: UserCardProps) {
  return (
    <div className="user-card p-2" onClick={onClick}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <h3 className="text-base font-semibold text-gray-900 dark:text-white">
              {userInfo.name}
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {userInfo.email}
            </p>

            <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-600 dark:text-gray-300">
              <span className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                Роль: {userInfo.role}
              </span>
              {userInfo.brigade && (
                <span className="bg-indigo-100 dark:bg-indigo-900/40 text-indigo-600 dark:text-indigo-300 px-2 py-0.5 rounded">
                  Бригада: {userInfo.brigade.name}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserCard;
