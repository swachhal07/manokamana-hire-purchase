import Hero from '../components/Hero'
import AboutUs from '../components/AboutUs'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import Faq from '../components/Faq'
import Reveal from '../components/Reveal'
import Seo from '../components/Seo'

export default function Home() {
  return (
    <>
      <Seo path="/" />
      <Hero />
      <Reveal>
        <AboutUs />
      </Reveal>
      <Services />
      <Reveal>
        <Testimonials />
      </Reveal>
      <Reveal>
        <Faq />
      </Reveal>
      {/* Next sections go here */}
    </>
  )
}
