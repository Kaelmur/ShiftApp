import CompanyCard from "@/components/Cards/CompanyCard";
import DashboardLayout from "@/components/DashboardLayout";
import Pagination from "@/components/Pagination";
import Spinner from "@/components/Spinner";
import { Button } from "@/components/ui/button";
import { API_PATHS } from "@/utils/apiPath";
import axiosInstance from "@/utils/axiosInstance";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function ManageCompanies() {
  const [allCompanies, setAllCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState(1);
  const [companiesPerPage] = useState(10);

  const getAllCompanies = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(
        API_PATHS.COMPANIES.GET_ALL_COMPANIES
      );

      setAllCompanies(response.data?.length > 0 ? response.data : []);
    } catch (error) {
      console.error("Error fetching companies:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleClick = (company: Company) => {
    navigate("/superadmin/companies/create", {
      state: { companyId: company.id },
    });
  };

  useEffect(() => {
    getAllCompanies();
  }, []);

  const indexOfLastCompany = currentPage * companiesPerPage;
  const indexOfFirstCompany = indexOfLastCompany - companiesPerPage;
  const currentCompanies = allCompanies.slice(
    indexOfFirstCompany,
    indexOfLastCompany
  );

  return (
    <DashboardLayout activeMenu="Компании">
      <div className="my-5">
        <Button
          onClick={() => navigate("/superadmin/companies/create")}
          className="fixed bottom-6 right-6 z-50 bg-primary text-white dark:text-black px-5 py-5 rounded-full shadow-lg dark:shadow-sm shadow-gray-400 dark:shadow-gray-600 hover:bg-blue-700 dark:hover:bg-gray-400 transition cursor-pointer"
        >
          + Создать компанию
        </Button>
        <div className="flex flex-col lg:flex-row lg:items-center justify-between">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-xl md:text-xl font-medium">Все Компании</h2>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center min-h-[200px] w-full">
            <Spinner />
          </div>
        ) : (
          <>
            {allCompanies.length === 0 ? (
              <p className="mt-10 text-slate-500">Компании отсутствуют</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                {currentCompanies.map((company) => (
                  <CompanyCard
                    key={company.id}
                    company={company}
                    onClick={() => {
                      handleClick(company);
                    }}
                  />
                ))}
              </div>
            )}

            <Pagination
              itemsPerPage={companiesPerPage}
              totalItems={allCompanies.length}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
            />
          </>
        )}
      </div>
    </DashboardLayout>
  );
}

export default ManageCompanies;
