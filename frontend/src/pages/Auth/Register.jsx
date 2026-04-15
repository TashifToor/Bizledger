import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'

export default function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '', username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      await api.post('/auth/register/', form)
      navigate('/login')
    } catch (err) {
      const data = err.response?.data
      if (data) {
        const msg = Object.entries(data).map(([k, v]) => `${k}: ${v}`).join(' | ')
        setError(msg)
      } else {
        setError('Registration failed. Try again.')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ backgroundColor: '#040d1a' }} className="min-h-screen flex items-center justify-center px-4">

      <div style={{ background: 'radial-gradient(circle, rgba(16,185,129,0.06) 0%, transparent 70%)' }}
        className="absolute w-[600px] h-[600px] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      <div style={{
        backgroundColor: '#060f20',
        border: '1px solid #0d2137',
        boxShadow: '0 0 40px rgba(16,185,129,0.06)'
      }} className="relative rounded-2xl p-10 w-full max-w-md">

        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mint-text mb-1">BizLedger</h1>
          <p style={{ color: '#475569' }} className="text-sm">Create your account</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            className="text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {[
            { label: 'Username', field: 'username', type: 'text' },
            { label: 'Email', field: 'email', type: 'email' },
            { label: 'Password', field: 'password', type: 'password' },
          ].map(({ label, field, type }) => (
            <div key={field}>
              <label style={{ color: '#94a3b8' }} className="text-sm mb-1.5 block">{label}</label>
              <input type={type}
                style={{ backgroundColor: '#071224', border: '1px solid #0d2137', color: '#e2e8f0' }}
                className="w-full px-4 py-3 rounded-xl focus:outline-none"
                value={form[field]}
                onChange={(e) => setForm({ ...form, [field]: e.target.value })} required />
            </div>
          ))}
          <button type="submit" disabled={loading}
            style={{ backgroundColor: '#10b981' }}
            className="w-full text-white py-3 rounded-xl font-semibold transition mt-2 hover:opacity-90">
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p style={{ color: '#475569' }} className="text-sm text-center mt-6">
          Already have an account?{' '}
          <span style={{ color: '#10b981' }} className="cursor-pointer hover:opacity-80"
            onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  )
}