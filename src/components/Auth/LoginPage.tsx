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
    <div className="min-h-screen flex items-center justify-center bg-neutral-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded-xl border border-neutral-300 bg-white p-8 shadow-sm"
      >
        <h1 className="text-xl font-semibold text-neutral-900 mb-1">Amazon Order Management</h1>
        <p className="text-sm text-neutral-500 mb-6">Đăng nhập để tiếp tục</p>

        <label className="block text-sm text-neutral-700 mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          autoComplete="username"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-blue-500"
        />

        <label className="block text-sm text-neutral-700 mb-1" htmlFor="password">
          Mật khẩu
        </label>
        <input
          id="password"
          type="password"
          required
          autoComplete="current-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 rounded-md border border-neutral-300 bg-white px-3 py-2 text-neutral-900 outline-none focus:border-blue-500"
        />

        {error && (
          <p className="mb-4 text-sm text-red-700 bg-red-50 border border-red-300 rounded-md px-3 py-2">
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

        <p className="mt-4 text-xs text-neutral-400">
          Chưa có tài khoản? Liên hệ admin để được tạo trong Supabase Dashboard.
        </p>
      </form>
    </div>
  )
}
