import RegisterForm from "./RegisterForm"
import { Routes, Route} from "react-router-dom"
import LoginForm from "./LoginForm"
import InternetUserAddForm from "./AddInternetUsers"
import AllUsers from "./AllUsers"
import AddViolation from "./AddViolation"
import PrivateRoute from "./PrivateRoute"
import Settings from "./Settings"
import SystemUsersPage from "./SystemUsersPage"
import DeputyMinistryForm from "./DeputyMinistryForm"
import AllMinistries from "./AllMinistries"
import NewDirectorate from "./NewDirectorate"
import AllDirectorates from "./AllDirectorates"
import AdminRoute from "./components/AdminRoute"
import NotFound from "./NotFound";


function App() {

  return (
    <>
      <Routes>
      <Route path="/register" element={<PrivateRoute><RegisterForm /></PrivateRoute>} />
      <Route path="/login" element={<LoginForm />} />
      <Route path="/newdeputyministry" element={<PrivateRoute><DeputyMinistryForm /></PrivateRoute>} />
      <Route path="/alldeputyministries" element={<PrivateRoute><AllMinistries /></PrivateRoute>} />
      <Route path="/newdirectorate" element={<PrivateRoute><NewDirectorate /></PrivateRoute>} />
      <Route path="/alldirectorates" element={<PrivateRoute><AllDirectorates /></PrivateRoute>} />
      <Route path="/adduser" element={<PrivateRoute><InternetUserAddForm /></PrivateRoute>} />
      <Route path="/all-system-users" element={<AdminRoute><SystemUsersPage /></AdminRoute>} />
      <Route path="/addviolation" element={<PrivateRoute><AddViolation /></PrivateRoute>} />
      <Route path="/settings" element={<PrivateRoute><Settings /></PrivateRoute>} />
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
