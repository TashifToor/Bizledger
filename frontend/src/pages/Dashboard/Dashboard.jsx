import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const StatCard = ({ title, value, icon, color }) => (
  <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
    className="rounded-2xl p-6">
    <div className="flex items-center justify-between mb-4">
      <p style={{ color: '#64748b' }} className="text-sm">{title}</p>
      <span className="text-2xl">{icon}</span>
    </div>
    <p style={{ color }} className="text-3xl font-bold">{value}</p>
  </div>
)

export default function Dashboard() {
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api.get('/dashboard/')
      .then(res => setData(res.data))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return (
    <Layout>
      <div style={{ color: '#10b981' }} className="text-center mt-20">Loading...</div>
    </Layout>
  )

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-white mb-8">Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        <StatCard title="Monthly Revenue" value={`PKR ${Number(data?.monthly_revenue || 0).toLocaleString()}`} icon="💰" color="#10b981" />
        <StatCard title="Monthly Expenses" value={`PKR ${Number(data?.monthly_expenses || 0).toLocaleString()}`} icon="💸" color="#ef4444" />
        <StatCard title="Net Profit" value={`PKR ${Number(data?.net_profit || 0).toLocaleString()}`} icon="📈" color="#6ee7b7" />
        <StatCard title="Total Clients" value={data?.total_clients || 0} icon="👥" color="#34d399" />
      </div>

      {/* Recent Invoices */}
      <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
        className="rounded-2xl p-6 mb-6">
        <h2 className="text-white font-semibold mb-4">Recent Invoices</h2>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: '#475569', borderBottom: '1px solid #0d2137' }}>
              <th className="text-left pb-3">Invoice #</th>
              <th className="text-left pb-3">Client</th>
              <th className="text-left pb-3">Amount</th>
              <th className="text-left pb-3">Status</th>
              <th className="text-left pb-3">Due Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.recent_invoices?.length === 0 ? (
              <tr><td colSpan={5} style={{ color: '#475569' }} className="text-center py-6">No invoices yet</td></tr>
            ) : data?.recent_invoices?.map((inv) => (
              <tr key={inv.id} style={{ borderBottom: '1px solid #0d2137', color: '#94a3b8' }}>
                <td className="py-3 text-white">{inv.Invoice_number || inv.invoice_number}</td>
                <td className="py-3">{inv.client__name || '—'}</td>
                <td className="py-3" style={{ color: '#10b981' }}>PKR {Number(inv.total || 0).toLocaleString()}</td>
                <td className="py-3">
                  <span style={{
                    backgroundColor: inv.status === 'paid' ? 'rgba(16,185,129,0.2)' :
                      inv.status === 'overdue' ? 'rgba(239,68,68,0.2)' :
                      inv.status === 'sent' ? 'rgba(59,130,246,0.2)' : 'rgba(100,116,139,0.2)',
                    color: inv.status === 'paid' ? '#10b981' :
                      inv.status === 'overdue' ? '#ef4444' :
                      inv.status === 'sent' ? '#60a5fa' : '#94a3b8',
                  }} className="px-2 py-1 rounded-full text-xs font-medium">
                    {inv.status}
                  </span>
                </td>
                <td className="py-3">{inv.due_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Recent Expenses */}
      <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
        className="rounded-2xl p-6">
        <h2 className="text-white font-semibold mb-4">Recent Expenses</h2>
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: '#475569', borderBottom: '1px solid #0d2137' }}>
              <th className="text-left pb-3">Title</th>
              <th className="text-left pb-3">Category</th>
              <th className="text-left pb-3">Amount</th>
              <th className="text-left pb-3">Date</th>
            </tr>
          </thead>
          <tbody>
            {data?.recent_expenses?.length === 0 ? (
              <tr><td colSpan={4} style={{ color: '#475569' }} className="text-center py-6">No expenses yet</td></tr>
            ) : data?.recent_expenses?.map((exp) => (
              <tr key={exp.id} style={{ borderBottom: '1px solid #0d2137', color: '#94a3b8' }}>
                <td className="py-3 text-white">{exp.title}</td>
                <td className="py-3">{exp.category__name || '—'}</td>
                <td className="py-3" style={{ color: '#ef4444' }}>PKR {Number(exp.amount || 0).toLocaleString()}</td>
                <td className="py-3">{exp.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Layout>
  )
}