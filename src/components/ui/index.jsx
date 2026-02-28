import { motion, AnimatePresence } from 'framer-motion'
import { X, AlertTriangle, CheckCircle, Info } from 'lucide-react'
import { cn } from '../../lib/utils'

// ─── Card ─────────────────────────────────────────────────────────────────────
export const Card = ({ children, className = '', onClick }) => (
    <div
        onClick={onClick}
        className={cn(
            'rounded-2xl border border-white/10 bg-white/5 relative overflow-hidden transition-all duration-300',
            onClick && 'cursor-pointer hover:border-white/20 hover:bg-white/8',
            className
        )}
    >
        {children}
    </div>
)

// ─── Badge ────────────────────────────────────────────────────────────────────
export const Badge = ({ children, color, bg, className = '' }) => (
    <span
        className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium', className)}
        style={{ color, backgroundColor: bg }}
    >
        {children}
    </span>
)

// ─── Button ───────────────────────────────────────────────────────────────────
export const Button = ({
    children, onClick, variant = 'primary', size = 'md',
    disabled = false, className = '', type = 'button', icon: Icon,
}) => {
    const base = 'inline-flex items-center gap-2 font-semibold rounded-xl transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed'
    const sizes = {
        sm: 'px-3 py-1.5 text-xs',
        md: 'px-4 py-2 text-sm',
        lg: 'px-6 py-3 text-sm',
    }
    const variants = {
        primary: 'bg-amber-400 text-gray-950 hover:bg-amber-300 active:scale-[0.98]',
        secondary: 'bg-white/8 text-white/80 hover:bg-white/12 border border-white/10',
        ghost: 'bg-transparent text-white/60 hover:text-white hover:bg-white/8',
        danger: 'bg-rose-500/15 text-rose-400 hover:bg-rose-500/25 border border-rose-500/20',
        emerald: 'bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25 border border-emerald-500/20',
    }
    return (
        <button
            type={type}
            onClick={onClick}
            disabled={disabled}
            className={cn(base, sizes[size], variants[variant], className)}
        >
            {Icon && <Icon size={14} />}
            {children}
        </button>
    )
}

// ─── Input ────────────────────────────────────────────────────────────────────
export const Input = ({ label, error, className = '', prefix, ...props }) => (
    <div className="space-y-1.5">
        {label && (
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest">
                {label}
            </label>
        )}
        <div className="relative">
            {prefix && (
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40 text-sm">
                    {prefix}
                </span>
            )}
            <input
                {...props}
                className={cn(
                    'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all',
                    'focus:border-amber-400/50 focus:bg-white/8 focus:ring-2 focus:ring-amber-400/10',
                    error && 'border-rose-500/50',
                    prefix && 'pl-8',
                    className
                )}
            />
        </div>
        {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
)

// ─── Select ───────────────────────────────────────────────────────────────────
export const Select = ({ label, error, options = [], className = '', ...props }) => (
    <div className="space-y-1.5">
        {label && (
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest">
                {label}
            </label>
        )}
        <select
            {...props}
            className={cn(
                'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white outline-none transition-all appearance-none',
                'focus:border-amber-400/50 focus:bg-white/8',
                error && 'border-rose-500/50',
                className
            )}
        >
            {options.map((o) => (
                <option key={o.value} value={o.value} className="bg-gray-900">
                    {o.label}
                </option>
            ))}
        </select>
        {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
)

// ─── Textarea ─────────────────────────────────────────────────────────────────
export const Textarea = ({ label, error, className = '', ...props }) => (
    <div className="space-y-1.5">
        {label && (
            <label className="block text-xs font-semibold text-white/50 uppercase tracking-widest">
                {label}
            </label>
        )}
        <textarea
            {...props}
            className={cn(
                'w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white placeholder-white/25 outline-none transition-all resize-none',
                'focus:border-amber-400/50 focus:bg-white/8',
                error && 'border-rose-500/50',
                className
            )}
        />
        {error && <p className="text-xs text-rose-400">{error}</p>}
    </div>
)

// ─── Modal ────────────────────────────────────────────────────────────────────
export const Modal = ({ isOpen, onClose, title, children, size = 'md' }) => {
    const sizes = { sm: 'max-w-sm', md: 'max-w-md', lg: 'max-w-lg' }
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                    onClick={(e) => e.target === e.currentTarget && onClose()}
                >
                    <motion.div
                        initial={{ opacity: 0, y: 40, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.96 }}
                        transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                        className={cn('w-full bg-gray-900 border border-white/10 rounded-2xl shadow-2xl', sizes[size])}
                    >
                        <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-white/8">
                            <h2 className="font-bold text-base text-white">{title}</h2>
                            <button
                                onClick={onClose}
                                className="p-1.5 rounded-lg hover:bg-white/8 text-white/40 hover:text-white transition-all"
                            >
                                <X size={16} />
                            </button>
                        </div>
                        <div className="p-5">{children}</div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    )
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
export const ProgressBar = ({ value, max, color = '#fbbf24', showLabel = false, className = '' }) => {
    const pct = max > 0 ? Math.min((value / max) * 100, 100) : 0
    const isOver = value > max
    return (
        <div className={cn('space-y-1', className)}>
            <div className="h-1.5 bg-white/8 rounded-full overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: isOver ? '#fb7185' : color }}
                />
            </div>
            {showLabel && (
                <div className="flex justify-between text-xs text-white/35">
                    <span>{pct.toFixed(0)}%</span>
                    {isOver && <span className="text-rose-400">Over budget!</span>}
                </div>
            )}
        </div>
    )
}

// ─── Empty State ──────────────────────────────────────────────────────────────
export const EmptyState = ({ icon: Icon, title, description, action }) => (
    <div className="flex flex-col items-center justify-center py-16 text-center">
        {Icon && (
            <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/8 flex items-center justify-center mb-4">
                <Icon size={24} className="text-white/25" />
            </div>
        )}
        <p className="font-semibold text-white/50 mb-1">{title}</p>
        {description && <p className="text-sm text-white/30 mb-4 max-w-xs">{description}</p>}
        {action}
    </div>
)

// ─── Alert ────────────────────────────────────────────────────────────────────
export const Alert = ({ type = 'info', children }) => {
    const configs = {
        info: { Icon: Info, color: '#60a5fa', bg: 'rgba(96,165,250,0.08)', border: 'rgba(96,165,250,0.2)' },
        warning: { Icon: AlertTriangle, color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.2)' },
        success: { Icon: CheckCircle, color: '#34d399', bg: 'rgba(52,211,153,0.08)', border: 'rgba(52,211,153,0.2)' },
        error: { Icon: AlertTriangle, color: '#fb7185', bg: 'rgba(251,113,133,0.08)', border: 'rgba(251,113,133,0.2)' },
    }
    const { Icon, color, bg, border } = configs[type]
    return (
        <div
            className="flex items-start gap-3 p-3.5 rounded-xl text-sm"
            style={{ backgroundColor: bg, border: `1px solid ${border}` }}
        >
            <Icon size={15} style={{ color, flexShrink: 0, marginTop: 1 }} />
            <span style={{ color }}>{children}</span>
        </div>
    )
}

// ─── Stat Card ────────────────────────────────────────────────────────────────
export const StatCard = ({ label, value, sub, color, icon: Icon, className = '' }) => (
    <Card className={cn('p-4', className)}>
        <div className="flex items-start justify-between mb-3">
            <p className="text-xs font-semibold text-white/40 uppercase tracking-widest">{label}</p>
            {Icon && (
                <div className="w-7 h-7 rounded-lg flex items-center justify-center"
                    style={{ backgroundColor: `${color}18` }}>
                    <Icon size={13} style={{ color }} />
                </div>
            )}
        </div>
        <p className="font-medium text-xl" style={{ color }}>{value}</p>
        {sub && <p className="text-xs text-white/35 mt-1">{sub}</p>}
    </Card>
)

// ─── Tab Bar ──────────────────────────────────────────────────────────────────
export const TabBar = ({ tabs, active, onChange }) => (
    <div className="flex gap-1 p-1 bg-white/5 rounded-xl border border-white/8">
        {tabs.map((tab) => (
            <button
                key={tab.value}
                onClick={() => onChange(tab.value)}
                className={cn(
                    'flex-1 py-2 px-3 rounded-lg text-xs font-semibold transition-all duration-200',
                    active === tab.value
                        ? 'bg-amber-400 text-gray-950'
                        : 'text-white/45 hover:text-white/70'
                )}
            >
                {tab.label}
            </button>
        ))}
    </div>
)

// ─── Section Header ───────────────────────────────────────────────────────────
export const SectionHeader = ({ title, subtitle, action }) => (
    <div className="flex items-start justify-between gap-4 mb-5">
        <div>
            <h2 className="font-bold text-base text-white">{title}</h2>
            {subtitle && <p className="text-sm text-white/40 mt-0.5">{subtitle}</p>}
        </div>
        {action}
    </div>
)

// ─── Divider ──────────────────────────────────────────────────────────────────
export const Divider = ({ label, className = '' }) => (
    <div className={cn('flex items-center gap-3', className)}>
        <div className="flex-1 h-px bg-white/8" />
        {label && <span className="text-xs text-white/25">{label}</span>}
        <div className="flex-1 h-px bg-white/8" />
    </div>
)