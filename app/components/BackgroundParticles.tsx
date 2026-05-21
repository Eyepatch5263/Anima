'use client'

import React, { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  alpha: number
  color: string
  shadowColor: string
}

export default function BackgroundParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animationFrameId: number
    let particles: Particle[] = []

    const initCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
      createParticles()
    }

    const createParticles = () => {
      // 80 particles for a rich but lightweight field
      const count = Math.min(80, Math.floor((canvas.width * canvas.height) / 15000))
      particles = []

      // Rich glowing cinematic colors matching the Yūgen palette
      const colors = [
        'rgba(229, 9, 20, 0.55)', // Primary Red
        'rgba(232, 124, 3, 0.45)', // Warm Amber/Orange
        'rgba(255, 255, 255, 0.3)' // Glowing White
      ]

      const shadowColors = [
        'rgba(229, 9, 20, 0.8)',
        'rgba(232, 124, 3, 0.6)',
        'rgba(255, 255, 255, 0.4)'
      ]

      for (let i = 0; i < count; i++) {
        const colorIdx = Math.floor(Math.random() * colors.length)
        particles.push({
          x: Math.random() * canvas.width,
          y: Math.random() * canvas.height,
          vx: (Math.random() - 0.5) * 0.25,
          vy: (Math.random() - 0.5) * 0.25,
          radius: Math.random() * 3 + 1.5, // Larger size range: 1.5px to 4.5px
          alpha: Math.random() * 0.6 + 0.3,
          color: colors[colorIdx],
          shadowColor: shadowColors[colorIdx]
        })
      }
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw particles with glowing shadows
      particles.forEach((p, idx) => {
        p.x += p.vx
        p.y += p.vy

        // Bounce/Wrap boundaries
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0

        ctx.save()
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.shadowBlur = 10
        ctx.shadowColor = p.shadowColor
        ctx.fillStyle = p.color
        ctx.fill()
        ctx.restore()

        // Constellation connection lines with higher opacity
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j]
          const dx = p.x - p2.x
          const dy = p.y - p2.y
          const dist = Math.sqrt(dx * dx + dy * dy)

          if (dist < 140) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(p2.x, p2.y)
            // Visually clear connection lines
            const lineAlpha = (1 - dist / 140) * 0.16
            ctx.strokeStyle = `rgba(229, 9, 20, ${lineAlpha})`
            ctx.lineWidth = 0.75
            ctx.stroke()
          }
        }
      })

      animationFrameId = requestAnimationFrame(animate)
    }

    window.addEventListener('resize', initCanvas)
    initCanvas()
    animate()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', initCanvas)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0 bg-transparent"
      style={{ mixBlendMode: 'screen' }}
    />
  )
}
