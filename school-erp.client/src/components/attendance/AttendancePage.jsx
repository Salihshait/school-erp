import React from 'react'
import DailyAttendance from './DailyAttendance'
import BulkAttendance from './BulkAttendance'
import AttendanceCalendar from './AttendanceCalendar'
import AttendanceReports from './AttendanceReports'

export default function AttendancePage() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Attendance</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: 16 }}>
        <div>
          <DailyAttendance />
          <BulkAttendance />
        </div>
        <div>
          <AttendanceCalendar />
          <AttendanceReports />
        </div>
      </div>
    </div>
  )
}
