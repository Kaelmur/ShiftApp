import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import { LuFileSpreadsheet } from "react-icons/lu";
import UserCard from "../../components/Cards/UserCard";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import Pagination from "@/components/Pagination";

function ManageUsers() {
  const [allUsers, setAllUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(9);

  const getAllUsers = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.USERS.GET_ALL_USERS);
      if (response.data?.length > 0) {
        setAllUsers(response.data);
      }
    } catch (error) {
      console.error("Error fetching users", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (userData: User) => {
    navigate("/admin/users/create", { state: { userId: userData.id } });
  };

  // donwload task report
  const handleDownloadReport = async () => {
    try {
      const response = await axiosInstance.get(API_PATHS.REPORTS.EXPORT_USERS, {
        responseType: "blob",
      });

      // Create a URL for the blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", "отчет_о_пользователях.xlsx");
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading expense details:", error);
      toast.error("Ошибка при загрузке деталей о пользователях.");
    }
  };

  useEffect(() => {
    getAllUsers();
  }, []);

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = allUsers.slice(indexOfFirstUser, indexOfLastUser);

  return (
    <DashboardLayout activeMenu="Работники">
      <div className="mt-5 mb-10">
        <Button
          onClick={() => navigate("/admin/users/create")}
          className="fixed bottom-6 right-6 z-50 bg-primary text-white dark:text-black px-5 py-5 rounded-full shadow-lg dark:shadow-sm shadow-gray-400 dark:shadow-gray-600 hover:bg-blue-700 dark:hover:bg-gray-400 transition cursor-pointer"
        >
          + Создать работника
        </Button>
        <div className="flex md:flex-row md:items-center justify-between">
          <h2 className="text-xl md:text-xl font-medium">Работники</h2>

          <button
            className="flex md:flex download-btn"
            onClick={handleDownloadReport}
          >
            <LuFileSpreadsheet className="text-lg" />
            Скачать отчет
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px] w-full">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {currentUsers?.map((user) => (
              <UserCard
                key={user.id}
                userInfo={user}
                onClick={() => {
                  handleClick(user);
                }}
              />
            ))}
          </div>
        )}
        <Pagination
          itemsPerPage={usersPerPage}
          totalItems={allUsers.length}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
        />
      </div>
    </DashboardLayout>
  );
}

export default ManageUsers;
