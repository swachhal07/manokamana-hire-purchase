const items = [
  'Trusted Partner',
  'Hire Purchase',
  'Strategic Growth',
  'Financial Guidance',
  'Investing',
  'Business Development',
]

function Sparkle() {
  return (
    <svg
      className="h-5 w-5 shrink-0 text-white"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M12 0c1 8 3 11 12 12-9 1-11 4-12 12-1-8-3-11-12-12 9-1 11-4 12-12Z" />
    </svg>
  )
}

export default function Marquee() {
  // Duplicate the list so the scroll loops seamlessly
  const loop = [...items, ...items]

  return (
    <div className="w-full overflow-hidden py-5">
      <div className="animate-marquee flex w-max items-center gap-10">
        {loop.map((item, i) => (
          <div key={i} className="flex items-center gap-10">
            <span className="whitespace-nowrap text-xl font-semibold tracking-wide text-white">
              {item}
            </span>
            <Sparkle />
          </div>
        ))}
      </div>
    </div>
  )
}
