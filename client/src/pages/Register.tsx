import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'

interface RegisterProps {
  setAuth: (value: boolean) => void
}

export default function Register({ setAuth }: RegisterProps) {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const response = await axios.post('/api/auth/register', { name, email, password })
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))
      setAuth(true)
      navigate('/')
    } catch (err: any) {
      setError(err.response?.data?.error || 'Registration failed')
    }
  }

  return (
    <div className="min-h-screen bg-parchment flex items-center justify-center p-4">
      <div className="card max-w-md w-full">
        <h1 className="text-3xl font-header text-midnight-purple mb-2">Get Started</h1>
        <p className="text-gray-600 font-body mb-6">
          Create your account to begin your ACT journey
        </p>

        {error && (
          <div className="bg-white border-2 border-inferno-red text-inferno-red px-4 py-3 rounded-lg mb-4 font-body">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-subheader text-gray-700 mb-2 uppercase">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-subheader text-gray-700 mb-2 uppercase">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-field"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-subheader text-gray-700 mb-2 uppercase">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field"
              minLength={6}
              required
            />
          </div>

          <button type="submit" className="btn-primary w-full">
            Create Account
          </button>
        </form>

        <p className="mt-6 text-center text-gray-600 font-body">
          Already have an account?{' '}
          <Link
            to="/login"
            className="text-electric-blue font-semibold hover:text-electric-blue-600"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  )
}
