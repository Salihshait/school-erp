import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import StudentAssignmentsPage from '../StudentAssignmentsPage'
import { useStudentPortalContext } from '../StudentPortalContext'
import * as useStudentPortalHooks from '../../../hooks/useStudentPortal'

vi.mock('../StudentPortalContext')
vi.mock('../../../hooks/useStudentPortal')

describe('StudentAssignmentsPage', () => {
  const submitMutateAsync = vi.fn().mockResolvedValue({})

  beforeEach(() => {
    submitMutateAsync.mockClear()
    useStudentPortalContext.mockReturnValue({ student: { class_id: 'c1', section: 'A' }, studentId: 's1' })
    useStudentPortalHooks.useAssignments.mockReturnValue({
      data: [
        { id: 'a1', subject: 'Math', title: 'Algebra worksheet', due_date: '2026-08-01' },
        { id: 'a2', subject: 'Science', title: 'Lab report', due_date: '2026-08-05' },
      ],
      isLoading: false,
    })
    useStudentPortalHooks.useSubmissions.mockReturnValue({
      data: [{ assignment_id: 'a2', status: 'graded', marks_obtained: 18 }],
    })
    useStudentPortalHooks.useSubmitAssignment.mockReturnValue({ mutateAsync: submitMutateAsync })
  })

  it('shows an input to submit an unsubmitted assignment', () => {
    render(<StudentAssignmentsPage />)
    expect(screen.getByText(/Algebra worksheet/)).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Your answer or submission link')).toBeInTheDocument()
  })

  it('shows graded status for an already-submitted assignment instead of an input', () => {
    render(<StudentAssignmentsPage />)
    expect(screen.getByText(/Marks: 18/)).toBeInTheDocument()
  })

  it('submits an assignment with the entered content', async () => {
    render(<StudentAssignmentsPage />)
    fireEvent.change(screen.getByPlaceholderText('Your answer or submission link'), { target: { value: 'my answer' } })
    await act(async () => {
      fireEvent.click(screen.getByText('Submit'))
    })
    expect(submitMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ assignment_id: 'a1', student_id: 's1', content: 'my answer' })
    )
  })
})
