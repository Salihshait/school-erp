import React from 'react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import TeacherAssignmentsPage from '../TeacherAssignmentsPage'
import { useTeacherPortalContext } from '../TeacherPortalContext'
import * as useStudentPortalHooks from '../../../hooks/useStudentPortal'

vi.mock('../TeacherPortalContext')
vi.mock('../../../hooks/useStudentPortal')

describe('TeacherAssignmentsPage', () => {
  const createMutateAsync = vi.fn().mockResolvedValue({})
  const gradeMutate = vi.fn()

  beforeEach(() => {
    createMutateAsync.mockClear()
    gradeMutate.mockClear()
    useTeacherPortalContext.mockReturnValue({ teacherId: 't1' })
    useStudentPortalHooks.useAssignments.mockReturnValue({ data: [], isLoading: false })
    useStudentPortalHooks.useCreateAssignment.mockReturnValue({ mutateAsync: createMutateAsync })
    useStudentPortalHooks.useAssignmentSubmissions.mockReturnValue({ data: [], isLoading: false })
    useStudentPortalHooks.useGradeSubmission.mockReturnValue({ mutate: gradeMutate })
  })

  it('does not show the assignment list until a class ID is entered', () => {
    render(<TeacherAssignmentsPage />)
    expect(screen.getByText(/Enter a class ID/)).toBeInTheDocument()
  })

  it('creates an assignment with the entered details', async () => {
    render(<TeacherAssignmentsPage />)
    fireEvent.change(screen.getByPlaceholderText('Class ID'), { target: { value: 'c1' } })
    fireEvent.change(screen.getByPlaceholderText('Subject'), { target: { value: 'Math' } })
    fireEvent.change(screen.getByPlaceholderText('Title'), { target: { value: 'Algebra worksheet' } })
    await act(async () => {
      fireEvent.click(screen.getByText('Upload Assignment'))
    })
    expect(createMutateAsync).toHaveBeenCalledWith(
      expect.objectContaining({ class_id: 'c1', subject: 'Math', title: 'Algebra worksheet', created_by: 't1' })
    )
  })

  it('grades a submission with the entered marks', () => {
    useStudentPortalHooks.useAssignments.mockReturnValue({
      data: [{ id: 'a1', subject: 'Math', title: 'Algebra worksheet', due_date: '2026-08-01' }],
      isLoading: false,
    })
    useStudentPortalHooks.useAssignmentSubmissions.mockReturnValue({
      data: [{ id: 'sub1', student_id: 's1', content: 'my answer', status: 'submitted' }],
      isLoading: false,
    })

    render(<TeacherAssignmentsPage />)
    fireEvent.change(screen.getByPlaceholderText('Class ID'), { target: { value: 'c1' } })
    fireEvent.click(screen.getByText('View Submissions'))
    fireEvent.change(screen.getByPlaceholderText('Marks'), { target: { value: '18' } })
    fireEvent.click(screen.getByText('Grade'))

    expect(gradeMutate).toHaveBeenCalledWith({ id: 'sub1', marks_obtained: 18 })
  })
})
