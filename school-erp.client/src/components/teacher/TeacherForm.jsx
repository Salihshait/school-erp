import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCreateTeacher, useUpdateTeacher, useTeacher } from '../../hooks/useTeachers'
import AvatarUpload from '../student/components/AvatarUpload'

const schema = yup.object({
  employee_number: yup.string().required('Employee number required'),
  first_name: yup.string().required('First name required'),
  last_name: yup.string().required('Last name required'),
  email: yup.string().email('Invalid email').nullable(),
  mobile: yup.string().nullable()
})

export default function TeacherForm({ id }) {
  const { data } = useTeacher(id)
  const create = useCreateTeacher()
  const update = useUpdateTeacher()
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
          <label>Employee Number</label>
          <input {...register('employee_number')} />
          {errors.employee_number && <div style={{ color: 'crimson' }}>{errors.employee_number.message}</div>}
        </div>
        <div>
          <label>Designation</label>
          <input {...register('designation')} />
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
          <label>Department</label>
          <input {...register('department_id')} />
        </div>
        <div>
          <label>Mobile</label>
          <input {...register('mobile')} />
        </div>

        <div>
          <label>Email</label>
          <input {...register('email')} />
        </div>

        <div>
          <label>Joining Date</label>
          <input type="date" {...register('joining_date')} />
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
