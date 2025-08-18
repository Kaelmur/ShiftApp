import { useEffect, useState } from "react";
import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import Spinner from "@/components/Spinner";
import ShiftCard from "../../components/Cards/ShiftCard";
import Pagination from "@/components/Pagination";

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

function ManageShifts() {
  const [allShifts, setAllShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [shiftsPerPage] = useState(3);

  const getAllShifts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(API_PATHS.SHIFTS.GET_ALL_SHIFTS);

      setAllShifts(
        response.data?.shifts?.length > 0 ? response.data.shifts : []
      );
    } catch (error) {
      console.error("Error fetching shifts:", error);
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

  const indexOfLastShift = currentPage * shiftsPerPage;
  const indexOfFirstShift = indexOfLastShift - shiftsPerPage;
  const currentShifts = allShifts.slice(indexOfFirstShift, indexOfLastShift);

  return (
    <DashboardLayout activeMenu="Смены">
      <div className="my-5">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">Все Смены</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px] w-full">
            <Spinner />
          </div>
        ) : (
          <>
            {allShifts.length === 0 ? (
              <p className="mt-10 text-slate-500">Смены отсутствуют</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {currentShifts.map((shift) => (
                  <ShiftCard key={shift.id} {...shift} />
                ))}
              </div>
            )}

            <Pagination
              itemsPerPage={shiftsPerPage}
              totalItems={allShifts.length}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ManageShifts;
