import { NavLink, useNavigate } from 'react-router-dom'
import useAuthStore from '../store/authStore'

const links = [
  { to: '/dashboard', label: 'Dashboard', icon: '📊' },
  { to: '/clients', label: 'Clients', icon: '👥' },
  { to: '/invoices', label: 'Invoices', icon: '🧾' },
  { to: '/expenses', label: 'Expenses', icon: '💸' },
  { to: '/reports', label: 'Reports', icon: '📈' },
  { to: '/settings', label: 'Settings', icon: '⚙️' },
]

export default function Sidebar() {
  const { logout, user } = useAuthStore()
  const navigate = useNavigate()

  return (
    <div style={{ backgroundColor: '#060f20', borderRight: '1px solid #0d2137' }}
      className="w-64 min-h-screen flex flex-col p-6">

      {/* Logo */}
      <div className="mb-10">
        <h1 className="text-2xl font-bold mint-text">BizLedger</h1>
        <p style={{ color: '#475569' }} className="text-xs mt-1">{user?.email}</p>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 flex-1">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => isActive ? 'active-link' : 'inactive-link'}
            style={({ isActive }) => ({
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '10px 14px',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              textDecoration: 'none',
              transition: 'all 0.2s',
              backgroundColor: isActive ? 'rgba(16,185,129,0.15)' : 'transparent',
              color: isActive ? '#10b981' : '#94a3b8',
              border: isActive ? '1px solid rgba(16,185,129,0.3)' : '1px solid transparent',
            })}
          >
            <span>{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>

      {/* User + Logout */}
      <div style={{ borderTop: '1px solid #0d2137' }} className="pt-4">
        <div className="flex items-center gap-3 mb-3 px-2">
          <div style={{ backgroundColor: 'rgba(16,185,129,0.2)', color: '#10b981' }}
            className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold">
            {user?.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <p className="text-white text-xs font-medium">{user?.username}</p>
            <p style={{ color: '#475569' }} className="text-xs capitalize">{user?.role}</p>
          </div>
        </div>
        <button
          onClick={() => { logout(); navigate('/login') }}
          style={{ color: '#64748b' }}
          className="w-full text-sm px-4 py-2.5 rounded-xl text-left transition hover:opacity-80"
          onMouseEnter={e => e.target.style.color = '#ef4444'}
          onMouseLeave={e => e.target.style.color = '#64748b'}
        >
          🚪 Logout
        </button>
      </div>
    </div>
  )
}