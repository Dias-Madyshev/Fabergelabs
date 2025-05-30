import { CheckCheck, AlertCircle, Loader2, Clock, File } from 'lucide-react'
import ReactMarkdown from 'react-markdown'

interface AnalysisResultProps {
  response: string
  status: string
  error: string | null
  processingTime: number | null
  uploadedFile: File | null
}

export function AnalysisResult({
  response,
  status,
  error,
  processingTime,
  uploadedFile,
}: AnalysisResultProps) {
  if (!response && !error) return null

  return (
    <div className="max-w-4xl mx-auto bg-white/95 shadow-lg rounded-xl border border-gray-100">
      <div className="divide-y divide-gray-100">
        {/* Статус и информация */}
        <div className="p-4 sm:p-5 space-y-3">
          {/* Статус */}
          <div className="flex items-center gap-2">
            {status === 'Processing completed successfully!' ? (
              <CheckCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
            ) : status.includes('Error') ? (
              <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0" />
            ) : (
              <Loader2 className="w-4 h-4 text-indigo-500 animate-spin flex-shrink-0" />
            )}
            <span
              className={`text-xs sm:text-sm font-medium ${
                status === 'Processing completed successfully!'
                  ? 'text-green-700'
                  : status.includes('Error')
                  ? 'text-red-700'
                  : 'text-indigo-700'
              }`}>
              {status}
            </span>
          </div>

          {/* Мета-информация */}
          <div className="flex flex-wrap gap-4 text-xs sm:text-sm text-gray-600">
            {processingTime && (
              <div className="flex items-center gap-2">
                <Clock className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-medium">Analysis Time:</span>
                <span className="font-mono bg-gray-50 px-1.5 py-0.5 rounded">
                  {(processingTime / 1000).toFixed(2)}s
                </span>
              </div>
            )}

            {uploadedFile && (
              <div className="flex items-center gap-2">
                <File className="w-3.5 h-3.5 flex-shrink-0" />
                <span className="font-medium">Document:</span>
                <span className="truncate max-w-[200px]">{uploadedFile.name}</span>
                <span className="text-gray-400">({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
              </div>
            )}
          </div>
        </div>

        {/* Ошибка */}
        {error && (
          <div className="p-4 sm:p-5 bg-red-50">
            <p className="text-xs sm:text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Результат */}
        {response && (
          <div className="p-4 sm:p-5">
            <div className="prose prose-sm sm:prose-base max-w-none">
              <ReactMarkdown
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-lg sm:text-xl font-bold mb-4">{children}</h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-base sm:text-lg font-semibold mb-3">{children}</h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-sm sm:text-base font-medium mb-2">{children}</h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-sm sm:text-base text-gray-700 mb-4 leading-relaxed">
                      {children}
                    </p>
                  ),
                  ul: ({ children }) => (
                    <ul className="text-sm sm:text-base text-gray-700 mb-4 list-disc pl-4">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="text-sm sm:text-base text-gray-700 mb-4 list-decimal pl-4">
                      {children}
                    </ol>
                  ),
                  li: ({ children }) => (
                    <li className="text-sm sm:text-base text-gray-700 mb-1">{children}</li>
                  ),
                }}>
                {response}
              </ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
