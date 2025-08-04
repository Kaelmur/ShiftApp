import ShiftCard from "@/components/Cards/ShiftCard";
import DashboardLayout from "@/components/DashboardLayout";
import Spinner from "@/components/Spinner";
import { API_PATHS } from "@/utils/apiPath";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Shift {
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
}

function ManageShiftsByUsers() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string>("");

  const handleClick = (shiftId: number) => {
    navigate(`/admin/shifts/${shiftId}/locations`);
  };

  const getAllShifts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.SHIFTS.GET_USERS_SHIFTS(userId!)
      );

      setUserName(response.data.shifts[0].user.name);

      setShifts(response.data?.shifts?.length > 0 ? response.data.shifts : []);
    } catch (error) {
      console.error("Error fetching user shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  // const handleClick = (taskData: Task) => {
  //   navigate("/admin/create-task", { state: { taskId: taskData._id } });
  // };

  useEffect(() => {
    getAllShifts();
  }, []);

  return (
    <DashboardLayout activeMenu="Смены">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">
              Смены работника: {userName}
            </h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px] w-full">
            <Spinner />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            {shifts?.map((shift) => (
              <ShiftCard
                key={shift.id}
                {...shift}
                onClick={() => handleClick(shift.id)}
              />
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ManageShiftsByUsers;
