import LogoLoop from './LogoLoop'

const PartnersLoop = () => {
  const imageLogos = [
    {
      src: '/images/accenture-logo.png',
      alt: 'Accenture',
      href: 'https://www.accenture.com/us-en?c=acn_glb_sembrandpuregoogle_13513493&n=psgs_0323&&&&&gclsrc=aw.ds&&c=ad_usadfy17_10000001&n=psgs_Brand-|-US-|-Exact_accenture&gad_source=1&gad_campaignid=935554953&gbraid=0AAAAADG9MDrpIdRBbRRK5Ke3PtUf4gJAq&gclid=CjwKCAjw1N7NBhAoEiwAcPchp_4apdL_ZLVSiZoi88Xk8fCD2EGHA7h3vmRezYn_OghznveTuxmOuRoC60MQAvD_BwE',
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
    {
      src: '/images/peopleshoreslogo.png',
      alt: 'peopleshores',
      href: 'https://peopleshores.com/',
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
        logoHeight={88}
        gap={56}
        hoverSpeed={0}
        scaleOnHover
        renderItem={(item) => {
          if ('src' in item) {
            const isOddbnbLogo = item.src === '/images/logo.jpg'

            return (
              <div className="flex h-24 w-52 items-center justify-center">
                <img
                  src={item.src}
                  alt={item.alt ?? ''}
                  className={[
                    'h-20 w-48 object-contain opacity-70',
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
