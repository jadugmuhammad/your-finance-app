import { Trash2, ArrowDownLeft, ArrowUpRight, ArrowLeftRight } from 'lucide-react'
import useFinanceStore from '../store/useFinanceStore'
import { formatCurrency, formatDateShort, TXN_TYPE_CONFIG } from '../lib/utils'

export default function TransactionItem({ txn, canDelete = true }) {
    const { deleteTransaction, getCategoryById } = useFinanceStore()
    const cat = txn.categoryId ? getCategoryById(txn.categoryId) : null
    const cfg = TXN_TYPE_CONFIG[txn.type] || {}

    const TypeIcon = () => {
        if (txn.type === 'income') return <ArrowDownLeft size={13} className="text-emerald-400" />
        if (txn.type === 'expense') return <ArrowUpRight size={13} className="text-rose-400" />
        if (txn.type === 'reserve_in') return <ArrowLeftRight size={13} className="text-violet-400" />
        if (txn.type === 'reserve_out') return <ArrowLeftRight size={13} className="text-blue-400" />
        return null
    }

    return (
        <div className="flex items-center gap-3 px-3 py-2.5 hover:bg-white/3 rounded-xl group transition-colors">

            {/* Icon */}
            <div
                className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                style={{ backgroundColor: cat ? `${cat.color}18` : 'rgba(255,255,255,0.06)' }}
            >
                {cat ? (
                    <span className="text-sm leading-none">{cat.icon}</span>
                ) : (
                    <TypeIcon />
                )}
            </div>

            {/* Info */}
            <div className="flex-1 min-w-0">
                <p className="text-sm text-white/85 truncate">
                    {txn.description || cfg.label}
                </p>
                <div className="flex items-center gap-2 mt-0.5">
                    {cat && <span className="text-xs text-white/30">{cat.name}</span>}
                    <span className="text-xs text-white/25">{formatDateShort(txn.date)}</span>
                    {txn.notes && (
                        <span className="text-xs text-white/25 truncate max-w-24">· {txn.notes}</span>
                    )}
                </div>
            </div>

            {/* Amount */}
            <p className="font-medium text-sm flex-shrink-0" style={{ color: cfg.color }}>
                {cfg.sign}{formatCurrency(txn.amount)}
            </p>

            {/* Delete */}
            {canDelete && (
                <button
                    onClick={() => deleteTransaction(txn.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg hover:bg-rose-500/15 text-white/25 hover:text-rose-400 transition-all ml-1"
                >
                    <Trash2 size={13} />
                </button>
            )}

        </div>
    )
}