import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

const statusColors = {
  draft:     { bg: 'rgba(100,116,139,0.2)', color: '#94a3b8' },
  sent:      { bg: 'rgba(59,130,246,0.2)',  color: '#60a5fa' },
  paid:      { bg: 'rgba(16,185,129,0.2)',  color: '#10b981' },
  overdue:   { bg: 'rgba(239,68,68,0.2)',   color: '#ef4444' },
  cancelled: { bg: 'rgba(234,179,8,0.2)',   color: '#eab308' },
}

const inputStyle = {
  backgroundColor: '#071224',
  border: '1px solid #0d2137',
  color: '#e2e8f0'
}

export default function Invoices() {
  const [invoices, setInvoices] = useState([])
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({
    client: '',
    issue_date: '',
    due_date: '',
    tax_percent: 0,
    discount: 0,
    notes: '',
    items: [{ description: '', quantity: 1, unit_price: 0 }]
  })

  const fetchInvoices = () => {
    api.get('/invoices/')
      .then(res => setInvoices(res.data.results || res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchInvoices()
    api.get('/clients/').then(res => setClients(res.data.results || res.data))
  }, [])

  const addItem = () => setForm({ ...form, items: [...form.items, { description: '', quantity: 1, unit_price: 0 }] })
  const removeItem = (i) => setForm({ ...form, items: form.items.filter((_, idx) => idx !== i) })
  const updateItem = (i, field, value) => {
    const updated = [...form.items]
    updated[i][field] = value
    setForm({ ...form, items: updated })
  }

  const resetForm = () => {
    setForm({ client: '', issue_date: '', due_date: '', tax_percent: 0, discount: 0, notes: '', items: [{ description: '', quantity: 1, unit_price: 0 }] })
    setShowModal(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    await api.post('/invoices/', form)
    resetForm()
    fetchInvoices()
  }

  const handleStatusChange = async (id, status) => {
    await api.patch(`/invoices/${id}/`, { status })
    fetchInvoices()
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this invoice?')) {
      await api.delete(`/invoices/${id}/`)
      fetchInvoices()
    }
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Invoices</h1>
        <button onClick={() => setShowModal(true)}
          style={{ backgroundColor: '#10b981' }}
          className="text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition">
          + New Invoice
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }} className="rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: '#475569', borderBottom: '1px solid #0d2137' }}>
              <th className="text-left px-6 py-4">Invoice #</th>
              <th className="text-left px-6 py-4">Client</th>
              <th className="text-left px-6 py-4">Total</th>
              <th className="text-left px-6 py-4">Status</th>
              <th className="text-left px-6 py-4">Due Date</th>
              <th className="text-left px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={6} style={{ color: '#10b981' }} className="text-center py-10">Loading...</td></tr>
            ) : invoices.length === 0 ? (
              <tr><td colSpan={6} style={{ color: '#475569' }} className="text-center py-10">No invoices yet</td></tr>
            ) : invoices.map((inv) => (
              <tr key={inv.id}
                style={{ borderBottom: '1px solid #0d2137', color: '#94a3b8' }}
                className="hover:bg-white/5 transition">
                <td className="px-6 py-4 text-white font-medium">
                  {inv.Invoice_number || inv.invoice_number}
                </td>
                <td className="px-6 py-4">{inv.client_name || inv.client__name || '—'}</td>
                <td className="px-6 py-4" style={{ color: '#10b981' }}>
                  PKR {Number(inv.total || 0).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                  <select
                    value={inv.status}
                    onChange={(e) => handleStatusChange(inv.id, e.target.value)}
                    style={{
                      backgroundColor: statusColors[inv.status]?.bg,
                      color: statusColors[inv.status]?.color,
                      border: 'none',
                      borderRadius: '999px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      cursor: 'pointer',
                    }}
                  >
                    {['draft', 'sent', 'paid', 'overdue', 'cancelled'].map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td className="px-6 py-4">{inv.due_date}</td>
                <td className="px-6 py-4">
                  <button onClick={() => handleDelete(inv.id)}
                    className="text-red-400 text-xs hover:opacity-80">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 overflow-y-auto py-10">
          <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
            className="rounded-2xl p-8 w-full max-w-2xl">
            <h2 className="text-white font-bold text-xl mb-6">New Invoice</h2>
            <form onSubmit={handleSubmit} className="space-y-4">

              {/* Client */}
              <div>
                <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Client</label>
                <select style={inputStyle} className="w-full px-4 py-3 rounded-xl focus:outline-none"
                  value={form.client} onChange={(e) => setForm({ ...form, client: e.target.value })} required>
                  <option value="">Select client</option>
                  {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>

              {/* Dates */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Issue Date</label>
                  <input type="date" style={inputStyle}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none"
                    value={form.issue_date}
                    onChange={(e) => setForm({ ...form, issue_date: e.target.value })} required />
                </div>
                <div>
                  <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Due Date</label>
                  <input type="date" style={inputStyle}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none"
                    value={form.due_date}
                    onChange={(e) => setForm({ ...form, due_date: e.target.value })} required />
                </div>
              </div>

              {/* Items */}
              <div>
                <label style={{ color: '#94a3b8' }} className="text-sm mb-2 block">Items</label>
                {form.items.map((item, i) => (
                  <div key={i} className="grid grid-cols-12 gap-2 mb-2">
                    <input placeholder="Description"
                      style={inputStyle}
                      className="col-span-6 px-3 py-2 rounded-xl text-sm focus:outline-none"
                      value={item.description}
                      onChange={(e) => updateItem(i, 'description', e.target.value)} required />
                    <input type="number" placeholder="Qty"
                      style={inputStyle}
                      className="col-span-2 px-3 py-2 rounded-xl text-sm focus:outline-none"
                      value={item.quantity}
                      onChange={(e) => updateItem(i, 'quantity', e.target.value)} required />
                    <input type="number" placeholder="Price"
                      style={inputStyle}
                      className="col-span-3 px-3 py-2 rounded-xl text-sm focus:outline-none"
                      value={item.unit_price}
                      onChange={(e) => updateItem(i, 'unit_price', e.target.value)} required />
                    <button type="button" onClick={() => removeItem(i)}
                      className="col-span-1 text-red-400 text-lg hover:opacity-80">×</button>
                  </div>
                ))}
                <button type="button" onClick={addItem}
                  style={{ color: '#10b981' }} className="text-sm mt-1 hover:opacity-80">
                  + Add Item
                </button>
              </div>

              {/* Tax & Discount */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Tax %</label>
                  <input type="number" style={inputStyle}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none"
                    value={form.tax_percent}
                    onChange={(e) => setForm({ ...form, tax_percent: e.target.value })} />
                </div>
                <div>
                  <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Discount</label>
                  <input type="number" style={inputStyle}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none"
                    value={form.discount}
                    onChange={(e) => setForm({ ...form, discount: e.target.value })} />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Notes</label>
                <textarea style={inputStyle}
                  className="w-full px-4 py-3 rounded-xl focus:outline-none" rows={2}
                  value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })} />
              </div>

              {/* Buttons */}
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  style={{ backgroundColor: '#10b981' }}
                  className="flex-1 text-white py-3 rounded-xl font-medium hover:opacity-90 transition">
                  Create Invoice
                </button>
                <button type="button" onClick={resetForm}
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