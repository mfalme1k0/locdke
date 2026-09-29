'use client'
import { useState } from 'react'
import { Menu, X } from 'lucide-react'

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
        <a className="brand" href="#home">
          {brand}
        </a>
        <button
          className="menu-btn"
          aria-label={open ? 'Close menu' : 'Open menu'}
          aria-expanded={open}
          aria-controls="site-navigation"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X aria-hidden="true" size={20} /> : <Menu aria-hidden="true" size={20} />}
        </button>
        <nav aria-label="Primary">
          <ul id="site-navigation" className={open ? 'open' : ''} onClick={() => setOpen(false)}>
            {links.map(([label, href]) => (
              <li key={href}>
                <a href={href}>{label}</a>
              </li>
            ))}
            <li>
              <a className="btn btn-solid" href="#booking">
                Book Now
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  )
}
