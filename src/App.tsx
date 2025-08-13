import RegisterForm from "./systemUsers/RegisterForm"
import { Routes, Route} from "react-router-dom"
import LoginForm from "./systemUsers/LoginForm"
import InternetUserAddForm from "./internetUsers/AddInternetUsers"
import AllUsers from "./internetUsers/AllUsers"
import PrivateRoute from "./systemUsers/PrivateRoute"
import Settings from "./systemUsers/Settings"
import SystemUsersPage from "./systemUsers/SystemUsersPage"
import NotFound from "./systemUsers/NotFound";
import AddViolationType from "./addviolationType"
import EmployeeViolationForm from "./internetUsers/employeeViolationForm"
import AllViolationTypes from "./allviolationtypes"
import AddViolationOnAUser from "./internetUsers/addViolationOnaUser"
import AllViolationsFromUsers from "./internetUsers/AllViolationsFromUsers"
import RoleRoute from "./components/RoleRoute"
import AccessDenied from "./AccessDenied"

function App() {

  return (
    <>
      <Routes>
      <Route path="/register" element={<PrivateRoute><RegisterForm /></PrivateRoute>} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/adduser" element={<PrivateRoute><RoleRoute allowedRoles={['Admin', 'User']}><InternetUserAddForm /></RoleRoute></PrivateRoute>} />
      <Route path="/all-system-users" element={<SystemUsersPage />} />
      <Route path="/addviolation" element={<PrivateRoute><EmployeeViolationForm /></PrivateRoute>} />
      <Route path="/addviolationonauser" element={<AddViolationOnAUser />} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
      <Route path="/add-violation-type" element={<PrivateRoute><AddViolationType /></PrivateRoute>} />
      <Route path="/all-violation-types" element={<PrivateRoute><AllViolationTypes /></PrivateRoute>} />
      <Route path="/all-violations-from-users" element={<PrivateRoute><AllViolationsFromUsers /></PrivateRoute>} />
      <Route path="/access-denied" element={<PrivateRoute><AccessDenied /></PrivateRoute>} />
      <Route
        path="/"
        element={
          <PrivateRoute>
            <AllUsers />
          </PrivateRoute>
        }
      />
      <Route path="*" element={<NotFound />} />
    </Routes>
    </>
  )
}

export default App
