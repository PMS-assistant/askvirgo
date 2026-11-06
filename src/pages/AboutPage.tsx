import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

/* About Virgo: one page. Says who builds Virgo (ARM Technologies Limited,
   named here at the owner's request on 2026-11-06, an exception to the old
   "footer only" rule) and what Virgo stands for. Every statement is drawn from
   virgo.pdf or the company's registration details; nothing about team size,
   history, customers or results is claimed. */

const PRINCIPLES = [
  { h: 'It reads. It doesn’t replace.', p: 'Virgo sits above the systems a hotel already runs and reads from them. Nothing to migrate, and nothing in your PMS or accounts is ever changed.', tint: 'var(--tint-blue)' },
  { h: 'It shows its working.', p: 'Every answer shows its figures and names the system and the dates they came from, so a manager can check any number.', tint: 'var(--tint-peach)' },
  { h: 'A person stays in charge.', p: 'Virgo drafts and suggests. A manager sends staff messages, complaints go to a person, and one switch stops every automatic reply.', tint: 'var(--tint-mint)' },
];

export default function AboutPage() {
  useEffect(() => {
    const previous = document.title;
    document.title = 'About Virgo | Virgo';
    return () => { document.title = previous; };
  }, []);

  return (
    <main className="ab">
      <section className="ab-hero">
        <span className="ab-eyebrow">About Virgo</span>
        <h1>Built for the people who run hotels.</h1>
        <p>
          Virgo is hotel intelligence for independent hotels. It reads the systems you already run, answers questions
          about the business in plain English, and tells the right person when something needs them.
        </p>
      </section>

      <section className="ab-block ab-by">
        <div>
          <span className="ab-eyebrow">Who’s behind it</span>
          <h2>Built by ARM Technologies.</h2>
        </div>
        <div className="ab-by-text">
          <p>
            Virgo is built by <b>ARM Technologies Limited</b>, a company registered in England and Wales with its
            registered office in Bournemouth. ARM Technologies has been working on Virgo to take the daily assembly work
            off hotel managers, so they can spend their time on guests and decisions.
          </p>
          <p>Everything Virgo stores (your settings, your logins and a record of the messages it sends) is kept in the UK.</p>
        </div>
      </section>

      <section className="ab-block">
        <span className="ab-eyebrow">What we stand for</span>
        <h2>Three ideas behind Virgo.</h2>
        <div className="ab-cards">
          {PRINCIPLES.map(x => (
            <article key={x.h} className="ab-card" style={{ background: x.tint }}>
              <h3>{x.h}</h3>
              <p>{x.p}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="ab-cta">
        <h2>Talk to us.</h2>
        <p>We’ll show you Virgo answering the questions your managers ask. <a href="mailto:hello@askvirgo.co.uk">hello@askvirgo.co.uk</a></p>
        <Link to="/#pilot" className="a1-btn a1-btn-lg">Book a demo <ArrowRight size={17} aria-hidden /></Link>
      </section>
    </main>
  );
}
