import { FileText, Upload, MessageCircle } from 'lucide-react'
import Image from 'next/image'

export function Header() {
  return (
    <header className="bg-white shadow-lg border-b border-purple-100">
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

          <nav className="hidden md:flex items-center space-x-6">
            <a
              href="#help"
              className="flex items-center space-x-2 px-4 py-2 rounded-lg bg-gradient-to-r from-purple-500 to-indigo-500 text-white hover:from-purple-600 hover:to-indigo-600 transition-all duration-300 shadow-md hover:shadow-lg">
              <MessageCircle className="h-5 w-5" />
              <span className="font-medium">Help</span>
            </a>
          </nav>
        </div>
      </div>
    </header>
  )
}
