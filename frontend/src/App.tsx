import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  Outlet,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import Dashboard from "./pages/Admin/Dashboard";
import ManageUsers from "./pages/Admin/ManageUsers";
import PrivateRoute from "./routes/PrivateRoute";
import UserProvider from "./context/UserProvider";
import { useContext } from "react";
import { UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";
import { ThemeProvider } from "./components/theme-provider";
import ManageUsersByBrigade from "./pages/Admin/ManageUsersByBrigade";
import ManageShifts from "./pages/Admin/ManageShifts";
import ManageShiftsByUsers from "./pages/Admin/ManageShiftsByUsers";
import MapPage from "./pages/Admin/MapPage";
import CreateUser from "./pages/Admin/CreateUser";
import CreateBrigade from "./pages/Admin/CreateBrigade";
import ManageCompanies from "./pages/Super_Admin/ManageCompanies";
import CreateCompany from "./pages/Admin/CreateCompany";

function App() {
  return (
    <UserProvider>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <div>
          <Router>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/unauthorized"
                element={<div>Unauthorized Access</div>}
              />

              <Route
                path="/"
                element={<Navigate to="/admin/dashboard" replace />}
              />

              {/* Admin Routes */}
              <Route
                element={
                  <PrivateRoute allowedRoles={["ADMIN", "SUPER_ADMIN"]} />
                }
              >
                <Route path="/admin/dashboard" element={<Dashboard />} />

                <Route
                  path="/admin/brigades/create"
                  element={<CreateBrigade />}
                />
                <Route
                  path="/admin/brigade-users"
                  element={<ManageUsersByBrigade />}
                />
                <Route
                  path="/admin/users/:userId/shifts"
                  element={<ManageShiftsByUsers />}
                />
                <Route path="/admin/shifts" element={<ManageShifts />} />
                <Route
                  path="/admin/shifts/:shiftId/locations"
                  element={<MapPage />}
                />
                <Route path="/admin/users" element={<ManageUsers />} />

                <Route path="/admin/users/create" element={<CreateUser />} />
              </Route>

              <Route element={<PrivateRoute allowedRoles={["SUPER_ADMIN"]} />}>
                <Route
                  path="/superadmin/companies"
                  element={<ManageCompanies />}
                />

                <Route
                  path="/superadmin/companies/create"
                  element={<CreateCompany />}
                />
              </Route>

              {/* Default Route */}
              <Route path="/admin/dashboard" element={<Root />} />
            </Routes>
          </Router>
        </div>

        <Toaster
          toastOptions={{
            className: "",
            style: {
              fontSize: "13px",
            },
          }}
        />
      </ThemeProvider>
    </UserProvider>
  );
}

export default App;

const Root = () => {
  const { user, loading } = useContext(UserContext);

  if (loading) return <Outlet />;

  if (!user) {
    return <Navigate to="/login" />;
  } else {
    return <Navigate to="/admin/dashboard" />;
  }

  return ["ADMIN", "SUPER_ADMIN"].includes(user?.role ?? "") ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
