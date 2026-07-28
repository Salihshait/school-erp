import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import studentService from '../services/studentService'

export function useStudents({ page = 1, perPage = 20, search = '', filters = {} } = {}) {
  return useQuery(['students', { page, perPage, search, filters }], () => studentService.list({ page, perPage, search, filters }), { keepPreviousData: true })
}

export function useStudent(id) {
  return useQuery(['student', id], () => studentService.getById(id), { enabled: !!id })
}

export function useCreateStudent() {
  const qc = useQueryClient()
  return useMutation(studentService.create, { onSuccess: () => qc.invalidateQueries(['students']) })
}

export function useUpdateStudent() {
  const qc = useQueryClient()
  return useMutation(({ id, payload }) => studentService.update(id, payload), { onSuccess: () => qc.invalidateQueries(['students']) })
}

export function useDeleteStudent() {
  const qc = useQueryClient()
  return useMutation(studentService.remove, { onSuccess: () => qc.invalidateQueries(['students']) })
}

export function useUploadPhoto() {
  const qc = useQueryClient()
  return useMutation(({ studentId, file }) => studentService.uploadPhoto(studentId, file), { onSuccess: () => qc.invalidateQueries(['student']) })
}
