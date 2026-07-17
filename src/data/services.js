import imgPassenger from '../assets/images/photo-1612057473166-af2affdb92ad.avif'
import imgTwoWheeler from '../assets/images/rv-4006491267651bec.avif'
import imgCommercial from '../assets/images/70_kmph_top_speed.webp'
import imgAgriculture from '../assets/images/photo-1594771804886-a933bb2d609b.avif'
import imgConstruction from '../assets/images/sinharai power.jpg'

/**
 * Canonical service catalogue — the single source of truth for both the
 * homepage teaser (src/components/Services.jsx) and the full /services page
 * (src/pages/Services.jsx). Category names, taglines, descriptions and the
 * `covers` sub-items live here only, so the two views can never drift apart.
 */
export const services = [
  {
    slug: 'two-wheelers',
    name: 'Two-Wheelers',
    tagline: 'Ride now, pay with ease',
    desc: 'Finance motorcycles, scooters, and electric two-wheelers with affordable installments.',
    covers: ['Motorcycles', 'Scooters', 'Electric bikes'],
    image: imgTwoWheeler,
  },
  {
    slug: 'passenger-vehicles',
    name: 'Passenger Vehicles',
    tagline: 'Drive home your dream car',
    desc: 'Own a new or used car, SUV, or electric vehicle with quick approvals and flexible terms.',
    covers: ['New cars', 'Used cars', 'SUVs', 'Electric vehicles'],
    image: imgPassenger,
  },
  {
    slug: 'commercial-vehicles',
    name: 'Commercial Vehicles',
    tagline: 'From roads to revenues',
    desc: 'Accelerate your business with financing for pickup trucks, vans, mini trucks and buses.',
    covers: ['Pickup trucks', 'Vans', 'Mini trucks', 'Buses'],
    image: imgCommercial,
  },
  {
    slug: 'agricultural-equipment',
    name: 'Agricultural Equipment',
    tagline: 'Grow more, harvest better',
    desc: 'Finance tractors and farming equipment to boost your agricultural productivity.',
    covers: ['Tractors', 'Tillers', 'Harvesters'],
    image: imgAgriculture,
  },
  {
    slug: 'construction-equipment',
    name: 'Construction Equipment',
    tagline: 'Build bigger, reach higher',
    desc: 'Fund excavators, heavy machinery, and construction equipment to power your projects.',
    covers: ['Excavators', 'Loaders', 'Heavy machinery'],
    image: imgConstruction,
  },
]
