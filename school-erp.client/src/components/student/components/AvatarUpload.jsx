import React, { useRef, useState } from 'react'
import { useUploadPhoto } from '../../../hooks/useStudents'

export default function AvatarUpload({ studentId }) {
  const inputRef = useRef()
  const [preview, setPreview] = useState(null)
  const upload = useUploadPhoto()

  function onFile(e) {
    const f = e.target.files[0]
    if (!f) return
    setPreview(URL.createObjectURL(f))
    upload.mutate({ studentId, file: f }, {
      onError: () => alert('Upload failed')
    })
  }

  return (
    <div>
      <div style={{ marginBottom: 8 }}>
        <img src={preview || '/placeholder.png'} alt="avatar" style={{ width: 120, height: 120, objectFit: 'cover', borderRadius: 8 }} />
      </div>
      <input ref={inputRef} type="file" accept="image/*" onChange={onFile} />
    </div>
  )
}
