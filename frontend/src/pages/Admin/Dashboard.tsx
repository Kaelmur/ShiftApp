import { useContext, useEffect, useState } from "react";
import { useUserAuth } from "../../hooks/useUserAuth";
import { UserContext } from "../../context/userContext";
import DashboardLayout from "../../components/DashboardLayout";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import moment from "moment/min/moment-with-locales";
import Spinner from "@/components/Spinner";
import BrigadeCard from "@/components/Cards/BrigadeCard";
import { Button } from "@/components/ui/button";

moment.locale("ru");

function Dashboard() {
  useUserAuth();

  const [brigades, setBrigades] = useState<Brigade[]>([]);
  const [loading, setLoading] = useState(false);

  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const date = moment().format("dddd Do MMM YYYY");

  const getAllBrigades = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.BRIGADES.GET_ALL_BRIGADES
      );

      setBrigades(response.data.length > 0 ? response.data : []);
    } catch (error) {
      console.error("Error fetching brigades:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllBrigades();
  }, []);
  return (
    <DashboardLayout activeMenu="Бригады">
      <div>
        <div className="card my-5">
          <Button
            onClick={() => navigate("/admin/brigades/create")}
            className="fixed bottom-6 right-6 z-50 bg-primary text-white dark:text-black px-5 py-5 rounded-full shadow-lg dark:shadow-sm shadow-gray-400 dark:shadow-gray-600 hover:bg-blue-700 dark:hover:bg-gray-400 transition cursor-pointer"
          >
            + Создать бригаду
          </Button>
          <div>
            <div className="col-span-3">
              <h2 className="text-xl md:text-2xl">
                Добро пожаловать, {user?.name}!
              </h2>
              <p className="text-xs md:text-[13px] text-gray-400 mt-1.5">
                {date.charAt(0).toUpperCase() + date.slice(1)}
              </p>
            </div>
          </div>
        </div>
        <h2 className="text-lg font-bold text-gray-800 dark:text-white mb-4">
          Бригады
        </h2>
        {loading ? (
          <div className="flex justify-center items-center min-h-[200px] w-full">
            <Spinner />
          </div>
        ) : (
          <div className="grid gap-4">
            {brigades.map((brigade) => (
              <BrigadeCard
                key={brigade.id}
                id={brigade.id}
                name={brigade.name}
                userCount={brigade.users.length}
                onClick={() =>
                  navigate("/admin/brigade-users", {
                    state: { brigadeId: brigade.id },
                  })
                }
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
