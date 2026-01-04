"use client"

import { useState } from "react"
import Image from "next/image"
import { motion } from "framer-motion"
import { Play, X } from "lucide-react"

interface MediaItem {
  id: number
  src: string
  alt: string
  description: string
  type: "image" | "video"
}

interface MediaGalleryProps {
  items: MediaItem[]
}

export function MediaGallery({ items }: MediaGalleryProps) {
  const [selectedMedia, setSelectedMedia] = useState<MediaItem | null>(null)

  return (
    <>
      <div className="container mx-auto px-4 py-12 md:py-24">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 md:mb-16">
          Le Nostre Specialità
        </h2>
        
        <div className="space-y-16 md:space-y-24">
          {items.map((item, index) => {
            const isEven = index % 2 === 0
            
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} items-center gap-8 md:gap-12`}
              >
                {/* Media Container */}
                <div 
                  onClick={() => setSelectedMedia(item)}
                  className="relative w-full md:w-1/2 aspect-[4/3] rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  {item.type === "image" ? (
                    <Image
                      src={item.src}
                      alt={item.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  ) : (
                    <div className="relative w-full h-full bg-black">
                      <video
                        src={item.src}
                        className="w-full h-full object-cover"
                        controls
                        playsInline
                        preload="metadata"
                      />
                    </div>
                  )}
                  
                  {/* Overlay gradient */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  
                  {/* Play button for videos */}
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                      <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-white/90 backdrop-blur-sm flex items-center justify-center shadow-lg">
                        <Play className="w-8 h-8 md:w-10 md:h-10 text-primary ml-1" fill="currentColor" />
                      </div>
                    </div>
                  )}
                  
                  {/* Click to expand indicator */}
                  <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-sm text-white text-xs px-3 py-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    Clicca per ingrandire
                  </div>
                </div>

                {/* Description Container */}
                <div className="w-full md:w-1/2 flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, delay: index * 0.1 + 0.2 }}
                    className="space-y-4"
                  >
                    <h3 className="text-2xl md:text-3xl font-bold">{item.alt}</h3>
                    <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>

      {/* Fullscreen Modal */}
      {selectedMedia && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          onClick={() => setSelectedMedia(null)}
        >
          <button
            onClick={(e) => {
              e.stopPropagation()
              setSelectedMedia(null)
            }}
            className="absolute top-4 right-4 z-60 text-white hover:text-gray-300 transition-colors p-2"
            aria-label="Chiudi"
          >
            <X className="w-8 h-8" />
          </button>
          
          <div 
            className="relative max-w-7xl w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {selectedMedia.type === "image" ? (
              <Image
                src={selectedMedia.src}
                alt={selectedMedia.alt}
                fill
                className="object-contain"
                sizes="100vw"
              />
            ) : (
              <video
                src={selectedMedia.src}
                className="max-w-full max-h-full"
                controls
                autoPlay
                playsInline
              />
            )}
          </div>
          
          {/* Description in modal */}
          <div 
            className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-black/80 backdrop-blur-sm text-white px-6 py-4 rounded-lg max-w-2xl text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="text-xl font-bold mb-2">{selectedMedia.alt}</h3>
            <p className="text-sm text-gray-300">{selectedMedia.description}</p>
          </div>
        </motion.div>
      )}
    </>
  )
}

