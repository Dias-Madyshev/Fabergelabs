'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from './ui/button'

interface FileUploadProps {
  onFileUpload: (file: File) => void
  isProcessing: boolean
}

export function FileUpload({ onFileUpload, isProcessing }: FileUploadProps) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const file = acceptedFiles[0]
      if (!file) return

      setUploadedFile(file)
      onFileUpload(file)
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
    disabled: isProcessing,
  })

  return (
    <div className="relative space-y-8 pt-8">
      <div className="relative text-center space-y-3 p-8 rounded-2xl bg-white/80 backdrop-blur-sm shadow-xl border border-indigo-50">
        <div className="relative z-10">
          <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            Genetic Document Analysis
          </h2>
          <p className="text-lg md:text-xl text-gray-600">
            Upload your documents for advanced analysis
          </p>
        </div>
      </div>

      <div
        className={`
        relative rounded-2xl overflow-hidden group
        ${isDragActive ? 'bg-white/90' : 'bg-white/80'} 
        ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}
        transition-all duration-300
        min-h-[200px] 
        max-h-[250px]
        sm:min-h-[250px]
        md:min-h-[300px]
        lg:min-h-[400px]
        h-screen/2
        [@media(max-height:608px)]:min-h-[180px]
        [@media(max-height:608px)]:max-h-[200px]
        shadow-xl
        backdrop-blur-sm
        border border-indigo-50
      `}>
        <div className="absolute inset-0">
          <div
            className={`
            absolute inset-[3px] 
            border-[3px] border-dashed rounded-xl
            ${isDragActive ? 'border-indigo-400' : 'border-indigo-200'}
            group-hover:border-indigo-300
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
              mx-auto w-16 h-16
              sm:w-20 sm:h-20
              md:w-24 md:h-24 
              lg:w-28 lg:h-28
              [@media(max-height:608px)]:w-14
              [@media(max-height:608px)]:h-14
              ${isDragActive ? 'bg-indigo-500' : 'bg-gradient-to-r from-indigo-600 to-purple-600'} 
              rounded-2xl flex items-center justify-center 
              shadow-lg transform transition-all duration-300
              ${isDragActive ? 'scale-110' : 'scale-100'}
              group-hover:shadow-indigo-200/50
              relative z-10
            `}>
              {isProcessing ? (
                <Loader2 className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 [@media(max-height:608px)]:h-6 [@media(max-height:608px)]:w-6 text-white animate-spin" />
              ) : uploadedFile ? (
                <CheckCircle className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 [@media(max-height:608px)]:h-6 [@media(max-height:608px)]:w-6 text-white" />
              ) : (
                <Upload className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 lg:h-14 lg:w-14 [@media(max-height:608px)]:h-6 [@media(max-height:608px)]:w-6 text-white" />
              )}
            </div>

            {uploadedFile ? (
              <div className="space-y-2 [@media(max-height:608px)]:space-y-1 relative z-10">
                <div className="flex items-center justify-center space-x-2 text-indigo-700">
                  <File className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 [@media(max-height:608px)]:h-3 [@media(max-height:608px)]:w-3" />
                  <span className="text-sm sm:text-base md:text-lg [@media(max-height:608px)]:text-xs font-medium">
                    {uploadedFile.name}
                  </span>
                </div>
                <p className="text-sm sm:text-base md:text-lg [@media(max-height:608px)]:text-xs text-gray-600">
                  {isProcessing ? 'Analyzing document...' : 'Document uploaded successfully!'}
                </p>
              </div>
            ) : (
              <div className="space-y-3 [@media(max-height:608px)]:space-y-2 py-4 sm:py-6 md:py-8 [@media(max-height:608px)]:py-2 relative z-10">
                <p className="text-lg sm:text-xl md:text-2xl [@media(max-height:608px)]:text-base font-semibold text-indigo-700">
                  {isDragActive ? 'Release to analyze' : 'Drag and drop document here'}
                </p>
                <div className="flex flex-col items-center space-y-2 [@media(max-height:608px)]:space-y-1">
                  <p className="text-sm sm:text-base md:text-lg [@media(max-height:608px)]:text-xs text-gray-500">
                    or
                  </p>
                  <Button
                    variant="outline"
                    disabled={isProcessing}
                    className="text-sm sm:text-base md:text-lg [@media(max-height:608px)]:text-xs px-6 py-3 border-2 border-indigo-300 text-indigo-700 hover:bg-indigo-50 transition-colors duration-300 rounded-xl">
                    Select Document
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
