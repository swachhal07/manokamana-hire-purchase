import LegalLayout from '../components/LegalLayout'

const sections = [
  {
    heading: 'About these terms',
    body: [
      'These Terms & Conditions govern your use of the website of Manokamana Hire Purchase Pvt. Ltd. ("Manokamana", "we", "us"). By browsing this website or submitting an enquiry through it, you agree to these terms. If you do not agree, please do not use the site.',
    ],
  },
  {
    heading: 'Information on this website',
    body: [
      'The content on this website — including descriptions of our financing categories, indicative terms, and the EMI calculator — is provided for general information only. It does not constitute a financial offer, approval, or commitment.',
      'Any EMI figures shown are estimates for illustration and may differ from the actual terms of a sanctioned facility. Interest rates, charges, eligibility, and repayment terms are confirmed only in a signed agreement following assessment.',
    ],
  },
  {
    heading: 'Financing & eligibility',
    body: [
      'All financing is subject to eligibility checks, documentation, credit assessment, and internal approval. Meeting the eligibility criteria listed on this site does not guarantee approval. We may request additional information or decline an application at our discretion, consistent with applicable law and regulation.',
    ],
  },
  {
    heading: 'Your responsibilities',
    body: [
      'When you contact us or apply for financing, you agree to:',
      [
        'Provide accurate, complete, and up-to-date information.',
        'Use this website only for lawful purposes and not to disrupt or misuse it.',
        'Keep any account or reference details we share with you confidential.',
      ],
    ],
  },
  {
    heading: 'Intellectual property',
    body: [
      'The name, logos, text, images, and design of this website belong to Manokamana Hire Purchase Pvt. Ltd. or its licensors and may not be copied or reused without our written permission.',
    ],
  },
  {
    heading: 'Third-party links',
    body: [
      'This website may link to external services and websites we do not control, such as maps and form providers. We are not responsible for the content or practices of those third parties, and their own terms and privacy policies apply.',
    ],
  },
  {
    heading: 'Limitation of liability',
    body: [
      'We work to keep this website accurate and available, but we provide it "as is" and cannot guarantee it will be uninterrupted or error-free. To the extent permitted by law, we are not liable for any loss arising from reliance on the information on this site.',
    ],
  },
  {
    heading: 'Changes & contact',
    body: [
      'We may update these terms from time to time; the current version will always be posted here. For any questions, contact us at info@manokamanahirepurchase.com.np or 01-4163533.',
    ],
  },
]

export default function Terms() {
  return (
    <LegalLayout
      eyebrow="Legal"
      title={
        <>
          Terms &amp; <span className="text-brand-500">Conditions.</span>
        </>
      }
      intro="The terms that apply when you use this website and enquire about our financing."
      lastUpdated="17 July 2026"
      sections={sections}
    />
  )
}
