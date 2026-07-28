import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import * as hostelService from '../services/hostelService'

// Hostel Blocks
export function useHostelBlocks() {
  return useQuery(['hostel', 'blocks'], hostelService.getBlocks)
}

export function useCreateHostelBlock() {
  const qc = useQueryClient()
  return useMutation(hostelService.createBlock, { onSuccess: () => qc.invalidateQueries(['hostel', 'blocks']) })
}

export function useUpdateHostelBlock() {
  const qc = useQueryClient()
  return useMutation(({ id, payload }) => hostelService.updateBlock(id, payload), { onSuccess: () => qc.invalidateQueries(['hostel', 'blocks']) })
}

export function useDeleteHostelBlock() {
  const qc = useQueryClient()
  return useMutation(hostelService.deleteBlock, { onSuccess: () => qc.invalidateQueries(['hostel', 'blocks']) })
}

// Rooms
export function useRooms(params) {
  return useQuery(['hostel', 'rooms', params], () => hostelService.getRooms(params))
}

export function useCreateRoom() {
  const qc = useQueryClient()
  return useMutation(hostelService.createRoom, { onSuccess: () => qc.invalidateQueries(['hostel', 'rooms']) })
}

export function useUpdateRoom() {
  const qc = useQueryClient()
  return useMutation(({ id, payload }) => hostelService.updateRoom(id, payload), { onSuccess: () => qc.invalidateQueries(['hostel', 'rooms']) })
}

export function useDeleteRoom() {
  const qc = useQueryClient()
  return useMutation(hostelService.deleteRoom, { onSuccess: () => qc.invalidateQueries(['hostel', 'rooms']) })
}

// Beds
export function useBeds(params) {
  return useQuery(['hostel', 'beds', params], () => hostelService.getBeds(params))
}

export function useCreateBed() {
  const qc = useQueryClient()
  return useMutation(hostelService.createBed, { onSuccess: () => qc.invalidateQueries(['hostel', 'beds']) })
}

export function useUpdateBedStatus() {
  const qc = useQueryClient()
  return useMutation(({ id, status }) => hostelService.updateBedStatus(id, status), { onSuccess: () => qc.invalidateQueries(['hostel', 'beds']) })
}

// Room Allocation
export function useAllocations(params) {
  return useQuery(['hostel', 'allocations', params], () => hostelService.getAllocations(params))
}

export function useAllocateRoom() {
  const qc = useQueryClient()
  return useMutation(hostelService.allocateRoom, {
    onSuccess: () => {
      qc.invalidateQueries(['hostel', 'allocations'])
      qc.invalidateQueries(['hostel', 'beds'])
    },
  })
}

export function useVacateAllocation() {
  const qc = useQueryClient()
  return useMutation(({ id, bed_id }) => hostelService.vacateAllocation(id, bed_id), {
    onSuccess: () => {
      qc.invalidateQueries(['hostel', 'allocations'])
      qc.invalidateQueries(['hostel', 'beds'])
    },
  })
}

// Mess Management
export function useMessMenu() {
  return useQuery(['hostel', 'mess-menu'], hostelService.getMessMenu)
}

export function useUpsertMessMenu() {
  const qc = useQueryClient()
  return useMutation(hostelService.upsertMessMenu, { onSuccess: () => qc.invalidateQueries(['hostel', 'mess-menu']) })
}

export function useMessAttendance(params) {
  return useQuery(['hostel', 'mess-attendance', params], () => hostelService.getMessAttendance(params))
}

export function useRecordMessAttendance() {
  const qc = useQueryClient()
  return useMutation(hostelService.recordMessAttendance, { onSuccess: () => qc.invalidateQueries(['hostel', 'mess-attendance']) })
}

// Visitors
export function useVisitors() {
  return useQuery(['hostel', 'visitors'], hostelService.getVisitors)
}

export function useLogVisitorCheckIn() {
  const qc = useQueryClient()
  return useMutation(hostelService.logVisitorCheckIn, { onSuccess: () => qc.invalidateQueries(['hostel', 'visitors']) })
}

export function useLogVisitorCheckOut() {
  const qc = useQueryClient()
  return useMutation(hostelService.logVisitorCheckOut, { onSuccess: () => qc.invalidateQueries(['hostel', 'visitors']) })
}

// Hostel Attendance
export function useHostelAttendance(params) {
  return useQuery(['hostel', 'attendance', params], () => hostelService.getHostelAttendance(params))
}

export function useMarkHostelAttendance() {
  const qc = useQueryClient()
  return useMutation(hostelService.markHostelAttendance, { onSuccess: () => qc.invalidateQueries(['hostel', 'attendance']) })
}

// Hostel Fees
export function useHostelFees(params) {
  return useQuery(['hostel', 'fees', params], () => hostelService.getHostelFees(params))
}

export function useCreateHostelFee() {
  const qc = useQueryClient()
  return useMutation(hostelService.createHostelFee, { onSuccess: () => qc.invalidateQueries(['hostel', 'fees']) })
}

export function useCollectHostelFee() {
  const qc = useQueryClient()
  return useMutation(hostelService.collectHostelFee, {
    onSuccess: () => {
      qc.invalidateQueries(['hostel', 'fees'])
      qc.invalidateQueries(['hostel', 'fee-summary'])
    },
  })
}

export function useHostelFeeSummary() {
  return useQuery(['hostel', 'fee-summary'], hostelService.getHostelFeeSummary)
}

// Complaints
export function useComplaints(params) {
  return useQuery(['hostel', 'complaints', params], () => hostelService.getComplaints(params))
}

export function useRaiseComplaint() {
  const qc = useQueryClient()
  return useMutation(hostelService.raiseComplaint, { onSuccess: () => qc.invalidateQueries(['hostel', 'complaints']) })
}

export function useUpdateComplaintStatus() {
  const qc = useQueryClient()
  return useMutation(({ id, status }) => hostelService.updateComplaintStatus(id, status), { onSuccess: () => qc.invalidateQueries(['hostel', 'complaints']) })
}

// Reports / Dashboard
export function useRoomOccupancy() {
  return useQuery(['hostel', 'occupancy'], hostelService.getRoomOccupancy)
}
