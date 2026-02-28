import { useState } from 'react'
import { Plus, Calendar, Play, Pencil, Archive } from 'lucide-react'
import useFinanceStore from '../store/useFinanceStore'
import { formatDate, formatCurrency, STATUS_CONFIG, calcBatchStats } from '../lib/utils'
import {
  Card, Button, Input, Modal, Textarea,
  Alert, Badge, EmptyState
} from '../components/ui/index'
import TransactionForm from '../components/TransactionForm'
import TransactionItem from '../components/TransactionItem'

function BatchCard({ batch, stats, hasActiveBatch, onActivate, onArchive, onEdit }) {
  const cfg     = STATUS_CONFIG[batch.status]
  const income  = stats?.totalIncome  || 0
  const expense = stats?.totalExpense || 0

  return (
    <Card>
      <div className="p-4 border-b border-white/6">
        <div className="flex items-start justify-between gap-3">

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge color={cfg?.color} bg={cfg?.bg}>{cfg?.label}</Badge>
            </div>
            <h3 className="font-bold text-base text-white">{batch.name}</h3>
            <p className="text-xs text-white/35 mt-0.5">
              {formatDate(batch.startDate)} – {formatDate(batch.endDate)}
            </p>
            {batch.notes && (
              <p className="text-xs text-white/40 mt-1">{batch.notes}</p>
            )}
          </div>

          {/* Actions */}
          <div className="flex gap-1.5 flex-shrink-0">
            <button
              onClick={() => onEdit(batch)}
              className="p-1.5 rounded-lg hover:bg-white/8 text-white/30 hover:text-white/70 transition-all"
            >
              <Pencil size={13} />
            </button>

            {batch.status === 'planned' && !hasActiveBatch && (
              <button
                onClick={() => onActivate(batch.id)}
                className="p-1.5 rounded-lg bg-emerald-500/12 hover:bg-emerald-500/22 text-emerald-400 transition-all"
                title="Aktifkan batch"
              >
                <Play size={13} />
              </button>
            )}

            {batch.status === 'active' && (
              <button
                onClick={() => onArchive(batch.id)}
                className="p-1.5 rounded-lg bg-white/6 hover:bg-white/12 text-white/40 hover:text-white/70 transition-all"
                title="Archive batch"
              >
                <Archive size={13} />
              </button>
            )}
          </div>

        </div>
      </div>

      {/* Stats */}
      <div className="px-4 py-3 flex items-center gap-4">
        <div>
          <p className="text-xs text-white/30 font-semibold mb-0.5">Pemasukan</p>
          <p className="font-medium text-sm text-emerald-400">{formatCurrency(income, true)}</p>
        </div>
        <div className="h-8 w-px bg-white/8" />
        <div>
          <p className="text-xs text-white/30 font-semibold mb-0.5">Pengeluaran</p>
          <p className="font-medium text-sm text-rose-400">{formatCurrency(expense, true)}</p>
        </div>
        <div className="h-8 w-px bg-white/8" />
        <div>
          <p className="text-xs text-white/30 font-semibold mb-0.5">Budget</p>
          <p className="font-medium text-sm text-white/60">
            {batch.budgets?.length || 0} kategori
          </p>
        </div>
      </div>
    </Card>
  )
}

export default function Plans() {
  const { batches, transactions, addBatch, updateBatch, activateBatch, archiveBatch } = useFinanceStore()

  const [modalOpen, setModalOpen]     = useState(false)
  const [txnOpen, setTxnOpen]         = useState(false)
  const [editing, setEditing]         = useState(null)
  const [selectedBatch, setSelectedBatch] = useState(null)
  const [activateError, setActivateError] = useState('')
  const [form, setForm] = useState({ name: '', startDate: '', endDate: '', notes: '' })

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const activeBatch    = batches.find((b) => b.status === 'active')
  const plannedBatches = batches.filter((b) => b.status === 'planned')
  const visibleBatches = batches.filter((b) => b.status !== 'archived')

  // Batch yang dipilih untuk lihat transaksinya
  const focusBatch = selectedBatch || activeBatch || plannedBatches[0]
  const focusStats = focusBatch ? calcBatchStats(transactions, focusBatch.id) : null

  const openNew = () => {
    setEditing(null)
    setForm({ name: '', startDate: '', endDate: '', notes: '' })
    setModalOpen(true)
  }

  const openEdit = (batch) => {
    setEditing(batch)
    setForm({
      name: batch.name,
      startDate: batch.startDate,
      endDate: batch.endDate,
      notes: batch.notes || '',
    })
    setModalOpen(true)
  }

  const handleSave = () => {
    if (!form.name || !form.startDate || !form.endDate) return
    if (editing) {
      updateBatch(editing.id, form)
    } else {
      addBatch(form)
    }
    setModalOpen(false)
  }

  const handleActivate = (id) => {
    const result = activateBatch(id)
    if (result?.error) {
      setActivateError(result.error)
      setTimeout(() => setActivateError(''), 4000)
    }
  }

  return (
    <div className="p-5 lg:p-7 max-w-3xl mx-auto space-y-5">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-black text-2xl text-white tracking-tight">Plans</h1>
          <p className="text-sm text-white/40 mt-0.5">
            Kelola batch aktif dan rencana mendatang
          </p>
        </div>
        <Button icon={Plus} onClick={openNew}>Batch Baru</Button>
      </div>

      {activateError && <Alert type="error">{activateError}</Alert>}

      {/* Batch List */}
      {visibleBatches.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Belum ada batch"
          description="Buat batch untuk mulai mencatat keuangan."
          action={<Button icon={Plus} size="sm" onClick={openNew}>Buat Batch</Button>}
        />
      ) : (
        <div className="space-y-3">
          {visibleBatches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              stats={calcBatchStats(transactions, batch.id)}
              hasActiveBatch={!!activeBatch}
              onActivate={handleActivate}
              onArchive={archiveBatch}
              onEdit={openEdit}
            />
          ))}
        </div>
      )}

      {/* Transaksi batch yang dipilih */}
      {focusBatch && focusStats && (
        <Card>
          <div className="px-5 pt-4 pb-3 border-b border-white/6 flex items-center justify-between">
            <div>
              <p className="text-xs text-white/35 font-semibold uppercase tracking-wider">
                Transaksi
              </p>
              <p className="font-bold text-sm text-white mt-0.5">{focusBatch.name}</p>
            </div>
            {focusBatch.status !== 'archived' && (
              <Button
                icon={Plus}
                size="sm"
                variant="secondary"
                onClick={() => { setSelectedBatch(focusBatch); setTxnOpen(true) }}
              >
                Tambah
              </Button>
            )}
          </div>

          {focusStats.txns.length === 0 ? (
            <EmptyState
              icon={Calendar}
              title="Belum ada transaksi"
              description="Tambah transaksi terencana untuk batch ini."
            />
          ) : (
            <div className="p-2">
              {[...focusStats.txns]
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map((t) => (
                  <TransactionItem
                    key={t.id}
                    txn={t}
                    canDelete={focusBatch.status !== 'archived'}
                  />
                ))
              }
            </div>
          )}
        </Card>
      )}

      {/* Modal Batch */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? 'Edit Batch' : 'Batch Baru'}
      >
        <div className="space-y-4">
          <Input
            label="Nama Batch"
            placeholder="cth. Maret 2026"
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
          />
          <div className="grid grid-cols-2 gap-3">
            <Input
              label="Mulai"
              type="date"
              value={form.startDate}
              onChange={(e) => set('startDate', e.target.value)}
            />
            <Input
              label="Selesai"
              type="date"
              value={form.endDate}
              onChange={(e) => set('endDate', e.target.value)}
            />
          </div>
          <Textarea
            label="Catatan (opsional)"
            placeholder="Tulis catatan untuk batch ini..."
            rows={2}
            value={form.notes}
            onChange={(e) => set('notes', e.target.value)}
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

      <TransactionForm
        isOpen={txnOpen}
        onClose={() => setTxnOpen(false)}
        batchId={focusBatch?.id}
      />

    </div>
  )
}