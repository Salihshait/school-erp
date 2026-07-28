import React, { useMemo, useState } from 'react'
import { useCalendarEntries } from '../../../hooks/useDashboard'
import PortalCard from '../../common/PortalCard'
import EmptyState from '../../common/EmptyState'

function monthKey(date) {
  return date.toISOString().slice(0, 7)
}

export default function CalendarWidget() {
  const [cursor, setCursor] = useState(() => new Date())
  const month = monthKey(cursor)
  const { data, isLoading } = useCalendarEntries(month)
  const entries = data || []

  const entriesByDate = useMemo(() => {
    const map = new Map()
    entries.forEach(e => {
      const list = map.get(e.date) || []
      list.push(e)
      map.set(e.date, list)
    })
    return map
  }, [entries])

  const year = cursor.getFullYear()
  const monthIndex = cursor.getMonth()
  const firstDay = new Date(year, monthIndex, 1).getDay()
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate()
  const cells = [...Array(firstDay).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => i + 1)]

  function changeMonth(delta) {
    setCursor(new Date(year, monthIndex + delta, 1))
  }

  return (
    <PortalCard
      title="Calendar"
      action={(
        <div style={{ display: 'flex', gap: 6 }}>
          <button onClick={() => changeMonth(-1)}>‹</button>
          <span style={{ fontSize: 13.5 }}>{cursor.toLocaleString(undefined, { month: 'long', year: 'numeric' })}</span>
          <button onClick={() => changeMonth(1)}>›</button>
        </div>
      )}
    >
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4, fontSize: 12.5, marginBottom: 10 }}>
        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
          <div key={i} style={{ textAlign: 'center', color: 'var(--text)' }}>{d}</div>
        ))}
        {cells.map((day, i) => {
          if (!day) return <div key={i} />
          const dateStr = `${year}-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasEntry = entriesByDate.has(dateStr)
          return (
            <div
              key={i}
              title={hasEntry ? entriesByDate.get(dateStr).map(e => e.title).join(', ') : undefined}
              style={{
                textAlign: 'center',
                padding: '4px 0',
                borderRadius: 6,
                background: hasEntry ? 'var(--accent-bg)' : 'transparent',
                color: hasEntry ? 'var(--accent)' : 'var(--text-h)',
                fontWeight: hasEntry ? 700 : 400,
              }}
            >
              {day}
            </div>
          )
        })}
      </div>

      {isLoading ? 'Loading...' : entries.length === 0 ? (
        <EmptyState>No events or holidays this month.</EmptyState>
      ) : entries.map((e, i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 0', fontSize: 13 }}>
          <span>{e.title}</span>
          <span style={{ color: 'var(--text)', textTransform: 'capitalize' }}>{e.date} • {e.type}</span>
        </div>
      ))}
    </PortalCard>
  )
}
