import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as payrollService from '../services/payrollService'

// Salary Structure
export function useSalaryStructures(params) {
  return useQuery(['payroll', 'salary-structures', params], () => payrollService.getSalaryStructures(params))
}

export function useCreateSalaryStructure() {
  const qc = useQueryClient()
  return useMutation(payrollService.createSalaryStructure, { onSuccess: () => qc.invalidateQueries(['payroll', 'salary-structures']) })
}

// Allowance
export function useAllowances(params) {
  return useQuery(['payroll', 'allowances', params], () => payrollService.getAllowances(params))
}

export function useCreateAllowance() {
  const qc = useQueryClient()
  return useMutation(payrollService.createAllowance, { onSuccess: () => qc.invalidateQueries(['payroll', 'allowances']) })
}

export function useDeleteAllowance() {
  const qc = useQueryClient()
  return useMutation(payrollService.deleteAllowance, { onSuccess: () => qc.invalidateQueries(['payroll', 'allowances']) })
}

// Deduction
export function useDeductions(params) {
  return useQuery(['payroll', 'deductions', params], () => payrollService.getDeductions(params))
}

export function useCreateDeduction() {
  const qc = useQueryClient()
  return useMutation(payrollService.createDeduction, { onSuccess: () => qc.invalidateQueries(['payroll', 'deductions']) })
}

export function useDeleteDeduction() {
  const qc = useQueryClient()
  return useMutation(payrollService.deleteDeduction, { onSuccess: () => qc.invalidateQueries(['payroll', 'deductions']) })
}

// PF
export function usePfContributions(params) {
  return useQuery(['payroll', 'pf', params], () => payrollService.getPfContributions(params))
}

export function useUpsertPfContribution() {
  const qc = useQueryClient()
  return useMutation(payrollService.upsertPfContribution, { onSuccess: () => qc.invalidateQueries(['payroll', 'pf']) })
}

// ESI
export function useEsiContributions(params) {
  return useQuery(['payroll', 'esi', params], () => payrollService.getEsiContributions(params))
}

export function useUpsertEsiContribution() {
  const qc = useQueryClient()
  return useMutation(payrollService.upsertEsiContribution, { onSuccess: () => qc.invalidateQueries(['payroll', 'esi']) })
}

// Professional Tax
export function useProfessionalTax(params) {
  return useQuery(['payroll', 'pt', params], () => payrollService.getProfessionalTax(params))
}

export function useUpsertProfessionalTax() {
  const qc = useQueryClient()
  return useMutation(payrollService.upsertProfessionalTax, { onSuccess: () => qc.invalidateQueries(['payroll', 'pt']) })
}

// Loan
export function useLoans(params) {
  return useQuery(['payroll', 'loans', params], () => payrollService.getLoans(params))
}

export function useCreateLoan() {
  const qc = useQueryClient()
  return useMutation(payrollService.createLoan, { onSuccess: () => qc.invalidateQueries(['payroll', 'loans']) })
}

export function useCloseLoan() {
  const qc = useQueryClient()
  return useMutation(payrollService.closeLoan, { onSuccess: () => qc.invalidateQueries(['payroll', 'loans']) })
}

export function useLoanRepayments(params) {
  return useQuery(['payroll', 'loan-repayments', params], () => payrollService.getLoanRepayments(params))
}

export function useRecordLoanRepayment() {
  const qc = useQueryClient()
  return useMutation(payrollService.recordLoanRepayment, { onSuccess: () => qc.invalidateQueries(['payroll', 'loan-repayments']) })
}

// Advance Salary
export function useAdvanceSalaries(params) {
  return useQuery(['payroll', 'advances', params], () => payrollService.getAdvanceSalaries(params))
}

export function useRequestAdvanceSalary() {
  const qc = useQueryClient()
  return useMutation(payrollService.requestAdvanceSalary, { onSuccess: () => qc.invalidateQueries(['payroll', 'advances']) })
}

export function useUpdateAdvanceSalaryStatus() {
  const qc = useQueryClient()
  return useMutation(({ id, status }) => payrollService.updateAdvanceSalaryStatus(id, status), { onSuccess: () => qc.invalidateQueries(['payroll', 'advances']) })
}

// Bonus
export function useBonuses(params) {
  return useQuery(['payroll', 'bonuses', params], () => payrollService.getBonuses(params))
}

export function useCreateBonus() {
  const qc = useQueryClient()
  return useMutation(payrollService.createBonus, { onSuccess: () => qc.invalidateQueries(['payroll', 'bonuses']) })
}

// Payslip
export function usePayslips(params) {
  return useQuery(['payroll', 'payslips', params], () => payrollService.getPayslips(params))
}

export function useGeneratePayslip() {
  const qc = useQueryClient()
  return useMutation(payrollService.generatePayslip, { onSuccess: () => qc.invalidateQueries(['payroll', 'payslips']) })
}

// Reports
export function usePayrollSummary() {
  return useQuery(['payroll', 'summary'], payrollService.getPayrollSummary)
}
