import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import { useContext, useEffect, useState } from "react";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";
import SelectDropdown from "@/components/Inputs/SelectDropdown";
import { UserContext } from "@/context/userContext";

function CreateBrigade() {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const location = useLocation();
  const { brigadeId } = location.state || {};

  const [brigadeData, setBrigadeData] = useState<BrigadeData>({
    name: "",
    companyId: null,
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);
  const [companies, setCompanies] = useState<{ id: number; name: string }[]>(
    []
  );

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await axiosInstance.get(
          API_PATHS.COMPANIES.GET_ALL_COMPANIES
        );
        setCompanies(response.data || []);
      } catch (err) {
        console.error("Ошибка при получении планов", err);
        setCompanies([]);
      }
    };

    fetchCompanies();
  }, []);

  const handleValueChange = <K extends keyof Brigade>(
    key: K,
    value: Brigade[K]
  ) => {
    setBrigadeData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    // resetForm
    setBrigadeData({
      name: "",
      companyId: null,
    });
  };

  // Create Brigade
  const createBrigade = async () => {
    setLoading(true);

    try {
      await axiosInstance.post(API_PATHS.BRIGADES.CREATE_BRIGADE, brigadeData);
      toast.success("Бригада успешно создана");
      clearData();
      navigate("/admin/dashboard");
    } catch (error) {
      console.error("Ошибка при создании бригады:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update Brigade
  const updateBrigade = async () => {
    setLoading(true);

    try {
      await axiosInstance.patch(
        API_PATHS.BRIGADES.UPDATE_BRIGADE(brigadeId),
        brigadeData
      );

      toast.success("Бригада успешно обновлена");
      navigate("/admin/brigades");
    } catch (error) {
      console.error("Error updating brigade:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");

    // Input validation
    if (!brigadeData.name.trim()) {
      setError("Название бригады обязательно.");
      return;
    }
    if (user?.role === "SUPER_ADMIN" && !brigadeData.companyId) {
      setError("Компания обязательна для супер-администратора.");
      return;
    }

    if (brigadeId) {
      updateBrigade();
      return;
    }

    createBrigade();
  };

  // Get brigade details if editing
  const getBrigadeDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.BRIGADES.GET_BRIGADE_BY_ID(brigadeId)
      );

      if (response.data) {
        const brigadeInfo = response.data;

        setBrigadeData({
          name: brigadeInfo.name || "",
          companyId: brigadeInfo.companyId || null,
        });
      }
    } catch (error) {
      console.error("Ошибка при получении бригады:", error);
    }
  };

  const deleteBrigade = async () => {
    try {
      await axiosInstance.delete(API_PATHS.BRIGADES.DELETE_BRIGADE(brigadeId));

      setOpenDeleteAlert(false);
      toast.success("Бригада удалена");
      navigate("/admin/dashboard");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Error deleting brigade:", error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    }
  };

  useEffect(() => {
    if (brigadeId) {
      getBrigadeDetailsByID();
    }
  }, [brigadeId]);

  return (
    <DashboardLayout activeMenu="Бригады">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {brigadeId ? "Обновить Бригаду" : "Создать Бригаду"}
              </h2>

              {brigadeId && (
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
                Название бригады
              </label>

              <input
                placeholder="Введите название бригады"
                className="form-input"
                value={brigadeData.name}
                onChange={({ target }) =>
                  handleValueChange("name", target.value)
                }
                required
              />
            </div>
            {user?.role === "SUPER_ADMIN" && (
              <div className="mt-3">
                <label className="text-xs font-medium text-slate-600 dark:text-slate-300">
                  Компания
                </label>

                <SelectDropdown
                  options={companies.map((company) => ({
                    label: company.name,
                    value: company.id,
                  }))}
                  value={brigadeData.companyId}
                  onChange={(value) =>
                    handleValueChange("companyId", value as number)
                  }
                  placeholder="Выберите Компанию"
                />
              </div>
            )}

            {error && (
              <p className="text-xs font-medium text-red-500 mt-5">{error}</p>
            )}

            <div className="flex justify-end mt-7">
              <button
                className="add-btn"
                onClick={handleSubmit}
                disabled={loading}
              >
                {brigadeId ? "Обновить Бригаду" : "Создать Бригаду"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Удалить Бригаду"
      >
        <DeleteAlert
          content="Вы уверены что хотите удалить бригаду?"
          onDelete={() => deleteBrigade()}
        />
      </Modal>
    </DashboardLayout>
  );
}

export default CreateBrigade;
