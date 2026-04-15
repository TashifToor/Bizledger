import { useEffect, useState } from 'react'
import Layout from '../../components/Layout'
import api from '../../api/axios'
import useAuthStore from '../../store/authStore'

const inputStyle = {
  backgroundColor: '#071224',
  border: '1px solid #0d2137',
  color: '#e2e8f0'
}

export default function Settings() {
  const { user, setUser } = useAuthStore()
  const [tenantForm, setTenantForm] = useState({
    name: '', email: '', phone: '', address: '', currency: 'PKR', tax_number: ''
  })
  const [profileForm, setProfileForm] = useState({
    username: '', email: ''
  })
  const [tenantLoading, setTenantLoading] = useState(false)
  const [profileLoading, setProfileLoading] = useState(false)
  const [tenantMsg, setTenantMsg] = useState('')
  const [profileMsg, setProfileMsg] = useState('')

  useEffect(() => {
    // Load tenant data
    api.get('/tenants/me/').then(res => {
      setTenantForm({
        name: res.data.name || '',
        email: res.data.email || '',
        phone: res.data.phone || '',
        address: res.data.address || '',
        currency: res.data.currency || 'PKR',
        tax_number: res.data.tax_number || '',
      })
    })

    // Load profile data
    api.get('/auth/me/').then(res => {
      setProfileForm({
        username: res.data.username || '',
        email: res.data.email || '',
      })
    })
  }, [])

  const handleTenantSubmit = async (e) => {
    e.preventDefault()
    setTenantLoading(true)
    setTenantMsg('')
    try {
      await api.patch('/tenants/me/', tenantForm)
      setTenantMsg('✅ Business info updated!')
    } catch {
      setTenantMsg('❌ Update failed. Try again.')
    } finally {
      setTenantLoading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setProfileLoading(true)
    setProfileMsg('')
    try {
      const res = await api.patch('/auth/me/', profileForm)
      setUser(res.data)
      setProfileMsg('✅ Profile updated!')
    } catch {
      setProfileMsg('❌ Update failed. Try again.')
    } finally {
      setProfileLoading(false)
    }
  }

  return (
    <Layout>
      <h1 className="text-2xl font-bold text-white mb-8">Settings</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Business / Tenant Settings */}
        <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
          className="rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-1">Business Info</h2>
          <p style={{ color: '#475569' }} className="text-sm mb-6">
            Update your business details
          </p>

          {tenantMsg && (
            <div style={{
              backgroundColor: tenantMsg.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${tenantMsg.includes('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: tenantMsg.includes('✅') ? '#10b981' : '#ef4444',
              borderRadius: '12px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px'
            }}>
              {tenantMsg}
            </div>
          )}

          <form onSubmit={handleTenantSubmit} className="space-y-4">
            {[
              { label: 'Business Name', field: 'name', type: 'text' },
              { label: 'Business Email', field: 'email', type: 'email' },
              { label: 'Phone', field: 'phone', type: 'text' },
              { label: 'Address', field: 'address', type: 'text' },
              { label: 'Tax Number (NTN/GST)', field: 'tax_number', type: 'text' },
            ].map(({ label, field, type }) => (
              <div key={field}>
                <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">{label}</label>
                <input type={type} style={inputStyle}
                  className="w-full px-4 py-3 rounded-xl focus:outline-none"
                  value={tenantForm[field]}
                  onChange={(e) => setTenantForm({ ...tenantForm, [field]: e.target.value })} />
              </div>
            ))}

            {/* Currency */}
            <div>
              <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Currency</label>
              <select style={inputStyle}
                className="w-full px-4 py-3 rounded-xl focus:outline-none"
                value={tenantForm.currency}
                onChange={(e) => setTenantForm({ ...tenantForm, currency: e.target.value })}>
                <option value="PKR">PKR — Pakistani Rupee</option>
                <option value="USD">USD — US Dollar</option>
                <option value="EUR">EUR — Euro</option>
                <option value="GBP">GBP — British Pound</option>
                <option value="AED">AED — UAE Dirham</option>
                <option value="SAR">SAR — Saudi Riyal</option>
              </select>
            </div>

            <button type="submit" disabled={tenantLoading}
              style={{ backgroundColor: '#10b981' }}
              className="w-full text-white py-3 rounded-xl font-medium hover:opacity-90 transition mt-2">
              {tenantLoading ? 'Saving...' : 'Save Business Info'}
            </button>
          </form>
        </div>

        {/* Profile Settings */}
        <div style={{ backgroundColor: '#060f20', border: '1px solid #0d2137' }}
          className="rounded-2xl p-6">
          <h2 className="text-white font-semibold text-lg mb-1">Profile</h2>
          <p style={{ color: '#475569' }} className="text-sm mb-6">
            Update your account details
          </p>

          {/* Avatar */}
          <div className="flex items-center gap-4 mb-6">
            <div style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#10b981' }}
              className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold">
              {user?.username?.[0]?.toUpperCase() || 'U'}
            </div>
            <div>
              <p className="text-white font-medium">{user?.username}</p>
              <p style={{ color: '#10b981' }} className="text-sm capitalize">{user?.role}</p>
            </div>
          </div>

          {profileMsg && (
            <div style={{
              backgroundColor: profileMsg.includes('✅') ? 'rgba(16,185,129,0.1)' : 'rgba(239,68,68,0.1)',
              border: `1px solid ${profileMsg.includes('✅') ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
              color: profileMsg.includes('✅') ? '#10b981' : '#ef4444',
              borderRadius: '12px', padding: '10px 14px', marginBottom: '16px', fontSize: '13px'
            }}>
              {profileMsg}
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div>
              <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Username</label>
              <input type="text" style={inputStyle}
                className="w-full px-4 py-3 rounded-xl focus:outline-none"
                value={profileForm.username}
                onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })} />
            </div>
            <div>
              <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Email</label>
              <input type="email" style={inputStyle}
                className="w-full px-4 py-3 rounded-xl focus:outline-none"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })} />
            </div>

            {/* Role — read only */}
            <div>
              <label style={{ color: '#94a3b8' }} className="text-sm mb-1 block">Role</label>
              <div style={{ backgroundColor: '#071224', border: '1px solid #0d2137', color: '#475569' }}
                className="w-full px-4 py-3 rounded-xl text-sm capitalize">
                {user?.role || '—'}
              </div>
            </div>

            <button type="submit" disabled={profileLoading}
              style={{ backgroundColor: '#10b981' }}
              className="w-full text-white py-3 rounded-xl font-medium hover:opacity-90 transition mt-2">
              {profileLoading ? 'Saving...' : 'Save Profile'}
            </button>
          </form>

          {/* Danger Zone */}
          <div style={{ borderTop: '1px solid #0d2137' }} className="mt-8 pt-6">
            <h3 className="text-white font-medium mb-2">Danger Zone</h3>
            <p style={{ color: '#475569' }} className="text-xs mb-4">
              Once you logout all sessions will be cleared.
            </p>
            <button
              onClick={() => { localStorage.clear(); window.location.href = '/login' }}
              style={{ backgroundColor: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444' }}
              className="w-full py-3 rounded-xl text-sm font-medium hover:opacity-80 transition">
              🚪 Logout All Sessions
            </button>
          </div>
        </div>
      </div>
    </Layout>
  )
}