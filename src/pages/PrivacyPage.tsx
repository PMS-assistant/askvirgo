import LegalLayout, { LegalSection } from '../components/legal/LegalLayout';

export default function PrivacyPage() {
  return (
    <LegalLayout title="Privacy Policy">
      <LegalSection heading="Who we are">
        [Placeholder] Details of the company responsible for this website and how to reach it.
      </LegalSection>
      <LegalSection heading="What we collect">
        [Placeholder] The information you submit through the contact form: your name, email address, hotel name and message.
      </LegalSection>
      <LegalSection heading="How we use it">
        [Placeholder] How enquiries are used, who can see them, and the legal basis for processing.
      </LegalSection>
      <LegalSection heading="How long we keep it">
        [Placeholder] Retention period for enquiries.
      </LegalSection>
      <LegalSection heading="Your rights">
        [Placeholder] Your rights to access, correct or delete your data, and how to exercise them.
      </LegalSection>
      <LegalSection heading="Contact">
        Questions about this page: hello@askvirgo.co.uk.
      </LegalSection>
    </LegalLayout>
  );
}
