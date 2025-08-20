import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import SelectDropdown from "@/components/Inputs/SelectDropdown";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa6";

function CreateUser() {
  const navigate = useNavigate();

  const location = useLocation();
  const { userId } = location.state || {};

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
  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);
  const [brigades, setBrigades] = useState<Brigade[]>([]);
  const [showPassword, setShowPassword] = useState(false);

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

  // Update User
  const updateUser = async () => {
    setLoading(true);

    try {
      await axiosInstance.patch(API_PATHS.USERS.UPDATE_USER(userId), {
        ...userData,
        ...(userData.password ? { password: userData.password } : {}),
      });

      toast.success("Пользователь успешно обновлен");
    } catch (error) {
      console.error("Error updating user:", error);
    } finally {
      setLoading(false);
    }
  };

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
    if (!userId && (!userData.password || userData.password.length < 6)) {
      setError("Пароль должен быть не менее 6 символов.");
      return;
    }
    if (!userData.role) {
      setError("Роль обязательна");
      return;
    }

    if (userId) {
      updateUser();
      navigate("/admin/users");
      return;
    }

    createUser();
    navigate("/admin/users");
  };

  const getUserDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.USERS.GET_USER_BY_ID(userId)
      );

      if (response.data) {
        const userInfo = response.data;

        setUserData({
          name: userInfo.name,
          email: userInfo.email,
          password: "",
          role: userInfo.role || "WORKER",
          companyId: userInfo.companyId || null,
          brigadeId: userInfo.brigadeId || null,
        });
      }
    } catch (error) {
      console.error("Ошибка при получении пользователя:", error);
    }
  };

  const deleteUser = async () => {
    try {
      await axiosInstance.delete(API_PATHS.USERS.DELETE_USER(userId));

      setOpenDeleteAlert(false);
      toast.success("Пользователь удален");
      navigate("/admin/users");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting user:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    if (userId) {
      getUserDetailsByID();
    }
  }, [userId]);

  return (
    <DashboardLayout activeMenu="Работники">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {userId ? "Обновить Работника" : "Создать Работника"}
              </h2>

              {userId && (
                <button
                  className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:border-rose-300 cursor-pointer"
                  onClick={() => setOpenDeleteAlert(true)}
                >
                  <LuTrash2 className="text-base" /> Удалить
                </button>
              )}
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

            <div className="mt-3 relative">
              <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                Пароль
              </label>

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Впишите пароль"
                className="form-input"
                value={userData.password}
                onChange={({ target }) =>
                  handleValueChange("password", target.value)
                }
                required
              />

              <button
                type="button"
                className="absolute right-2 bottom-[10px] text-slate-500 hover:text-slate-700 cursor-pointer"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                {showPassword ? (
                  <FaRegEyeSlash size={24} />
                ) : (
                  <FaRegEye size={24} />
                )}
              </button>
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
                {userId ? "Обновить Пользователя" : "Создать Пользователя"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Удалить Пользователя"
      >
        <DeleteAlert
          content="Вы уверены что хотите удалить пользователя ?"
          onDelete={() => deleteUser()}
        />
      </Modal>
    </DashboardLayout>
  );
}

export default CreateUser;
