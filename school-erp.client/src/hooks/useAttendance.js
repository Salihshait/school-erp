import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as attendanceService from '../services/attendanceService'

export function useCreateSession() {
  const qc = useQueryClient()
  return useMutation(attendanceService.createSession, { onSuccess: () => qc.invalidateQueries(['attendance','sessions']) })
}

export function useRecordAttendance() {
  const qc = useQueryClient()
  return useMutation(attendanceService.recordAttendance, { onSuccess: () => qc.invalidateQueries(['attendance','records']) })
}

export function useBulkRecord() {
  const qc = useQueryClient()
  return useMutation(attendanceService.bulkRecordAttendance, { onSuccess: () => qc.invalidateQueries(['attendance','records']) })
}

export function useSessionRecords(session_id) {
  return useQuery(['attendance','session',session_id], () => attendanceService.getSessionRecords(session_id), { enabled: !!session_id })
}

export function useHolidays() {
  return useQuery(['attendance','holidays'], attendanceService.getHolidays)
}

export function useCreateLeave() {
  const qc = useQueryClient()
  return useMutation(attendanceService.createLeaveRequest, { onSuccess: () => qc.invalidateQueries(['attendance','leaves']) })
}
