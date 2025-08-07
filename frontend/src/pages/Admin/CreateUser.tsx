import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from "moment";
import { LuTrash2 } from "react-icons/lu";
import { useContext, useEffect, useState } from "react";
import SelectUsers from "../../components/Inputs/SelectUsers";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import { UserContext } from "@/context/userContext";
import SelectDropdown from "@/components/Inputs/SelectDropdown";

type UserData = {
  name: string;
  email: string;
  password: string;
  role?: "WORKER" | "ADMIN";
  companyId: number;
  brigadeId: number;
};

function CreateUser() {
  const navigate = useNavigate();

  const { user } = useContext(UserContext);

  const [userData, setUserData] = useState({
    name: "",
    email: "",
    password: "",
    role: "WORKER",
    companyId: null,
    brigadeId: null,
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [brigades, setBrigades] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    const fetchBrigades = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.BRIGADES.GET_ALL_BRIGADES
        );
        setBrigades(response.data);
      } catch (err) {
        console.error("Ошибка при получении планов", err);
        setBrigades([]);
      }
    };

    fetchBrigades();
  }, []);

  const handleValueChange = <K extends keyof UserData>(
    key: K,
    value: UserData[K]
  ) => {
    setUserData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    // resetForm
    setUserData({
      name: "",
      email: "",
      password: "",
      role: "WORKER",
      companyId: null,
      brigadeId: null,
    });
  };

  // Create Plan
  const createUser = async () => {
    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.USERS.CREATE_USER, {
        ...userData,
      });

      toast.success("Работник успешно создан");

      clearData();
      navigate("/admin/users");
    } catch (error) {
      console.error("Ошибка при создании работника:", error);
    } finally {
      setLoading(false);
    }
  };

  // // Update User
  // const updatePlan = async () => {
  //   setLoading(true);

  //   try {
  //     await axiosInstance.put(API_PATHS.PLANS.UPDATE_PLAN(planId), {
  //       ...planData,
  //       startDate: planData.startDate
  //         ? new Date(planData.startDate).toISOString()
  //         : null,
  //       endDate: planData.endDate
  //         ? new Date(planData.endDate).toISOString()
  //         : null,
  //     });

  //     toast.success("План успешно обновлен");
  //   } catch (error) {
  //     console.error("Error updating task:", error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async () => {
    setError("");

    // Input validation
    if (!userData.name.trim()) {
      setError("Имя обязательно.");
      return;
    }
    if (!userData.email.includes("@")) {
      setError("Неверный email.");
      return;
    }
    if (!userData.password || userData.password.length < 6) {
      setError("Пароль должен быть не менее 6 символов.");
      return;
    }
    if (!userData.role) {
      setError("Роль обязательна");
      return;
    }

    // if (planId) {
    //   updateUser();
    //   navigate("/admin/users");
    //   return;
    // }

    createUser();
    navigate("/admin/users");
  };

  // get Plan by ID
  // const getPlanDetailsByID = async () => {
  //   try {
  //     const response = await axiosInstance.get<PlanDetailsResponse>(
  //       API_PATHS.PLANS.GET_PLAN_BY_ID(planId)
  //     );

  //     if (response.data) {
  //       const planInfo = response.data;

  //       setPlanData({
  //         name: planInfo.name,
  //         goal: planInfo.goal,
  //         startDate: planInfo.startDate
  //           ? moment(planInfo.startDate).format("YYYY-MM-DD")
  //           : null,
  //         endDate: planInfo.endDate
  //           ? moment(planInfo.endDate).format("YYYY-MM-DD")
  //           : null,
  //         assignedTo: planInfo?.assignedTo?.map((user) => user?._id) || [],
  //         tasks: planInfo?.tasks || [],
  //       });
  //     }
  //   } catch (error) {
  //     console.error("Ошибка при получении плана:", error);
  //   }
  // };

  // Delete Task
  // const deletePlan = async () => {
  //   try {
  //     await axiosInstance.delete(API_PATHS.PLANS.DELETE_PLAN(planId));

  //     setOpenDeleteAlert(false);
  //     toast.success("План удален");
  //     navigate("/admin/plans");
  //   } catch (error: unknown) {
  //     if (error instanceof Error) {
  //       console.error("Error deleting plan:", error.message);
  //     } else {
  //       console.error("Unexpected error:", error);
  //     }
  //   }
  // };

  // useEffect(() => {
  //   if (planId) {
  //     getPlanDetailsByID();
  //   }
  // }, [planId]);

  return (
    <DashboardLayout activeMenu="Работники">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                Создать Работника
                {/* {planId ? "Обновить План" : "Создать План"} */}
              </h2>

              {/* {planId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Удалить
                </button>
              )} */}
            </div>

            <div className="mt-4">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                ФИО
              </label>

              <input
                placeholder="Впишите ФИО работника"
                className="form-input"
                value={userData.name}
                onChange={({ target }) =>
                  handleValueChange("name", target.value)
                }
                required
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Почта
              </label>

              <input
                type="email"
                placeholder="example@gmail.com"
                className="form-input"
                value={userData.email}
                onChange={({ target }) =>
                  handleValueChange("email", target.value)
                }
                required
              />
            </div>

            <div className="mt-3">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Пароль
              </label>

              <input
                type="password"
                placeholder="Впишите пароль"
                className="form-input"
                value={userData.password}
                onChange={({ target }) =>
                  handleValueChange("password", target.value)
                }
                required
              />
            </div>

            <div className="grid grid-cols-12 gap-4 mt-2">
              <div className="col-span-6 md:col-span-6">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Роль
                </label>
                <SelectDropdown
                  options={[
                    { label: "Рабочий", value: "WORKER" },
                    { label: "Админ", value: "ADMIN" },
                  ]}
                  value={userData.role}
                  onChange={(value) =>
                    handleValueChange("role", value as UserData["role"])
                  }
                  placeholder="Выберите Роль"
                />
              </div>

              <div className="col-span-6 md:col-span-6">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Бригада
                </label>

                <SelectDropdown
                  options={brigades.map((brigade) => ({
                    label: brigade.name,
                    value: brigade.id,
                  }))}
                  value={userData.brigadeId}
                  onChange={(value) =>
                    handleValueChange(
                      "brigadeId",
                      value as UserData["brigadeId"]
                    )
                  }
                  placeholder="Выберите Бригаду"
                />
              </div>
            </div>

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {/* {planId ? "Обновить План" : "Создать План"} */}Создать
                Пользователя
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Удалить План"
      >
        <DeleteAlert
          content="Вы уверены что хотите удалить план?"
          onDelete={() => deletePlan()}
        />
      </Modal> */}
    </DashboardLayout>
  );
}

export default CreateUser;
