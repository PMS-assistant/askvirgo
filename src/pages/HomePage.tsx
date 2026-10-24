import Hero from '../components/home/Hero';
import BeforeAfter from '../components/home/BeforeAfter';
import CapabilityScroller from '../components/home/CapabilityScroller';
import VirgoProblem from '../components/virgo/VirgoProblem';
import VirgoHowItWorks from '../components/virgo/VirgoHowItWorks';
import VirgoPilotCTA from '../components/virgo/VirgoPilotCTA';
import ScrollColorWash from '../components/home/ScrollColorWash';

export default function HomePage() {
  return (
    <>
      {/* Renders nothing — drives the --wash token as you scroll, so the
          ground colour drifts between sections. Homepage only; the other
          routes keep the static porcelain. */}
      <ScrollColorWash />

      <Hero />

      {/* Say what's wrong before selling the fix — everything below is the
          answer to this section. */}
      <VirgoProblem />

      {/* The transformation, shown before it's explained — a working day
          collapsing from five apps to one question. */}
      <BeforeAfter />

      {/* What you can ask, capability by capability — housekeeping, guest
          messaging and the rest live here as example questions, not separate
          dashboards. The single surviving product visual besides the hero's
          own ask-demo, so it also carries the #virgo nav anchor. */}
      <div id="virgo">
        <CapabilityScroller />
      </div>

      {/* How to start, then the ask. Who built it lives on /company. */}
      <VirgoHowItWorks />
      <div id="pilot">
        <VirgoPilotCTA />
      </div>
    </>
  );
}
