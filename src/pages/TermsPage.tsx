import LegalLayout, { LegalSection } from '../components/legal/LegalLayout';

export default function TermsPage() {
  return (
    <LegalLayout title="Terms of Use">
      <LegalSection heading="Using this website">
        [Placeholder] Terms governing use of this website.
      </LegalSection>
      <LegalSection heading="Information on this site">
        [Placeholder] The site describes a product in development. Content is for information only and is not an offer.
      </LegalSection>
      <LegalSection heading="Liability">
        [Placeholder] Limits of liability.
      </LegalSection>
      <LegalSection heading="Governing law">
        [Placeholder] Governing law and jurisdiction.
      </LegalSection>
      <LegalSection heading="Contact">
        Questions about this page: hello@askvirgo.co.uk.
      </LegalSection>
    </LegalLayout>
  );
}
