import React from 'react'

export default function HallTicket({ ticket }) {
  if (!ticket) return <div>No hall ticket</div>
  return (
    <div style={{ padding: 12, border: '1px solid #ddd', width: 360 }}>
      <h4>Hall Ticket</h4>
      <div>Student: {ticket.student_id}</div>
      <div>Exam: {ticket.exam_id}</div>
      <div>URL: {ticket.ticket_url}</div>
    </div>
  )
}
