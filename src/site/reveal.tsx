'use client'
import { useEffect, useRef, useState } from 'react'

/** Same behaviour as the original: fade in once, when ~16% is in view. */
export function Reveal({
  children,
  delay = 0,
  className = '',
  variant = 'rise',
}: {
  children: React.ReactNode
  delay?: number
  className?: string
  variant?: 'rise' | 'image'
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (
      !el ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      !('IntersectionObserver' in window)
    )
      return
    document.documentElement.dataset.revealReady = 'true'

    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
          io.disconnect()
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div
      ref={ref}
      className={`reveal ${visible ? 'visible' : ''} ${className}`}
      data-reveal={variant}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}
