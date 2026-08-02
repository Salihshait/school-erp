import React, { useState } from 'react'
import { useBiometricDevices, useAddBiometricDevice, useUpdateBiometricDevice, useRemoveBiometricDevice } from '../../hooks/useFaceAttendance'

const emptyForm = { name: '', api_endpoint: '', api_key: '' }

export default function BiometricDeviceSettings() {
  const { data: devices, isLoading } = useBiometricDevices()
  const addDevice = useAddBiometricDevice()
  const updateDevice = useUpdateBiometricDevice()
  const removeDevice = useRemoveBiometricDevice()
  const [form, setForm] = useState(emptyForm)

  async function handleAdd(e) {
    e.preventDefault()
    if (!form.name || !form.api_endpoint) return
    await addDevice.mutateAsync(form)
    setForm(emptyForm)
  }

  return (
    <section style={{ marginTop: 16 }}>
      <h3>Fingerprint / Biometric Devices</h3>
      <p style={{ fontSize: 13.5, color: 'var(--text)', maxWidth: 640 }}>
        A browser can't talk to a USB fingerprint scanner directly — it needs the vendor's
        own SDK running locally as a bridge that exposes an API. Register that bridge's
        connection details here; devices stay disconnected until you point them at a real
        endpoint and enable them. See <code>src/services/fingerprintService.js</code> for
        the request contract to adapt for your specific hardware.
      </p>

      <form onSubmit={handleAdd} style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12, marginBottom: 16 }}>
        <input placeholder="Device name" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
        <input placeholder="API endpoint (e.g. http://localhost:9000)" value={form.api_endpoint} onChange={e => setForm(f => ({ ...f, api_endpoint: e.target.value }))} style={{ minWidth: 260 }} />
        <input placeholder="API key (optional)" value={form.api_key} onChange={e => setForm(f => ({ ...f, api_key: e.target.value }))} />
        <button type="submit" disabled={addDevice.isLoading}>Add device</button>
      </form>

      {isLoading ? 'Loading...' : !devices?.length ? (
        <div style={{ fontSize: 13.5, color: 'var(--text)' }}>No biometric devices configured yet.</div>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13.5 }}>
          <thead>
            <tr style={{ textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
              <th style={{ padding: '6px 8px' }}>Name</th>
              <th style={{ padding: '6px 8px' }}>Endpoint</th>
              <th style={{ padding: '6px 8px' }}>Status</th>
              <th style={{ padding: '6px 8px' }}></th>
            </tr>
          </thead>
          <tbody>
            {devices.map(d => (
              <tr key={d.id} style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '6px 8px' }}>{d.name}</td>
                <td style={{ padding: '6px 8px' }}>{d.api_endpoint}</td>
                <td style={{ padding: '6px 8px' }}>
                  <span style={{ color: d.enabled ? 'var(--success)' : 'var(--text)' }}>
                    {d.enabled ? 'Enabled' : 'Disabled (not connected)'}
                  </span>
                </td>
                <td style={{ padding: '6px 8px', display: 'flex', gap: 6 }}>
                  <button
                    className="btn-secondary btn-sm"
                    onClick={() => updateDevice.mutate({ id: d.id, payload: { enabled: !d.enabled } })}
                  >
                    {d.enabled ? 'Disable' : 'Enable'}
                  </button>
                  <button className="btn-danger btn-sm" onClick={() => removeDevice.mutate(d.id)}>Remove</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </section>
  )
}
