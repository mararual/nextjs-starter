'use client'

import { useState } from 'react'

type ContactFormData = {
  readonly name: string
  readonly email: string
  readonly message: string
}

export function ContactForm() {
  const [formData, setFormData] = useState<ContactFormData>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.currentTarget
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      return 'Name is required'
    }
    if (!formData.email.includes('@')) {
      return 'Valid email is required'
    }
    if (formData.message.length < 10) {
      return 'Message must be at least 10 characters'
    }
    return null
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const error = validateForm()
    if (error) {
      setStatus('error')
      setMessage(error)
      return
    }

    setStatus('loading')
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      setStatus('success')
      setMessage('Message sent! We will respond within 1 business day.')
      setFormData({ name: '', email: '', message: '' })
    } catch {
      setStatus('error')
      setMessage('Failed to send message. Please try again.')
    }
  }

  return (
    <section id="contact" className="py-20 sm:py-32 bg-gray-50">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <div className="mx-auto max-w-2xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Get in touch</h2>
            <p className="mt-4 text-lg leading-8 text-gray-600">
              Have questions? Our team is here to help.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6" data-testid="contact-form">
            <div>
              <label htmlFor="contact-name" className="block text-sm font-semibold text-gray-900 mb-2">
                Full Name
              </label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="contact-email" className="block text-sm font-semibold text-gray-900 mb-2">
                Email Address
              </label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="john@example.com"
              />
            </div>

            <div>
              <label htmlFor="contact-message" className="block text-sm font-semibold text-gray-900 mb-2">
                Message
              </label>
              <textarea
                id="contact-message"
                name="message"
                value={formData.message}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-600"
                placeholder="Tell us how we can help..."
              />
            </div>

            <button
              type="submit"
              disabled={status === 'loading'}
              className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-500 transition-colors disabled:opacity-50"
            >
              {status === 'loading' ? 'Sending...' : 'Send Message'}
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
