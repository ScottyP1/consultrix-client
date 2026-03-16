import LogoLoop from './LogoLoop'

const PartnersLoop = () => {
  const imageLogos = [
    {
      src: '/images/accenture-logo.png',
      alt: 'Accenture',
      href: 'https://company1.com',
    },
    {
      src: '/images/logo.jpg',
      alt: 'Oddbnb',
      href: 'https://theoodbnb.com',
    },
    {
      src: '/images/nomad-logo.png',
      alt: 'nomadtrack',
      href: 'https://nomadtrack.net',
    },
  ]
  return (
    <section
      id="learn-more"
      className="flex scroll-mt-28 flex-col gap-12 items-center"
    >
      <h2
        className="tracking-[5px] text-white/70 text-xs md:text-sm"
        style={{ fontFamily: '"Space Grotesk", "Manrope", sans-serif' }}
      >
        WE WORK WITH THE BEST PARTNERS
      </h2>
      <LogoLoop
        logos={imageLogos}
        speed={90}
        direction="left"
        logoHeight={72}
        gap={48}
        hoverSpeed={0}
        scaleOnHover
        renderItem={(item) => {
          if ('src' in item) {
            const isOddbnbLogo = item.src === '/images/logo.jpg'

            return (
              <div className="flex h-16 w-40 items-center justify-center">
                <img
                  src={item.src}
                  alt={item.alt ?? ''}
                  className={[
                    'h-full w-full object-contain opacity-70',
                    isOddbnbLogo && 'mix-blend-screen',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  loading="lazy"
                  decoding="async"
                />
              </div>
            )
          }
          return item.node
        }}
        ariaLabel="Technology partners"
      />
    </section>
  )
}

export default PartnersLoop
