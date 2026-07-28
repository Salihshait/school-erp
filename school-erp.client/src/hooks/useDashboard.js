import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as dashboardService from '../services/dashboardService'

export function useStudentCount() {
  return useQuery(['dashboard', 'student-count'], dashboardService.getStudentCount)
}

export function useTeacherCount() {
  return useQuery(['dashboard', 'teacher-count'], dashboardService.getTeacherCount)
}

export function useClassCount() {
  return useQuery(['dashboard', 'class-count'], dashboardService.getClassCount)
}

export function useTodayAttendanceSummary() {
  return useQuery(['dashboard', 'today-attendance'], dashboardService.getTodayAttendanceSummary)
}

export function useTodaysBirthdays() {
  return useQuery(['dashboard', 'birthdays'], dashboardService.getTodaysBirthdays)
}

export function useRecentAdmissions(limit) {
  return useQuery(['dashboard', 'recent-admissions', limit], () => dashboardService.getRecentAdmissions(limit))
}

export function useRecentNotices(limit) {
  return useQuery(['dashboard', 'recent-notices', limit], () => dashboardService.getRecentNotices(limit))
}

export function useMonthlyFinance() {
  return useQuery(['dashboard', 'finance'], dashboardService.getMonthlyFinance)
}

export function useExpenses(limit) {
  return useQuery(['dashboard', 'expenses', limit], () => dashboardService.getExpenses(limit))
}

export function useCreateExpense() {
  const qc = useQueryClient()
  return useMutation(dashboardService.createExpense, {
    onSuccess: () => {
      qc.invalidateQueries(['dashboard', 'expenses'])
      qc.invalidateQueries(['dashboard', 'finance'])
    },
  })
}

export function useCalendarEntries(month) {
  return useQuery(['dashboard', 'calendar', month], () => dashboardService.getCalendarEntries(month), { enabled: !!month })
}
