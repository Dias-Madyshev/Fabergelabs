import React from 'react'
import { ChevronRight } from 'lucide-react'

const ZigzagFeature = ({
  feature,
  isReversed,
  index,
}: {
  feature: any
  isReversed: boolean
  index: number
}) => {
  const [isvisible, setisVisible] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setisVisible(true)
        }
      },
      { threshold: 0.1 },
    )
    if (ref.current) {
      observer.observe(ref.current)
    }

    return () => {
      if (ref.current) {
        observer.disconnect()
      }
    }
  }, [])
  return (
    <div
      ref={ref}
      className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center transition-all duration-1000 ${
        isvisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'
      }`}>
      <div className={`${isReversed ? 'lg:order-2' : 'lg:order-1'} space-y-6`}>
        <div className="flex items-center space-x-3">
          {feature.icon}
          <span className="text-sm font-semibold text-gray-500 uppercase tracking-wide">
            Technology {index + 1}
          </span>
        </div>

        <h3 className="text-3xl font-bold text-gray-900 lg:text-4xl">{feature.title}</h3>

        <p className="text-lg text-gray-600 leading-relaxed">{feature.description}</p>

        <div className="grid grid-cols-3 gap-4">
          {feature.stats.map((stat: string, statIndex: number) => (
            <div key={statIndex} className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-sm font-semibold text-gray-900">{stat}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Image */}
      <div className={`${isReversed ? 'lg:order-1' : 'lg:order-2'} relative`}>
        <div className="relative overflow-hidden rounded-2xl shadow-2xl">
          <img
            src={feature.image || '/placeholder.svg'}
            alt={feature.title}
            className="w-full h-80 object-cover transition-transform duration-700 hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        </div>

        {/* Floating elements for visual interest */}
        <div className="absolute -top-4 -right-4 w-20 h-20 bg-blue-100 rounded-full opacity-60"></div>
        <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-green-100 rounded-full opacity-60"></div>
      </div>
    </div>
  )
}
export default ZigzagFeature
