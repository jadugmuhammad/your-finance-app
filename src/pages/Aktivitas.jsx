import { useState } from 'react'
import { Plus, Wallet } from 'lucide-react'
import useFinanceStore from '../store/useFinanceStore'
import { formatCurrency, calcBatchStats, TXN_TYPE_CONFIG } from '../lib/utils'
import { Card, Button, Input, Select, Alert, EmptyState } from '../components/ui/index'
import TransactionForm from '../components/TransactionForm'
import TransactionItem from '../components/TransactionItem'

export default function Aktivitas() {
    const { batches, transactions, categories } = useFinanceStore()
    const [txnOpen, setTxnOpen] = useState(false)
    const [defaultType, setDefaultType] = useState('expense')
    const [search, setSearch] = useState('')
    const [filterType, setFilterType] = useState('all')

    const activeBatch = batches.find((b) => b.status === 'active')
    const stats = activeBatch ? calcBatchStats(transactions, activeBatch.id) : null

    const filtered = stats
        ? stats.txns
            .filter((t) => {
                if (filterType !== 'all' && t.type !== filterType) return false
                if (search) {
                    const q = search.toLowerCase()
                    const cat = categories.find((c) => c.id === t.categoryId)
                    return (
                        t.description?.toLowerCase().includes(q) ||
                        cat?.name?.toLowerCase().includes(q)
                    )
                }
                return true
            })
            .sort((a, b) => new Date(b.date) - new Date(a.date))
        : []

    const openTxn = (type) => {
        setDefaultType(type)
        setTxnOpen(true)
    }

    return (
        <div className="p-5 lg:p-7 max-w-3xl mx-auto space-y-5">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="font-black text-2xl text-white tracking-tight">Aktivitas</h1>
                    <p className="text-sm text-white/40 mt-0.5">
                        {activeBatch ? activeBatch.name : 'Tidak ada batch aktif'}
                    </p>
                </div>
                {activeBatch && (
                    <Button icon={Plus} onClick={() => openTxn('expense')}>Tambah</Button>
                )}
            </div>

            {!activeBatch && (
                <Alert type="warning">
                    Tidak ada batch aktif. Buat dan aktifkan batch di halaman Plans.
                </Alert>
            )}

            {/* Quick Add */}
            {activeBatch && (
                <div className="grid grid-cols-4 gap-2">
                    {Object.entries(TXN_TYPE_CONFIG).map(([type, cfg]) => (
                        <button
                            key={type}
                            onClick={() => openTxn(type)}
                            className="flex flex-col items-center gap-1.5 p-3 rounded-xl border border-white/8 bg-white/3 hover:bg-white/8 hover:border-white/15 transition-all group"
                        >
                            <span className="text-xl">
                                {type === 'income' ? '📥'
                                    : type === 'expense' ? '📤'
                                        : type === 'reserve_in' ? '🏦' : '💸'}
                            </span>
                            <span className="text-xs text-white/40 group-hover:text-white/65 font-semibold text-center leading-tight">
                                {cfg.label}
                            </span>
                        </button>
                    ))}
                </div>
            )}

            {/* Summary */}
            {stats && (
                <div className="grid grid-cols-3 gap-2">
                    {[
                        { label: 'Pemasukan', value: stats.totalIncome, color: '#34d399' },
                        { label: 'Pengeluaran', value: stats.totalExpense, color: '#fb7185' },
                        {
                            label: 'Net',
                            value: stats.totalIncome - stats.totalExpense,
                            color: stats.totalIncome >= stats.totalExpense ? '#34d399' : '#fb7185'
                        },
                    ].map((s) => (
                        <Card key={s.label} className="p-3">
                            <p className="text-xs text-white/35 font-semibold mb-1">{s.label}</p>
                            <p className="font-medium text-sm" style={{ color: s.color }}>
                                {formatCurrency(s.value, true)}
                            </p>
                        </Card>
                    ))}
                </div>
            )}

            {/* Filter + Search */}
            {activeBatch && (
                <div className="flex gap-2">
                    <Input
                        className="flex-1"
                        placeholder="Cari transaksi..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-sm text-white/70 outline-none"
                    >
                        <option value="all" className="bg-gray-900">Semua</option>
                        <option value="income" className="bg-gray-900">Pemasukan</option>
                        <option value="expense" className="bg-gray-900">Pengeluaran</option>
                        <option value="reserve_in" className="bg-gray-900">Setor Reserve</option>
                        <option value="reserve_out" className="bg-gray-900">Tarik Reserve</option>
                    </select>
                </div>
            )}

            {/* List */}
            {activeBatch && (
                <Card>
                    {filtered.length === 0 ? (
                        <EmptyState
                            icon={Wallet}
                            title="Tidak ada transaksi"
                            description={search
                                ? 'Coba kata kunci lain.'
                                : 'Belum ada transaksi di batch ini.'
                            }
                            action={!search && (
                                <Button icon={Plus} size="sm" onClick={() => openTxn('expense')}>
                                    Tambah Pertama
                                </Button>
                            )}
                        />
                    ) : (
                        <div className="p-2">
                            {filtered.map((t) => (
                                <TransactionItem key={t.id} txn={t} />
                            ))}
                        </div>
                    )}
                </Card>
            )}

            <TransactionForm
                isOpen={txnOpen}
                onClose={() => setTxnOpen(false)}
                batchId={activeBatch?.id}
                defaultType={defaultType}
            />

        </div>
    )
}