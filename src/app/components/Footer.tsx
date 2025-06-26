import React, { useState } from 'react'

export const Footer = () => {
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [opinion, setOpinion] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      const res = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, opinion }),
      })
      if (res.ok) {
        setStatus('success')
        setFirstName('')
        setLastName('')
        setOpinion('')
      } else {
        setStatus('error')
      }
    } catch {
      setStatus('error')
    }
  }

  return (
    <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-6">
          Share your opinion about the platform
        </h2>
        <form onSubmit={handleSubmit} className="bg-white/90 rounded-xl shadow-lg p-8 space-y-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
              required
              className="flex-1 text-black px-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
              required
              className="flex-1 text-black px-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg"
            />
          </div>
          <textarea
            placeholder="What do you think about our platform?"
            value={opinion}
            onChange={e => setOpinion(e.target.value)}
            required
            rows={4}
            className="w-full text-black px-4 py-3 rounded-lg border border-purple-200 focus:outline-none focus:ring-2 focus:ring-purple-400 text-lg resize-none"
          />
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-indigo-700 transition-colors disabled:opacity-60"
            disabled={status === 'loading'}>
            {status === 'loading' ? 'Submitting...' : 'Submit'}
          </button>
          {status === 'success' && (
            <div className="text-green-600 font-medium">Thank you for your feedback!</div>
          )}
          {status === 'error' && (
            <div className="text-red-600 font-medium">Submission error. Please try again.</div>
          )}
        </form>
      </div>
    </section>
  )
}
