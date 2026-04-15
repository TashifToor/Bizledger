import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'

export default function Clients() {
  const [clients, setClients] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', phone: '', company: '', address: '' })
  const [editing, setEditing] = useState(null)

  const fetchClients = () => {
    api.get('/clients/')
      .then(res => setClients(res.data.results || res.data))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchClients() }, [])

const handleSubmit = async (e) => {
  e.preventDefault()
  try {
    if (editing) {
      await api.put(`/clients/${editing}/`, form)
    } else {
      await api.post('/clients/', form)
    }
    setShowModal(false)
    setForm({ name: '', email: '', phone: '', company: '', address: '' })
    setEditing(null)
    fetchClients()
  } catch (error) {
    console.log("Error data:", error.response.data)
  }
  setShowModal(false)
  setForm({ name: '', email: '', phone: '', company: '', address: '' })
  setEditing(null)
  fetchClients()
}

  const handleEdit = (client) => {
    setForm(client)
    setEditing(client.id)
    setShowModal(true)
  }

  const handleDelete = async (id) => {
    if (confirm('Delete this client?')) {
      await api.delete(`/clients/${id}/`)
      fetchClients()
    }
  }

  const inputStyle = {
    backgroundColor: '#071224',
    border: '1px solid #0d2137',
    color: '#e2e8f0'
  }

  return (
    <Layout>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-white">Clients</h1>
        <button
          onClick={() => setShowModal(true)}
          style={{ backgroundColor: '#10b981' }}
          className="text-white px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90 transition"
        >
          + Add Client
        </button>
      </div>

      {/* Table */}
      <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
        className="rounded-2xl">
        <table className="w-full text-sm">
          <thead>
            <tr style={{ color: '#475569', borderBottom: '1px solid #0d2137' }}>
              <th className="text-left px-6 py-4">Name</th>
              <th className="text-left px-6 py-4">Email</th>
              <th className="text-left px-6 py-4">Phone</th>
              <th className="text-left px-6 py-4">Company</th>
              <th className="text-left px-6 py-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={5} style={{ color: '#10b981' }} className="text-center py-10">Loading...</td></tr>
            ) : clients.length === 0 ? (
              <tr><td colSpan={5} style={{ color: '#475569' }} className="text-center py-10">No clients yet</td></tr>
            ) : clients.map((client) => (
              <tr key={client.id}
                style={{ borderBottom: '1px solid #0d2137', color: '#94a3b8' }}
                className="hover:bg-white/5 transition">
                <td className="px-6 py-4 font-medium text-white">{client.name}</td>
                <td className="px-6 py-4">{client.email || '—'}</td>
                <td className="px-6 py-4">{client.phone || '—'}</td>
                <td className="px-6 py-4">{client.company || '—'}</td>
                <td className="px-6 py-4 flex gap-3">
                  <button onClick={() => handleEdit(client)}
                    style={{ color: '#10b981' }}
                    className="text-xs hover:opacity-80">Edit</button>
                  <button onClick={() => handleDelete(client.id)}
                    className="text-red-400 text-xs hover:opacity-80">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
            className="rounded-2xl p-8 w-full max-w-md">
            <h2 className="text-white font-bold text-xl mb-6">
              {editing ? 'Edit Client' : 'Add Client'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {['name', 'email', 'phone', 'company', 'address'].map((field) => (
                <div key={field}>
                  <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block capitalize">{field}</label>
                  <input
                    type="text"
                    style={inputStyle}
                    className="w-full px-4 py-3 rounded-xl focus:outline-none"
                    value={form[field]}
                    onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                    required={field === 'name'}
                  />
                </div>
              ))}
              <div className="flex gap-3 pt-2">
                <button type="submit"
                  style={{ backgroundColor: '#10b981' }}
                  className="flex-1 text-white py-3 rounded-xl font-medium hover:opacity-90 transition">
                  {editing ? 'Update' : 'Add'}
                </button>
                <button type="button"
                  onClick={() => { setShowModal(false); setEditing(null); setForm({ name: '', email: '', phone: '', company: '', address: '' }) }}
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