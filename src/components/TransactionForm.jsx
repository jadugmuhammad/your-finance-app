import { useState } from 'react'
import { Modal, Button, Input, Select, Textarea, Alert } from './ui/index'
import useFinanceStore from '../store/useFinanceStore'

const TXN_TYPES = [
    { value: 'income', label: '📥 Pemasukan' },
    { value: 'expense', label: '📤 Pengeluaran' },
    { value: 'reserve_in', label: '🏦 Setor Reserve' },
    { value: 'reserve_out', label: '💸 Tarik Reserve' },
]

export default function TransactionForm({ isOpen, onClose, batchId, defaultType = 'expense' }) {
    const { addTransaction, categories } = useFinanceStore()

    const [form, setForm] = useState({
        type: defaultType,
        amount: '',
        description: '',
        categoryId: '',
        date: new Date().toISOString().slice(0, 10),
        notes: '',
    })
    const [error, setError] = useState('')

    const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

    const needsCategory = form.type === 'income' || form.type === 'expense'

    const catOptions = [
        { value: '', label: '— Pilih Kategori —' },
        ...categories
            .filter((c) => {
                if (form.type === 'income') return c.tier === 'income'
                if (form.type === 'expense') return c.tier !== 'income'
                return false
            })
            .map((c) => ({ value: c.id, label: `${c.icon} ${c.name}` })),
    ]

    const handleSubmit = () => {
        if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0) {
            setError('Masukkan nominal yang valid.')
            return
        }
        if (needsCategory && !form.categoryId) {
            setError('Pilih kategori terlebih dahulu.')
            return
        }

        const result = addTransaction({
            ...form,
            batchId,
            amount: Number(form.amount),
            categoryId: needsCategory ? form.categoryId : null,
        })

        if (result?.error) {
            setError(result.error)
            return
        }

        setError('')
        setForm({
            type: defaultType,
            amount: '',
            description: '',
            categoryId: '',
            date: new Date().toISOString().slice(0, 10),
            notes: '',
        })
        onClose()
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose} title="Tambah Transaksi">
            <div className="space-y-4">

                {error && <Alert type="error">{error}</Alert>}

                <Select
                    label="Tipe"
                    value={form.type}
                    onChange={(e) => { set('type', e.target.value); set('categoryId', '') }}
                    options={TXN_TYPES}
                />

                <Input
                    label="Nominal"
                    type="number"
                    prefix="Rp"
                    placeholder="0"
                    value={form.amount}
                    onChange={(e) => set('amount', e.target.value)}
                />

                <Input
                    label="Deskripsi"
                    type="text"
                    placeholder="Isi deskripsi transaksi..."
                    value={form.description}
                    onChange={(e) => set('description', e.target.value)}
                />

                {needsCategory && (
                    <Select
                        label="Kategori"
                        value={form.categoryId}
                        onChange={(e) => set('categoryId', e.target.value)}
                        options={catOptions}
                    />
                )}

                <Input
                    label="Tanggal"
                    type="date"
                    value={form.date}
                    onChange={(e) => set('date', e.target.value)}
                />

                <Textarea
                    label="Catatan (opsional)"
                    placeholder="Tambah catatan..."
                    rows={2}
                    value={form.notes}
                    onChange={(e) => set('notes', e.target.value)}
                />

                <div className="flex gap-2 pt-1">
                    <Button variant="secondary" className="flex-1" onClick={onClose}>Batal</Button>
                    <Button variant="primary" className="flex-1" onClick={handleSubmit}>Simpan</Button>
                </div>

            </div>
        </Modal>
    )
}