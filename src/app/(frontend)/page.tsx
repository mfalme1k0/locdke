import type { Metadata } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import Image from 'next/image'

import { BookingForm } from '@/site/BookingForm'
import { getHomeData } from '@/site/getHomeData'
import { img } from '@/site/media'
import { SiteNav } from '@/site/SiteNav'
import '@/site/site.css'

const display = Cormorant_Garamond({ subsets: ['latin'], weight: ['400', '500', '600'], style: ['normal', 'italic'], variable: '--font-cormorant' })
const body = Manrope({ subsets: ['latin'], variable: '--font-manrope' })

export const revalidate = 3600 // safety net; edits in the admin refresh the page instantly via hooks

export async function generateMetadata(): Promise<Metadata> {
  const { homepage } = await getHomeData()
  const hero = img(homepage.hero?.image, 'large')
  return { openGraph: hero ? { images: [hero.src] } : undefined }
}

export default async function HomePage() {
  const { homepage: h, artist, settings, services, portfolio } = await getHomeData()
  const hero = img(h.hero?.image, 'large')
  const portrait = img(artist.portrait, 'card')

  return (
    <div className={`locd ${display.variable} ${body.variable}`}>
      <SiteNav brand={settings.brandName} />

      <main>
        <section id="home" className="hero pad">
          <div className="wrap">
            <div>
              {h.hero?.eyebrow && <p className="eyebrow">{h.hero.eyebrow}</p>}
              <h1 style={{ marginTop: '.8rem' }}>{h.hero?.headline}</h1>
              <p className="lead">{h.hero?.subheadline}</p>
              <div className="cta">
                <a className="btn btn-solid" href="#booking">{h.hero?.primaryCta}</a>
                <a className="btn" href="#portfolio">{h.hero?.secondaryCta}</a>
              </div>
              {!!settings.stats?.length && (
                <div className="stats">
                  {settings.stats.map((s) => (
                    <div key={s.id}><strong>{s.value}</strong><span>{s.label}</span></div>
                  ))}
                </div>
              )}
            </div>
            {hero && (
              <div className="img">
                <Image src={hero.src} alt={hero.alt} width={900} height={1125} priority sizes="(max-width: 800px) 100vw, 45vw" />
              </div>
            )}
          </div>
        </section>

        <section id="services" className="services pad">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">{h.services?.eyebrow}</p>
              <h2>{h.services?.heading}</h2>
              <p>{h.services?.intro}</p>
            </div>
            <div className="grid">
              {services.map((s) => (
                <article className="service" key={s.id}>
                  <h3>{s.title}</h3>
                  <p>{s.description}</p>
                  <span className="price">{s.priceDisplay}</span>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="about" className="about pad">
          <div className="wrap">
            {portrait && (
              <div className="img">
                <Image src={portrait.src} alt={portrait.alt} width={800} height={1000} sizes="(max-width: 800px) 100vw, 40vw" />
              </div>
            )}
            <div>
              <p className="eyebrow">{artist.eyebrow}</p>
              <h2>{artist.heading}</h2>
              <div className="bio">
                {artist.bio.split(/\n\s*\n/).map((para, i) => <p key={i}>{para}</p>)}
              </div>
              {!!artist.highlights?.length && (
                <div className="highlights">
                  {artist.highlights.map((x) => (
                    <div key={x.id}><h3>{x.title}</h3><p>{x.description}</p></div>
                  ))}
                </div>
              )}
              <p className="signature">{artist.name}</p>
            </div>
          </div>
        </section>

        <section id="portfolio" className="pad">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">{h.portfolio?.eyebrow}</p>
              <h2>{h.portfolio?.heading}</h2>
              <p>{h.portfolio?.intro}</p>
            </div>
            <div className="gallery">
              {portfolio.map((item) => {
                const cover = img(item.coverImage, 'card')
                if (!cover) return null
                return (
                  <figure className="card" key={item.id} style={{ margin: 0 }}>
                    <Image src={cover.src} alt={cover.alt || item.name} width={800} height={1000} sizes="(max-width: 800px) 100vw, 25vw" />
                    <figcaption>
                      <h4>{item.name}</h4>
                      {item.description && <p>{item.description}</p>}
                    </figcaption>
                  </figure>
                )
              })}
            </div>
          </div>
        </section>

        <section id="booking" className="booking pad">
          <div className="wrap">
            <div className="head">
              <p className="eyebrow">{h.booking?.eyebrow}</p>
              <h2>{h.booking?.heading}</h2>
              <p>{h.booking?.intro}</p>
              <div className="contact">
                {settings.whatsapp && <a className="btn" href={`https://wa.me/${settings.whatsapp}`}>WhatsApp</a>}
                {settings.socials?.map((s) => (
                  <a key={s.id} className="btn" href={s.url} rel="noopener">{s.platform}</a>
                ))}
              </div>
            </div>
            <BookingForm
              services={services.map((s) => ({ id: s.id, title: s.title }))}
              successMessage={h.booking?.successMessage ?? 'Thank you!'}
            />
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div>
            <a className="brand" href="#home">{settings.brandName}</a>
            <p style={{ marginTop: '.5rem' }}>{settings.footerTagline}</p>
            <p><a href={`mailto:${settings.email}`}>{settings.email}</a></p>
          </div>
          <small>© {new Date().getFullYear()} {settings.brandName}. All rights reserved.</small>
        </div>
      </footer>
    </div>
  )
}
