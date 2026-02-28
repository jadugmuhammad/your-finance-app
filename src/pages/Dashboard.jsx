import { useState } from 'react'
import { Link } from 'react-router-dom'
import {
    AreaChart, Area, XAxis, YAxis, Tooltip,
    ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts'
import {
    Plus, TrendingUp, TrendingDown,
    Wallet, PiggyBank, ArrowRight
} from 'lucide-react'
import useFinanceStore from '../store/useFinanceStore'
import { formatCurrency, formatDate, calcBatchStats, TIER_CONFIG } from '../lib/utils'
import {
    Card, Button, StatCard, EmptyState, SectionHeader
} from '../components/ui/index'

// ─── Custom Tooltip Chart ─────────────────────────────────────────────────────
const ChartTooltip = ({ active, payload }) => {
    if (!active || !payload?.length) return null
    return (
        <div className="bg-gray-900 border border-white/10 rounded-xl px-3 py-2.5 text-xs space-y-1">
            <p className="text-white/50 mb-1">{payload[0]?.payload?.name}</p>
            <p className="text-emerald-400">Masuk: {formatCurrency(payload[0]?.value || 0, true)}</p>
            <p className="text-rose-400">Keluar: {formatCurrency(payload[1]?.value || 0, true)}</p>
        </div>
    )
}

export default function Dashboard() {
    const { saldoUtama, reserve, batches, transactions, categories } = useFinanceStore()
    const [txnOpen, setTxnOpen] = useState(false)

    const activeBatch = batches.find((b) => b.status === 'active')
    const stats = activeBatch ? calcBatchStats(transactions, activeBatch.id) : null

    // Data tren (batch archived + active)
    const trendBatches = batches.filter((b) => b.status !== 'planned')
    const trendData = trendBatches.map((b) => {
        const s = calcBatchStats(transactions, b.id)
        return {
            name: b.name.split(' ')[0],
            income: s.totalIncome,
            expense: s.totalExpense,
        }
    })

    // Breakdown pengeluaran per tier (batch aktif)
    const tierData = stats
        ? Object.entries(
            stats.txns
                .filter((t) => t.type === 'expense')
                .reduce((acc, t) => {
                    const cat = categories.find((c) => c.id === t.categoryId)
                    if (cat) acc[cat.tier] = (acc[cat.tier] || 0) + t.amount
                    return acc
                }, {})
        ).map(([tier, value]) => ({
            name: TIER_CONFIG[tier]?.label || tier,
            value,
            color: TIER_CONFIG[tier]?.color,
        }))
        : []

    // 5 transaksi terbaru
    const recentTxns = stats
        ? [...stats.txns]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 5)
        : []

    const net = stats
        ? stats.totalIncome - stats.totalExpense - stats.totalReserveIn + stats.totalReserveOut
        : 0

    return (
        <div className="p-5 lg:p-7 max-w-5xl mx-auto space-y-6">

            {/* Header */}
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h1 className="font-black text-2xl text-white tracking-tight">Dashboard</h1>
                    <p className="text-sm text-white/40 mt-0.5">
                        {activeBatch
                            ? `${activeBatch.name} · ${formatDate(activeBatch.startDate)} – ${formatDate(activeBatch.endDate)}`
                            : 'Tidak ada batch aktif'}
                    </p>
                </div>
            </div>

            {/* Stat Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    label="Saldo Utama"
                    value={formatCurrency(saldoUtama, true)}
                    sub={saldoUtama < 0 ? '⚠️ Saldo negatif!' : 'Dompet aktif'}
                    color={saldoUtama < 0 ? '#fb7185' : '#fbbf24'}
                    icon={Wallet}
                />
                <StatCard
                    label="Reserve"
                    value={formatCurrency(reserve, true)}
                    sub="Dana cadangan"
                    color="#34d399"
                    icon={PiggyBank}
                />
                <StatCard
                    label="Total Masuk"
                    value={stats ? formatCurrency(stats.totalIncome, true) : '—'}
                    sub={activeBatch?.name || '—'}
                    color="#34d399"
                    icon={TrendingUp}
                />
                <StatCard
                    label="Total Keluar"
                    value={stats ? formatCurrency(stats.totalExpense, true) : '—'}
                    sub={`Net: ${stats ? formatCurrency(net, true) : '—'}`}
                    color="#fb7185"
                    icon={TrendingDown}
                />
            </div>

            {/* Charts */}
            {trendData.length > 0 && (
                <div className="grid lg:grid-cols-3 gap-4">

                    {/* Area Chart */}
                    <Card className="lg:col-span-2 p-5">
                        <SectionHeader
                            title="Tren Keuangan"
                            subtitle="Pemasukan vs pengeluaran per batch"
                        />
                        <ResponsiveContainer width="100%" height={180}>
                            <AreaChart data={trendData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                <defs>
                                    <linearGradient id="gradIncome" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#34d399" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#34d399" stopOpacity={0} />
                                    </linearGradient>
                                    <linearGradient id="gradExpense" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#fb7185" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#fb7185" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <XAxis
                                    dataKey="name"
                                    tick={{ fill: 'rgba(255,255,255,0.3)', fontSize: 11 }}
                                    axisLine={false} tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: 'rgba(255,255,255,0.25)', fontSize: 10 }}
                                    axisLine={false} tickLine={false}
                                    tickFormatter={(v) => `${(v / 1e6).toFixed(1)}jt`}
                                />
                                <Tooltip content={<ChartTooltip />} cursor={{ stroke: 'rgba(255,255,255,0.08)' }} />
                                <Area type="monotone" dataKey="income" stroke="#34d399" strokeWidth={2} fill="url(#gradIncome)" />
                                <Area type="monotone" dataKey="expense" stroke="#fb7185" strokeWidth={2} fill="url(#gradExpense)" />
                            </AreaChart>
                        </ResponsiveContainer>
                    </Card>

                    {/* Pie Chart */}
                    {tierData.length > 0 && (
                        <Card className="p-5">
                            <SectionHeader title="Pengeluaran" subtitle="Per tier (batch aktif)" />
                            <div className="flex flex-col items-center gap-4">
                                <PieChart width={130} height={130}>
                                    <Pie
                                        data={tierData}
                                        cx={60} cy={60}
                                        innerRadius={35} outerRadius={60}
                                        paddingAngle={3} dataKey="value"
                                    >
                                        {tierData.map((entry, i) => (
                                            <Cell key={i} fill={entry.color} opacity={0.85} />
                                        ))}
                                    </Pie>
                                </PieChart>
                                <div className="space-y-1.5 w-full">
                                    {tierData.map((t) => (
                                        <div key={t.name} className="flex items-center justify-between text-xs">
                                            <div className="flex items-center gap-1.5">
                                                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: t.color }} />
                                                <span className="text-white/50">{t.name}</span>
                                            </div>
                                            <span className="text-white/70">{formatCurrency(t.value, true)}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </Card>
                    )}

                </div>
            )}

            {/* Transaksi Terbaru */}
            <Card>
                <div className="px-5 pt-5 pb-4 border-b border-white/6 flex items-center justify-between">
                    <div>
                        <h2 className="font-bold text-base text-white">Transaksi Terbaru</h2>
                        {activeBatch && (
                            <p className="text-xs text-white/35 mt-0.5">{activeBatch.name}</p>
                        )}
                    </div>
                    {activeBatch && (
                        <Link to="/aktivitas">
                            <Button variant="ghost" size="sm" icon={ArrowRight}>Semua</Button>
                        </Link>
                    )}
                </div>

                {recentTxns.length === 0 ? (
                    <EmptyState
                        icon={Wallet}
                        title="Belum ada transaksi"
                        description={activeBatch
                            ? 'Tambah transaksi pertama di halaman Aktivitas.'
                            : 'Aktifkan batch terlebih dahulu di halaman Plans.'
                        }
                    />
                ) : (
                    <div className="p-2">
                        {recentTxns.map((t) => {
                            const cat = categories.find((c) => c.id === t.categoryId)
                            return (
                                <div key={t.id} className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/3 transition-colors">
                                    <div
                                        className="w-8 h-8 rounded-xl flex items-center justify-center text-sm flex-shrink-0"
                                        style={{ backgroundColor: cat ? `${cat.color}18` : 'rgba(255,255,255,0.06)' }}
                                    >
                                        {cat?.icon || '💸'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-sm text-white/80 truncate">{t.description}</p>
                                        <p className="text-xs text-white/30">{cat?.name || t.type}</p>
                                    </div>
                                    <p
                                        className="text-sm font-medium flex-shrink-0"
                                        style={{
                                            color: t.type === 'income' || t.type === 'reserve_out'
                                                ? '#34d399' : '#fb7185'
                                        }}
                                    >
                                        {t.type === 'income' || t.type === 'reserve_out' ? '+' : '-'}
                                        {formatCurrency(t.amount, true)}
                                    </p>
                                </div>
                            )
                        })}
                    </div>
                )}
            </Card>

        </div>
    )
}