import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as transportService from '../services/transportService'

export function useRoutes() {
  return useQuery(['transport','routes'], transportService.getRoutes)
}

export function useCreateRoute() {
  const qc = useQueryClient()
  return useMutation(transportService.createRoute, { onSuccess: () => qc.invalidateQueries(['transport','routes']) })
}

export function useVehicles() {
  return useQuery(['transport','vehicles'], transportService.getVehicles)
}

export function useAddVehicle() {
  const qc = useQueryClient()
  return useMutation(transportService.addVehicle, { onSuccess: () => qc.invalidateQueries(['transport','vehicles']) })
}

export function useDrivers() {
  return useQuery(['transport','drivers'], transportService.getDrivers)
}

export function useAddDriver() {
  const qc = useQueryClient()
  return useMutation(transportService.addDriver, { onSuccess: () => qc.invalidateQueries(['transport','drivers']) })
}

export function useAllocateVehicle() {
  const qc = useQueryClient()
  return useMutation(transportService.allocateVehicle, { onSuccess: () => qc.invalidateQueries(['transport','allocations']) })
}

export function useMaintenance() {
  const qc = useQueryClient()
  return useMutation(transportService.recordMaintenance, { onSuccess: () => qc.invalidateQueries(['transport','maintenance']) })
}

export function useFuelExpense() {
  const qc = useQueryClient()
  return useMutation(transportService.addFuelExpense, { onSuccess: () => qc.invalidateQueries(['transport','fuel']) })
}

export function useVehicleUtilization() {
  return useQuery(['transport','utilization'], transportService.getVehicleUtilization)
}
