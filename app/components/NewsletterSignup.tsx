'use client'

import { useState } from 'react'

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!email.includes('@')) {
      setStatus('error')
      setMessage('Please enter a valid email address')
      return
    }

    setStatus('loading')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))
      setStatus('success')
      setMessage('Thanks for subscribing! Check your email to confirm your subscription.')
      setEmail('')
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <section className="bg-gradient-to-r from-indigo-600 to-indigo-700 py-12">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-md">
          <h3 className="text-2xl font-bold text-white mb-4">Stay updated</h3>
          <p className="text-indigo-100 mb-6">Get the latest features and updates delivered to your inbox.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                required
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-white text-indigo-600 font-semibold py-3 rounded-lg hover:bg-gray-100 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
            </button>

            {(status === 'success' || status === 'error') && (
              <div
                role="alert"
                className={`p-4 rounded-lg text-sm ${
                  status === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {message}
              </div>
            )}
          </form>
        </div>
      </div>
    </section>
  )
}
