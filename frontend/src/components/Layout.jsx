import Sidebar from './Sidebar'

export default function Layout({ children }) {
  return (
    <div style={{ backgroundColor: '#040d1a' }} className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  )
}