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
import PayrollPage from './components/payroll/PayrollPage'
import ExportPage from './components/export/ExportPage'
import ParentPortalLayout from './components/parent-portal/ParentPortalLayout'
import ParentAttendancePage from './components/parent-portal/ParentAttendancePage'
import ParentMarksPage from './components/parent-portal/ParentMarksPage'
import ParentHomeworkPage from './components/parent-portal/ParentHomeworkPage'
import ParentReportCardPage from './components/parent-portal/ParentReportCardPage'
import ParentFeesPage from './components/parent-portal/ParentFeesPage'
import ParentNoticesPage from './components/parent-portal/ParentNoticesPage'
import ParentEventsPage from './components/parent-portal/ParentEventsPage'
import ParentChatPage from './components/parent-portal/ParentChatPage'
import ParentLeaveRequestPage from './components/parent-portal/ParentLeaveRequestPage'
import ParentNotificationsPage from './components/parent-portal/ParentNotificationsPage'

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
              <Route path="/payroll" element={<PayrollPage />} />
              <Route path="/export" element={<ExportPage />} />
            </Route>
            <Route path="/parent" element={<ParentPortalLayout />}>
              <Route index element={<ParentAttendancePage />} />
              <Route path="marks" element={<ParentMarksPage />} />
              <Route path="homework" element={<ParentHomeworkPage />} />
              <Route path="report-card" element={<ParentReportCardPage />} />
              <Route path="fees" element={<ParentFeesPage />} />
              <Route path="notices" element={<ParentNoticesPage />} />
              <Route path="events" element={<ParentEventsPage />} />
              <Route path="chat" element={<ParentChatPage />} />
              <Route path="leave" element={<ParentLeaveRequestPage />} />
              <Route path="notifications" element={<ParentNotificationsPage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
