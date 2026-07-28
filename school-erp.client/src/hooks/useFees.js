import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as feeService from '../services/feeService'

export function useCategories() {
  return useQuery(['fees','categories'], feeService.getCategories)
}

export function useCreateCategory() {
  const qc = useQueryClient()
  return useMutation(feeService.createCategory, { onSuccess: () => qc.invalidateQueries(['fees','categories']) })
}

export function useCreateFee() {
  const qc = useQueryClient()
  return useMutation(feeService.createFee, { onSuccess: () => qc.invalidateQueries(['fees','pending']) })
}

export function usePendingFees(params) {
  return useQuery(['fees','pending', params], () => feeService.getPendingFees(params))
}

export function useRecordPayment() {
  const qc = useQueryClient()
  return useMutation(feeService.recordPayment, { onSuccess: () => { qc.invalidateQueries(['payments']); qc.invalidateQueries(['fees','pending']) } })
}

export function usePayFee() {
  const qc = useQueryClient()
  return useMutation(feeService.payFee, { onSuccess: () => { qc.invalidateQueries(['payments']); qc.invalidateQueries(['fees','pending']) } })
}

export function usePayments(student_id) {
  return useQuery(['payments', student_id], () => feeService.getPayments({ student_id }), { enabled: true })
}

export function useCollections() {
  return useQuery(['collections','daily'], feeService.getDailyCollection)
}

export function useMonthlyCollections() {
  return useQuery(['collections','monthly'], feeService.getMonthlyCollection)
}

export function useRefund() {
  const qc = useQueryClient()
  return useMutation(feeService.refundPayment, { onSuccess: () => qc.invalidateQueries(['payments']) })
}
