'use client'
import { useState } from 'react'

const links = [
  ['Home', '#home'],
  ['Services', '#services'],
  ['About', '#about'],
  ['Portfolio', '#portfolio'],
] as const

export function SiteNav({ brand }: { brand: string }) {
  const [open, setOpen] = useState(false)
  return (
    <header className="nav">
      <div className="wrap">
        <a className="brand" href="#home">{brand}</a>
        <button className="menu-btn" aria-label="Toggle menu" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? '×' : '≡'}
        </button>
        <nav aria-label="Primary">
          <ul className={open ? 'open' : ''} onClick={() => setOpen(false)}>
            {links.map(([label, href]) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
            <li><a className="btn btn-solid" href="#booking">Book Now</a></li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
