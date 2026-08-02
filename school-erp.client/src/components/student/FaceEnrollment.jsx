import React, { useEffect, useRef, useState } from 'react'
import { loadModels, detectDescriptor } from '../../services/faceRecognitionService'
import faceEnrollmentService from '../../services/faceEnrollmentService'
import { useFaceEnrollments, useAddFaceEnrollment, useRemoveFaceEnrollment } from '../../hooks/useFaceAttendance'

const ANGLE_PROMPTS = ['Look straight at the camera', 'Turn your head slightly left', 'Turn your head slightly right']

export default function FaceEnrollment({ studentId }) {
  const videoRef = useRef(null)
  const streamRef = useRef(null)
  const [modelsReady, setModelsReady] = useState(false)
  const [cameraOn, setCameraOn] = useState(false)
  const [status, setStatus] = useState(null)
  const [capturing, setCapturing] = useState(false)

  const { data: enrollments, isLoading } = useFaceEnrollments(studentId)
  const addEnrollment = useAddFaceEnrollment(studentId)
  const removeEnrollment = useRemoveFaceEnrollment(studentId)

  useEffect(() => {
    loadModels().then(() => setModelsReady(true)).catch(() => setStatus({ type: 'error', text: 'Could not load face recognition models.' }))
  }, [])

  useEffect(() => () => stopCamera(), [])

  async function startCamera() {
    setStatus(null)
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { width: 480, height: 360 } })
      streamRef.current = stream
      if (videoRef.current) videoRef.current.srcObject = stream
      setCameraOn(true)
    } catch (err) {
      setStatus({ type: 'error', text: `Could not access camera: ${err.message}` })
    }
  }

  function stopCamera() {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
    setCameraOn(false)
  }

  async function capture() {
    if (!videoRef.current || !modelsReady) return
    setCapturing(true)
    setStatus(null)
    try {
      const descriptor = await detectDescriptor(videoRef.current)
      if (!descriptor) {
        setStatus({ type: 'error', text: 'No face detected — center your face in frame and try again.' })
        return
      }
      const canvas = document.createElement('canvas')
      canvas.width = videoRef.current.videoWidth
      canvas.height = videoRef.current.videoHeight
      canvas.getContext('2d').drawImage(videoRef.current, 0, 0)
      const imageBlob = await new Promise(resolve => canvas.toBlob(resolve, 'image/jpeg', 0.9))

      const angleIndex = enrollments?.length || 0
      const label = ANGLE_PROMPTS[Math.min(angleIndex, ANGLE_PROMPTS.length - 1)]
      await addEnrollment.mutateAsync({ descriptor, imageBlob, label })
      setStatus({ type: 'info', text: 'Face captured and saved.' })
    } catch (err) {
      setStatus({ type: 'error', text: err.message || String(err) })
    } finally {
      setCapturing(false)
    }
  }

  const nextPrompt = ANGLE_PROMPTS[Math.min(enrollments?.length || 0, ANGLE_PROMPTS.length - 1)]

  return (
    <section style={{ marginTop: 20 }}>
      <h3>Face Enrollment</h3>
      <p style={{ fontSize: 13.5, color: 'var(--text)', marginBottom: 12 }}>
        Capture a few angles of this student's face so they can be recognized automatically for attendance.
        {enrollments?.length < 3 && enrollments?.length >= 0 && ` Next: ${nextPrompt}.`}
      </p>

      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
        <div>
          <div style={{
            width: 320, height: 240, borderRadius: 10, overflow: 'hidden',
            background: 'var(--code-bg)', border: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            {cameraOn ? (
              <video ref={videoRef} autoPlay muted playsInline style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: 'var(--text)', fontSize: 13.5 }}>Camera is off</span>
            )}
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 10 }}>
            {!cameraOn ? (
              <button onClick={startCamera}>Start camera</button>
            ) : (
              <>
                <button onClick={capture} disabled={!modelsReady || capturing}>
                  {capturing ? 'Capturing...' : !modelsReady ? 'Loading models...' : 'Capture face'}
                </button>
                <button className="btn-secondary" onClick={stopCamera}>Stop camera</button>
              </>
            )}
          </div>
          {status && (
            <p style={{ marginTop: 8, fontSize: 13, color: status.type === 'error' ? 'var(--danger)' : 'var(--success)' }}>
              {status.text}
            </p>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, marginBottom: 8 }}>Enrolled captures ({enrollments?.length || 0})</div>
          {isLoading ? 'Loading...' : !enrollments?.length ? (
            <div style={{ fontSize: 13.5, color: 'var(--text)' }}>No face captures yet.</div>
          ) : (
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {enrollments.map(e => (
                <div key={e.id} style={{ textAlign: 'center' }}>
                  <img
                    src={faceEnrollmentService.getImageUrl(e.image_path) || '/placeholder.png'}
                    alt={e.label || 'capture'}
                    style={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)' }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--text)', marginTop: 4, maxWidth: 80 }}>{e.label}</div>
                  <button
                    className="btn-danger btn-sm"
                    style={{ marginTop: 4 }}
                    onClick={() => removeEnrollment.mutate(e.id)}
                  >
                    Remove
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
