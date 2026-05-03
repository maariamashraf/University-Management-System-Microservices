import Auth from "./pages/Auth";
import { RouterProvider } from "react-router-dom";
import { createBrowserRouter } from "react-router-dom";
import LoginForm from "./components/Auth/LoginForm";
import RegisterFrom from "./components/Auth/RegisterFrom";
import ErrorPage from"./components/common/ErrorPage";
import RootLayOut from "./pages/RootLayOut";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DashboardLayout from "./pages/DashboardLayout";
import ProtectedRoute from "./components/common/ProtectedRoute";
import { CoursesDashboard } from "./pages/Courses/CoursesDashboard";
import Registration from "./pages/Courses/Registration";
import OAuth2Callback from "./pages/OAuth2Callback";
import CourseDetails from "./pages/CourseDetails/CourseDetails";
import Setting from "./pages/SettingPage/Setting";
import AdminUserPermissionDashboard from "./features/admin/presentation/pages/AdminUserPermissionDashboard";
import { AdminCoursesDashboard } from "./features/admin/presentation/pages/AdminCoursesDashboard";
import AdminAuditLogDashboard from "./features/admin/presentation/pages/AdminAuditLogDashboard";
import { Toaster } from "sonner";
import { AdminDashboard } from "./features/admin/presentation/pages/AdminDashboard";
const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayOut />,
    errorElement:<ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "home",
        element: <Home />,
      },
    
    ],
  },
  {
    path: "dashboard",
    element: <DashboardLayout />,
    errorElement:<ErrorPage />,
    children: [
      {
        index: true,
        element: <ProtectedRoute>
          <Dashboard />
          </ProtectedRoute>,
      },
      {
        path: "Courses",
        element: <ProtectedRoute>
          <CoursesDashboard />
          </ProtectedRoute>,
      },
      {
        path:'registration',
        element: <ProtectedRoute>
          <Registration />
          </ProtectedRoute>,
      },
      {
        path: "settings",
        element: <ProtectedRoute>
          <Setting />
          </ProtectedRoute>,
      }
      ,
      {
        path: "admin/users-permissions",
        element: <ProtectedRoute>
          <AdminUserPermissionDashboard />
          </ProtectedRoute>,
      }
      ,{
        path: "admin/courses",
        element: <ProtectedRoute><AdminCoursesDashboard /></ProtectedRoute>
      },
      {
        path: "admin/audit-log",
        element: <ProtectedRoute><AdminAuditLogDashboard /></ProtectedRoute>
      }
      ,{

        path: "admin/dashboard",
        element: <ProtectedRoute>
          <AdminDashboard />
        </ProtectedRoute>
      }
    ],
  },
  {
    path: "/auth",
    element: <Auth />,
    errorElement:<ErrorPage />,
    children: [
      {
        index: true,
        element: <LoginForm />,
      },
      {
        path: "login",
        element: <LoginForm />,
      },
      {
        path: "register",
        element: <RegisterFrom />,
      },
    
    ],
  },
  {
    path: "/oauth2/redirect",
    element: <OAuth2Callback />,
  },
  {
    path: "/CourseDetails/:id",
    element: (
      <ProtectedRoute>
        <CourseDetails />
      </ProtectedRoute>
    ),
  },

  
]);

// we add the useAnnouncementsHook to the app to get the announcements from the server 
//TODO:now handle it in the back end and use it in the front end
function App() {
  return (
    <>
      <RouterProvider router={router} />
      <Toaster richColors position="top-right"  closeButton={true}
      toastOptions={{
        style: {
        marginTop: '100px',
        marginRight: '0px',
        marginLeft:'auto',
        }}}
      />
    </>
  );
}

export default App;
