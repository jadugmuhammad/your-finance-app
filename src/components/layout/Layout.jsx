import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
    LayoutDashboard, Activity, Target, Calendar,
    Archive, PiggyBank, BarChart3, Menu, X
} from 'lucide-react'
import useFinanceStore from '../../store/useFinanceStore'
import { formatCurrency, cn } from '../../lib/utils'

const NAV = [
    { to: '/', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/aktivitas', icon: Activity, label: 'Aktivitas' },
    { to: '/anggaran', icon: Target, label: 'Anggaran' },
    { to: '/plans', icon: Calendar, label: 'Plans' },
    { to: '/archives', icon: Archive, label: 'Archives' },
    { to: '/reserve', icon: PiggyBank, label: 'Reserve' },
    { to: '/laporan', icon: BarChart3, label: 'Laporan' },
]

function SidebarContent({ onClose }) {
    const location = useLocation()
    const { saldoUtama, reserve } = useFinanceStore()

    return (
        <div className="flex flex-col h-full">

            {/* Logo */}
            <div className="px-5 pt-6 pb-5 border-b border-white/6">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-lg bg-amber-400 flex items-center justify-center">
                            <span className="text-sm font-black text-gray-950">₴</span>
                        </div>
                        <span className="font-black text-base text-white tracking-tight">
                            YourFinance
                        </span>
                    </div>
                    {onClose && (
                        <button
                            onClick={onClose}
                            className="p-1.5 rounded-lg hover:bg-white/8 text-white/40"
                        >
                            <X size={16} />
                        </button>
                    )}
                </div>
            </div>

            {/* Saldo Global */}
            <div className="px-4 py-4 border-b border-white/6 space-y-2">
                <div className="rounded-xl bg-white/5 border border-white/8 p-3">
                    <p className="text-xs text-white/35 font-semibold uppercase tracking-wider mb-1">
                        Saldo Utama
                    </p>
                    <p className={cn(
                        'font-medium text-lg',
                        saldoUtama < 0 ? 'text-rose-400' : 'text-amber-300'
                    )}>
                        {formatCurrency(saldoUtama)}
                    </p>
                </div>
                <div className="rounded-xl bg-white/5 border border-white/8 p-3">
                    <p className="text-xs text-white/35 font-semibold uppercase tracking-wider mb-1">
                        Reserve
                    </p>
                    <p className="font-medium text-lg text-emerald-400">
                        {formatCurrency(reserve)}
                    </p>
                </div>
            </div>

            {/* Navigasi */}
            <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
                {NAV.map(({ to, icon: Icon, label }) => {
                    const isActive = to === '/'
                        ? location.pathname === '/'
                        : location.pathname.startsWith(to)
                    return (
                        <NavLink
                            key={to}
                            to={to}
                            onClick={onClose}
                            className={cn(
                                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200 group',
                                isActive
                                    ? 'bg-amber-400/12 text-amber-300 border border-amber-400/20'
                                    : 'text-white/45 hover:text-white/80 hover:bg-white/5'
                            )}
                        >
                            <Icon
                                size={16}
                                className={cn(
                                    isActive
                                        ? 'text-amber-400'
                                        : 'text-white/35 group-hover:text-white/60'
                                )}
                            />
                            {label}
                        </NavLink>
                    )
                })}
            </nav>

            {/* Footer */}
            <div className="px-4 pb-5 pt-4 border-t border-white/6">
                <p className="text-xs text-white/20 text-center">
                    Data tersimpan lokal di browser
                </p>
            </div>

        </div>
    )
}

export default function Layout({ children }) {
    const [mobileOpen, setMobileOpen] = useState(false)

    return (
        <div className="flex h-screen overflow-hidden bg-gray-950 text-white">

            {/* Sidebar Desktop */}
            <aside className="hidden lg:flex flex-col w-60 border-r border-white/6 bg-gray-900 flex-shrink-0">
                <SidebarContent />
            </aside>

            {/* Sidebar Mobile */}
            <AnimatePresence>
                {mobileOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                            onClick={() => setMobileOpen(false)}
                        />
                        <motion.aside
                            initial={{ x: -280 }}
                            animate={{ x: 0 }}
                            exit={{ x: -280 }}
                            transition={{ type: 'spring', damping: 26, stiffness: 300 }}
                            className="fixed left-0 top-0 bottom-0 w-72 bg-gray-900 border-r border-white/6 z-50 lg:hidden"
                        >
                            <SidebarContent onClose={() => setMobileOpen(false)} />
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-hidden">

                {/* Mobile Header */}
                <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/6 bg-gray-900">
                    <button
                        onClick={() => setMobileOpen(true)}
                        className="p-2 rounded-lg hover:bg-white/8 text-white/60"
                    >
                        <Menu size={18} />
                    </button>
                    <span className="font-black text-base text-white">YourFinance</span>
                </div>

                {/* Page Content */}
                <div className="flex-1 overflow-y-auto">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={location.pathname}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -6 }}
                            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                            className="min-h-full"
                        >
                            {children}
                        </motion.div>
                    </AnimatePresence>
                </div>

            </main>
        </div>
    )
}