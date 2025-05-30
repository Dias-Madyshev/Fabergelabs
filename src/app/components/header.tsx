import { FileText, Upload, MessageCircle } from 'lucide-react'
import Image from 'next/image'

export function Header() {
  return (
    <header className="bg-gradient-to-r from-gray-50/90 via-purple-50/80 to-gray-50/90 backdrop-blur-md shadow-lg border-b border-purple-100">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-purple-600 to-indigo-600 p-2 rounded-xl shadow-md flex items-center">
              <Image
                src="/vercel.svg"
                alt="Flask Logo"
                width={32}
                height={32}
                className="h-8 w-8"
                priority
              />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-800">Faberge Labs</h1>
              <p className="text-sm text-purple-600 font-medium">Intelligent Document Analysis</p>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#upload"
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
              <Upload className="h-4 w-4" />
              <span className="font-medium">Upload</span>
            </a>
            <a
              href="#reports"
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
              <FileText className="h-4 w-4" />
              <span className="font-medium">Reports</span>
            </a>
            <a
              href="#help"
              className="flex items-center space-x-2 text-gray-600 hover:text-purple-600 transition-colors">
              <MessageCircle className="h-4 w-4" />
              <span className="font-medium">Help</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
