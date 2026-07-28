import { useQuery } from '@tanstack/react-query'
import * as reportsService from '../services/reportsService'

export function useAdmissionsMonthly() {
  return useQuery(['reports', 'admissions-monthly'], reportsService.getAdmissionsMonthly)
}

export function useExamPerformance() {
  return useQuery(['reports', 'exam-performance'], reportsService.getExamPerformance)
}

export function useBookIssueSummary() {
  return useQuery(['reports', 'book-issue-summary'], reportsService.getBookIssueSummary)
}

export function useTeacherPerformanceSummary() {
  return useQuery(['reports', 'teacher-performance-summary'], reportsService.getTeacherPerformanceSummary)
}
