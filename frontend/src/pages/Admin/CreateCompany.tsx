import DashboardLayout from "../../components/DashboardLayout";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPath";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import { LuTrash2 } from "react-icons/lu";
import { useEffect, useState } from "react";
import Modal from "../../components/Modal";
import DeleteAlert from "../../components/DeleteAlert";

function CreateCompany() {
  const navigate = useNavigate();
  const location = useLocation();
  const { companyId } = location.state || {};

  const [companyData, setCompanyData] = useState({
    name: "",
  });

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [openDeleteAlert, setOpenDeleteAlert] = useState<boolean>(false);

  const handleValueChange = <K extends keyof typeof companyData>(
    key: K,
    value: (typeof companyData)[K]
  ) => {
    setCompanyData((prevData) => ({ ...prevData, [key]: value }));
  };

  const clearData = () => {
    setCompanyData({
      name: "",
    });
  };

  // Create company
  const createCompany = async () => {
    setLoading(true);
    try {
      await axiosInstance.post(API_PATHS.COMPANIES.CREATE_COMPANY, {
        ...companyData,
      });

      toast.success("Компания успешно создана");
      clearData();
      navigate("/superadmin/companies");
    } catch (error) {
      console.error("Ошибка при создании компании:", error);
    } finally {
      setLoading(false);
    }
  };

  // Update company
  const updateCompany = async () => {
    setLoading(true);
    try {
      await axiosInstance.patch(API_PATHS.COMPANIES.UPDATE_COMPANY(companyId), {
        ...companyData,
      });

      toast.success("Компания успешно обновлена");
      navigate("/superadmin/companies");
    } catch (error) {
      console.error("Ошибка при обновлении компании:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setError("");

    if (!companyData.name.trim()) {
      setError("Название компании обязательно.");
      return;
    }

    if (companyId) {
      updateCompany();
      return;
    }

    createCompany();
  };

  const getCompanyDetailsByID = async () => {
    try {
      const response = await axiosInstance.get(
        API_PATHS.COMPANIES.GET_COMPANY_BY_ID(companyId)
      );

      if (response.data) {
        setCompanyData({
          name: response.data.name || "",
        });
      }
    } catch (error) {
      console.error("Ошибка при получении компании:", error);
    }
  };

  const deleteCompany = async () => {
    try {
      await axiosInstance.delete(API_PATHS.COMPANIES.DELETE_COMPANY(companyId));

      setOpenDeleteAlert(false);
      toast.success("Компания удалена");
      navigate("/superadmin/companies");
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("Ошибка при удалении компании:", error.message);
      } else {
        console.error("Неизвестная ошибка:", error);
      }
    }
  };

  useEffect(() => {
    if (companyId) {
      getCompanyDetailsByID();
    }
  }, [companyId]);

  return (
    <DashboardLayout activeMenu="Компании">
      <div className="mt-5">
        <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
          <div className="form-card col-span-3">
            <div className="flex items-center justify-between">
              <h2 className="text-xl md:text-xl font-medium">
                {companyId ? "Обновить Компанию" : "Создать Компанию"}
              </h2>

              {companyId && (
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
                Название компании
              </label>

              <input
                placeholder="Введите название компании"
                className="form-input"
                value={companyData.name}
                onChange={({ target }) =>
                  handleValueChange("name", target.value)
                }
                required
              />
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
                {companyId ? "Обновить Компанию" : "Создать Компанию"}
              </button>
            </div>
          </div>
        </div>
      </div>

      <Modal
        isOpen={openDeleteAlert}
        onClose={() => setOpenDeleteAlert(false)}
        title="Удалить Компанию"
      >
        <DeleteAlert
          content="Вы уверены, что хотите удалить компанию?"
          onDelete={() => deleteCompany()}
        />
      </Modal>
    </DashboardLayout>
  );
}

export default CreateCompany;
