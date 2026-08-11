import { useState, type FormEvent } from 'react'
import { useAuth } from '../../hooks/useAuth'

export function LoginPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Đăng nhập thất bại')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-950 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-white/10 bg-neutral-900 p-8 shadow-xl"
      >
        <h1 className="text-xl font-semibold text-white mb-1">Amazon Order Management</h1>
        <p className="text-sm text-white/50 mb-6">Đăng nhập để tiếp tục</p>

        <label className="block text-sm text-white/70 mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 rounded-md border border-white/15 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-blue-500"
        />

        <label className="block text-sm text-white/70 mb-1" htmlFor="password">
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 rounded-md border border-white/15 bg-neutral-800 px-3 py-2 text-white outline-none focus:border-blue-500"
        />

        {error && (
          <p className="mb-4 text-sm text-red-400 bg-red-500/10 border border-red-500/30 rounded-md px-3 py-2">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-medium py-2 transition-colors"
        >
          {submitting ? 'Đang đăng nhập...' : 'Đăng nhập'}
        </button>

        <p className="mt-4 text-xs text-white/40">
          Chưa có tài khoản? Liên hệ admin để được tạo trong Supabase Dashboard.
        </p>
      </form>
    </div>
  )
}
