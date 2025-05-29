import { FileText, Upload, MessageCircle } from 'lucide-react'

export function Header() {
  return (
    <header className="bg-white shadow-lg border-b border-blue-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600 p-2 rounded-xl shadow-md">
              <FileText className="h-8 w-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Faberge Labs</h1>
              <p className="text-sm text-blue-600 font-medium">Intelligent Document Analysis</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#upload"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
              <Upload className="h-4 w-4" />
              <span className="font-medium">Upload</span>
            </a>
            <a
              href="#reports"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Reports</span>
            </a>
            <a
              href="#help"
              className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span className="font-medium">Help</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
