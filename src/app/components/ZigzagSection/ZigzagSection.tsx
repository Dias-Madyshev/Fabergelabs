import React from 'react'
import { Bot, Dna, Microscope, Cpu, ChevronRight, ArrowRight, Play } from 'lucide-react'
import ZigzagFeature from '@/app/components/ZigzagSection/ZigzagFeature'

const ZigzagSection = () => {
  const features = [
    {
      title: 'Document Analysis & Automation Suggestion',
      description:
        'Our intelligent system analyzes documents, identifies key information, and suggests automation opportunities based on standard operating procedures (SOPs). This reduces manual work and improves operational efficiency.',
      image: '/images/image1.jpg',
      icon: <Dna className="h-8 w-8 text-purple-600" />,
      stats: ['99.9% Accuracy', '1000x Faster', '50+ Markers'],
    },
    {
      title: 'Robotic Laboratories',
      description:
        'Fully automated laboratory processes using robotic manipulators. Eliminates human error and ensures sterility at every research stage.',
      image: '/images/image2.jpg',
      icon: <Bot className="h-8 w-8 text-purple-600" />,
      stats: ['24/7 Operation', '0% Errors', '100% Sterility'],
    },
    {
      title: 'Next-Gen Microscopy',
      description:
        'Ultra-precise visualization of cellular structures with nanometer resolution. Observe genetic processes in real-time.',
      image: '/images/image 3.jpg',
      icon: <Microscope className="h-8 w-8 text-purple-600" />,
      stats: ['1nm Resolution', 'Real-time', '3D Visualization'],
    },
    {
      title: 'Quantum Computing',
      description:
        'We use quantum processors to simulate complex molecular interactions. Predict gene behavior with unmatched precision.',
      image: '/images/image4.jpg',
      icon: <Cpu className="h-8 w-8 text-purple-600" />,
      stats: ['Quantum Speed', 'Molecular Modeling', 'Predictive Analytics'],
    },
  ]
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent sm:text-4xl lg:text-5xl mb-4">
            Future Technologies
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Every component of our platform is designed to revolutionize genetic research
          </p>
        </div>

        <div className="space-y-24">
          {features.map((feature, index) => (
            <ZigzagFeature
              key={index}
              feature={feature}
              isReversed={index % 2 === 1}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  )
}
export default ZigzagSection
