'use client'

import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Upload, File, CheckCircle, Loader2 } from 'lucide-react'
import { Button } from './ui/button'
import { Card, CardContent } from './ui/card'

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

      setUploadedFile(file)
      setError(null)
      onFileUpload(file)

      const formData = new FormData()
      formData.append('file', file)

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        })

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({ error: 'Ошибка сервера' }))
          throw new Error(errorData.details || errorData.error || 'Ошибка при обработке файла')
        }

        const data = await res.json()
        setResponse(data.message || 'Нет ответа')
      } catch (error) {
        console.error('Error:', error)
        setError(error instanceof Error ? error.message : 'Произошла ошибка при обработке файла')
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
    },
    multiple: false,
  })

  return (
    <section id="upload" className="space-y-6">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold text-gray-900">Загрузите документ</h2>
        <p className="text-lg text-gray-600">Поддерживаются форматы PDF, DOCX и TXT</p>
      </div>

      <Card className="border-2 border-dashed border-blue-200 bg-blue-50/50 hover:bg-blue-50 transition-colors">
        <CardContent className="p-8">
          <div
            {...getRootProps()}
            className={`cursor-pointer text-center space-y-4 ${
              isDragActive ? 'scale-105' : ''
            } transition-transform duration-200`}>
            <input {...getInputProps()} />

            <div className="mx-auto w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg">
              {isProcessing ? (
                <Loader2 className="h-8 w-8 text-white animate-spin" />
              ) : uploadedFile ? (
                <CheckCircle className="h-8 w-8 text-white" />
              ) : (
                <Upload className="h-8 w-8 text-white" />
              )}
            </div>

            {uploadedFile ? (
              <div className="space-y-2">
                <div className="flex items-center justify-center space-x-2 text-green-700">
                  <File className="h-5 w-5" />
                  <span className="font-medium">{uploadedFile.name}</span>
                </div>
                <p className="text-sm text-gray-600">
                  {isProcessing ? 'Обработка документа...' : 'Документ загружен успешно!'}
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xl font-semibold text-gray-700">
                  {isDragActive ? 'Отпустите файл здесь' : 'Перетащите файл сюда'}
                </p>
                <p className="text-gray-500">или нажмите для выбора</p>
              </div>
            )}

            {!uploadedFile && (
              <Button variant="outline" className="border-blue-300 text-blue-700 hover:bg-blue-100">
                Выбрать файл
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">{error}</div>
      )}

      {response && (
        <div className="whitespace-pre-wrap mt-4 p-6 bg-blue-50 text-blue-900 rounded-lg shadow-sm border border-blue-200">
          {response}
        </div>
      )}
    </section>
  )
}
