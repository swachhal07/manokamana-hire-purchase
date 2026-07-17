import LegalLayout from '../components/LegalLayout'

const sections = [
  {
    heading: 'Who we are',
    body: [
      'Manokamana Hire Purchase Pvt. Ltd. ("Manokamana", "we", "us") provides hire-purchase and vehicle & equipment financing services in Nepal. This policy explains what personal information we collect through this website, how we use it, and the choices you have.',
    ],
  },
  {
    heading: 'Information we collect',
    body: [
      'We only collect information you choose to share with us, together with basic technical data needed to run the site. This may include:',
      [
        'Contact details you submit through our enquiry or consultation forms — your name, phone number, email address, and the message you send us.',
        'The financing category or product you tell us you are interested in.',
        'Standard technical information your browser sends automatically, such as approximate location, device and browser type, and pages visited.',
      ],
    ],
  },
  {
    heading: 'How we use your information',
    body: [
      'We use the information you provide to:',
      [
        'Respond to your enquiry and follow up about the financing you asked about.',
        'Assess and process a hire-purchase or loan application if you choose to proceed.',
        'Improve our website and the quality of our service.',
        'Meet our legal, regulatory, and record-keeping obligations.',
      ],
      'We do not sell your personal information, and we do not send marketing messages unless you have asked us to.',
    ],
  },
  {
    heading: 'How we share information',
    body: [
      'We may share your information with trusted service providers who help us operate the website and communicate with you (for example, our form-handling provider), and with regulators or authorities where the law requires it. We ask everyone who handles your data on our behalf to protect it and use it only for the purpose we specify.',
    ],
  },
  {
    heading: 'Data retention & security',
    body: [
      'We keep your information only for as long as needed to serve your enquiry, meet our obligations, or as required by law, and then delete or anonymise it. We take reasonable technical and organisational measures to protect your information, but no method of transmission over the internet is completely secure.',
    ],
  },
  {
    heading: 'Your choices',
    body: [
      'You may ask us to access, correct, or delete the personal information we hold about you, or withdraw a consent you previously gave. To make a request, contact us using the details below and we will respond within a reasonable time.',
    ],
  },
  {
    heading: 'Contact us',
    body: [
      'If you have any questions about this Privacy Policy or how we handle your information, reach us at info@manokamanahirepurchase.com.np or 01-4163533, or visit our office in Kathmandu, Nepal.',
    ],
  },
]

export default function Privacy() {
  return (
    <LegalLayout
      eyebrow="Privacy"
      title={
        <>
          Privacy <span className="text-brand-500">Policy.</span>
        </>
      }
      intro="Your trust matters to us. This policy explains what we collect through this website and how we use and protect it."
      lastUpdated="17 July 2026"
      sections={sections}
    />
  )
}
