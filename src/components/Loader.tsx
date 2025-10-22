"use client"

interface LoaderProps {
  size?: "sm" | "md" | "lg"
 
}

export function Loader({ size = "lg" }: LoaderProps) {
  const sizeClasses = {
    sm: "w-12 h-12",
    md: "w-20 h-20",
    lg: "w-32 h-32",
  }

  const innerSizeClasses = {
    sm: "w-8 h-8",
    md: "w-14 h-14",
    lg: "w-24 h-24",
  }

  const dotSizeClasses = {
    sm: "w-1.5 h-1.5",
    md: "w-2.5 h-2.5",
    lg: "w-4 h-4",
  }

  return (
    <div className="flex flex-col items-center justify-center gap-4">
      {/* Outer rotating ring with glass effect */}
      <div className="relative inline-flex items-center justify-center">
        {/* Fast outer ring */}
        <div
          className={`${sizeClasses[size]} rounded-full`}
          style={{
            animation: "spin 1s linear infinite",
            background: `conic-gradient(from 0deg, rgba(232, 65, 66, 0.9), rgba(232, 65, 66, 0.3), transparent)`,
            backdropFilter: "blur(10px)",
            border: "2px solid rgba(232, 65, 66, 0.4)",
            boxShadow: "0 0 30px rgba(232, 65, 66, 0.4), inset 0 0 20px rgba(232, 65, 66, 0.1)",
          }}
        />
        
        {/* Counter-rotating outer ring */}
        <div
          className={`absolute ${sizeClasses[size]} rounded-full`}
          style={{
            animation: "spin 1.5s linear infinite reverse",
            background: `conic-gradient(from 180deg, rgba(232, 65, 66, 0.4), rgba(232, 65, 66, 0.1), transparent)`,
            backdropFilter: "blur(8px)",
            border: "1px solid rgba(232, 65, 66, 0.2)",
          }}
        />

        {/* Middle pulsing ring */}
        <div
          className={`absolute ${sizeClasses[size]} rounded-full animate-pulse-glow`}
          style={{
            border: "1px solid rgba(232, 65, 66, 0.5)",
            backdropFilter: "blur(8px)",
          }}
        />

        {/* Inner rotating ring (opposite direction) */}
        <div
          className={`absolute ${innerSizeClasses[size]} rounded-full`}
          style={{
            animation: "spin 2s linear infinite reverse",
            background: `conic-gradient(from 180deg, rgba(232, 65, 66, 0.6), rgba(232, 65, 66, 0.1), transparent)`,
            backdropFilter: "blur(8px)",
            border: "1.5px solid rgba(232, 65, 66, 0.4)",
          }}
        />

        {/* Center dot with glow */}
        <div
          className={`absolute ${dotSizeClasses[size]} rounded-full`}
          style={{
            background: "#e84142",
            boxShadow: "0 0 15px rgba(232, 65, 66, 0.8), 0 0 30px rgba(232, 65, 66, 0.4)",
          }}
        />

        {/* Floating particles */}
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full"
            style={{
              background: "#e84142",
              left: "50%",
              top: "50%",
              animation: `float-up 2s ease-out infinite`,
              animationDelay: `${i * 0.4}s`,
              transform: `rotate(${i * 120}deg) translateX(${size === "sm" ? 20 : size === "md" ? 35 : 55}px)`,
              opacity: 0.6,
            }}
          />
        ))}
      </div>

    
    </div>
  )
}
