'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'
import ReactMarkdown from 'react-markdown'

interface FileUploadProps {
  onFileUpload: (file: File) => void
  isProcessing: boolean
}

export function FileUpload({ onFileUpload, isProcessing }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [response, setResponse] = useState('')
  const [error, setError] = useState<string | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      console.log('Starting file upload:', {
        name: file.name,
        type: file.type,
        size: file.size,
      })

      setUploadedFile(file)
      setError(null)
      onFileUpload(file)

      const formData = new FormData()
      formData.append('file', file)

      try {
        console.log('Sending file to server...')
        const res = await fetch('/api/parse', {
          method: 'POST',
          body: formData,
        })

        const contentType = res.headers.get('content-type')
        console.log('Response content type:', contentType)

        let data
        const text = await res.text()
        console.log('Response text:', text)

        try {
          data = JSON.parse(text)
        } catch (e) {
          console.error('JSON parsing error:', e)
          throw new Error('Server returned invalid data format')
        }

        if (!res.ok) {
          throw new Error(data.details || data.error || 'Error processing file')
        }

        setResponse(data.result || 'No response')
      } catch (error) {
        console.error('File upload error:', error)
        setError(
          error instanceof Error ? error.message : 'An error occurred while processing the file',
        )
        setResponse('')
      }
    },
    [onFileUpload],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/plain': ['.txt'],
      'application/pdf': ['.pdf'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc', '.docx'],
      'application/vnd.ms-word': ['.doc', '.docx'],
    },
    multiple: false,
  })

  return (
    <section id="upload" className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center space-y-3">
        <h2 className="text-4xl font-bold text-gray-900">Upload Document</h2>
        <p className="text-xl text-gray-600">Supported formats: PDF, DOCX, and TXT</p>
      </div>

      <div
        className={`
        relative rounded-xl overflow-hidden group
        ${isDragActive ? 'bg-blue-50' : 'bg-blue-50/50'} 
        transition-all duration-300
      `}>
        <div className="absolute inset-0">
          <div
            className={`
            absolute inset-[3px] 
            border-[3px] border-dashed rounded-lg
            ${isDragActive ? 'border-blue-400' : 'border-blue-200'}
            group-hover:border-blue-300
            transition-colors duration-300
          `}
          />
        </div>

        <div className="relative">
          <div {...getRootProps()} className="cursor-pointer text-center space-y-6 p-12">
            <input {...getInputProps()} />

            <div
              className={`
              mx-auto w-24 h-24 
              ${isDragActive ? 'bg-blue-500' : 'bg-blue-600'} 
              rounded-full flex items-center justify-center 
              shadow-lg transform transition-all duration-300
              ${isDragActive ? 'scale-110' : 'scale-100'}
              group-hover:shadow-blue-200/50
              relative z-10
            `}>
              {isProcessing ? (
                <Loader2 className="h-12 w-12 text-white animate-spin" />
              ) : uploadedFile ? (
                <CheckCircle className="h-12 w-12 text-white" />
              ) : (
                <Upload className="h-12 w-12 text-white" />
              )}
            </div>

            {uploadedFile ? (
              <div className="space-y-4 relative z-10">
                <div className="flex items-center justify-center space-x-3 text-green-700">
                  <File className="h-6 w-6" />
                  <span className="text-lg font-medium">{uploadedFile.name}</span>
                </div>
                <p className="text-lg text-gray-600">
                  {isProcessing ? 'Processing document...' : 'Document uploaded successfully!'}
                </p>
              </div>
            ) : (
              <div className="space-y-4 py-8 relative z-10">
                <p className="text-2xl font-semibold text-gray-700">
                  {isDragActive ? 'Drop file here' : 'Drag and drop file here'}
                </p>
                <div className="flex flex-col items-center space-y-4">
                  <p className="text-lg text-gray-500">or</p>
                  <Button
                    variant="outline"
                    className="text-lg px-8 py-4 border-2 border-blue-300 text-blue-700 hover:bg-blue-100 transition-colors duration-300">
                    Select File
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-6 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-lg text-red-700">{error}</p>
        </div>
      )}

      {response && (
        <div className="prose prose-blue prose-lg max-w-none mt-8 p-8 bg-white rounded-lg shadow-md border border-gray-200">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </section>
  )
}
