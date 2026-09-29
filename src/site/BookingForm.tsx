'use client'
import { useState } from 'react'

type Props = { services: { id: number; title: string }[]; successMessage: string }

export function BookingForm({ services, successMessage }: Props) {
  const [state, setState] = useState<'idle' | 'sending' | 'done' | 'error'>('idle')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const f = new FormData(form)
    setState('sending')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: f.get('name'),
          email: f.get('email'),
          phone: f.get('phone') || undefined,
          service: f.get('service') ? Number(f.get('service')) : undefined,
          preferredDate: f.get('preferredDate') || undefined,
          message: f.get('message') || undefined,
          website: f.get('website'), // honeypot
        }),
      })
      if (!res.ok) throw new Error()
      form.reset()
      setState('done')
    } catch {
      setState('error')
    }
  }

  if (state === 'done') return <p className="msg ok" role="status">{successMessage}</p>

  return (
    <form onSubmit={onSubmit}>
      <div className="row">
        <label>Name<input name="name" required maxLength={120} autoComplete="name" /></label>
        <label>Email<input name="email" type="email" required autoComplete="email" /></label>
      </div>
      <div className="row">
        <label>Phone / WhatsApp<input name="phone" type="tel" autoComplete="tel" /></label>
        <label>
          Service
          <select name="service" defaultValue="">
            <option value="">Select service</option>
            {services.map((s) => <option key={s.id} value={s.id}>{s.title}</option>)}
          </select>
        </label>
      </div>
      <label>Preferred date<input name="preferredDate" type="date" min={new Date().toISOString().slice(0, 10)} /></label>
      <label>Message<textarea name="message" rows={4} maxLength={2000} /></label>
      <input className="hp" name="website" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <button className="btn btn-solid" disabled={state === 'sending'}>
        {state === 'sending' ? 'Sending…' : 'Send Booking Request'}
      </button>
      {state === 'error' && <p className="msg err" role="alert">Something went wrong. Please try again or email us directly.</p>}
    </form>
  )
}
