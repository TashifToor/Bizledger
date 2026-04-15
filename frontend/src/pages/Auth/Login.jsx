import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'

export default function Login() {
  const navigate = useNavigate()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await api.post('/auth/login/', form)
      const me = await api.get('/auth/me/', {
        headers: { Authorization: `Bearer ${res.data.access}` }
      })
      login(res.data, me.data)
      navigate('/dashboard')
    } catch (err) {
      setError('Invalid email or password')
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
          <p style={{ color: '#475569' }} className="text-sm">Sign in to your account</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)' }}
            className="text-red-400 px-4 py-3 rounded-xl mb-6 text-sm">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label style={{ color: '#94a3b8' }} className="text-sm mb-1.5 block">Email</label>
            <input type="email"
              style={{ backgroundColor: '#071224', border: '1px solid #0d2137', color: '#e2e8f0' }}
              className="w-full px-4 py-3 rounded-xl focus:outline-none"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} required />
          </div>
          <div>
            <label style={{ color: '#94a3b8' }} className="text-sm mb-1.5 block">Password</label>
            <input type="password"
              style={{ backgroundColor: '#071224', border: '1px solid #0d2137', color: '#e2e8f0' }}
              className="w-full px-4 py-3 rounded-xl focus:outline-none"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} required />
          </div>
          <button type="submit" disabled={loading}
            style={{ backgroundColor: '#10b981' }}
            className="w-full text-white py-3 rounded-xl font-semibold transition mt-2 hover:opacity-90">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>

        <p style={{ color: '#475569' }} className="text-sm text-center mt-6">
          Don't have an account?{' '}
          <span style={{ color: '#10b981' }} className="cursor-pointer hover:opacity-80"
            onClick={() => navigate('/register')}>Register</span>
        </p>
      </div>
    </div>
  )
}