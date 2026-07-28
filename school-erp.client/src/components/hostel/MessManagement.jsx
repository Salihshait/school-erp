import React, { useState } from 'react'
import { useMessMenu, useUpsertMessMenu } from '../../hooks/useHostel'

const DAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun']
const MEALS = ['breakfast', 'lunch', 'snacks', 'dinner']

export default function MessManagement() {
  const { data: menu, isLoading } = useMessMenu()
  const upsert = useUpsertMessMenu()
  const [day, setDay] = useState('mon')
  const [meal, setMeal] = useState('breakfast')
  const [items, setItems] = useState('')

  async function submit() {
    if (!items.trim()) return
    await upsert.mutateAsync({ day_of_week: day, meal_type: meal, items })
    setItems('')
  }

  function entryFor(d, m) {
    return menu?.find(x => x.day_of_week === d && x.meal_type === m)
  }

  return (
    <div style={{ marginTop: 12 }}>
      <h4>Mess Management</h4>
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
        <select value={day} onChange={e => setDay(e.target.value)}>
          {DAYS.map(d => <option key={d} value={d}>{d.toUpperCase()}</option>)}
        </select>
        <select value={meal} onChange={e => setMeal(e.target.value)}>
          {MEALS.map(m => <option key={m} value={m}>{m}</option>)}
        </select>
        <input placeholder="Menu items (comma separated)" value={items} onChange={e => setItems(e.target.value)} style={{ minWidth: 220 }} />
        <button onClick={submit}>Save Menu</button>
      </div>
      <div style={{ marginTop: 8, overflowX: 'auto' }}>
        {isLoading ? 'Loading...' : (
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
            <thead>
              <tr>
                <th style={{ textAlign: 'left', padding: 4 }}>Day</th>
                {MEALS.map(m => <th key={m} style={{ textAlign: 'left', padding: 4 }}>{m}</th>)}
              </tr>
            </thead>
            <tbody>
              {DAYS.map(d => (
                <tr key={d} style={{ borderTop: '1px solid #eee' }}>
                  <td style={{ padding: 4, fontWeight: 600 }}>{d.toUpperCase()}</td>
                  {MEALS.map(m => <td key={m} style={{ padding: 4 }}>{entryFor(d, m)?.items || '—'}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
