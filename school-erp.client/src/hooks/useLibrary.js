import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as libraryService from '../services/libraryService'

export function useCreateBook() {
  const qc = useQueryClient()
  return useMutation(libraryService.addBook, { onSuccess: () => qc.invalidateQueries(['library','books']) })
}

export function useAddCopy() {
  const qc = useQueryClient()
  return useMutation(libraryService.addCopy, { onSuccess: () => qc.invalidateQueries(['library','copies']) })
}

export function useRegisterMember() {
  const qc = useQueryClient()
  return useMutation(libraryService.registerMember, { onSuccess: () => qc.invalidateQueries(['library','members']) })
}

export function useIssueBook() {
  const qc = useQueryClient()
  return useMutation(libraryService.issueBook, { onSuccess: () => { qc.invalidateQueries(['library','issues']); qc.invalidateQueries(['library','copies']) } })
}

export function useReturnBook() {
  const qc = useQueryClient()
  return useMutation(libraryService.returnBook, { onSuccess: () => { qc.invalidateQueries(['library','issues']); qc.invalidateQueries(['library','copies']) } })
}

export function useRenewBook() {
  const qc = useQueryClient()
  return useMutation(libraryService.renewBook, { onSuccess: () => qc.invalidateQueries(['library','issues']) })
}

export function useReserveBook() {
  const qc = useQueryClient()
  return useMutation(libraryService.reserveBook, { onSuccess: () => qc.invalidateQueries(['library','reservations']) })
}

export function useSearchBooks(q) {
  return useQuery(['library','search',q], () => libraryService.searchBooks(q), { enabled: !!q })
}

export function useAddFine() {
  const qc = useQueryClient()
  return useMutation(libraryService.addFine, { onSuccess: () => qc.invalidateQueries(['library','fines']) })
}
