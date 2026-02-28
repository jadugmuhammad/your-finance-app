import { useState } from 'react'
import { Plus, Target } from 'lucide-react'
import useFinanceStore from '../store/useFinanceStore'
import { formatCurrency, calcBatchStats, TIER_CONFIG } from '../lib/utils'
import {
    Card, Button, Input, Select, Modal,
    ProgressBar, Alert, EmptyState, Badge, SectionHeader
} from '../components/ui/index'

function BudgetRow({ budget, category, spent }) {
    const isOver = spent > budget.amount
    const tierCfg = TIER_CONFIG[category?.tier] || {}

    return (
        <div className="px-4 py-3 hover:bg-white/3 rounded-xl transition-colors">
            <div className="flex items-center justify-between mb-2">

                {/* Kiri: icon + nama */}
                <div className="flex items-center gap-2.5">
                    <div
                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm"
                        style={{ backgroundColor: `${category?.color}18` }}
                    >
                        {category?.icon}
                    </div>
                    <div>
                        <p className="text-sm font-medium text-white/80">{category?.name}</p>
                        <Badge color={tierCfg.color} bg={tierCfg.bg}>{tierCfg.label}</Badge>
                    </div>
                </div>

                {/* Kanan: nominal */}
                <div className="text-right">
                    <p
                        className="text-sm font-medium"
                        style={{ color: isOver ? '#fb7185' : 'rgba(255,255,255,0.8)' }}
                    >
                        {formatCurrency(spent, true)}
                    </p>
                    <p className="text-xs text-white/30">
                        / {formatCurrency(budget.amount, true)}
                    </p>
                </div>

            </div>
            <ProgressBar
                value={spent}
                max={budget.amount}
                color={tierCfg.color || '#fbbf24'}
                showLabel
            />
        </div>
    )
}

export default function Anggaran() {
    const { batches, transactions, categories, setBudget } = useFinanceStore()
    const [modalOpen, setModalOpen] = useState(false)
    const [form, setForm] = useState({ categoryId: '', amount: '' })

    const activeBatch = batches.find((b) => b.status === 'active')
    const stats = activeBatch ? calcBatchStats(transactions, activeBatch.id) : null

    // Hitung pengeluaran aktual per kategori
    const spentByCategory = stats
        ? stats.txns
            .filter((t) => t.type === 'expense')
            .reduce((acc, t) => {
                if (t.categoryId) acc[t.categoryId] = (acc[t.categoryId] || 0) + t.amount
                return acc
            }, {})
        : {}

    const budgets = activeBatch?.budgets || []
    const totalBudgeted = budgets.reduce((s, b) => s + b.amount, 0)
    const totalSpent = Object.values(spentByCategory).reduce((s, v) => s + v, 0)

    const catOptions = [
        { value: '', label: '— Pilih Kategori —' },
        ...categories
            .filter((c) => c.tier !== 'income')
            .map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` })),
    ]

    const handleSave = () => {
        if (!form.categoryId || !form.amount) return
        setBudget(activeBatch.id, form.categoryId, Number(form.amount))
        setForm({ categoryId: '', amount: '' })
        setModalOpen(false)
    }

    const TIERS = ['needs', 'comfort', 'wants']

    return (
        <div className="p-5 lg:p-7 max-w-2xl mx-auto space-y-5">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="font-black text-2xl text-white tracking-tight">Anggaran</h1>
                    <p className="text-sm text-white/40 mt-0.5">
                        {activeBatch ? activeBatch.name : 'Tidak ada batch aktif'}
                    </p>
                </div>
                {activeBatch && (
                    <Button icon={Plus} onClick={() => setModalOpen(true)}>Set Budget</Button>
                )}
            </div>

            {!activeBatch && (
                <Alert type="warning">Aktifkan batch untuk mengatur anggaran.</Alert>
            )}

            {activeBatch && (
                <>
                    {/* Summary */}
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { label: 'Total Budget', value: totalBudgeted, color: '#fbbf24' },
                            { label: 'Terpakai', value: totalSpent, color: '#fb7185' },
                            { label: 'Sisa', value: totalBudgeted - totalSpent, color: totalBudgeted >= totalSpent ? '#34d399' : '#fb7185' },
                        ].map((s) => (
                            <Card key={s.label} className="p-3">
                                <p className="text-xs text-white/35 font-semibold mb-1">{s.label}</p>
                                <p className="font-medium text-sm" style={{ color: s.color }}>
                                    {formatCurrency(s.value, true)}
                                </p>
                            </Card>
                        ))}
                    </div>

                    {/* Overall progress */}
                    {totalBudgeted > 0 && (
                        <Card className="p-4">
                            <div className="flex justify-between text-sm mb-3">
                                <span className="font-semibold text-white/60">Total Progres</span>
                                <span className="text-white/40">
                                    {Math.round((totalSpent / totalBudgeted) * 100)}%
                                </span>
                            </div>
                            <ProgressBar value={totalSpent} max={totalBudgeted} color="#fbbf24" />
                        </Card>
                    )}

                    {/* Budget per tier */}
                    {TIERS.map((tier) => {
                        const tierBudgets = budgets.filter((b) => {
                            const cat = categories.find((c) => c.id === b.categoryId)
                            return cat?.tier === tier
                        })
                        if (tierBudgets.length === 0) return null
                        const cfg = TIER_CONFIG[tier]

                        return (
                            <Card key={tier}>
                                <div className="px-4 pt-4 pb-2 border-b border-white/6 flex items-center gap-2">
                                    <Badge color={cfg.color} bg={cfg.bg}>{cfg.label}</Badge>
                                    <span className="text-xs text-white/30">
                                        {formatCurrency(
                                            tierBudgets.reduce((s, b) => s + b.amount, 0),
                                            true
                                        )} dianggarkan
                                    </span>
                                </div>
                                <div className="p-2">
                                    {tierBudgets.map((b) => {
                                        const cat = categories.find((c) => c.id === b.categoryId)
                                        return (
                                            <BudgetRow
                                                key={b.categoryId}
                                                budget={b}
                                                category={cat}
                                                spent={spentByCategory[b.categoryId] || 0}
                                            />
                                        )
                                    })}
                                </div>
                            </Card>
                        )
                    })}

                    {/* Empty */}
                    {budgets.length === 0 && (
                        <EmptyState
                            icon={Target}
                            title="Belum ada anggaran"
                            description="Atur budget per kategori untuk memantau pengeluaran."
                            action={
                                <Button icon={Plus} size="sm" onClick={() => setModalOpen(true)}>
                                    Set Budget Pertama
                                </Button>
                            }
                        />
                    )}
                </>
            )}

            {/* Modal */}
            <Modal
                isOpen={modalOpen}
                onClose={() => setModalOpen(false)}
                title="Set Budget Kategori"
            >
                <div className="space-y-4">
                    <Select
                        label="Kategori"
                        value={form.categoryId}
                        onChange={(e) => setForm((f) => ({ ...f, categoryId: e.target.value }))}
                        options={catOptions}
                    />
                    <Input
                        label="Nominal Budget"
                        type="number"
                        prefix="Rp"
                        placeholder="0"
                        value={form.amount}
                        onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
                    />
                    <div className="flex gap-2 pt-1">
                        <Button variant="secondary" className="flex-1" onClick={() => setModalOpen(false)}>
                            Batal
                        </Button>
                        <Button variant="primary" className="flex-1" onClick={handleSave}>
                            Simpan
                        </Button>
                    </div>
                </div>
            </Modal>

        </div>
    )
}