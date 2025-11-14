import { useEffect, useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Rocket, Sparkles, Star, Users, RefreshCw, Link as LinkIcon } from 'lucide-react'

function Tag({ label }) {
  return (
    <span className="inline-flex items-center rounded-full bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 mr-1">
      {label}
    </span>
  )
}

function Metric({ icon: Icon, value, label }) {
  return (
    <div className="flex items-center gap-2 text-sm text-gray-600">
      <Icon className="w-4 h-4 text-gray-500" />
      <span className="font-semibold text-gray-800">{value}</span>
      <span className="text-gray-500">{label}</span>
    </div>
  )
}

function ProjectCard({ project, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05, duration: 0.5, ease: 'easeOut' }}
      className="group rounded-xl bg-white/80 backdrop-blur border border-gray-100 shadow-sm hover:shadow-md transition-shadow overflow-hidden"
    >
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-gradient-to-br from-blue-50 to-indigo-50 text-indigo-600">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">{project.title}</h3>
          </div>
          <span className="text-xs px-2 py-1 rounded bg-emerald-50 text-emerald-700 capitalize">
            {project.status}
          </span>
        </div>
        <p className="text-gray-600 text-sm leading-relaxed mb-3">{project.subtitle}</p>
        <p className="text-gray-700 text-sm leading-relaxed mb-4">{project.description}</p>
        <div className="flex flex-wrap mb-4">
          {project.tags?.map((t) => (
            <Tag key={t} label={t} />
          ))}
        </div>
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <div className="flex items-center gap-4">
            <Metric icon={Star} value={project.metrics?.stars ?? '—'} label="rating" />
            <Metric icon={Users} value={project.metrics?.users ?? '—'} label="users" />
          </div>
          <button className="inline-flex items-center gap-2 text-indigo-600 hover:text-indigo-700 text-sm font-medium">
            <LinkIcon className="w-4 h-4" />
            View details
          </button>
        </div>
      </div>
    </motion.div>
  )
}

export default function App() {
  const baseURL = useMemo(() => import.meta.env.VITE_BACKEND_URL || '', [])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [projects, setProjects] = useState([])
  const [hello, setHello] = useState('')

  const fetchShowcase = async () => {
    setLoading(true)
    setError('')
    try {
      const res = await fetch(`${baseURL}/api/showcase/projects`)
      if (!res.ok) throw new Error(`Request failed: ${res.status}`)
      const data = await res.json()
      setProjects(data.projects || [])
    } catch (e) {
      setError(e.message || 'Failed to load')
    } finally {
      setLoading(false)
    }
  }

  const pingHello = async () => {
    try {
      const res = await fetch(`${baseURL}/api/hello`)
      const data = await res.json()
      setHello(data.message)
    } catch (e) {
      setHello('Could not reach backend')
    }
  }

  useEffect(() => {
    fetchShowcase()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-white">
      <header className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[1200px] h-[1200px] rounded-full opacity-30 blur-3xl bg-gradient-to-br from-indigo-200 via-sky-200 to-purple-200" />
        </div>
        <div className="max-w-6xl mx-auto px-6 pt-16 pb-10">
          <div className="flex items-center gap-3 text-indigo-700 mb-4">
            <Rocket className="w-5 h-5" />
            <span className="text-sm font-semibold tracking-wide">Flames.Blue Showcase</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
            A collection of delightful, production‑ready demos
          </h1>
          <p className="mt-4 text-gray-600 max-w-2xl">
            Explore polished experiences that highlight speed, clarity, and thoughtful details. Each example is built end‑to‑end.
          </p>
          <div className="mt-6 flex items-center gap-3">
            <button onClick={fetchShowcase} className="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-semibold shadow">
              <RefreshCw className="w-4 h-4" /> Refresh
            </button>
            <button onClick={pingHello} className="inline-flex items-center gap-2 bg-white hover:bg-gray-50 text-gray-800 px-4 py-2 rounded-lg text-sm font-semibold border border-gray-200 shadow-sm">
              Ping backend
            </button>
            {hello && <span className="text-sm text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-1 rounded">{hello}</span>}
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 pb-20">
        {error && (
          <div className="mb-4 rounded-lg border border-red-200 bg-red-50 p-4 text-red-700 text-sm">
            {error}
          </div>
        )}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="h-48 rounded-xl bg-gradient-to-br from-gray-100 to-gray-50 animate-pulse" />
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="grid"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {projects.map((p, idx) => (
                <ProjectCard key={p.id} project={p} index={idx} />
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-6 text-sm text-gray-500">
          Built with care, tuned for flow.
        </div>
      </footer>
    </div>
  )
}
