// ─── Format Currency ────────────────────────────────────────────────────────
export const formatCurrency = (amount, compact = false) => {
    if (compact && Math.abs(amount) >= 1_000_000) {
        const m = amount / 1_000_000
        return `Rp ${m % 1 === 0 ? m : m.toFixed(1)}jt`
    }
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
    }).format(amount)
}

// ─── Format Date ────────────────────────────────────────────────────────────
export const formatDate = (dateStr) => {
    if (!dateStr) return ''
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric', month: 'short', year: 'numeric'
    }).format(new Date(dateStr))
}

export const formatDateShort = (dateStr) => {
    if (!dateStr) return ''
    return new Intl.DateTimeFormat('id-ID', {
        day: 'numeric', month: 'short'
    }).format(new Date(dateStr))
}

// ─── Class Names Helper ──────────────────────────────────────────────────────
export const cn = (...classes) => classes.filter(Boolean).join(' ')

// ─── Tier Config ─────────────────────────────────────────────────────────────
export const TIER_CONFIG = {
    needs: { label: 'Needs', color: '#34d399', bg: 'rgba(52,211,153,0.1)', border: 'rgba(52,211,153,0.2)' },
    comfort: { label: 'Comfort', color: '#a78bfa', bg: 'rgba(167,139,250,0.1)', border: 'rgba(167,139,250,0.2)' },
    wants: { label: 'Wants', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)', border: 'rgba(251,191,36,0.2)' },
    income: { label: 'Income', color: '#60a5fa', bg: 'rgba(96,165,250,0.1)', border: 'rgba(96,165,250,0.2)' },
}

// ─── Transaction Type Config ──────────────────────────────────────────────────
export const TXN_TYPE_CONFIG = {
    income: { label: 'Pemasukan', color: '#34d399', sign: '+' },
    expense: { label: 'Pengeluaran', color: '#fb7185', sign: '-' },
    reserve_in: { label: 'Setor Reserve', color: '#a78bfa', sign: '-' },
    reserve_out: { label: 'Tarik Reserve', color: '#60a5fa', sign: '+' },
}

// ─── Status Config ────────────────────────────────────────────────────────────
export const STATUS_CONFIG = {
    active: { label: 'Aktif', color: '#34d399', bg: 'rgba(52,211,153,0.1)' },
    planned: { label: 'Planned', color: '#fbbf24', bg: 'rgba(251,191,36,0.1)' },
    archived: { label: 'Arsip', color: 'rgba(255,255,255,0.4)', bg: 'rgba(255,255,255,0.06)' },
}

// ─── Batch Stats Calculator ───────────────────────────────────────────────────
export const calcBatchStats = (transactions, batchId) => {
    const txns = transactions.filter((t) => t.batchId === batchId)
    return {
        txns,
        totalIncome: txns.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0),
        totalExpense: txns.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0),
        totalReserveIn: txns.filter(t => t.type === 'reserve_in').reduce((s, t) => s + t.amount, 0),
        totalReserveOut: txns.filter(t => t.type === 'reserve_out').reduce((s, t) => s + t.amount, 0),
    }
}