'use client'
import { useState, FormEvent } from 'react'

export default function AskForm() {
  const [prompt, setPrompt] = useState('')
  const [response, setResponse] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (!prompt.trim()) return

    try {
      setIsLoading(true)
      setError('')
      const res = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: prompt.trim() }),
      })

      const data = await res.json()

      console.log(data)

      if (!res.ok) {
        throw new Error(data.error || `Ошибка сервера: ${res.status}`)
      }

      if (data.error) {
        throw new Error(data.error)
      }

      console.log('Полный ответ от API:', data)

      const content = data.choices?.[0]?.message?.content
      if (!content) {
        console.error('Неожиданный формат ответа:', data)
        throw new Error('Неожиданный формат ответа от сервера')
      }

      setResponse(content)
      setPrompt('')
    } catch (error) {
      console.error('Error:', error)
      setError(error instanceof Error ? error.message : 'Произошла ошибка')
      setResponse('')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          className="text-black w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
          type="text"
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="Задай вопрос..."
          disabled={isLoading}
        />
        <button
          className="w-full bg-red-500 text-white p-2 rounded-lg hover:bg-red-600 disabled:bg-gray-300"
          type="submit"
          disabled={isLoading || !prompt.trim()}>
          {isLoading ? 'Загрузка...' : 'Спросить'}
        </button>
      </form>
      {error && <div className="mt-4 p-4 bg-red-50 text-red-600 rounded-lg">{error}</div>}
      {response && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <p className="text-black whitespace-pre-wrap">{response}</p>
        </div>
      )}
    </div>
  )
}
