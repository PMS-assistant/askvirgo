import { useReveal } from '../../lib/motion';
import VirgoTiltPanel from './VirgoTiltPanel';

/* "Meet Virgo" — the product itself, tilted back and straightening as you
   scroll. Sits right after the promise cards so you see what Virgo *is*
   before reading what it does.

   The headline is passed *into* the panel rather than rendered above it so
   both ride the same scroll track: "Meet Virgo." lands oversized and shrinks
   back as the chat rises and flattens under it. The reveal wrapper stays
   nested inside the scrub wrapper — two elements, so the fade-in and the
   scroll-scrub never fight over the same transform. */
export default function MeetVirgo() {
  const headRef = useReveal<HTMLDivElement>({ y: 24, duration: 620 });

  return (
    <section
      style={{
        background: 'var(--surface)',
        borderTop: '1px solid var(--line-soft)',
        padding: 'clamp(60px, 8vw, 100px) 0',
      }}
    >
      <div style={{ maxWidth: '1180px', margin: '0 auto', padding: '0 24px' }}>
        <VirgoTiltPanel
          title={
            <div ref={headRef} style={{ opacity: 0, maxWidth: '760px', margin: '0 auto 48px', textAlign: 'center' }}>
              <p
                className="font-mono"
                style={{ fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--faint)', marginBottom: '16px' }}
              >
                What Virgo does
              </p>
              <h2
                className="font-display shine-text"
                style={{ fontSize: 'clamp(48px, 8vw, 92px)', fontWeight: 800, lineHeight: 0.98, marginBottom: '14px' }}
              >
                Meet Virgo.
              </h2>
              <p
                className="font-display meet-virgo-sub"
                style={{ fontSize: 'clamp(19px, 2.4vw, 28px)', fontWeight: 700, lineHeight: 1.25, color: 'var(--ink)' }}
              >
                One place to ask. Every system answers.
              </p>
            </div>
          }
        />
      </div>
    </section>
  );
}
