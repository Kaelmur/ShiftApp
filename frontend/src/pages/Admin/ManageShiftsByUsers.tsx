import ShiftCard from "@/components/Cards/ShiftCard";
import DashboardLayout from "@/components/DashboardLayout";
import Pagination from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import { API_PATHS } from "@/utils/apiPath";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

function ManageShiftsByUsers() {
  const { userId } = useParams();
  const navigate = useNavigate();
  const [shifts, setShifts] = useState<Shift[]>([]);
  const [loading, setLoading] = useState(false);
  const [userName, setUserName] = useState<string>("");

  // pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [shiftsPerPage] = useState(9);

  const handleClick = (shiftId: number) => {
    navigate(`/admin/shifts/${shiftId}/locations`);
  };

  const getAllShifts = async () => {
    setLoading(true);
    try {
      const response = await axiosInstance.get(
        API_PATHS.SHIFTS.GET_USERS_SHIFTS(userId!)
      );

      const fetchedShifts = response.data?.shifts || [];

      if (fetchedShifts.length > 0) {
        setUserName(fetchedShifts[0].user.name);
      } else {
        const userRes = await axiosInstance.get(
          API_PATHS.USERS.GET_USER_BY_ID(userId!)
        );
        setUserName(userRes.data.name);
      }

      setShifts(fetchedShifts);
    } catch (error) {
      console.error("Error fetching user shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllShifts();
  }, []);

  const indexOfLastShift = currentPage * shiftsPerPage;
  const indexOfFirstShift = indexOfLastShift - shiftsPerPage;
  const currentShifts = shifts.slice(indexOfFirstShift, indexOfLastShift);

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
          <>
            {shifts.length === 0 ? (
              <p className="mt-10 text-slate-500">Смены отсутствуют</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {currentShifts.map((shift) => (
                  <ShiftCard
                    key={shift.id}
                    {...shift}
                    onClick={() => handleClick(shift.id)}
                  />
                ))}
              </div>
            )}
            <Pagination
              itemsPerPage={shiftsPerPage}
              totalItems={shifts.length}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ManageShiftsByUsers;
