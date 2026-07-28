import React from 'react'
import SalaryStructure from './SalaryStructure'
import Allowance from './Allowance'
import Deduction from './Deduction'
import PF from './PF'
import ESI from './ESI'
import ProfessionalTax from './ProfessionalTax'
import Loan from './Loan'
import AdvanceSalary from './AdvanceSalary'
import Bonus from './Bonus'
import Payslip from './Payslip'
import PayrollReports from './PayrollReports'

export default function PayrollPage() {
  return (
    <div style={{ padding: 16 }}>
      <h2>Payroll</h2>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 16 }}>
        <div>
          <SalaryStructure />
          <Allowance />
          <Deduction />
          <PF />
          <ESI />
          <ProfessionalTax />
          <Loan />
          <AdvanceSalary />
          <Bonus />
          <Payslip />
        </div>
        <div>
          <PayrollReports />
        </div>
      </div>
    </div>
  )
}
