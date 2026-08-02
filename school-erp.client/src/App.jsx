import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom'
import { AuthProvider } from './components/auth/AuthProvider'
import ProtectedRoute from './components/auth/ProtectedRoute'
import AppLayout from './components/layout/AppLayout'
import AuthForm from './components/auth/AuthForm'
import ForgotPasswordPage from './components/auth/ForgotPasswordPage'
import ResetPasswordPage from './components/auth/ResetPasswordPage'
import VerifyEmailNotice from './components/auth/VerifyEmailNotice'
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
import ReportsPage from './components/reports/ReportsPage'
import ExportPage from './components/export/ExportPage'
import SettingsPage from './components/settings/SettingsPage'
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
import StudentPortalLayout from './components/student-portal/StudentPortalLayout'
import StudentDashboardPage from './components/student-portal/StudentDashboardPage'
import StudentAttendancePage from './components/student-portal/StudentAttendancePage'
import StudentHomeworkPage from './components/student-portal/StudentHomeworkPage'
import StudentAssignmentsPage from './components/student-portal/StudentAssignmentsPage'
import StudentExamResultsPage from './components/student-portal/StudentExamResultsPage'
import StudentFeesPage from './components/student-portal/StudentFeesPage'
import StudentLibraryPage from './components/student-portal/StudentLibraryPage'
import StudentTimetablePage from './components/student-portal/StudentTimetablePage'
import StudentNotesPage from './components/student-portal/StudentNotesPage'
import StudentProfilePage from './components/student-portal/StudentProfilePage'
import StudentCertificatesPage from './components/student-portal/StudentCertificatesPage'
import TeacherPortalLayout from './components/teacher-portal/TeacherPortalLayout'
import TeacherAttendancePage from './components/teacher-portal/TeacherAttendancePage'
import TeacherStudentAttendancePage from './components/teacher-portal/TeacherStudentAttendancePage'
import TeacherHomeworkPage from './components/teacher-portal/TeacherHomeworkPage'
import TeacherAssignmentsPage from './components/teacher-portal/TeacherAssignmentsPage'
import TeacherExamMarksPage from './components/teacher-portal/TeacherExamMarksPage'
import TeacherTimetablePage from './components/teacher-portal/TeacherTimetablePage'
import TeacherSalaryPage from './components/teacher-portal/TeacherSalaryPage'
import TeacherLeavePage from './components/teacher-portal/TeacherLeavePage'
import TeacherProfilePage from './components/teacher-portal/TeacherProfilePage'
import TeacherNoticePage from './components/teacher-portal/TeacherNoticePage'

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
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/verify-email" element={<VerifyEmailNotice />} />
            <Route element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
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
              <Route path="/reports" element={<ReportsPage />} />
              <Route path="/export" element={<ExportPage />} />
              <Route path="/settings" element={<SettingsPage />} />
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
            <Route path="/student-portal" element={<StudentPortalLayout />}>
              <Route index element={<StudentDashboardPage />} />
              <Route path="attendance" element={<StudentAttendancePage />} />
              <Route path="homework" element={<StudentHomeworkPage />} />
              <Route path="assignments" element={<StudentAssignmentsPage />} />
              <Route path="results" element={<StudentExamResultsPage />} />
              <Route path="fees" element={<StudentFeesPage />} />
              <Route path="library" element={<StudentLibraryPage />} />
              <Route path="timetable" element={<StudentTimetablePage />} />
              <Route path="notes" element={<StudentNotesPage />} />
              <Route path="certificates" element={<StudentCertificatesPage />} />
              <Route path="profile" element={<StudentProfilePage />} />
            </Route>
            <Route path="/teacher-portal" element={<TeacherPortalLayout />}>
              <Route index element={<TeacherAttendancePage />} />
              <Route path="student-attendance" element={<TeacherStudentAttendancePage />} />
              <Route path="homework" element={<TeacherHomeworkPage />} />
              <Route path="assignments" element={<TeacherAssignmentsPage />} />
              <Route path="marks" element={<TeacherExamMarksPage />} />
              <Route path="timetable" element={<TeacherTimetablePage />} />
              <Route path="salary" element={<TeacherSalaryPage />} />
              <Route path="leave" element={<TeacherLeavePage />} />
              <Route path="notice" element={<TeacherNoticePage />} />
              <Route path="profile" element={<TeacherProfilePage />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default App
