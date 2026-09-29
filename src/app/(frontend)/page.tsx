import type { Metadata } from 'next'
import { Cormorant_Garamond, Manrope } from 'next/font/google'
import Image from 'next/image'

import { BookingForm } from '@/site/BookingForm'
import { getHomeData } from '@/site/getHomeData'
import { img } from '@/site/media'
import { Reveal } from '@/site/reveal'
import { SiteNav } from '@/site/SiteNav'
import '@/site/site.css'

const display = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
})
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
  const portrait = img(artist.portrait ?? h.hero?.image, 'card')
  const servicesImage = img(portfolio[0]?.coverImage ?? h.hero?.image, 'large')
  const bookingMedia =
    portfolio.find((item) => item.images?.length)?.images?.[0] ??
    portfolio.at(-1)?.coverImage ??
    artist.portrait ??
    h.hero?.image
  const bookingImage = img(bookingMedia, 'large')
  const seenPortfolioMedia = new Set<number>()
  const portfolioPhotos = portfolio.flatMap((item) => {
    const photos = [
      { media: item.coverImage, title: item.name, description: item.description },
      ...(item.images ?? []).map((media) => ({
        media,
        title: '',
        description: typeof media === 'number' ? '' : (media.caption ?? ''),
      })),
    ]

    return photos.flatMap(({ media, title, description }) => {
      const mediaID = typeof media === 'number' ? media : media.id
      if (seenPortfolioMedia.has(mediaID)) return []
      seenPortfolioMedia.add(mediaID)
      const photo = img(media, 'card')
      return photo ? [{ ...photo, id: `${item.id}-${mediaID}`, title, description }] : []
    })
  })

  return (
    <div className={`locd ${display.variable} ${body.variable}`}>
      <SiteNav brand={settings.brandName || "Loc'd ke"} />

      <main>
        <section id="home" className="hero pad">
          <div className="wrap">
            <Reveal className="hero-copy">
              <div>
                {h.hero?.eyebrow && <p className="eyebrow">{h.hero.eyebrow}</p>}
                <h1 style={{ marginTop: '.8rem' }}>{h.hero?.headline}</h1>
                <p className="lead">{h.hero?.subheadline}</p>
                <div className="cta">
                  <a className="btn btn-solid" href="#booking">
                    {h.hero?.primaryCta}
                  </a>
                  <a className="btn" href="#portfolio">
                    {h.hero?.secondaryCta}
                  </a>
                </div>
                {!!settings.stats?.length && (
                  <div className="stats">
                    {settings.stats.map((s) => (
                      <div key={s.id}>
                        <strong>{s.value}</strong>
                        <span>{s.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </Reveal>
            {hero && (
              <Reveal className="hero-visual" delay={120}>
                <div className="img">
                  <Image
                    src={hero.src}
                    alt={hero.alt}
                    width={900}
                    height={1125}
                    priority
                    sizes="(max-width: 800px) 100vw, 45vw"
                  />
                </div>
              </Reveal>
            )}
          </div>
        </section>

        <section id="services" className="services pad">
          <div className="wrap">
            <div className="services-layout">
              {servicesImage && (
                <Reveal className="services-visual" variant="image">
                  <figure className="section-photo">
                    <Image
                      src={servicesImage.src}
                      alt={servicesImage.alt}
                      width={900}
                      height={1125}
                      sizes="(max-width: 800px) 100vw, 38vw"
                    />
                    <figcaption>
                      <span>01</span> Signature loc artistry
                    </figcaption>
                  </figure>
                </Reveal>
              )}
              <div className="services-content">
                <Reveal>
                  <div className="head">
                    <p className="eyebrow">{h.services?.eyebrow}</p>
                    <h2>{h.services?.heading}</h2>
                    <p>{h.services?.intro}</p>
                  </div>
                </Reveal>
                <div className="grid">
                  {services.map((s, index) => (
                    <Reveal key={s.id} delay={Math.min(index, 3) * 70}>
                      <article className="service">
                        <h3>{s.title}</h3>
                        <p>{s.description}</p>
                        <span className="price">{s.priceDisplay}</span>
                      </article>
                    </Reveal>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="about" className="about pad">
          <div className="wrap">
            {portrait && (
              <Reveal className="about-visual" variant="image">
                <div className="img">
                  <Image
                    src={portrait.src}
                    alt={portrait.alt}
                    width={800}
                    height={1000}
                    sizes="(max-width: 800px) 100vw, 40vw"
                  />
                </div>
              </Reveal>
            )}
            <Reveal className="about-copy" delay={100}>
              <div>
                <p className="eyebrow">{artist.eyebrow}</p>
                <h2>{artist.heading}</h2>
                <div className="bio">
                  {(artist.bio ?? '')
                    .split(/\n\s*\n/)
                    .filter(Boolean)
                    .map((para, i) => (
                      <p key={i}>{para}</p>
                    ))}
                </div>
                {!!artist.highlights?.length && (
                  <div className="highlights">
                    {artist.highlights.map((x) => (
                      <div key={x.id}>
                        <h3>{x.title}</h3>
                        <p>{x.description}</p>
                      </div>
                    ))}
                  </div>
                )}
                <p className="signature">{artist.name}</p>
              </div>
            </Reveal>
          </div>
        </section>

        <section id="portfolio" className="pad">
          <div className="wrap">
            <Reveal>
              <div className="head">
                <p className="eyebrow">{h.portfolio?.eyebrow}</p>
                <h2>{h.portfolio?.heading}</h2>
                <p>{h.portfolio?.intro}</p>
              </div>
            </Reveal>
            <div
              className={`gallery ${portfolioPhotos.length < 3 ? 'gallery-compact' : 'gallery-editorial'}`}
            >
              {portfolioPhotos.map((photo, index) => {
                return (
                  <Reveal
                    key={photo.id}
                    className={index === 0 ? 'gallery-featured' : ''}
                    variant="image"
                    delay={Math.min(index % 3, 2) * 90}
                  >
                    <figure className="card" style={{ margin: 0 }}>
                      <Image
                        src={photo.src}
                        alt={photo.alt || photo.title}
                        width={800}
                        height={1000}
                        sizes="(max-width: 800px) 100vw, 60vw"
                      />
                      {(photo.title || photo.description) && (
                        <figcaption>
                          {photo.title && <h4>{photo.title}</h4>}
                          {photo.description && <p>{photo.description}</p>}
                        </figcaption>
                      )}
                    </figure>
                  </Reveal>
                )
              })}
            </div>
          </div>
        </section>

        <section id="booking" className="booking pad">
          <div className="wrap booking-layout">
            {bookingImage && (
              <Reveal className="booking-visual" variant="image">
                <figure className="section-photo">
                  <Image
                    src={bookingImage.src}
                    alt={bookingImage.alt}
                    width={900}
                    height={1125}
                    sizes="(max-width: 800px) 100vw, 38vw"
                  />
                  <figcaption>
                    <span>02</span> Made for your next chapter
                  </figcaption>
                </figure>
              </Reveal>
            )}
            <div className="booking-content">
              <Reveal>
                <div className="head">
                  <p className="eyebrow">{h.booking?.eyebrow}</p>
                  <h2>{h.booking?.heading}</h2>
                  <p>{h.booking?.intro}</p>
                  <div className="contact">
                    {settings.whatsapp && (
                      <a className="btn" href={`https://wa.me/${settings.whatsapp}`}>
                        WhatsApp
                      </a>
                    )}
                    {settings.socials?.map((s) => (
                      <a key={s.id} className="btn" href={s.url} rel="noopener">
                        {s.platform}
                      </a>
                    ))}
                  </div>
                </div>
              </Reveal>
              <Reveal delay={120}>
                <BookingForm
                  services={services.map((s) => ({ id: s.id, title: s.title }))}
                  successMessage={h.booking?.successMessage ?? 'Thank you!'}
                />
              </Reveal>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="wrap">
          <div>
            <a className="brand" href="#home">
              {settings.brandName || "Loc'd ke"}
            </a>
            <p style={{ marginTop: '.5rem' }}>{settings.footerTagline}</p>
            <p>
              <a href={`mailto:${settings.email}`}>{settings.email}</a>
            </p>
          </div>
          <small>
            © {new Date().getFullYear()} {settings.brandName}. All rights reserved.
          </small>
        </div>
      </footer>
    </div>
  )
}
