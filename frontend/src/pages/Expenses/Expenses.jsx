import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const inputStyle = {
  backgroundColor: '#071224',
  border: '1px solid #0d2137',
  color: '#e2e8f0'
}

const paymentColors = {
  cash:      { bg: 'rgba(16,185,129,0.2)',  color: '#10b981' },
  bank:      { bg: 'rgba(59,130,246,0.2)',  color: '#60a5fa' },
  card:      { bg: 'rgba(168,85,247,0.2)',  color: '#a855f7' },
  jazzcash:  { bg: 'rgba(239,68,68,0.2)',   color: '#ef4444' },
  easypaisa: { bg: 'rgba(34,197,94,0.2)',   color: '#22c55e' },
}

export default function Expenses() {
  const [expenses, setExpenses] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [showCatModal, setShowCatModal] = useState(false)
  const [catForm, setCatForm] = useState({ name: '' })
  const [form, setForm] = useState({
    title: '', amount: '', date: '',
    category: '', payment_method: 'cash', notes: ''
  })

  const fetchExpenses = () => {
    api.get('/expenses/')
      .then(res => setExpenses(res.data.results || res.data))
      .finally(() => setLoading(false))
  }

  const fetchCategories = () => {
    api.get('/expenses/categories/')
      .then(res => setCategories(res.data.results || res.data))
  }

  useEffect(() => {
    fetchExpenses()
    fetchCategories()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/expenses/', form)
    setShowModal(false)
    setForm({ title: '', amount: '', date: '', category: '', payment_method: 'cash', notes: '' })
    fetchExpenses()
  }

  const handleCatSubmit = async (e) => {
    e.preventDefault()
    await api.post('/expenses/categories/', catForm)
    setShowCatModal(false)
    setCatForm({ name: '' })
    fetchCategories()
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this expense?')) {
      await api.delete(`/expenses/${id}/`)
      fetchExpenses()
    }
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Expenses</h1>
        <div className="flex gap-3">
          <button onClick={() => setShowCatModal(true)}
            style={{ backgroundColor: '#071224', border: '1px solid #0d2137', color: '#94a3b8' }}
            className="px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-80 transition">
            + Category
          </button>
          <button onClick={() => setShowModal(true)}
            style={{ backgroundColor: '#10b981' }}
            className="text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition">
            + Add Expense
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }} className="rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: '#475569', borderBottom: '1px solid #0d2137' }}>
              <th className="text-left px-6 py-4">Title</th>
              <th className="text-left px-6 py-4">Category</th>
              <th className="text-left px-6 py-4">Amount</th>
              <th className="text-left px-6 py-4">Payment</th>
              <th className="text-left px-6 py-4">Date</th>
              <th className="text-left px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ color: '#10b981' }} className="text-center py-10">Loading...</td></tr>
            ) : expenses.length === 0 ? (
              <tr><td colSpan={6} style={{ color: '#475569' }} className="text-center py-10">No expenses yet</td></tr>
            ) : expenses.map((exp) => (
              <tr key={exp.id}
                style={{ borderBottom: '1px solid #0d2137', color: '#94a3b8' }}
                className="hover:bg-white/5 transition">
                <td className="px-6 py-4 text-white font-medium">{exp.title}</td>
                <td className="px-6 py-4">{exp.category_name || '—'}</td>
                <td className="px-6 py-4" style={{ color: '#ef4444' }}>
                  PKR {Number(exp.amount || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <span style={{
                    backgroundColor: paymentColors[exp.payment_method]?.bg,
                    color: paymentColors[exp.payment_method]?.color,
                    padding: '2px 10px',
                    borderRadius: '999px',
                    fontSize: '11px',
                    fontWeight: '500',
                  }}>
                    {exp.payment_method}
                  </span>
                </td>
                <td className="px-6 py-4">{exp.date}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(exp.id)}
                    className="text-red-400 text-xs hover:opacity-80">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Expense Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
            className="rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-white font-bold text-xl mb-6">Add Expense</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Title</label>
                <input style={inputStyle} className="w-full px-4 py-3 rounded-xl focus:outline-none"
                  value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Amount</label>
                  <input type="number" style={inputStyle}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
                </div>
                <div>
                  <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Date</label>
                  <input type="date" style={inputStyle}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none"
                    value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })} required />
                </div>
              </div>
              <div>
                <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Category</label>
                <select style={inputStyle} className="w-full px-4 py-3 rounded-xl focus:outline-none"
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  <option value="">Select category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Payment Method</label>
                <select style={inputStyle} className="w-full px-4 py-3 rounded-xl focus:outline-none"
                  value={form.payment_method}
                  onChange={(e) => setForm({ ...form, payment_method: e.target.value })}>
                  <option value="cash">Cash</option>
                  <option value="bank">Bank Transfer</option>
                  <option value="card">Card</option>
                  <option value="jazzcash">JazzCash</option>
                  <option value="easypaisa">EasyPaisa</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Notes</label>
                <textarea style={inputStyle} className="w-full px-4 py-3 rounded-xl focus:outline-none"
                  rows={2} value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" style={{ backgroundColor: '#10b981' }}
                  className="flex-1 text-white py-3 rounded-xl font-medium hover:opacity-90 transition">
                  Add Expense
                </button>
                <button type="button" onClick={() => setShowModal(false)}
                  style={{ backgroundColor: '#071224', color: '#94a3b8' }}
                  className="flex-1 py-3 rounded-xl font-medium hover:opacity-80 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add Category Modal */}
      {showCatModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
            className="rounded-2xl p-8 w-full max-w-sm">
            <h2 className="text-white font-bold text-xl mb-6">Add Category</h2>
            <form onSubmit={handleCatSubmit} className="space-y-4">
              <div>
                <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Category Name</label>
                <input style={inputStyle} className="w-full px-4 py-3 rounded-xl focus:outline-none"
                  value={catForm.name}
                  onChange={(e) => setCatForm({ name: e.target.value })}
                  placeholder="e.g. Rent, Salaries, Utilities" required />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="submit" style={{ backgroundColor: '#10b981' }}
                  className="flex-1 text-white py-3 rounded-xl font-medium hover:opacity-90 transition">
                  Add
                </button>
                <button type="button" onClick={() => setShowCatModal(false)}
                  style={{ backgroundColor: '#071224', color: '#94a3b8' }}
                  className="flex-1 py-3 rounded-xl font-medium hover:opacity-80 transition">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </Layout>
  )
}