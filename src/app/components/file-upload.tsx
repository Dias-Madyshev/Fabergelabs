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
    <section id="upload" className="space-y-8 max-w-4xl mx-auto px-4 md:px-6 lg:px-8">
      <div className="text-center space-y-3">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">Upload Document</h2>
        <p className="text-lg md:text-xl text-gray-600">Supported formats: PDF, DOCX, and TXT</p>
      </div>

      <div
        className={`
        relative rounded-xl overflow-hidden group
        ${isDragActive ? 'bg-blue-50' : 'bg-blue-50/50'} 
        transition-all duration-300
        min-h-[200px] 
        max-h-[250px]
        sm:min-h-[250px]
        md:min-h-[300px]
        lg:min-h-[400px]
        h-screen/2
        [@media(max-height:608px)]:min-h-[180px]
        [@media(max-height:608px)]:max-h-[200px]
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
          <div
            {...getRootProps()}
            className="cursor-pointer text-center space-y-4 [@media(max-height:608px)]:space-y-2 p-4 sm:p-6 md:p-8 lg:p-12">
            <input {...getInputProps()} />

            <div
              className={`
              mx-auto w-12 h-12
              sm:w-14 sm:h-14
              md:w-16 md:h-16 
              lg:w-20 lg:h-20
              [@media(max-height:608px)]:w-10
              [@media(max-height:608px)]:h-10
              ${isDragActive ? 'bg-blue-500' : 'bg-blue-600'} 
              rounded-full flex items-center justify-center 
              shadow-lg transform transition-all duration-300
              ${isDragActive ? 'scale-110' : 'scale-100'}
              group-hover:shadow-blue-200/50
              relative z-10
            `}>
              {isProcessing ? (
                <Loader2 className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 [@media(max-height:608px)]:h-5 [@media(max-height:608px)]:w-5 text-white animate-spin" />
              ) : uploadedFile ? (
                <CheckCircle className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 [@media(max-height:608px)]:h-5 [@media(max-height:608px)]:w-5 text-white" />
              ) : (
                <Upload className="h-6 w-6 sm:h-8 sm:w-8 md:h-10 md:w-10 lg:h-12 lg:w-12 [@media(max-height:608px)]:h-5 [@media(max-height:608px)]:w-5 text-white" />
              )}
            </div>

            {uploadedFile ? (
              <div className="space-y-2 [@media(max-height:608px)]:space-y-1 relative z-10">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <File className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 [@media(max-height:608px)]:h-3 [@media(max-height:608px)]:w-3" />
                  <span className="text-sm sm:text-base md:text-lg [@media(max-height:608px)]:text-xs font-medium">
                    {uploadedFile.name}
                  </span>
                </div>
                <p className="text-sm sm:text-base md:text-lg [@media(max-height:608px)]:text-xs text-gray-600">
                  {isProcessing ? 'Processing document...' : 'Document uploaded successfully!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 [@media(max-height:608px)]:space-y-2 py-4 sm:py-6 md:py-8 [@media(max-height:608px)]:py-2 relative z-10">
                <p className="text-lg sm:text-xl md:text-2xl [@media(max-height:608px)]:text-base font-semibold text-gray-700">
                  {isDragActive ? 'Drop file here' : 'Drag and drop file here'}
                </p>
                <div className="flex flex-col items-center space-y-2 [@media(max-height:608px)]:space-y-1">
                  <p className="text-sm sm:text-base md:text-lg [@media(max-height:608px)]:text-xs text-gray-500">
                    or
                  </p>
                  <Button
                    variant="outline"
                    className="text-sm sm:text-base md:text-lg [@media(max-height:608px)]:text-xs px-4 sm:px-6 md:px-8 py-2 sm:py-3 md:py-4 [@media(max-height:608px)]:py-1 [@media(max-height:608px)]:px-3 border-2 border-blue-300 text-blue-700 hover:bg-blue-100 transition-colors duration-300">
                    Select File
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="p-4 md:p-6 bg-red-50 border-2 border-red-200 rounded-lg">
          <p className="text-base md:text-lg text-red-700">{error}</p>
        </div>
      )}

      {response && (
        <div className="prose prose-blue prose-base md:prose-lg max-w-none mt-6 md:mt-8 p-6 md:p-8 bg-white rounded-lg shadow-md border border-gray-200">
          <ReactMarkdown>{response}</ReactMarkdown>
        </div>
      )}
    </section>
  )
}
