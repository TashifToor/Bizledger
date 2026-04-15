import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const StatCard = ({ title, value, color, icon }) => (
  <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
    className="rounded-2xl p-6">
    <div className="flex items-center justify-between mb-3">
      <p style={{ color: '#64748b' }} className="text-sm">{title}</p>
      <span className="text-xl">{icon}</span>
    </div>
    <p style={{ color }} className="text-2xl font-bold">{value}</p>
  </div>
)

export default function Reports() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth() + 1)
  const [year, setYear] = useState(now.getFullYear())
  const [financial, setFinancial] = useState(null)
  const [invoiceStatus, setInvoiceStatus] = useState([])
  const [expenseByCategory, setExpenseByCategory] = useState([])
  const [loading, setLoading] = useState(true)

  const fetchReports = () => {
    setLoading(true)
    Promise.all([
      api.get(`/reports/financial/?month=${month}&year=${year}`),
      api.get('/reports/invoice-status/'),
      api.get(`/reports/expenses-by-category/?month=${month}&year=${year}`),
    ]).then(([fin, inv, exp]) => {
      setFinancial(fin.data)
      setInvoiceStatus(inv.data)
      setExpenseByCategory(exp.data)
    }).finally(() => setLoading(false))
  }

  useEffect(() => { fetchReports() }, [month, year])

  const months = [
    'January','February','March','April','May','June',
    'July','August','September','October','November','December'
  ]

  const inputStyle = {
    backgroundColor: '#071224',
    border: '1px solid #0d2137',
    color: '#e2e8f0',
    borderRadius: '12px',
    padding: '8px 14px',
    fontSize: '13px',
  }

  return (
    <Layout>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Reports</h1>

        {/* Month/Year Filter */}
        <div className="flex gap-3">
          <select style={inputStyle} value={month}
            onChange={(e) => setMonth(Number(e.target.value))}>
            {months.map((m, i) => (
              <option key={i} value={i + 1}>{m}</option>
            ))}
          </select>
          <select style={inputStyle} value={year}
            onChange={(e) => setYear(Number(e.target.value))}>
            {[2024, 2025, 2026, 2027].map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <div style={{ color: '#10b981' }} className="text-center mt-20">Loading...</div>
      ) : (
        <>
          {/* Financial Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <StatCard
              title="Total Revenue"
              value={`PKR ${Number(financial?.total_revenue || 0).toLocaleString()}`}
              color="#10b981" icon="💰" />
            <StatCard
              title="Total Expenses"
              value={`PKR ${Number(financial?.total_expenses || 0).toLocaleString()}`}
              color="#ef4444" icon="💸" />
            <StatCard
              title="Net Profit"
              value={`PKR ${Number(financial?.profit || 0).toLocaleString()}`}
              color={financial?.profit >= 0 ? '#6ee7b7' : '#ef4444'} icon="📈" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* Invoice Status */}
            <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
              className="rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-5">Invoice Status</h2>
              {invoiceStatus.length === 0 ? (
                <p style={{ color: '#475569' }} className="text-sm text-center py-6">No data</p>
              ) : invoiceStatus.map((item) => (
                <div key={item.status} className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div style={{
                      width: '10px', height: '10px', borderRadius: '50%',
                      backgroundColor:
                        item.status === 'paid' ? '#10b981' :
                        item.status === 'overdue' ? '#ef4444' :
                        item.status === 'sent' ? '#60a5fa' :
                        item.status === 'cancelled' ? '#eab308' : '#94a3b8'
                    }} />
                    <span style={{ color: '#94a3b8' }} className="text-sm capitalize">
                      {item.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-4">
                    <span style={{ color: '#64748b' }} className="text-xs">
                      {item.count} invoices
                    </span>
                    <span style={{ color: '#10b981' }} className="text-sm font-medium">
                      PKR {Number(item.total || 0).toLocaleString()}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Expenses By Category */}
            <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
              className="rounded-2xl p-6">
              <h2 className="text-white font-semibold mb-5">Expenses by Category</h2>
              {expenseByCategory.length === 0 ? (
                <p style={{ color: '#475569' }} className="text-sm text-center py-6">No data</p>
              ) : expenseByCategory.map((item, i) => {
                const maxTotal = Math.max(...expenseByCategory.map(e => e.total))
                const percent = Math.round((item.total / maxTotal) * 100)
                return (
                  <div key={i} className="mb-4">
                    <div className="flex justify-between mb-1">
                      <span style={{ color: '#94a3b8' }} className="text-sm">
                        {item.category__name || 'Uncategorized'}
                      </span>
                      <span style={{ color: '#ef4444' }} className="text-sm font-medium">
                        PKR {Number(item.total || 0).toLocaleString()}
                      </span>
                    </div>
                    {/* Progress Bar */}
                    <div style={{ backgroundColor: '#0d2137', borderRadius: '999px', height: '6px' }}>
                      <div style={{
                        width: `${percent}%`,
                        backgroundColor: '#10b981',
                        height: '6px',
                        borderRadius: '999px',
                        transition: 'width 0.5s ease'
                      }} />
                    </div>
                  </div>
                )
              })}
            </div>

          </div>

          {/* Summary */}
          <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
            className="rounded-2xl p-6 mt-6">
            <h2 className="text-white font-semibold mb-4">Monthly Summary</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Paid Invoices', value: financial?.invoice_count || 0, color: '#10b981' },
                { label: 'Total Expenses', value: financial?.expense_count || 0, color: '#ef4444' },
                { label: 'Month', value: months[month - 1], color: '#6ee7b7' },
                { label: 'Year', value: year, color: '#34d399' },
              ].map((item) => (
                <div key={item.label}
                  style={{ backgroundColor: '#071224', borderRadius: '12px', padding: '16px' }}>
                  <p style={{ color: '#475569' }} className="text-xs mb-1">{item.label}</p>
                  <p style={{ color: item.color }} className="text-xl font-bold">{item.value}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </Layout>
  )
}