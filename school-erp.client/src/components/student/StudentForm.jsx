import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCreateStudent, useUpdateStudent, useStudent } from '../../hooks/useStudents'
import AvatarUpload from './components/AvatarUpload'

const schema = yup.object({
  admission_number: yup.string().required(),
  first_name: yup.string().required(),
  last_name: yup.string().required(),
  email: yup.string().email().nullable(),
  mobile: yup.string().nullable(),
  dob: yup.date().nullable(),
})

export default function StudentForm({ id }) {
  const { data } = useStudent(id)
  const create = useCreateStudent()
  const update = useUpdateStudent()
  const { register, handleSubmit, reset, formState: { errors } } = useForm({ resolver: yupResolver(schema) })

  useEffect(() => { if (data) reset(data) }, [data])

  async function onSubmit(vals) {
    try {
      if (id) await update.mutateAsync({ id, payload: vals })
      else await create.mutateAsync(vals)
      alert('Saved')
    } catch (err) { alert(err.message || 'Save failed') }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ padding: 16 }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
        <div>
          <label>Admission Number</label>
          <input {...register('admission_number')} />
          {errors.admission_number && <div style={{ color: 'crimson' }}>{errors.admission_number.message}</div>}
        </div>

        <div>
          <label>Roll Number</label>
          <input {...register('roll_number')} />
        </div>

        <div>
          <label>First Name</label>
          <input {...register('first_name')} />
        </div>

        <div>
          <label>Last Name</label>
          <input {...register('last_name')} />
        </div>

        <div>
          <label>Email</label>
          <input {...register('email')} />
        </div>

        <div>
          <label>Mobile</label>
          <input {...register('mobile')} />
        </div>
      </div>

      <div style={{ marginTop: 12 }}>
        <label>Photo</label>
        <AvatarUpload studentId={id} />
      </div>

      <div style={{ marginTop: 12 }}>
        <button type="submit">Save</button>
      </div>
    </form>
  )
}
