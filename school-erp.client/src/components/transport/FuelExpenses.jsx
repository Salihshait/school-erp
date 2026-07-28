import React, { useState } from 'react'
import { useFuelExpense } from '../../hooks/useTransport'

export default function FuelExpenses() {
  const [vehicleId, setVehicleId] = useState('')
  const [amount, setAmount] = useState('')
  const [litres, setLitres] = useState('')
  const addFuel = useFuelExpense()

  async function submit() {
    await addFuel.mutateAsync({ vehicle_id: vehicleId, amount: parseFloat(amount), litres: parseFloat(litres) })
    setVehicleId('')
    setAmount('')
    setLitres('')
    alert('Fuel expense recorded (demo)')
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Fuel Expense</h4>
      <div>
        <input placeholder="Vehicle ID" value={vehicleId} onChange={e => setVehicleId(e.target.value)} />
        <input placeholder="Amount" value={amount} onChange={e => setAmount(e.target.value)} />
        <input placeholder="Litres" value={litres} onChange={e => setLitres(e.target.value)} />
      </div>
      <button onClick={submit}>Record Expense</button>
    </div>
  )
}
