import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Seed Data ────────────────────────────────────────────────────────────────
const seedCategories = [
    // Needs
    { id: 'c1', name: 'Makanan & Minuman', tier: 'needs', icon: '🍽️', color: '#34d399' },
    { id: 'c2', name: 'Transportasi', tier: 'needs', icon: '🚌', color: '#34d399' },
    { id: 'c3', name: 'Tagihan & Utilitas', tier: 'needs', icon: '⚡', color: '#34d399' },
    { id: 'c4', name: 'Kesehatan', tier: 'needs', icon: '💊', color: '#34d399' },
    // Comfort
    { id: 'c5', name: 'Perawatan Diri', tier: 'comfort', icon: '🧴', color: '#a78bfa' },
    { id: 'c6', name: 'Pakaian', tier: 'comfort', icon: '👕', color: '#a78bfa' },
    // Wants
    { id: 'c7', name: 'Hiburan', tier: 'wants', icon: '🎮', color: '#fbbf24' },
    { id: 'c8', name: 'Makan di Luar', tier: 'wants', icon: '🍜', color: '#fbbf24' },
    { id: 'c9', name: 'Langganan', tier: 'wants', icon: '📱', color: '#fbbf24' },
    { id: 'c10', name: 'Shopping', tier: 'wants', icon: '🛍️', color: '#fbbf24' },
    // Income
    { id: 'c11', name: 'Gaji', tier: 'income', icon: '💼', color: '#60a5fa' },
    { id: 'c12', name: 'Freelance', tier: 'income', icon: '💻', color: '#60a5fa' },
    { id: 'c13', name: 'Bonus', tier: 'income', icon: '🎁', color: '#60a5fa' },
]

const seedBatches = [
    {
        id: 'b1',
        name: 'Januari 2026',
        startDate: '2026-01-01',
        endDate: '2026-01-31',
        status: 'archived',
        notes: 'Bulan pertama tahun baru',
        snapshotSaldoUtama: 2_450_000,
        snapshotReserve: 5_000_000,
        budgets: [
            { categoryId: 'c1', amount: 1_200_000 },
            { categoryId: 'c2', amount: 600_000 },
            { categoryId: 'c7', amount: 300_000 },
        ],
    },
    {
        id: 'b2',
        name: 'Februari 2026',
        startDate: '2026-02-01',
        endDate: '2026-02-28',
        status: 'active',
        notes: '',
        budgets: [
            { categoryId: 'c1', amount: 1_200_000 },
            { categoryId: 'c2', amount: 600_000 },
            { categoryId: 'c3', amount: 400_000 },
            { categoryId: 'c7', amount: 300_000 },
            { categoryId: 'c8', amount: 500_000 },
        ],
    },
    {
        id: 'b3',
        name: 'Maret 2026',
        startDate: '2026-03-01',
        endDate: '2026-03-31',
        status: 'planned',
        notes: 'Target tabungan lebih banyak',
        budgets: [],
    },
]

const seedTransactions = [
    // Januari
    { id: 't1', batchId: 'b1', type: 'income', amount: 5_500_000, categoryId: 'c11', description: 'Gaji Januari', date: '2026-01-02', notes: '' },
    { id: 't2', batchId: 'b1', type: 'expense', amount: 1_150_000, categoryId: 'c1', description: 'Belanja supermarket', date: '2026-01-05', notes: '' },
    { id: 't3', batchId: 'b1', type: 'expense', amount: 580_000, categoryId: 'c2', description: 'Bensin + parkir', date: '2026-01-10', notes: '' },
    { id: 't4', batchId: 'b1', type: 'expense', amount: 280_000, categoryId: 'c7', description: 'Game & streaming', date: '2026-01-15', notes: '' },
    { id: 't5', batchId: 'b1', type: 'reserve_in', amount: 1_000_000, categoryId: null, description: 'Setor dana darurat', date: '2026-01-25', notes: '' },
    // Februari
    { id: 't6', batchId: 'b2', type: 'income', amount: 5_500_000, categoryId: 'c11', description: 'Gaji Februari', date: '2026-02-02', notes: '' },
    { id: 't7', batchId: 'b2', type: 'expense', amount: 980_000, categoryId: 'c1', description: 'Belanja mingguan', date: '2026-02-05', notes: '' },
    { id: 't8', batchId: 'b2', type: 'expense', amount: 420_000, categoryId: 'c2', description: 'Bensin + ojek online', date: '2026-02-08', notes: '' },
    { id: 't9', batchId: 'b2', type: 'expense', amount: 350_000, categoryId: 'c8', description: 'Dinner Valentine', date: '2026-02-14', notes: '🩷' },
    { id: 't10', batchId: 'b2', type: 'expense', amount: 180_000, categoryId: 'c9', description: 'Netflix & Spotify', date: '2026-02-18', notes: '' },
    { id: 't11', batchId: 'b2', type: 'reserve_in', amount: 500_000, categoryId: null, description: 'Setor tabungan rutin', date: '2026-02-20', notes: '' },
    { id: 't12', batchId: 'b2', type: 'income', amount: 1_200_000, categoryId: 'c12', description: 'Freelance website', date: '2026-02-22', notes: '' },
]

const seedReserveGoals = [
    { id: 'r1', name: 'Dana Darurat', target: 10_000_000, description: '3 bulan pengeluaran', icon: '🛡️', color: '#34d399' },
    { id: 'r2', name: 'Liburan Bali', target: 5_000_000, description: 'Liburan akhir tahun', icon: '🌴', color: '#fbbf24' },
    { id: 'r3', name: 'Laptop Baru', target: 15_000_000, description: 'MacBook Air M3', icon: '💻', color: '#a78bfa' },
]

// ─── Store ────────────────────────────────────────────────────────────────────
const useFinanceStore = create(
    persist(
        (set, get) => ({
            // State
            saldoUtama: 4_442_000,
            reserve: 6_500_000,
            batches: seedBatches,
            transactions: seedTransactions,
            categories: seedCategories,
            reserveGoals: seedReserveGoals,
            reserveAllocations: [
                { id: 'ra1', goalId: 'r1', amount: 4_500_000 },
                { id: 'ra2', goalId: 'r2', amount: 1_200_000 },
                { id: 'ra3', goalId: 'r3', amount: 800_000 },
            ],

            // ── Helpers ──────────────────────────────────────────────────────────
            getActiveBatch: () =>
                get().batches.find((b) => b.status === 'active') || null,

            getCategoryById: (id) =>
                get().categories.find((c) => c.id === id),

            // ── Batch Actions ─────────────────────────────────────────────────────
            addBatch: (batch) =>
                set((s) => ({
                    batches: [...s.batches, { ...batch, id: `b${Date.now()}`, status: 'planned', budgets: [] }],
                })),

            updateBatch: (id, data) =>
                set((s) => ({
                    batches: s.batches.map((b) => (b.id === id ? { ...b, ...data } : b)),
                })),

            activateBatch: (id) => {
                const hasActive = get().batches.some((b) => b.status === 'active')
                if (hasActive) return { error: 'Archive batch aktif terlebih dahulu.' }
                set((s) => ({
                    batches: s.batches.map((b) => (b.id === id ? { ...b, status: 'active' } : b)),
                }))
                return { error: null }
            },

            archiveBatch: (id) => {
                const { saldoUtama, reserve } = get()
                set((s) => ({
                    batches: s.batches.map((b) =>
                        b.id === id
                            ? { ...b, status: 'archived', snapshotSaldoUtama: saldoUtama, snapshotReserve: reserve }
                            : b
                    ),
                }))
            },

            setBudget: (batchId, categoryId, amount) =>
                set((s) => ({
                    batches: s.batches.map((b) => {
                        if (b.id !== batchId) return b
                        const existing = b.budgets.find((bg) => bg.categoryId === categoryId)
                        return {
                            ...b,
                            budgets: existing
                                ? b.budgets.map((bg) => bg.categoryId === categoryId ? { ...bg, amount } : bg)
                                : [...b.budgets, { categoryId, amount }],
                        }
                    }),
                })),

            // ── Transaction Actions ───────────────────────────────────────────────
            addTransaction: (txn) => {
                let { saldoUtama, reserve } = get()
                if (txn.type === 'income') saldoUtama += txn.amount
                if (txn.type === 'expense') saldoUtama -= txn.amount
                if (txn.type === 'reserve_in') {
                    if (saldoUtama < txn.amount) return { error: 'Saldo utama tidak cukup.' }
                    saldoUtama -= txn.amount
                    reserve += txn.amount
                }
                if (txn.type === 'reserve_out') {
                    if (reserve < txn.amount) return { error: 'Saldo reserve tidak cukup.' }
                    reserve -= txn.amount
                    saldoUtama += txn.amount
                }
                set((s) => ({
                    transactions: [...s.transactions, { ...txn, id: `t${Date.now()}` }],
                    saldoUtama,
                    reserve,
                }))
                return { error: null }
            },

            deleteTransaction: (id) => {
                const txn = get().transactions.find((t) => t.id === id)
                if (!txn) return
                let { saldoUtama, reserve } = get()
                if (txn.type === 'income') saldoUtama -= txn.amount
                if (txn.type === 'expense') saldoUtama += txn.amount
                if (txn.type === 'reserve_in') { saldoUtama += txn.amount; reserve -= txn.amount }
                if (txn.type === 'reserve_out') { saldoUtama -= txn.amount; reserve += txn.amount }
                set((s) => ({
                    transactions: s.transactions.filter((t) => t.id !== id),
                    saldoUtama,
                    reserve,
                }))
            },

            // ── Reserve Goal Actions ──────────────────────────────────────────────
            addReserveGoal: (goal) =>
                set((s) => ({
                    reserveGoals: [...s.reserveGoals, { ...goal, id: `r${Date.now()}` }],
                })),

            updateReserveGoal: (id, data) =>
                set((s) => ({
                    reserveGoals: s.reserveGoals.map((g) => (g.id === id ? { ...g, ...data } : g)),
                })),

            deleteReserveGoal: (id) =>
                set((s) => ({
                    reserveGoals: s.reserveGoals.filter((g) => g.id !== id),
                    reserveAllocations: s.reserveAllocations.filter((a) => a.goalId !== id),
                })),

            allocateReserve: (goalId, amount) =>
                set((s) => {
                    const existing = s.reserveAllocations.find((a) => a.goalId === goalId)
                    return {
                        reserveAllocations: existing
                            ? s.reserveAllocations.map((a) => a.goalId === goalId ? { ...a, amount } : a)
                            : [...s.reserveAllocations, { id: `ra${Date.now()}`, goalId, amount }],
                    }
                }),
        }),
        { name: 'your-finance-store' }
    )
)

export default useFinanceStore