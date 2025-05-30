'use client'

import { useState } from 'react'

import { Header } from './components/header'
import { FileUpload } from './components/file-upload'

export default function HomePage() {
  const [isProcessing, setIsProcessing] = useState(false)

  const handleFileUpload = async () => {
    setIsProcessing(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-12">
          <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />
        </div>
      </main>
    </div>
  )
}
