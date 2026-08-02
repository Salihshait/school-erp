import React, { useEffect, useRef, useState } from 'react'
import { loadModels, detectAllDescriptors, findBestMatch } from '../../services/faceRecognitionService'
import { useRosterFaceEnrollments } from '../../hooks/useFaceAttendance'

const SCAN_INTERVAL_MS = 900

// Continuously scans the webcam feed, matches detected faces against the
// roster's enrolled face descriptors, and calls onRecognized(studentId, confidence)
// the first time each student is seen in this session.
export default function FaceAttendanceCapture({ roster, onRecognized }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const intervalRef = useRef(null)
  const recognizedRef = useRef(new Set())
  const [modelsReady, setModelsReady] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [error, setError] = useState(null)
  const [log, setLog] = useState([])

  const studentIds = roster.map(s => s.id)
  const { data: enrollments, isLoading: enrollmentsLoading } = useRosterFaceEnrollments(studentIds)

  useEffect(() => {
    loadModels().then(() => setModelsReady(true)).catch(() => setError('Could not load face recognition models.'))
  }, [])

  useEffect(() => () => stopCamera(), [])

  async function startCamera() {
    setError(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 480 } })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraOn(true)
      intervalRef.current = setInterval(scanFrame, SCAN_INTERVAL_MS)
    } catch (err) {
      setError(`Could not access camera: ${err.message}`)
    }
  }

  function stopCamera() {
    clearInterval(intervalRef.current)
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  async function scanFrame() {
    if (!videoRef.current || !modelsReady || !enrollments?.length) return
    const faces = await detectAllDescriptors(videoRef.current)
    for (const face of faces) {
      const match = findBestMatch(face.descriptor, enrollments)
      if (!match || recognizedRef.current.has(match.studentId)) continue
      recognizedRef.current.add(match.studentId)
      const student = roster.find(s => s.id === match.studentId)
      const confidence = Math.round((1 - match.distance) * 100)
      setLog(prev => [{ studentId: match.studentId, name: student ? `${student.first_name} ${student.last_name}` : match.studentId, confidence, time: new Date() }, ...prev])
      onRecognized(match.studentId, confidence)
    }
  }

  return (
    <div>
      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{
            width: 360, height: 270, borderRadius: 10, overflow: 'hidden',
            background: 'var(--code-bg)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {cameraOn ? (
              <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'var(--text)', fontSize: 13.5, padding: 12, textAlign: 'center' }}>
                {enrollmentsLoading ? 'Loading enrolled faces...' : `${enrollments?.length || 0} face captures enrolled for this roster`}
              </span>
            )}
          </div>
          <div style={{ marginTop: 10 }}>
            {!cameraOn ? (
              <button onClick={startCamera} disabled={!modelsReady || !enrollments?.length}>
                {!modelsReady ? 'Loading models...' : !enrollments?.length ? 'No enrolled faces for this class' : 'Start scanning'}
              </button>
            ) : (
              <button className="btn-secondary" onClick={stopCamera}>Stop scanning</button>
            )}
          </div>
          {error && <p style={{ marginTop: 8, fontSize: 13, color: 'var(--danger)' }}>{error}</p>}
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 8 }}>Recognized ({log.length}/{roster.length})</div>
          {log.length === 0 ? (
            <div style={{ fontSize: 13.5, color: 'var(--text)' }}>No students recognized yet.</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {log.map(entry => (
                <div key={entry.studentId} style={{
                  display: 'flex', justifyContent: 'space-between', fontSize: 13.5,
                  padding: '6px 10px', borderRadius: 7, background: 'var(--success-bg)', color: 'var(--text-h)',
                }}>
                  <span>{entry.name}</span>
                  <span style={{ color: 'var(--success)' }}>{entry.confidence}% · {entry.time.toLocaleTimeString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
