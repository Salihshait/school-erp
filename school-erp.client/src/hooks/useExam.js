import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as examService from '../services/examService'

export function useCreateExamType() {
  const qc = useQueryClient()
  return useMutation(examService.createExamType, { onSuccess: () => qc.invalidateQueries(['exams','types']) })
}

export function useCreateExam() {
  const qc = useQueryClient()
  return useMutation(examService.createExam, { onSuccess: () => qc.invalidateQueries(['exams','list']) })
}

export function useExams() {
  return useQuery(['exams', 'list'], examService.getExams)
}

export function useAddQuestion() {
  const qc = useQueryClient()
  return useMutation(examService.addQuestion, { onSuccess: () => qc.invalidateQueries(['exams','questions']) })
}

export function useEnterMarks() {
  const qc = useQueryClient()
  return useMutation(examService.enterMarks, { onSuccess: () => qc.invalidateQueries(['exams','marks']) })
}

export function usePublishResults() {
  const qc = useQueryClient()
  return useMutation(examService.publishResults, { onSuccess: () => qc.invalidateQueries(['exams','published']) })
}

export function useExamSchedule(exam_id) {
  return useQuery(['exams','schedule',exam_id], () => examService.getExamSchedule(exam_id), { enabled: !!exam_id })
}

export function useProgressCard(student_id, exam_id) {
  return useQuery(['progress', student_id, exam_id], () => examService.getProgressCard({ student_id, exam_id }), { enabled: !!student_id && !!exam_id })
}

export function useStudentMarks(student_id) {
  return useQuery(['exams', 'marks', student_id], () => examService.getStudentMarks(student_id), { enabled: !!student_id })
}
