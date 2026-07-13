import imgPassenger from '../assets/images/photo-1612057473166-af2affdb92ad.avif'
import imgTwoWheeler from '../assets/images/rv-4006491267651bec.avif'
import imgCommercial from '../assets/images/tata-commercial-vehicles-rfk9d2h0ouvp4u8e.jpg'
import imgAgriculture from '../assets/images/photo-1594771804886-a933bb2d609b.avif'
import imgOffice from '../assets/images/vitaly-gariev-M5k978V3qBc-unsplash.jpg'
import imgMeeting from '../assets/images/vitaly-gariev-LS5dCL0NkhE-unsplash.jpg'
import imgAdvisor from '../assets/images/vitaly-gariev-0kWem6X0Mc8-unsplash.jpg'

/* Each post carries a slug (for /blog/:slug) and a body of content blocks. */

export const featured = {
  slug: 'complete-guide-to-hire-purchase-in-nepal',
  category: 'Guides',
  date: 'Asar 26, 2083',
  readTime: '6 min read',
  title: 'The complete guide to hire purchase in Nepal',
  excerpt:
    'What hire purchase actually means, how instalments are sized around your income, and the questions worth asking before you sign — everything a first-time borrower should know, in plain language.',
  image: imgAdvisor,
  body: [
    { type: 'p', text: 'Hire purchase is one of the most common ways Nepalis own a vehicle or machine without paying the full price up front. You take delivery today, use the asset immediately, and pay for it in fixed monthly instalments over an agreed term. Ownership transfers to you once the final instalment is cleared.' },
    { type: 'h2', text: 'How instalments are sized' },
    { type: 'p', text: 'A responsible lender does not lend against the price of the vehicle alone — it lends against your ability to repay. At Manokamana, an advisor looks at your income, your existing obligations, and how steady your earnings are through the year. The monthly instalment is then set so it stays comfortably within what you actually take home.' },
    { type: 'p', text: 'A useful rule of thumb: your income should be at least twice the EMI amount. That headroom is what keeps a loan survivable when a month runs tight.' },
    { type: 'h2', text: 'Questions worth asking before you sign' },
    { type: 'p', text: 'Ask for the total cost over the full term, not just the monthly figure. Ask what happens if you want to settle early, and whether there are charges for it. Ask which documents you and your guarantor need so you are not making a second trip. A good agreement answers all of these in writing.' },
    { type: 'p', text: 'The distance between wanting a vehicle and owning one should never come down to a lump sum — and with a clear hire purchase agreement, it does not have to.' },
  ],
}

export const posts = [
  {
    slug: 'size-an-emi-you-can-keep',
    category: 'EMI & Money',
    date: 'Asar 20, 2083',
    readTime: '4 min read',
    title: 'How to size an EMI you can actually keep',
    excerpt:
      'The two-times-income rule, seasonal earnings, and why the cheapest monthly figure is not always the safest one.',
    image: imgOffice,
    body: [
      { type: 'p', text: 'The most attractive EMI on paper is the smallest one — but stretching a loan over a longer term to shrink the monthly figure means paying more in total. The goal is not the lowest instalment; it is the right one.' },
      { type: 'h2', text: 'Start with your real income' },
      { type: 'p', text: 'Use your take-home income, not your gross. Then keep the EMI at or below half of it. That way an unexpected month — a slow season, a medical cost — does not put the agreement at risk.' },
      { type: 'h2', text: 'If your income is seasonal' },
      { type: 'p', text: 'Farmers, contractors, and transport operators rarely earn the same amount every month. Talk to your advisor about matching the repayment to your cash flow rather than fighting it. A loan that respects the harvest calendar is a loan you keep.' },
    ],
  },
  {
    slug: 'first-bike-on-finance',
    category: 'Two-Wheelers',
    date: 'Asar 14, 2083',
    readTime: '3 min read',
    title: 'First bike on finance? Read this before the showroom',
    excerpt:
      'Down payments, insurance, and the documents your dealer will ask for — a checklist that saves you a second trip.',
    image: imgTwoWheeler,
    body: [
      { type: 'p', text: 'Financing your first two-wheeler is straightforward once you know what to bring. A little preparation means you ride out with the paperwork done in one visit.' },
      { type: 'h2', text: 'What to carry' },
      { type: 'p', text: 'Citizenship, a passport photo, proof of income, and your guarantor’s documents. If the bike is for family use, a family member’s licence works too.' },
      { type: 'h2', text: 'Down payment and insurance' },
      { type: 'p', text: 'Expect to pay a share of the price up front — the larger it is, the smaller your instalments. Insurance is mandatory and usually arranged alongside the loan, so factor it into your monthly budget from day one.' },
    ],
  },
  {
    slug: 'from-one-truck-to-a-fleet',
    category: 'Commercial',
    date: 'Jestha 30, 2083',
    readTime: '5 min read',
    title: 'From one truck to a fleet: financing that scales',
    excerpt:
      'How operators use hire purchase to add vehicles as routes grow — without draining working capital.',
    image: imgCommercial,
    body: [
      { type: 'p', text: 'Growing a transport business is a chicken-and-egg problem: you need more vehicles to take on more routes, but the routes are what pay for the vehicles. Hire purchase breaks the deadlock.' },
      { type: 'h2', text: 'Add capacity without emptying the account' },
      { type: 'p', text: 'By financing each new vehicle rather than buying it outright, you keep working capital free for fuel, wages, and maintenance — the costs that actually keep the wheels turning.' },
      { type: 'h2', text: 'Match repayments to revenue' },
      { type: 'p', text: 'A vehicle that earns from week one should pay for itself as it goes. We structure terms so each truck’s instalment lines up with the income it generates on the road.' },
    ],
  },
  {
    slug: 'tractor-that-pays-for-itself',
    category: 'Agriculture',
    date: 'Jestha 18, 2083',
    readTime: '4 min read',
    title: 'A tractor that pays for itself: the harvest math',
    excerpt:
      'Owning versus renting equipment, and how instalments can follow the crop calendar instead of fighting it.',
    image: imgAgriculture,
    body: [
      { type: 'p', text: 'Renting a tractor every season is money that leaves your farm for good. Owning one turns that recurring cost into an asset you control — and can even hire out to neighbours.' },
      { type: 'h2', text: 'The math over three seasons' },
      { type: 'p', text: 'Add up what you spend renting equipment across a year. In many cases the total is close to a financed instalment — except at the end of the term, you own the machine outright.' },
      { type: 'h2', text: 'Repayments that follow the crop' },
      { type: 'p', text: 'Income arrives at harvest, not in even monthly slices. We can shape a schedule around that rhythm so repayment never lands in your leanest month.' },
    ],
  },
  {
    slug: 'documents-for-a-vehicle-loan',
    category: 'Guides',
    date: 'Jestha 05, 2083',
    readTime: '5 min read',
    title: 'Every document you need for a vehicle loan, listed',
    excerpt:
      'Citizenship, income proof, guarantor papers — the full checklist for individuals and firms, explained item by item.',
    image: imgMeeting,
    body: [
      { type: 'p', text: 'Paperwork is the part people dread, but the list is shorter than you think. Bring these and your application moves quickly.' },
      { type: 'h2', text: 'For individuals' },
      { type: 'p', text: 'Citizenship or NID copy, PAN copy, two photographs each for you and your guarantor, a valid driving licence, proof of income of at least twice the EMI, residency proof, and a recent bank statement.' },
      { type: 'h2', text: 'For a company or firm' },
      { type: 'p', text: 'Add PAN/VAT, registration, an audit report, and tax clearance. Companies also need MOA, AOA and share records; partnerships need the partnership deed and a board minute. A vehicle quotation completes the file.' },
    ],
  },
  {
    slug: 'new-used-or-electric-car-loan',
    category: 'Passenger',
    date: 'Baisakh 22, 2083',
    readTime: '4 min read',
    title: 'New, used, or electric: which car loan fits you?',
    excerpt:
      'Interest, resale value, and running costs compared — so the car you choose still feels right in year three.',
    image: imgPassenger,
    body: [
      { type: 'p', text: 'The right car loan depends less on the sticker price and more on how you will live with the car over the next few years.' },
      { type: 'h2', text: 'New versus used' },
      { type: 'p', text: 'A new car costs more up front but comes with warranty and predictable running costs. A used car lowers the loan amount but is worth inspecting carefully before you commit.' },
      { type: 'h2', text: 'The electric question' },
      { type: 'p', text: 'Electric vehicles cost more to buy but far less to run. If your daily distance is high and charging is convenient, the running-cost saving can offset the higher instalment well within the loan term.' },
    ],
  },
]

export function getPostBySlug(slug) {
  return [featured, ...posts].find((p) => p.slug === slug) || null
}
