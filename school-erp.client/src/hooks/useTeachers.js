import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import teacherService, { getClassTimetable } from '../services/teacherService'

export function useTeachers(params) {
  return useQuery(['teachers', params], () => teacherService.list(params), { keepPreviousData: true })
}

export function useTeacher(id) {
  return useQuery(['teacher', id], () => teacherService.get(id), { enabled: !!id })
}

export function useCreateTeacher() {
  const qc = useQueryClient()
  return useMutation(teacherService.create, { onSuccess: () => qc.invalidateQueries(['teachers']) })
}

export function useUpdateTeacher() {
  const qc = useQueryClient()
  return useMutation(({ id, payload }) => teacherService.update(id, payload), { onSuccess: () => qc.invalidateQueries(['teachers']) })
}

export function useDeleteTeacher() {
  const qc = useQueryClient()
  return useMutation(teacherService.remove, { onSuccess: () => qc.invalidateQueries(['teachers']) })
}

export function useClassTimetable(class_id) {
  return useQuery(['timetable', 'class', class_id], () => getClassTimetable(class_id), { enabled: !!class_id })
}

export function useUploadTeacherDocument() {
  const qc = useQueryClient()
  return useMutation(({ teacherId, file, name }) => teacherService.uploadDocument(teacherId, file, name), { onSuccess: () => qc.invalidateQueries(['teacher', teacherId]) })
}
