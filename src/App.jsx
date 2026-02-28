import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import Dashboard from './pages/Dashboard'
import Aktivitas from './pages/Aktivitas'
import Anggaran from './pages/Anggaran'

// Halaman sementara
const Placeholder = ({ title }) => (
  <div className="p-8">
    <h1 className="text-2xl font-bold text-white">{title}</h1>
    <p className="text-white/40 mt-1">Halaman ini belum dibuat.</p>
  </div>
)

export default function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/aktivitas" element={<Aktivitas />} />
          <Route path="/anggaran" element={<Anggaran />} />
          <Route path="/plans" element={<Placeholder title="Plans" />} />
          <Route path="/archives" element={<Placeholder title="Archives" />} />
          <Route path="/reserve" element={<Placeholder title="Reserve" />} />
          <Route path="/laporan" element={<Placeholder title="Laporan" />} />
        </Routes>
      </Layout>
    </BrowserRouter>
  )
}