import React, { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { useCreateTeacher, useUpdateTeacher, useTeacher } from '../../hooks/useTeachers'
import AvatarUpload from '../student/components/AvatarUpload'
import '../common/FormCard.css'

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
    <div style={{ padding: 20 }}>
      <h2>{id ? 'Edit Teacher' : 'Add Teacher'}</h2>
      <form onSubmit={handleSubmit(onSubmit)} className="form-card">
        <div className="form-section">
          <h3 className="form-section-title">Photo</h3>
          <AvatarUpload studentId={id} />
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Employment</h3>
          <div className="form-grid">
            <div className="field">
              <label>Employee Number</label>
              <input {...register('employee_number')} />
              {errors.employee_number && <div className="field-error">{errors.employee_number.message}</div>}
            </div>
            <div className="field">
              <label>Designation</label>
              <input {...register('designation')} />
            </div>
            <div className="field">
              <label>Department</label>
              <input {...register('department_id')} />
            </div>
            <div className="field">
              <label>Joining Date</label>
              <input type="date" {...register('joining_date')} />
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Personal Details</h3>
          <div className="form-grid">
            <div className="field">
              <label>First Name</label>
              <input {...register('first_name')} />
              {errors.first_name && <div className="field-error">{errors.first_name.message}</div>}
            </div>
            <div className="field">
              <label>Last Name</label>
              <input {...register('last_name')} />
              {errors.last_name && <div className="field-error">{errors.last_name.message}</div>}
            </div>
          </div>
        </div>

        <div className="form-section">
          <h3 className="form-section-title">Contact</h3>
          <div className="form-grid">
            <div className="field">
              <label>Email</label>
              <input type="email" {...register('email')} />
              {errors.email && <div className="field-error">{errors.email.message}</div>}
            </div>
            <div className="field">
              <label>Mobile</label>
              <input {...register('mobile')} />
            </div>
          </div>
        </div>

        <div className="form-actions">
          <button type="submit">Save</button>
          <button type="button" className="btn-secondary" onClick={() => window.history.back()}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
