import React from 'react'
import { useUploadTeacherDocument } from '../../../hooks/useTeachers'

export default function DocumentsUpload({ teacherId }) {
  const upload = useUploadTeacherDocument()
  function onFile(e) {
    const f = e.target.files[0]
    if (!f) return
    upload.mutate({ teacherId, file: f, name: f.name }, { onError: () => alert('Upload failed'), onSuccess: () => alert('Uploaded') })
  }

  return (
    <div>
      <input type="file" onChange={onFile} />
    </div>
  )
}
