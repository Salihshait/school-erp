import React from 'react'
import { useHolidays } from '../../hooks/useAttendance'

export default function AttendanceCalendar() {
  const holidays = useHolidays()

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Calendar View</h4>
      <div style={{ minHeight: 120, border: '1px solid #eee', padding: 8 }}>
        <div>Calendar placeholder — integrate FullCalendar or similar.</div>
        <div style={{ marginTop: 8 }}>
          <strong>Holidays:</strong>
          <ul>
            {holidays.isLoading ? <li>Loading...</li> : holidays.data?.map(h => <li key={h.id}>{h.holiday_date} — {h.title}</li>)}
          </ul>
        </div>
      </div>
    </div>
  )
}
