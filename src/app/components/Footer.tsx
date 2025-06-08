import React from 'react'

export const Footer = () => {
  return (
    <section className="bg-gradient-to-r from-purple-600 to-indigo-600 py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <h2 className="text-3xl font-bold text-white sm:text-4xl lg:text-5xl mb-6">
          Ready to Transform the Future of Genetics?
        </h2>

        <p className="text-xl text-purple-100 mb-10 max-w-2xl mx-auto">
          Join the revolution in genetic research. Start using our cutting-edge technologies today.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-white text-purple-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors">
            Start Free Trial
          </button>
          <button className="border-2 border-white text-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-purple-600 transition-colors">
            Contact Us
          </button>
        </div>

        <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-3xl font-bold text-white">1000+</div>
            <div className="text-purple-100">Research Projects</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">50+</div>
            <div className="text-purple-100">Laboratories</div>
          </div>
          <div>
            <div className="text-3xl font-bold text-white">99.9%</div>
            <div className="text-purple-100">Accuracy</div>
          </div>
        </div>
      </div>
    </section>
  )
}
