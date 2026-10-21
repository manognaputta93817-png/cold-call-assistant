import { Outlet, NavLink, useNavigate } from 'react-router-dom'
import { Phone, History, Zap } from 'lucide-react'

const navItems = [
    { to: '/call/new', icon: Phone, label: 'Live Call' },
    { to: '/history', icon: History, label: 'Call History' },
]

export default function Layout() {
    return (
        <div className="flex h-screen bg-gray-50 overflow-hidden">
            {/* Sidebar */}
            <aside className="w-16 md:w-56 bg-white border-r border-gray-200 flex flex-col shrink-0">
                {/* Logo */}
                <div className="flex items-center gap-2.5 px-4 py-5 border-b border-gray-100">
                    <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shrink-0">
                        <Zap size={16} className="text-white" />
                    </div>
                    <span className="hidden md:block font-bold text-gray-900 text-lg tracking-tight">
                        CallPilot
                    </span>
                </div>

                {/* Nav */}
                <nav className="flex-1 px-2 py-4 space-y-1">
                    {navItems.map(({ to, icon: Icon, label }) => (
                        <NavLink
                            key={to}
                            to={to}
                            className={({ isActive }) =>
                                [
                                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150',
                                    isActive
                                        ? 'bg-brand-50 text-brand-700'
                                        : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900',
                                ].join(' ')
                            }
                        >
                            <Icon size={18} className="shrink-0" />
                            <span className="hidden md:block">{label}</span>
                        </NavLink>
                    ))}
                </nav>

                {/* Footer */}
                <div className="px-3 py-4 border-t border-gray-100">
                    <p className="hidden md:block text-xs text-gray-400 text-center">
                        CallPilot v1.0
                    </p>
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 overflow-auto">
                <Outlet />
            </main>
        </div>
    )
}
