import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import UserPage from "./pages/UserPage";
import MajorPage from "./pages/MajorPage";
import FacultyPage from "./pages/FacultyPage";
import SubjectPage from "./pages/SubjectPage";
import StudentPage from "./pages/StudentPage";
import CoursePage from "./pages/CoursePage";
import ProfileStudent from "./pages/ProfileStudent";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./hooks/useAuth";
import ComparePage from "./pages/ComparePage";
import AnnualDataPage from "./pages/AnnualDataPage";
import PreviewPage from "./pages/PreviewPage";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import TestPage from "./pages/TestPage";
import NewComparePage from "./pages/newComparePage";

function App() {
  const { role } = useAuth();
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute
                allowedRoles={["Admin", "Teacher", "Committee", "Student"]}
              >
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/annual-data"
            element={
              <ProtectedRoute
                allowedRoles={["Admin", "Teacher", "Committee", "Student"]}
              >
                <AnnualDataPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <UserPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/majors"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <MajorPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/faculties"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <FacultyPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/students"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <StudentPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/subjects"
            element={
              <ProtectedRoute allowedRoles={["Admin"]}>
                <SubjectPage />
              </ProtectedRoute>
            }
          />
          <Route path="/course" element={<CoursePage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route
            path="/newCompare"
            element={
              <ProtectedRoute
                allowedRoles={["Admin", "Teacher", "Committee", "Student"]}
              >
                <NewComparePage />
              </ProtectedRoute>
            }
          />
          <Route path="/preview" element={<PreviewPage />} />
          <Route path="/profileStudent" element={<ProfileStudent />} />
          <Route path="/test" element={<TestPage />} />
        </Routes>
      </BrowserRouter>
    </LocalizationProvider>
  );
}

export default App;
