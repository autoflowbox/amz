import { NavLink, Outlet } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export function AppShell() {
  const { session, signOut } = useAuth()

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    `px-4 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive ? 'bg-blue-600 text-white' : 'text-white/60 hover:text-white hover:bg-white/5'
    }`

  return (
    <div className="min-h-screen bg-neutral-950 flex flex-col">
      <header className="border-b border-white/10 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <h1 className="text-white font-semibold text-sm whitespace-nowrap">
            Amazon Order Management
          </h1>
          <nav className="flex gap-1">
            <NavLink to="/" end className={tabClass}>
              Đơn hàng
            </NavLink>
            <NavLink to="/dashboard" className={tabClass}>
              Dashboard
            </NavLink>
          </nav>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-white/40">{session?.user.email}</span>
          <button
            onClick={() => signOut()}
            className="text-xs text-white/60 hover:text-white border border-white/15 rounded-md px-3 py-1.5 hover:bg-white/5 transition-colors"
          >
            Đăng xuất
          </button>
        </div>
      </header>
      <main className="flex-1 min-h-0">
        <Outlet />
      </main>
    </div>
  )
}
