'use client'

import { useState } from 'react'

import { FileUpload } from './components/file-upload'
import { AnalysisResult } from './components/analysis-result'
import GeneticsLanding from '@/app/components/ZigzagSection/GeneticsLanding'
import { Footer } from '@/app/components/Footer'

export default function HomePage() {
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [response, setResponse] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [status, setStatus] = useState<string>('')
  const [processingTime, setProcessingTime] = useState<number | null>(null)

  const handleFileUpload = async (file: File) => {
    const startTime = Date.now()
    setIsProcessing(true)
    setUploadedFile(file)
    setStatus('File received, preparing to upload...')
    setError(null)

    const formData = new FormData()
    formData.append('file', file)

    try {
      setStatus('Uploading file to server...')
      const res = await fetch('/api/parse', {
        method: 'POST',
        body: formData,
      })

      setStatus('Processing file on server...')
      let data
      const text = await res.text()

      try {
        data = JSON.parse(text)
      } catch (e) {
        throw new Error('Server returned invalid data format')
      }

      if (!res.ok) {
        throw new Error(data.details || data.error || 'Error processing file')
      }

      const endTime = Date.now()
      setProcessingTime(endTime - startTime)
      setStatus('Processing completed successfully!')
      setResponse(data.result || 'No response')
    } catch (error) {
      setError(
        error instanceof Error ? error.message : 'An error occurred while processing the file',
      )
      setResponse('')
      setStatus('Error occurred during processing')
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="bg-[url('/images/bg2.jpg')] bg-repeat-y bg-cover bg-center">
        <main className="container mx-auto px-4 py-6">
          <div className="max-w-4xl mx-auto">
            <FileUpload onFileUpload={handleFileUpload} isProcessing={isProcessing} />
          </div>
        </main>
      </div>
      <div className="container mx-auto px-4 sm:px-6 py-6">
        <AnalysisResult
          response={response}
          status={status}
          error={error}
          processingTime={processingTime}
          uploadedFile={uploadedFile}
        />
      </div>
      <GeneticsLanding />
      <Footer />
    </div>
  )
}
