import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import UserCard from "../../components/Cards/UserCard";
import toast from "react-hot-toast";
import Spinner from "@/components/Spinner";
import { useLocation, useNavigate } from "react-router-dom";
import { DateTime } from "luxon";
import { LuFileSpreadsheet } from "react-icons/lu";
import Modal from "@/components/Modal";
import { Button } from "@/components/ui/button";
import DeleteAlert from "@/components/DeleteAlert";

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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [months, setMonths] = useState<
    { name: string; month: number; year: number }[]
  >([]);

  const handleUserClick = (userId: string) => {
    navigate(`/admin/users/${userId}/shifts`);
  };

  const handleDelete = async () => {
    try {
      await axiosInstance.delete(API_PATHS.BRIGADES.DELETE_BRIGADE(brigadeId));
      toast.success("Бригада удалена успешно.");
    } catch (error) {
      console.error(error);
      toast.error(error as string);
      alert("Something went wrong");
    } finally {
      setShowModal(false);
      navigate("/admin/dashboard");
    }
  };

  const handleDownload = async (month: number, year: number) => {
    try {
      const res = await axiosInstance.get(
        `${API_PATHS.REPORTS.EXPORT_SHIFTS}?brigadeId=${brigadeId}&month=${month}&year=${year}`,
        { responseType: "blob" }
      );

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `табель_${year}_${month}.xlsx`);
      document.body.appendChild(link);
      link.click();
    } catch (err) {
      console.error(err);
    }
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

  const openReportModal = () => {
    const now = DateTime.now().setLocale("ru");
    const lastSixMonths = Array.from({ length: 6 }, (_, i) => {
      const date = now.minus({ months: i });
      return {
        name: date.toFormat("LLLL yyyy"),
        month: date.month,
        year: date.year,
      };
    });
    setMonths(lastSixMonths);
    setIsModalOpen(true);
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
          <Button
            onClick={() => setShowModal(true)}
            className="fixed bottom-6 right-6 z-50 bg-red-500 text-white dark:text-black px-5 py-5 rounded-full shadow-lg dark:shadow-sm shadow-gray-400 dark:shadow-gray-600 hover:bg-red-700 dark:hover:bg-gray-400 transition cursor-pointer"
          >
            Удалить бригаду
          </Button>
          <div className="flex md:flex-row md:items-center justify-between">
            <h2 className="text-xl md:text-xl font-medium">
              Работники бригады: {users[0]?.brigade.name || "Неизвестно"}
            </h2>
            <button
              className="flex md:flex download-btn"
              onClick={openReportModal}
            >
              <LuFileSpreadsheet className="text-lg" />
              Скачать табель
            </button>
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

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Выберите месяц для отчёта"
      >
        <div className="flex flex-wrap gap-2 space-y-2 items-center justify-center">
          {months.map((m, idx) => (
            <button
              key={idx}
              className="w-full px-3 py-2 bg-gray-200 hover:bg-gray-300 rounded cursor-pointer text-center"
              onClick={() => {
                handleDownload(m.month, m.year);
                toast.success(`Скачиваем отчёт за ${m.name}`);
                setIsModalOpen(false);
              }}
            >
              {m.name}
            </button>
          ))}
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Удалить Бригаду"
      >
        <DeleteAlert
          content="Вы уверены что хотите удалить бригаду?"
          onDelete={() => handleDelete()}
        />
      </Modal>
    </DashboardLayout>
  );
}

export default ManageUsersByBrigade;
