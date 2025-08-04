import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import UserCard from "../../components/Cards/UserCard";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import { useLocation, useNavigate } from "react-router-dom";

interface User {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "SUPER_ADMIN";
  brigade: {
    name: string;
  };
  createdAt: string;
  updatedAt: string;
  onClick: () => void;
}

function ManageUsersByBrigade() {
  const navigate = useNavigate();
  const location = useLocation();
  const { brigadeId }: { brigadeId: string } = location.state || {};
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const handleUserClick = (userId: string) => {
    navigate(`/admin/users/${userId}/shifts`);
  };

  const getBrigadeUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.USERS.GET_USER_BY_BRIGADE(brigadeId)
      );
      if (response.data?.length > 0) {
        setUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getBrigadeUsers();
  }, []);

  return (
    <DashboardLayout activeMenu="Работники">
      {loading ? (
        <div className="flex justify-center items-center min-h-[200px] w-full">
          <Spinner />
        </div>
      ) : (
        <div className="mt-5 mb-10">
          <div className="flex md:flex-row md:items-center justify-between">
            <h2 className="text-xl md:text-xl font-medium">
              Работники бригады: {users[0]?.brigade.name || "Неизвестно"}
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {users.length === 0 && <p>Нет пользователей в этой бригаде.</p>}
            {users?.map((user) => (
              <UserCard
                key={user.id}
                userInfo={user}
                onClick={() => handleUserClick(user.id)}
              />
            ))}
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}

export default ManageUsersByBrigade;
