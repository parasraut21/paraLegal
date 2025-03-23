"use client"

import { useState, useEffect, useCallback } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

type CarouselProps = {
  images: {
    src: string
    alt: string
  }[]
  autoSlideInterval?: number
}

export default function CarouselBanner({
  images = [
    { src: "/1.webp", alt: "Legal services banner" },
    { src: "/2.webp", alt: "Legal advice banner" },
    { src: "/3.webp", alt: "Legal resources banner" },
  ],
  autoSlideInterval = 5000,
}: CarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  const prev = useCallback(() => {
    setCurrentIndex((currentIndex) => (currentIndex === 0 ? images.length - 1 : currentIndex - 1))
  }, [images.length])

  const next = useCallback(() => {
    setCurrentIndex((currentIndex) => (currentIndex === images.length - 1 ? 0 : currentIndex + 1))
  }, [images.length])

  useEffect(() => {
    const slideInterval = setInterval(next, autoSlideInterval)
    return () => clearInterval(slideInterval)
  }, [next, autoSlideInterval])

  return (
    <div className="relative w-full h-[400px] md:h-[500px] overflow-hidden">
      {/* Carousel images */}
      <div className="relative h-full w-full">
        {images.map((image, index) => (
          <div
            key={index}
            className={cn(
              "absolute inset-0 w-full h-full transition-opacity duration-1000",
              index === currentIndex ? "opacity-100" : "opacity-0",
            )}
          >
            <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050508] z-10" aria-hidden="true" />
            <img src={image.src || "/placeholder.svg"} alt={image.alt} className="w-full h-full object-cover" />
            <div className="absolute inset-0 flex items-center justify-center z-20">
              <div className="text-center px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                  Legal <span className="text-primary">Knowledge</span> For Everyone
                </h2>
                <p className="text-xl text-white/90 max-w-3xl mx-auto drop-shadow-md">
                  Understand your rights and get guidance on legal matters
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Navigation buttons */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-30"
        aria-label="Previous slide"
      >
        <ChevronLeft className="h-6 w-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/30 hover:bg-black/50 text-white p-2 rounded-full z-30"
        aria-label="Next slide"
      >
        <ChevronRight className="h-6 w-6" />
      </button>

      {/* Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2 z-30">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={cn(
              "w-2 h-2 rounded-full transition-all",
              index === currentIndex ? "bg-primary w-6" : "bg-white/50 hover:bg-white/80",
            )}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}

