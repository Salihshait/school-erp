import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthProvider'
import AppLayout from './components/layout/AppLayout'
import AuthForm from './components/auth/AuthForm'
import DashboardPage from './components/dashboard/DashboardPage'
import StudentList from './components/student/StudentList'
import StudentForm from './components/student/StudentForm'
import StudentProfile from './components/student/StudentProfile'
import TeacherList from './components/teacher/TeacherList'
import TeacherForm from './components/teacher/TeacherForm'
import TeacherProfile from './components/teacher/TeacherProfile'
import AttendancePage from './components/attendance/AttendancePage'
import HostelPage from './components/hostel/HostelPage'
import ExportPage from './components/export/ExportPage'

const queryClient = new QueryClient()

function StudentProfileRoute() {
  const { id } = useParams()
  return <StudentProfile id={id} />
}

function StudentFormRoute() {
  const { id } = useParams()
  return <StudentForm id={id} />
}

function TeacherProfileRoute() {
  const { id } = useParams()
  return <TeacherProfile id={id} />
}

function TeacherFormRoute() {
  const { id } = useParams()
  return <TeacherForm id={id} />
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/auth" element={<AuthForm />} />
            <Route element={<AppLayout />}>
              <Route path="/" element={<DashboardPage />} />
              <Route path="/student" element={<StudentList />} />
              <Route path="/student/new" element={<StudentFormRoute />} />
              <Route path="/student/edit/:id" element={<StudentFormRoute />} />
              <Route path="/student/:id" element={<StudentProfileRoute />} />
              <Route path="/teacher" element={<TeacherList />} />
              <Route path="/teacher/new" element={<TeacherFormRoute />} />
              <Route path="/teacher/edit/:id" element={<TeacherFormRoute />} />
              <Route path="/teacher/:id" element={<TeacherProfileRoute />} />
              <Route path="/attendance" element={<AttendancePage />} />
              <Route path="/hostel" element={<HostelPage />} />
              <Route path="/export" element={<ExportPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
