import RegisterForm from "./systemUsers/RegisterForm"
import { Routes, Route } from "react-router-dom"
import LoginForm from "./systemUsers/LoginForm"
import InternetUserAddForm from "./internetUsers/AddInternetUsers"
import AllUsers from "./internetUsers/AllUsers"
import PrivateRoute from "./systemUsers/PrivateRoute"
import Settings from "./systemUsers/Settings"
import SystemUsersPage from "./systemUsers/SystemUsersPage"
import NotFound from "./systemUsers/NotFound";
import AddViolationType from "./internetUsers/addviolationType"
import EmployeeViolationForm from "./internetUsers/employeeViolationForm"
import AllViolationTypes from "./internetUsers/allviolationtypes"
import AddViolationOnAUser from "./internetUsers/addViolationOnaUser"
import AllViolationsFromUsers from "./internetUsers/AllViolationsFromUsers"
import RoleChecker from "./components/RoleChecker"
import AccessDenied from "./AccessDenied"
import ReactivateUserForm from "./internetUsers/reActivation"
import Dashboard from "./internetUsers/dashboard"
import AllReactivations from "./internetUsers/AllReactivations"
import Reports from "./internetUsers/reports"
import Home from "./site/Home"
import About from "./site/About"
import Contact from "./site/Contact"

function App() {
  return (
    <>
      <Routes>
        <Route
          path="/register"
          element={
            <PrivateRoute>
              <RoleChecker allowedRoles={["Admin"]}>
                <RegisterForm />
              </RoleChecker>
            </PrivateRoute>
          }
        />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/adduser" element={<PrivateRoute><RoleChecker allowedRoles={['Admin', 'User']}><InternetUserAddForm /></RoleChecker></PrivateRoute>} />
        <Route path="/all-system-users" element={<RoleChecker allowedRoles={['Admin']}><SystemUsersPage /></RoleChecker>} />
        <Route path="/addviolation" element={<RoleChecker allowedRoles={['Admin', 'User']}><EmployeeViolationForm /></RoleChecker>} />
        <Route path="/addviolationonauser" element={<RoleChecker allowedRoles={['Admin', 'User']}><AddViolationOnAUser /></RoleChecker>} />
        <Route path="/re-activate" element={<RoleChecker allowedRoles={['Admin', 'User']}><ReactivateUserForm /></RoleChecker>} />
        <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
        <Route path="/add-violation-type" element={<RoleChecker allowedRoles={['Admin', 'User']}><AddViolationType /></RoleChecker>} />
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/all-re-activations" element={<RoleChecker allowedRoles={['Admin', 'User']}><AllReactivations/></RoleChecker>} />
        <Route path="/reports" element={<RoleChecker allowedRoles={['Admin', 'User']}><Reports/></RoleChecker>} />
        <Route path="/all-violation-types" element={<PrivateRoute><AllViolationTypes /></PrivateRoute>} />
        <Route path="/all-violations-from-users" element={<PrivateRoute><AllViolationsFromUsers /></PrivateRoute>} />
        <Route path="/access-denied" element={<PrivateRoute><AccessDenied /></PrivateRoute>} />
        
        <Route
          path="/all-users"
          element={
            <PrivateRoute>
              <AllUsers />
            </PrivateRoute>
          }
        />
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
