"use client"

import Image from "next/image"

export function WelcomeScreen() {
  return (
    <div className="flex-1 h-full w-full flex flex-col items-center justify-center p-4 sm:p-6 text-center my-auto">
      <div className="max-w-xl mx-auto space-y-4 sm:space-y-6 flex flex-col items-center justify-center">
        {/* Logo */}
        <div className="flex justify-center mb-1 sm:mb-2">
          <Image 
            src="/UMJ.webp" 
            alt="Logo" 
            width={64} 
            height={64} 
            className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl sm:rounded-2xl shadow-xl border border-white/10" 
          />
        </div>

        {/* Title & Description */}
        <div className="space-y-2 sm:space-y-3">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-balance">
            Smartchat AI Assistant
          </h1>
          <p className="text-muted-foreground text-sm sm:text-base md:text-lg max-w-md mx-auto leading-relaxed">
            Mulai percakapan dengan AI untuk bantuan, saran, dan pertanyaan
          </p>
        </div>
      </div>
    </div>
  )
}
