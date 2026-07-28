import React from 'react'
import { useCertificates } from '../../hooks/useStudentPortal'
import { useStudentPortalContext } from './StudentPortalContext'
import { generateCertificatePdf } from '../../utils/certificatePdf'
import PortalCard from '../common/PortalCard'
import EmptyState from '../common/EmptyState'

export default function StudentCertificatesPage() {
  const { student, studentId } = useStudentPortalContext()
  const { data, isLoading } = useCertificates(studentId)
  const certificates = data || []

  return (
    <div>
      <h2>Certificates</h2>
      <PortalCard title="Issued Certificates">
        {isLoading ? 'Loading...' : certificates.length === 0 ? (
          <EmptyState>No certificates issued yet.</EmptyState>
        ) : certificates.map(c => (
          <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid var(--border)' }}>
            <span style={{ textTransform: 'capitalize' }}>{c.certificate_type} — {c.issued_date}</span>
            <button onClick={() => generateCertificatePdf(c, student)}>Download PDF</button>
          </div>
        ))}
      </PortalCard>
    </div>
  )
}
