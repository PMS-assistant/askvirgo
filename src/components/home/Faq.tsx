import { Plus } from 'lucide-react';

/* FAQ: the questions a general manager or owner asks before a demo. Every
   answer is drawn from virgo.pdf (R1 read-only, R2 nothing kept, R3 sources,
   R6/R7/R9 guest replies, §6 systems). Nothing here states pricing, data
   location, certifications or timelines; add those only once they are facts.
   Native <details> keeps it accessible with no script. */

const QA: { q: string; a: string }[] = [
  { q: 'Does Virgo change anything in our PMS or accounts?',
    a: 'No. Virgo only reads from your systems. It never edits a booking, a rate or an invoice. The only messages it sends are guest replies, and staff messages that a manager approves and sends.' },
  { q: 'Which systems does it work with?',
    a: 'Your property management system, accounts, channel manager, guest messaging, reviews and staff rota. If you’re not sure about yours, tell us what you run and we’ll tell you where it stands.' },
  { q: 'Do my staff need training?',
    a: 'There’s no new system for your front desk. Managers simply ask Virgo questions in plain English, the way they’d ask a colleague.' },
  { q: 'What happens to our hotel’s data?',
    a: 'Virgo fetches only what a question needs, uses it to answer, and lets it go. It doesn’t keep its own copy of your bookings or accounts. It keeps only your settings, your logins and a record of the messages it sends.' },
  { q: 'Can Virgo reply to guests on its own?',
    a: 'Only for routine questions, using what your hotel has written down, like breakfast times or parking. Complaints, bills and anything it isn’t sure about go straight to your duty manager, and the guest is told a person is on it. One switch stops every automatic reply.' },
  { q: 'Can I check where a number came from?',
    a: 'Yes. Every answer shows its figures and names the system and the dates they came from.' },
  { q: 'How do we get started?',
    a: 'Book a demo. We’ll show you Virgo answering the kind of questions your managers ask, and talk you through connecting your systems.' },
];

export default function Faq() {
  return (
    <section id="faq" className="fq">
      <div className="fq-inner">
        <div className="fq-head">
          <span className="fq-eyebrow">FAQ</span>
          <h2>Questions hotels ask.</h2>
          <p>Something else? Email <a href="mailto:hello@askvirgo.co.uk">hello@askvirgo.co.uk</a>.</p>
        </div>
        <div className="fq-list">
          {QA.map(({ q, a }, i) => (
            <details key={q} className="fq-item" open={i === 0}>
              <summary>
                <span>{q}</span>
                <Plus size={18} aria-hidden className="fq-ico" />
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
